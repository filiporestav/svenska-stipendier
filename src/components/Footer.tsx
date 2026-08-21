import { useLocale } from "@/contexts/locale-context";
import { CONTRIBUTING_URL, GITHUB_URL, NEW_SCHOLARSHIP_URL } from "@/lib/site";

/**
 * The second slab. It closes the page the way the status band opens it, so the
 * board sits between two solid blocks rather than fading out at the bottom.
 */
export const Footer = () => {
  const { copy } = useLocale();

  const links = [
    { href: GITHUB_URL, label: copy.footer.sourceCode },
    { href: NEW_SCHOLARSHIP_URL, label: copy.footer.addScholarship },
    { href: CONTRIBUTING_URL, label: copy.nav.contribute },
  ];

  return (
    <footer className="slab mt-24">
      <div className="mx-auto grid w-full max-w-5xl gap-10 px-5 py-12 sm:grid-cols-[1fr_auto] sm:px-8">
        <div className="max-w-md">
          <p className="font-display text-lg font-semibold uppercase tracking-[0.02em]">
            {copy.footer.tagline}
          </p>
          <p className="mt-4 text-[0.8125rem] leading-relaxed text-boardInk/70">
            {copy.footer.dataNote}
          </p>
          <p className="eyebrow mt-6 text-boardInk/50">{copy.footer.license}</p>
        </div>

        <nav className="flex flex-col gap-3 sm:items-end">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow text-boardInk/70 transition-colors hover:text-boardInk"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
};
