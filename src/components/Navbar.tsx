import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLocale } from "@/contexts/locale-context";
import { Logo } from "@/components/Logo";
import { GitHubMark } from "@/components/GitHubMark";
import { Locale, buildLocalePath, stripLocaleFromPath } from "@/lib/i18n";
import { GITHUB_URL } from "@/lib/site";

/** Every item in the bar is set alike, so nothing in it competes with the board. */
const linkClass =
  "font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-soft transition-colors hover:text-ink";

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
    <header className="border-b-2 border-ink">
      <nav className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-5 py-4 sm:px-8">
        <Logo />

        <div className="flex items-center gap-3 sm:gap-6">
          <Link to={pathFor("/about")} className={linkClass}>
            {copy.nav.about}
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={copy.nav.openSourceAria}
            className={`${linkClass} flex items-center gap-2`}
          >
            <GitHubMark className="h-3.5 w-3.5 shrink-0" />
            {/* The mark carries it on a narrow bar; the words are what tell a
                student who isn't a developer that the list is theirs to edit. */}
            <span className="hidden sm:inline">{copy.nav.openSource}</span>
          </a>
          <div className="flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.16em]">
            {(["sv", "en"] as const).map((option, index) => (
              <span key={option} className="flex items-center gap-1.5">
                {index > 0 && (
                  <span className="text-ink-faint" aria-hidden="true">
                    /
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => switchTo(option)}
                  aria-current={locale === option}
                  className={
                    locale === option
                      ? "bg-ink px-1.5 py-0.5 font-medium text-paper"
                      : "px-1.5 py-0.5 text-ink-soft transition-colors hover:text-ink"
                  }
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
