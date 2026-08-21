import { Link } from "react-router-dom";
import { useLocale } from "@/contexts/locale-context";

const NotFound = () => {
  const { copy, pathFor } = useLocale();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col items-start px-5 py-28 sm:px-8">
      <h1 className="font-serif text-3xl text-ink">
        {copy.notFound.title}
      </h1>
      <Link
        to={pathFor("/")}
        className="mt-4 border-b border-accentInk/40 pb-0.5 text-sm text-accentInk hover:border-accentInk"
      >
        ← {copy.notFound.back}
      </Link>
    </main>
  );
};

export default NotFound;
