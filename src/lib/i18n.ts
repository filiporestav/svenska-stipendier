export type Locale = "sv" | "en";

export const DEFAULT_LOCALE: Locale = "sv";
export const ENGLISH_LOCALE_PREFIX = "/en";
export const LOCALE_STORAGE_KEY = "stipendier-locale";

export const translations = {
  sv: {
    nav: {
      directory: "Stipendier",
      about: "Om",
      contribute: "Bidra",
      openMenu: "Öppna meny",
      closeMenu: "Stäng meny",
    },
    directory: {
      title: "Stipendier för svenska studenter",
      subtitle:
        "En öppen lista över stipendier du kan söka själv. Klicka på ett stipendium för att komma till ansökan.",
      searchPlaceholder: "Sök på namn…",
      countOne: "1 stipendium",
      countMany: "{{count}} stipendier",
      noResults: "Inga stipendier matchar din sökning.",
      clearFilters: "Rensa filter",
      allTags: "Alla",
      sortLabel: "Sortering",
      filterStatus: "Status",
      lastVerified: "Senast kontrollerad {{date}}",
      apply: "Till ansökan",
      applyByEmail: "Ansökan mailas till {{email}}",
      applyByEmailGeneric: "Ansökan mailas in",
      applyByPost: "Ansökan skickas per post",
      reportRequired: "Kräver återrapportering",
      typicalAmount: "Har delat ut ca {{amount}} kr",
      projected: "Datum uppskattat från förra årets omgång",
      reportProblem: "Fel i uppgifterna?",
    },
    phase: {
      open: "Öppen",
      upcoming: "Öppnar snart",
      closed: "Stängd",
      rolling: "Löpande",
      unknown: "Datum saknas",
      all: "Alla",
      opensOn: "Öppnar {{date}}",
      deadlineOn: "Sista dag {{date}}",
      daysLeftOne: "1 dag kvar",
      daysLeftMany: "{{count}} dagar kvar",
    },
    tags: {
      utlandsstudier: "Utlandsstudier",
      examensarbete: "Examensarbete",
      forskning: "Forskning",
      foretagsstipendium: "Företagsstipendium",
      kultur: "Kultur",
      medlemskap: "Kräver medlemskap",
      region: "Regionalt",
      kvinnor: "För kvinnor",
      internationellt: "Internationellt",
      ai: "AI",
      kth: "KTH",
      chalmers: "Chalmers",
    },
    footer: {
      tagline: "En öppen databas över svenska stipendier.",
      dataNote:
        "Uppgifterna underhålls av frivilliga och kan vara inaktuella. Kontrollera alltid mot stipendiegivarens egen webbplats innan du söker.",
      sourceCode: "Källkod på GitHub",
      addScholarship: "Lägg till ett stipendium",
      license: "Data under CC BY 4.0, kod under MIT.",
    },
    about: {
      title: "Om projektet",
      contributeTitle: "Så bidrar du",
      backToDirectory: "Tillbaka till listan",
    },
    notFound: {
      title: "Sidan finns inte",
      back: "Till stipendielistan",
    },
  },
  en: {
    nav: {
      directory: "Scholarships",
      about: "About",
      contribute: "Contribute",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    directory: {
      title: "Scholarships for students in Sweden",
      subtitle:
        "An open list of scholarships you can apply for yourself. Click one to go straight to its application.",
      searchPlaceholder: "Search by name…",
      countOne: "1 scholarship",
      countMany: "{{count}} scholarships",
      noResults: "No scholarships match your search.",
      clearFilters: "Clear filters",
      allTags: "All",
      sortLabel: "Sort",
      filterStatus: "Status",
      lastVerified: "Last checked {{date}}",
      apply: "Go to application",
      applyByEmail: "Applications are emailed to {{email}}",
      applyByEmailGeneric: "Submitted by email",
      applyByPost: "Applications are sent by post",
      reportRequired: "Requires a report back",
      typicalAmount: "Has awarded around {{amount}} SEK",
      projected: "Date estimated from last year's round",
      reportProblem: "Something wrong here?",
    },
    phase: {
      open: "Open",
      upcoming: "Opening soon",
      closed: "Closed",
      rolling: "Rolling",
      unknown: "No date",
      all: "All",
      opensOn: "Opens {{date}}",
      deadlineOn: "Deadline {{date}}",
      daysLeftOne: "1 day left",
      daysLeftMany: "{{count}} days left",
    },
    tags: {
      utlandsstudier: "Study abroad",
      examensarbete: "Degree project",
      forskning: "Research",
      foretagsstipendium: "Company scholarship",
      kultur: "Culture",
      medlemskap: "Membership required",
      region: "Regional",
      kvinnor: "For women",
      internationellt: "International",
      ai: "AI",
      kth: "KTH",
      chalmers: "Chalmers",
    },
    footer: {
      tagline: "An open database of Swedish scholarships.",
      dataNote:
        "The data is maintained by volunteers and may be out of date. Always check the awarding body's own website before applying.",
      sourceCode: "Source on GitHub",
      addScholarship: "Add a scholarship",
      license: "Data under CC BY 4.0, code under MIT.",
    },
    about: {
      title: "About this project",
      contributeTitle: "How to contribute",
      backToDirectory: "Back to the list",
    },
    notFound: {
      title: "Page not found",
      back: "To the scholarship list",
    },
  },
} as const;

export type TranslationSet = (typeof translations)[Locale];

/** Fills {{name}} placeholders in a translated string. */
export const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{\{(\w+)\}\}/g, (_, key) => String(values[key] ?? ""));

export const buildLocalePath = (locale: Locale, pathname: string) => {
  const clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (locale === "sv") return clean;
  return clean === "/" ? ENGLISH_LOCALE_PREFIX : `${ENGLISH_LOCALE_PREFIX}${clean}`;
};

export const stripLocaleFromPath = (pathname: string) => {
  if (pathname === ENGLISH_LOCALE_PREFIX) return "/";
  if (pathname.startsWith(`${ENGLISH_LOCALE_PREFIX}/`)) {
    return pathname.slice(ENGLISH_LOCALE_PREFIX.length) || "/";
  }
  return pathname;
};

export const getStoredLocalePreference = (): Locale | null => {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return stored === "sv" || stored === "en" ? stored : null;
};

export const setStoredLocalePreference = (locale: Locale) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
};

/**
 * Swedish unless the browser says otherwise. The old build called out to an
 * IP geolocation API for this; a browser language check needs no API key and
 * no third-party request, which matters more now the site is static.
 */
export const detectPreferredLocale = (): Locale => {
  const stored = getStoredLocalePreference();
  if (stored) return stored;
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;
  const languages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  return languages.some((lang) => lang?.toLowerCase().startsWith("sv")) ? "sv" : "en";
};

export const formatDate = (iso: string, locale: Locale) =>
  new Intl.DateTimeFormat(locale === "sv" ? "sv-SE" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${iso}T00:00:00`));

export const formatAmount = (amount: number, locale: Locale) =>
  new Intl.NumberFormat(locale === "sv" ? "sv-SE" : "en-GB").format(amount);
