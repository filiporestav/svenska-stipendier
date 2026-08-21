import { Link } from "react-router-dom";
import { useLocale } from "@/contexts/locale-context";
import { scholarships } from "@/lib/scholarships";
import { CONTRIBUTING_URL, DATA_DIR_URL, GITHUB_URL, NEW_SCHOLARSHIP_URL } from "@/lib/site";

const content = {
  sv: {
    intro:
      "Det här är en lista över stipendier du kan söka som student eller forskare i Sverige. Den började som ett kalkylark där vi höll koll på våra egna ansökningar, och ligger nu öppet här så att fler kan ha nytta av den.",
    noAccount:
      "Du behöver inget konto och det kostar ingenting. Du klickar dig vidare till stipendiegivaren och skickar in ansökan där.",
    dataTitle: "Om uppgifterna",
    dataBody:
      "Varje stipendium är en JSON-fil i repot. Datumen kommer från den senaste omgången vi har kunnat bekräfta. För stipendier som återkommer varje år räknar sidan fram nästa förväntade datum och markerar det med ≈. Det är vår gissning utifrån förra året, inte ett besked från stipendiegivaren, så kolla alltid deras egen sida.",
    contributeBody:
      "Hittar du ett stipendium som saknas, ett datum som har ändrats eller ett som inte delas ut längre? Hör av dig. Du behöver inte kunna koda för att hjälpa till.",
    steps: [
      "Öppna ett ärende på GitHub om du bara vill tipsa oss.",
      "Eller ändra filen direkt på GitHub och skicka en pull request.",
      "En automatisk kontroll går igenom formatet innan ändringen läggs in.",
    ],
    linkData: "Se alla datafiler",
    linkContributing: "Läs bidragsguiden",
    linkNew: "Lägg till ett stipendium",
    linkRepo: "Källkoden på GitHub",
    count: (n: number) => `Listan innehåller ${n} stipendier just nu.`,
  },
  en: {
    intro:
      "This is a list of scholarships you can apply for as a student or researcher in Sweden. It started as a spreadsheet where we kept track of our own applications, and now sits here in the open so more people can get something out of it.",
    noAccount:
      "You do not need an account and it costs nothing. You click through to the awarding body and send your application there.",
    dataTitle: "About the data",
    dataBody:
      "Each scholarship is a JSON file in the repository. The dates come from the last round we could confirm. For scholarships that come back every year, the site works out the next expected date and marks it with ≈. That is our guess from last year, not something the awarding body has announced, so always check their own page.",
    contributeBody:
      "Found a scholarship that is missing, a date that has changed, or one that is no longer given out? Let us know. You do not need to be able to code to help.",
    steps: [
      "Open an issue on GitHub if you just want to tip us off.",
      "Or edit the file directly on GitHub and send a pull request.",
      "An automatic check goes over the format before the change goes in.",
    ],
    linkData: "Browse the data files",
    linkContributing: "Read the contributing guide",
    linkNew: "Add a scholarship",
    linkRepo: "Source code on GitHub",
    count: (n: number) => `The list holds ${n} scholarships right now.`,
  },
} as const;

const About = () => {
  const { copy, locale, pathFor } = useLocale();
  const text = content[locale];

  const links = [
    { href: NEW_SCHOLARSHIP_URL, label: text.linkNew },
    { href: CONTRIBUTING_URL, label: text.linkContributing },
    { href: DATA_DIR_URL, label: text.linkData },
    { href: GITHUB_URL, label: text.linkRepo },
  ];

  return (
    <main className="mx-auto w-full max-w-3xl px-5 pb-24 pt-10 sm:px-8 sm:pt-14">
      <h1 className="border-b-2 border-ink pb-4 font-display text-[2rem] font-bold uppercase leading-none tracking-[-0.01em] text-ink sm:text-[3rem]">
        {copy.about.title}
      </h1>

      <div className="mt-8 max-w-2xl space-y-4 text-[0.9375rem] leading-relaxed text-ink-soft">
        <p>{text.intro}</p>
        <p>{text.noAccount}</p>
      </div>

      <p className="slab tnum eyebrow mt-8 inline-block px-3 py-2">
        {text.count(scholarships.length)}
      </p>

      <h2 className="eyebrow mt-14 border-b border-ink pb-1.5 text-ink">{text.dataTitle}</h2>
      <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-soft">{text.dataBody}</p>

      <h2 className="eyebrow mt-14 border-b border-ink pb-1.5 text-ink">
        {copy.about.contributeTitle}
      </h2>
      <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-soft">{text.contributeBody}</p>
      <ol className="mt-5 max-w-2xl list-none space-y-3 text-[0.9375rem] leading-relaxed text-ink-soft [counter-reset:step]">
        {text.steps.map((step) => (
          <li
            key={step}
            className="grid grid-cols-[2rem_minmax(0,1fr)] items-baseline [counter-increment:step]"
          >
            <span className="eyebrow tnum text-ink-faint before:[content:counter(step,decimal-leading-zero)]" />
            <span>{step}</span>
          </li>
        ))}
      </ol>

      <div className="mt-12 flex flex-col items-start gap-3 border-t-2 border-ink pt-6">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="eyebrow inline-flex items-center gap-2 text-ink-soft transition-colors hover:text-ink"
          >
            {link.label}
            <span aria-hidden="true">&#8599;</span>
          </a>
        ))}
      </div>

      <Link
        to={pathFor("/")}
        className="eyebrow mt-12 inline-block text-ink-faint transition-colors hover:text-ink"
      >
        &#8592; {copy.about.backToDirectory}
      </Link>
    </main>
  );
};

export default About;
