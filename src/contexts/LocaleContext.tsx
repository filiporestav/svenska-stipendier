import React, { useMemo } from "react";
import {
  Locale,
  buildLocalePath,
  setStoredLocalePreference,
  translations,
} from "@/lib/i18n";
import { LocaleContext } from "@/contexts/locale-context";

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
