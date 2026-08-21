import { Link } from "react-router-dom";
import { useLocale } from "@/contexts/locale-context";

const NotFound = () => {
  const { copy, pathFor } = useLocale();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col items-start px-5 py-28 sm:px-8">
      <p className="eyebrow text-ink-faint">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold uppercase leading-tight text-ink sm:text-5xl">
        {copy.notFound.title}
      </h1>
      <Link
        to={pathFor("/")}
        className="eyebrow mt-8 inline-flex items-center gap-2 bg-ink px-3 py-2 text-paper transition-opacity hover:opacity-80"
      >
        <span aria-hidden="true">&#8592;</span>
        {copy.notFound.back}
      </Link>
    </main>
  );
};

export default NotFound;
