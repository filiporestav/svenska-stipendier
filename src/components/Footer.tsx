import { useLocale } from "@/contexts/locale-context";
import { CONTRIBUTING_URL, GITHUB_URL, NEW_SCHOLARSHIP_URL } from "@/lib/site";

export const Footer = () => {
  const { copy } = useLocale();

  const links = [
    { href: GITHUB_URL, label: copy.footer.sourceCode },
    { href: NEW_SCHOLARSHIP_URL, label: copy.footer.addScholarship },
    { href: CONTRIBUTING_URL, label: copy.nav.contribute },
  ];

  return (
    <footer className="mt-auto border-t border-rule">
      <div className="mx-auto grid w-full max-w-3xl gap-8 px-5 py-12 sm:grid-cols-[1fr_auto] sm:px-8">
        <div>
          <p className="font-serif text-base text-ink">{copy.footer.tagline}</p>
          <p className="mt-3 max-w-md text-[0.8125rem] leading-relaxed text-ink-soft">
            {copy.footer.dataNote}
          </p>
          <p className="mt-4 text-[0.6875rem] text-ink-faint">{copy.footer.license}</p>
        </div>

        <nav className="flex flex-col gap-2 text-[0.8125rem] sm:text-right">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
};
