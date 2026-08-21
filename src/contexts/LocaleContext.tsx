import React, { createContext, useContext, useMemo } from "react";
import {
  Locale,
  TranslationSet,
  buildLocalePath,
  setStoredLocalePreference,
  translations,
} from "@/lib/i18n";

interface LocaleContextType {
  locale: Locale;
  copy: TranslationSet;
  pathFor: (pathname: string) => string;
  setLocalePreference: (nextLocale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider = ({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) => {
  const value = useMemo(
    () => ({
      locale,
      copy: translations[locale],
      pathFor: (pathname: string) => buildLocalePath(locale, pathname),
      setLocalePreference: setStoredLocalePreference,
    }),
    [locale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
};
