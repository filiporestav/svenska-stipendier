import { Link } from "react-router-dom";
import { useLocale } from "@/contexts/LocaleContext";

const NotFound = () => {
  const { copy, pathFor } = useLocale();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col items-start px-5 py-24 sm:px-8">
      <h1 className="font-heading text-3xl font-medium text-foreground">
        {copy.notFound.title}
      </h1>
      <Link
        to={pathFor("/")}
        className="mt-4 text-primary hover:underline"
      >
        ← {copy.notFound.back}
      </Link>
    </main>
  );
};

export default NotFound;
