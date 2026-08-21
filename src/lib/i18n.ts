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
      tagline: "Sista ansökningsdag först",
      standfirst:
        "Datum med ≈ är uppskattade från förra årets omgång, inte bekräftade av stipendiegivaren.",
      searchPlaceholder: "Namn eller ämne",
      searchLabel: "Sök",
      searchAria: "Sök på namn eller ämne",
      boardTotal: "i listan",
      boardOpen: "öppna nu",
      boardNext: "nästa stänger om {{days}} dygn",
      boardNextToday: "nästa stänger idag",
      boardNextNone: "inget öppet just nu",
      countOne: "1 träff",
      countMany: "{{count}} träffar",
      noResults: "Inga träffar på den sökningen.",
      noResultsHint: "Testa ett bredare filter, eller tipsa oss om ett stipendium som saknas.",
      clearFilters: "Rensa",
      allTags: "Alla ämnen",
      filterSubject: "Ämne",
      filterStatus: "Status",
      rollingHeading: "Löpande ansökan",
      rollingSub: "Du kan söka när som helst",
      lastVerified: "Senast kontrollerad {{date}}",
      applyByEmail: "Mailas till {{email}}",
      applyByEmailGeneric: "Du mailar in ansökan",
      applyByPost: "Skickas per post",
      reportRequired: "Kräver återrapportering",
      typicalAmount: "{{amount}} kr",
      amountUnknown: "Belopp anges inte",
      projected: "Uppskattat datum utifrån förra årets omgång. Kolla hos stipendiegivaren innan du planerar efter det.",
      reportProblem: "Rapportera fel",
      contributeTitle: "Saknas något?",
      contributeBody:
        "Vi letar reda på stipendierna själva, så listan blir aldrig helt komplett. Hittar du ett som saknas, eller ett datum som har ändrats, säg till.",
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
      tagline: "En öppen lista över stipendier du kan söka i Sverige.",
      dataNote:
        "Frivilliga sköter listan, så den hinner bli fel ibland. Kolla stipendiegivarens egen sida innan du söker.",
      sourceCode: "Källkod på GitHub",
      addScholarship: "Lägg till ett stipendium",
      license: "Data under CC BY 4.0, kod under MIT.",
    },
    about: {
      title: "Om projektet",
      contributeTitle: "Så bidrar du",
      creditsTitle: "Vilka som gjort listan",
      backToDirectory: "Tillbaka till listan",
    },
    notFound: {
      title: "Sidan finns inte",
      back: "Tillbaka till stipendierna",
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
      tagline: "Closest deadline first",
      standfirst:
        "Dates marked ≈ are estimated from last year's round, not confirmed by the awarding body.",
      searchPlaceholder: "Name or subject",
      searchLabel: "Find",
      searchAria: "Search by name or subject",
      boardTotal: "listed",
      boardOpen: "open now",
      boardNext: "next closes in {{days}} days",
      boardNextToday: "next closes today",
      boardNextNone: "nothing open right now",
      countOne: "1 result",
      countMany: "{{count}} results",
      noResults: "No scholarships match that search.",
      noResultsHint: "Try a broader filter, or tell us about a scholarship that is missing.",
      clearFilters: "Clear",
      allTags: "All subjects",
      filterSubject: "Subject",
      filterStatus: "Status",
      rollingHeading: "Rolling applications",
      rollingSub: "You can apply at any time",
      lastVerified: "Last checked {{date}}",
      applyByEmail: "Email to {{email}}",
      applyByEmailGeneric: "You email the application in",
      applyByPost: "Sent by post",
      reportRequired: "Report back required",
      typicalAmount: "{{amount}} SEK",
      amountUnknown: "Amount not stated",
      projected: "Estimated from last year's round. Check with the awarding body before you plan around it.",
      reportProblem: "Report an error",
      contributeTitle: "Something missing?",
      contributeBody:
        "We find these scholarships ourselves, so the list is never quite complete. If one is missing, or a date has changed, tell us.",
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
      tagline: "An open list of scholarships you can apply for in Sweden.",
      dataNote:
        "Volunteers keep the list, so it goes wrong sometimes. Check the awarding body's own page before you apply.",
      sourceCode: "Source on GitHub",
      addScholarship: "Add a scholarship",
      license: "Data under CC BY 4.0, code under MIT.",
    },
    about: {
      title: "About this project",
      contributeTitle: "How to contribute",
      creditsTitle: "Who made this",
      backToDirectory: "Back to the list",
    },
    notFound: {
      title: "Page not found",
      back: "Back to the scholarships",
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
