import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLocale } from "@/contexts/LocaleContext";
import { Logo } from "@/components/Logo";
import { Locale, buildLocalePath, stripLocaleFromPath } from "@/lib/i18n";
import { GITHUB_URL } from "@/lib/site";

export const Navbar = () => {
  const { copy, locale, pathFor, setLocalePreference } = useLocale();
  const location = useLocation();
  const navigate = useNavigate();

  const switchTo = (next: Locale) => {
    if (next === locale) return;
    setLocalePreference(next);
    navigate(
      {
        pathname: buildLocalePath(next, stripLocaleFromPath(location.pathname)),
        search: location.search,
      },
      { replace: true }
    );
  };

  return (
    <header>
      <nav className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-5 pt-6 sm:px-8">
        <Logo />

        <div className="flex items-center gap-5 text-[0.8125rem]">
          <Link to={pathFor("/about")} className="text-ink-soft transition-colors hover:text-ink">
            {copy.nav.about}
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-soft transition-colors hover:text-ink"
          >
            GitHub
          </a>
          <div className="flex items-baseline gap-1 text-ink-faint">
            {(["sv", "en"] as const).map((option, index) => (
              <span key={option} className="flex items-baseline gap-1">
                {index > 0 && <span aria-hidden="true">/</span>}
                <button
                  type="button"
                  onClick={() => switchTo(option)}
                  aria-current={locale === option}
                  className={`rounded-sm transition-colors ${
                    locale === option ? "font-medium text-ink" : "hover:text-ink"
                  }`}
                >
                  {option.toUpperCase()}
                </button>
              </span>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};
