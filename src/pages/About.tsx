import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useLocale } from "@/contexts/locale-context";
import { scholarships } from "@/lib/scholarships";
import { CONTRIBUTING_URL, DATA_DIR_URL, GITHUB_URL, NEW_SCHOLARSHIP_URL } from "@/lib/site";

const content = {
  sv: {
    intro:
      "Det här är en öppen lista över stipendier som studenter i Sverige kan söka. Den började som ett kalkylark där vi höll reda på våra egna ansökningar, och ligger nu här så att fler kan använda den.",
    noAccount:
      "Det finns inget konto att skapa och ingenting att betala för. Du klickar dig vidare till stipendiegivaren och skickar in ansökan själv.",
    dataTitle: "Om uppgifterna",
    dataBody:
      "Varje stipendium är en JSON-fil i repot. Datumen är hämtade från förra omgången: för stipendier som återkommer varje år räknar sidan fram nästa förväntade datum och markerar det med ≈. Det är en uppskattning, inte ett besked - kontrollera alltid mot stipendiegivarens egen webbplats.",
    contributeBody:
      "Hittar du ett stipendium som saknas, ett datum som har ändrats eller ett som inte längre delas ut? Öppna ett ärende eller skicka en pull request. Ändringar av en fil kontrolleras automatiskt mot dataschemat.",
    steps: [
      "Öppna ett ärende om du hellre bara vill tipsa oss.",
      "Eller redigera filen direkt på GitHub och skicka en pull request.",
      "En kontroll validerar formatet automatiskt innan vi slår ihop den.",
    ],
    linkData: "Se alla datafiler",
    linkContributing: "Läs bidragsguiden",
    linkNew: "Lägg till ett stipendium",
    linkRepo: "Källkoden på GitHub",
    count: (n: number) => `Listan innehåller just nu ${n} stipendier.`,
  },
  en: {
    intro:
      "This is an open list of scholarships students in Sweden can apply for. It started as a spreadsheet where we tracked our own applications, and now lives here so more people can use it.",
    noAccount:
      "There is no account to create and nothing to pay for. You click through to the awarding body and submit the application yourself.",
    dataTitle: "About the data",
    dataBody:
      "Each scholarship is a JSON file in the repository. Dates come from the last round: for scholarships that recur annually the site projects the next expected date and marks it with ≈. That is an estimate, not an announcement - always check the awarding body's own website.",
    contributeBody:
      "Found a scholarship that is missing, a date that has changed, or one that is no longer awarded? Open an issue or send a pull request. Changes to a file are checked automatically against the data schema.",
    steps: [
      "Open an issue if you would rather just tell us about it.",
      "Or edit the file directly on GitHub and send a pull request.",
      "A check validates the format automatically before we merge it.",
    ],
    linkData: "Browse the data files",
    linkContributing: "Read the contributing guide",
    linkNew: "Add a scholarship",
    linkRepo: "Source code on GitHub",
    count: (n: number) => `The list currently holds ${n} scholarships.`,
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
    <main className="mx-auto w-full max-w-2xl px-5 pb-28 pt-14 sm:pt-20 sm:px-8">
      <h1 className="border-b border-ink pb-6 font-serif text-[2rem] leading-tight text-ink sm:text-[2.5rem]">
        {copy.about.title}
      </h1>

      <div className="mt-8 space-y-4 text-[0.9375rem] leading-relaxed text-ink-soft">
        <p>{text.intro}</p>
        <p>{text.noAccount}</p>
        <p className="tnum eyebrow pt-2 text-ink-faint">{text.count(scholarships.length)}</p>
      </div>

      <h2 className="eyebrow mt-12 font-sans text-ink">
        {text.dataTitle}
      </h2>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">{text.dataBody}</p>

      <h2 className="eyebrow mt-12 font-sans text-ink">
        {copy.about.contributeTitle}
      </h2>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">{text.contributeBody}</p>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-[0.9375rem] leading-relaxed marker:text-ink-faint text-ink-soft">
        {text.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <div className="mt-10 flex flex-col items-start gap-3 border-t border-rule pt-6">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 border-b border-accentInk/30 pb-0.5 text-sm text-accentInk transition-colors hover:border-accentInk"
          >
            {link.label}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        ))}
      </div>

      <Link
        to={pathFor("/")}
        className="mt-12 inline-block text-[0.8125rem] text-ink-faint transition-colors hover:text-ink"
      >
        ← {copy.about.backToDirectory}
      </Link>
    </main>
  );
};

export default About;
