import { useNavigate } from "react-router-dom";
import { useLocale } from "@/contexts/LocaleContext";

interface LogoProps {
  className?: string;
  isLink?: boolean;
}

/**
 * The masthead. Set in the serif at a size that lets it act as a title rather
 * than a badge, with the two words stacked so it reads as a publication name.
 */
export const Logo = ({ className = "", isLink = true }: LogoProps) => {
  const navigate = useNavigate();
  const { pathFor } = useLocale();

  const content = (
    <span
      className={`font-serif text-lg leading-none tracking-tight text-ink sm:text-xl ${className}`}
    >
      Svenska stipendier
    </span>
  );

  if (!isLink) return content;

  return (
    <button
      type="button"
      onClick={() => navigate(pathFor("/"))}
      className="rounded-sm transition-opacity hover:opacity-70"
    >
      {content}
    </button>
  );
};
