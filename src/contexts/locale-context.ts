import { createContext, useContext } from "react";
import { Locale, TranslationSet } from "@/lib/i18n";

export interface LocaleContextType {
  locale: Locale;
  copy: TranslationSet;
  pathFor: (pathname: string) => string;
  setLocalePreference: (nextLocale: Locale) => void;
}

export const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
};
