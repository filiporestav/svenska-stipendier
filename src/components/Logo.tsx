import { useNavigate } from "react-router-dom";
import { useLocale } from "@/contexts/locale-context";

interface LogoProps {
  className?: string;
  isLink?: boolean;
}

/**
 * The masthead. A filled square and the name in wide mono capitals, the way a
 * board is labelled rather than the way a product is branded.
 */
export const Logo = ({ className = "", isLink = true }: LogoProps) => {
  const navigate = useNavigate();
  const { pathFor } = useLocale();

  const content = (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <span className="h-2.5 w-2.5 shrink-0 bg-ink" aria-hidden="true" />
      <span className="font-mono text-[0.6875rem] font-semibold uppercase leading-none tracking-[0.14em] text-ink sm:text-[0.8125rem] sm:tracking-[0.2em]">
        Svenska stipendier
      </span>
    </span>
  );

  if (!isLink) return content;

  return (
    <button type="button" onClick={() => navigate(pathFor("/"))} className="hover:opacity-70">
      {content}
    </button>
  );
};
