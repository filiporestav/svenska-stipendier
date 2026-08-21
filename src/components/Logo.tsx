import { useNavigate } from "react-router-dom";
import { useLocale } from "@/contexts/LocaleContext";

interface LogoProps {
  className?: string; // Additional classes
  variant?: "light" | "dark"; // Light = White text (for dark bg), Dark = Black text (for white bg)
  isLink?: boolean; // If true, wraps in a button to go home
}

export const Logo = ({ className = "", variant = "dark", isLink = true }: LogoProps) => {
  const navigate = useNavigate();
  const { pathFor } = useLocale();
  
  // Base font style: Satoshi (Heading font), tight tracking, lowercase.
  // Weight: Medium (500) per requirements.
  const baseClasses = "font-heading font-medium text-xl tracking-tight select-none";
  
  // Colors
  const colorClass = variant === "light" 
    ? "text-white" 
    : "text-neutral-900";

  const Content = (
    <div className={`flex items-center gap-2 ${baseClasses} ${colorClass} ${className}`}>
      <span>svenska stipendier</span>
    </div>
  );

  if (isLink) {
    return (
      <button 
        onClick={() => navigate(pathFor("/"))}
        className="hover:opacity-80 transition-opacity focus:outline-none"
      >
        {Content}
      </button>
    );
  }

  return Content;
};
