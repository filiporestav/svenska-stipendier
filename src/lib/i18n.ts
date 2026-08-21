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
      tagline: "Ett öppet register över stipendier du kan söka själv",
      standfirst:
        "Sorterat efter sista ansökningsdag. Klicka på ett stipendium för att komma direkt till ansökan hos stipendiegivaren. Datum märkta ≈ är uppskattade från förra årets omgång.",
      searchPlaceholder: "Sök på namn eller ämne",
      summary: "{{total}} stipendier · {{open}} går att söka nu",
      countOne: "1 träff",
      countMany: "{{count}} träffar",
      noResults: "Inga stipendier matchar din sökning.",
      noResultsHint: "Prova ett bredare filter, eller tipsa oss om ett som saknas.",
      clearFilters: "Rensa",
      allTags: "Alla ämnen",
      filterSubject: "Ämne",
      filterStatus: "Status",
      rollingHeading: "Löpande ansökan",
      rollingSub: "Går att söka när som helst",
      lastVerified: "Senast kontrollerad {{date}}",
      applyByEmail: "Mailas till {{email}}",
      applyByEmailGeneric: "Ansökan mailas in",
      applyByPost: "Skickas per post",
      reportRequired: "Återrapportering",
      typicalAmount: "{{amount}} kr",
      amountUnknown: "Belopp ej angivet",
      projected: "Uppskattat datum, räknat från förra årets omgång. Kontrollera hos stipendiegivaren.",
      reportProblem: "Rapportera fel",
      contributeTitle: "Saknas något?",
      contributeBody:
        "Registret underhålls av frivilliga. Hittar du ett stipendium som saknas eller ett datum som ändrats, ta med det.",
    },
    phase: {
      open: "Öppna nu",
      upcoming: "Öppnar senare",
      closed: "Stängd",
      rolling: "Löpande",
      unknown: "Datum saknas",
      all: "Alla",
      opensOn: "Öppnar {{date}}",
      deadlineOn: "Sista dag {{date}}",
      lastDay: "Sista dagen idag",
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
      tagline: "An open register of scholarships you can apply for yourself",
      standfirst:
        "Ordered by deadline. Click a scholarship to go straight to its application with the awarding body. Dates marked ≈ are projected from last year’s round.",
      searchPlaceholder: "Search by name or subject",
      summary: "{{total}} scholarships · {{open}} open to apply now",
      countOne: "1 result",
      countMany: "{{count}} results",
      noResults: "No scholarships match your search.",
      noResultsHint: "Try a broader filter, or tell us about one that is missing.",
      clearFilters: "Clear",
      allTags: "All subjects",
      filterSubject: "Subject",
      filterStatus: "Status",
      rollingHeading: "Rolling applications",
      rollingSub: "Can be applied for at any time",
      lastVerified: "Last checked {{date}}",
      applyByEmail: "Email to {{email}}",
      applyByEmailGeneric: "Submitted by email",
      applyByPost: "Sent by post",
      reportRequired: "Report back",
      typicalAmount: "{{amount}} SEK",
      amountUnknown: "Amount not stated",
      projected: "Estimated date, projected from last year's round. Check with the awarding body.",
      reportProblem: "Report an error",
      contributeTitle: "Something missing?",
      contributeBody:
        "The register is maintained by volunteers. If a scholarship is missing or a date has moved, add it.",
    },
    phase: {
      open: "Open now",
      upcoming: "Opens later",
      closed: "Closed",
      rolling: "Rolling",
      unknown: "No date",
      all: "All",
      opensOn: "Opens {{date}}",
      deadlineOn: "Deadline {{date}}",
      lastDay: "Last day today",
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

export const monthLabel = (date: Date, locale: Locale) =>
  new Intl.DateTimeFormat(locale === "sv" ? "sv-SE" : "en-GB", {
    month: "long",
    year: "numeric",
  }).format(date);

/** Short month for the date gutter: "aug", "sep". */
export const shortMonth = (iso: string, locale: Locale) =>
  new Intl.DateTimeFormat(locale === "sv" ? "sv-SE" : "en-GB", { month: "short" })
    .format(new Date(`${iso}T00:00:00`))
    .replace(".", "");

export const dayOfMonth = (iso: string) => Number(iso.slice(8, 10));

export const formatDate = (iso: string, locale: Locale) =>
  new Intl.DateTimeFormat(locale === "sv" ? "sv-SE" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${iso}T00:00:00`));

export const formatAmount = (amount: number, locale: Locale) =>
  new Intl.NumberFormat(locale === "sv" ? "sv-SE" : "en-GB").format(amount);
