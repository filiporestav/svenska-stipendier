import { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LocaleProvider } from "@/contexts/LocaleContext";
import {
  Locale,
  buildLocalePath,
  detectPreferredLocale,
  getStoredLocalePreference,
  stripLocaleFromPath,
} from "@/lib/i18n";
import { applySeoMetadata } from "@/lib/seo";
import Directory from "./pages/Directory";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const LocaleLayout = ({ locale }: { locale: Locale }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const normalizedPath = stripLocaleFromPath(location.pathname);

  // First visit only: send a non-Swedish browser to /en. Once someone has used
  // the language switch, their choice is stored and we leave them alone.
  useEffect(() => {
    if (locale !== "sv" || getStoredLocalePreference()) return;
    if (detectPreferredLocale() === "en") {
      navigate(
        {
          pathname: buildLocalePath("en", normalizedPath),
          search: location.search,
        },
        { replace: true }
      );
    }
  }, [locale, navigate, normalizedPath, location.search]);

  useEffect(() => {
    applySeoMetadata(locale, normalizedPath);
  }, [locale, normalizedPath]);

  return (
    <LocaleProvider locale={locale}>
      <div className="flex min-h-screen flex-col bg-paper">
        <Navbar />
        <div className="flex-1">
          <Outlet />
        </div>
        <Footer />
      </div>
    </LocaleProvider>
  );
};

const localeRoutes = (
  <>
    <Route index element={<Directory />} />
    <Route path="about" element={<About />} />
    <Route path="om" element={<Navigate to="/about" replace />} />
    <Route path="*" element={<NotFound />} />
  </>
);

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/en" element={<LocaleLayout locale="en" />}>
        {localeRoutes}
      </Route>
      <Route path="/" element={<LocaleLayout locale="sv" />}>
        {localeRoutes}
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
