import { useLocale } from "@/contexts/LocaleContext";
import { CONTRIBUTING_URL, GITHUB_URL, NEW_SCHOLARSHIP_URL } from "@/lib/site";

export const Footer = () => {
  const { copy } = useLocale();

  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8">
        <p className="font-heading text-sm text-foreground">{copy.footer.tagline}</p>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {copy.footer.dataNote}
        </p>

        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {copy.footer.sourceCode}
          </a>
          <a
            href={NEW_SCHOLARSHIP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {copy.footer.addScholarship}
          </a>
          <a
            href={CONTRIBUTING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {copy.nav.contribute}
          </a>
        </div>

        <p className="mt-5 text-xs text-muted-foreground">{copy.footer.license}</p>
      </div>
    </footer>
  );
};
