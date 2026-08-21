import { Link, useLocation, useNavigate } from "react-router-dom";
import { Github } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { Logo } from "@/components/Logo";
import { Locale, buildLocalePath, stripLocaleFromPath } from "@/lib/i18n";
import { GITHUB_URL } from "@/lib/site";

export const Navbar = () => {
  const { copy, locale, pathFor, setLocalePreference } = useLocale();
  const location = useLocation();
  const navigate = useNavigate();

  const switchTo = (next: Locale) => {
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
    <header className="border-b border-border">
      <nav className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Logo />

        <div className="flex items-center gap-4 text-sm">
          <Link
            to={pathFor("/about")}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {copy.nav.about}
          </Link>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>

          <div className="flex items-center rounded-full border border-border p-0.5">
            {(["sv", "en"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => switchTo(option)}
                aria-current={locale === option}
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                  locale === option
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};
