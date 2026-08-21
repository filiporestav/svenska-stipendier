import { Locale, buildLocalePath } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

const SITE_NAME = "Svenska stipendier";

const metadata = {
  sv: {
    "/": {
      title: "Svenska stipendier – öppen lista för studenter",
      description:
        "En öppen, fritt tillgänglig lista över stipendier som studenter i Sverige kan söka. Datum, krav och direktlänkar till varje ansökan.",
    },
    "/about": {
      title: "Om projektet – en öppen stipendiedatabas",
      description:
        "Svenska stipendier är en öppen databas över stipendier du kan söka själv. Läs om hur uppgifterna underhålls och hur du kan bidra.",
    },
  },
  en: {
    "/": {
      title: "Swedish scholarships – an open list for students",
      description:
        "An open, freely available list of scholarships students in Sweden can apply for. Dates, requirements and direct links to every application.",
    },
    "/about": {
      title: "About this project – an open scholarship database",
      description:
        "An open database of scholarships available to students in Sweden. Read how the data is maintained and how to contribute.",
    },
  },
} as const;

const setMeta = (attr: "name" | "property", key: string, value: string) => {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", value);
};

const setLink = (rel: string, href: string, hreflang?: string) => {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let tag = document.head.querySelector<HTMLLinkElement>(selector);
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    if (hreflang) tag.setAttribute("hreflang", hreflang);
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
};

export const applySeoMetadata = (locale: Locale, normalizedPath: string) => {
  const forLocale = metadata[locale];
  const entry =
    forLocale[normalizedPath as keyof typeof forLocale] ?? forLocale["/"];

  document.title = entry.title;
  document.documentElement.lang = locale;

  setMeta("name", "description", entry.description);
  setMeta("property", "og:title", entry.title);
  setMeta("property", "og:description", entry.description);
  setMeta("property", "og:site_name", SITE_NAME);
  setMeta("property", "og:type", "website");

  const canonical = `${SITE_URL}${buildLocalePath(locale, normalizedPath)}`;
  setMeta("property", "og:url", canonical);
  setLink("canonical", canonical);
  setLink("alternate", `${SITE_URL}${buildLocalePath("sv", normalizedPath)}`, "sv");
  setLink("alternate", `${SITE_URL}${buildLocalePath("en", normalizedPath)}`, "en");
  setLink("alternate", `${SITE_URL}${buildLocalePath("sv", normalizedPath)}`, "x-default");
};
