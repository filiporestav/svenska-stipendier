import { useMemo, useState } from "react";
import { ArrowUpRight, Search, X } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import {
  dayOfMonth,
  fill,
  formatAmount,
  formatDate,
  monthLabel,
  shortMonth,
} from "@/lib/i18n";
import {
  DatedEntry,
  MonthGroup,
  Phase,
  Tag,
  activeTags,
  countOpenNow,
  getTiming,
  groupByDeadlineMonth,
  scholarships,
} from "@/lib/scholarships";
import { NEW_SCHOLARSHIP_URL, reportUrl } from "@/lib/site";

/** Below this many days, a deadline is worth shouting about. */
const URGENT_DAYS = 7;

const STATUS_FILTERS: (Phase | null)[] = [null, "open", "upcoming"];

/**
 * A filter control. Understated on purpose: the list is what matters, so the
 * chrome around it reads as a legend rather than as buttons competing with it.
 */
const Toggle = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`-mx-1 whitespace-nowrap rounded-sm px-1 py-0.5 text-sm transition-colors ${
      active
        ? "font-medium text-ink underline decoration-accentInk decoration-2 underline-offset-[6px]"
        : "text-ink-soft hover:text-ink"
    }`}
  >
    {children}
  </button>
);

const Row = ({ entry, timing }: DatedEntry) => {
  const { copy, locale } = useLocale();

  const urgent =
    timing.phase === "open" &&
    timing.daysUntilDeadline !== null &&
    timing.daysUntilDeadline <= URGENT_DAYS;

  const status = (() => {
    if (timing.phase === "rolling") return copy.directory.rollingSub;
    if (timing.phase === "upcoming" && timing.opens) {
      return fill(copy.phase.opensOn, { date: formatDate(timing.opens, locale) });
    }
    if (timing.daysUntilDeadline === null) return null;
    if (timing.daysUntilDeadline === 0) return copy.phase.lastDay;
    if (timing.daysUntilDeadline === 1) return copy.phase.daysLeftOne;
    return fill(copy.phase.daysLeftMany, { count: timing.daysUntilDeadline });
  })();

  const meta = [
    ...entry.tags.map((tag) => copy.tags[tag]),
    entry.report_required ? copy.directory.reportRequired : null,
    entry.apply_via === "email"
      ? entry.apply_email
        ? fill(copy.directory.applyByEmail, { email: entry.apply_email })
        : copy.directory.applyByEmailGeneric
      : null,
    entry.apply_via === "post" ? copy.directory.applyByPost : null,
  ].filter(Boolean) as string[];

  const note = entry.notes?.[locale] ?? entry.notes?.sv ?? null;

  return (
    <li className="group relative border-t border-rule first:border-t-0">
      <a
        href={entry.url}
        target="_blank"
        rel="noopener noreferrer"
        className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-x-4 py-5 sm:grid-cols-[3.25rem_minmax(0,1fr)_auto] sm:gap-x-6"
      >
        {/* Date gutter -- the spine of the whole index. */}
        <div className="text-center">
          {timing.deadline ? (
            <>
              <div
                className={`tnum font-serif text-[1.75rem] leading-none sm:text-[2rem] ${
                  urgent ? "text-signal" : "text-ink"
                }`}
              >
                {dayOfMonth(timing.deadline)}
              </div>
              <div className="eyebrow mt-1 text-ink-faint">
                {shortMonth(timing.deadline, locale)}
              </div>
            </>
          ) : (
            <div className="font-serif text-[1.75rem] leading-none text-ink-faint">&infin;</div>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="font-sans text-[0.9375rem] font-medium leading-snug text-ink decoration-accentInk/40 underline-offset-4 group-hover:underline sm:text-base">
            {entry.name}
            {timing.projected && (
              <span
                className="ml-1.5 cursor-help align-middle text-xs text-ink-faint"
                title={copy.directory.projected}
              >
                &asymp;
              </span>
            )}
          </h3>

          <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-soft">
            {status && (
              <span className={urgent ? "font-medium text-signal" : undefined}>{status}</span>
            )}
            {status && meta.length > 0 && <span className="text-ink-faint"> &middot; </span>}
            {meta.join(" · ")}
            {entry.typical_amount_sek && (
              <span className="sm:hidden">
                <span className="text-ink-faint"> &middot; </span>
                <span className="tnum font-medium text-ink">
                  {fill(copy.directory.typicalAmount, {
                    amount: formatAmount(entry.typical_amount_sek, locale),
                  })}
                </span>
              </span>
            )}
          </p>

          {note && (
            <p className="mt-2 max-w-prose text-[0.8125rem] leading-relaxed text-ink-soft/90">
              {note}
            </p>
          )}
        </div>

        {/* Amounts right-align into a column of their own, as on any listings page. */}
        <div className="col-start-3 hidden items-center gap-3 sm:flex sm:justify-end">
          {entry.typical_amount_sek ? (
            <div className="tnum whitespace-nowrap font-sans text-[0.9375rem] font-medium text-ink">
              {fill(copy.directory.typicalAmount, {
                amount: formatAmount(entry.typical_amount_sek, locale),
              })}
            </div>
          ) : null}
          <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-faint transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accentInk" />
        </div>
      </a>

      {/* Outside the row link, so it is not swallowed by it. */}
      <a
        href={reportUrl(entry.id, entry.name)}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-1.5 right-0 text-[0.6875rem] text-ink-faint opacity-0 transition-opacity hover:text-ink hover:underline focus-visible:opacity-100 group-hover:opacity-100"
      >
        {copy.directory.reportProblem}
      </a>
    </li>
  );
};

const MonthSection = ({ group }: { group: MonthGroup }) => {
  const { copy, locale } = useLocale();
  const heading =
    group.month === null ? copy.directory.rollingHeading : monthLabel(group.month, locale);

  return (
    <section className="mt-12 first:mt-0">
      <div className="flex items-baseline gap-4">
        <h2 className="eyebrow shrink-0 font-sans text-ink">{heading}</h2>
        <span className="h-px flex-1 bg-rule-strong" aria-hidden="true" />
        <span className="tnum shrink-0 text-xs text-ink-faint">{group.items.length}</span>
      </div>
      <ul className="mt-1">
        {group.items.map((item) => (
          <Row key={item.entry.id} {...item} />
        ))}
      </ul>
    </section>
  );
};

const Directory = () => {
  const { copy, locale } = useLocale();
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<Tag | null>(null);
  const [phase, setPhase] = useState<Phase | null>(null);

  const openNow = useMemo(() => countOpenNow(scholarships), []);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return scholarships.filter((entry) => {
      if (tag && !entry.tags.includes(tag)) return false;
      if (phase && getTiming(entry).phase !== phase) return false;
      if (!needle) return true;
      const haystack = [
        entry.name,
        entry.notes?.sv ?? "",
        entry.notes?.en ?? "",
        ...entry.tags.map((t) => copy.tags[t]),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [query, tag, phase, copy.tags]);

  const groups = useMemo(() => groupByDeadlineMonth(results), [results]);

  const hasFilters = query !== "" || tag !== null || phase !== null;
  const clearFilters = () => {
    setQuery("");
    setTag(null);
    setPhase(null);
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-5 pb-28 sm:px-8">
      <header className="border-b border-ink pb-8 pt-14 sm:pt-20">
        <h1 className="max-w-xl font-serif text-[2rem] leading-[1.1] text-ink sm:text-[2.75rem]">
          {copy.directory.tagline}
        </h1>
        <p className="mt-5 max-w-lg text-[0.9375rem] leading-relaxed text-ink-soft">
          {copy.directory.standfirst}
        </p>
        <p className="tnum eyebrow mt-6 text-ink-faint">
          {fill(copy.directory.summary, { total: scholarships.length, open: openNow })}
        </p>
      </header>

      <div className="sticky top-0 z-10 -mx-5 border-b border-rule bg-paper/95 px-5 pb-4 pt-4 backdrop-blur sm:-mx-8 sm:px-8">
        <div className="flex items-center gap-3 border-b border-rule-strong pb-2">
          <Search className="h-4 w-4 shrink-0 text-ink-faint" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.directory.searchPlaceholder}
            aria-label={copy.directory.searchPlaceholder}
            className="w-full bg-transparent py-1 font-sans text-[0.9375rem] text-ink outline-none placeholder:text-ink-faint"
          />
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex shrink-0 items-center gap-1 text-xs text-ink-soft hover:text-ink"
            >
              <X className="h-3 w-3" />
              {copy.directory.clearFilters}
            </button>
          )}
        </div>

        <div className="mt-3 flex min-w-0 flex-col gap-2 text-sm sm:flex-row sm:items-baseline sm:gap-8">
          <div className="flex min-w-0 items-baseline gap-3 sm:shrink-0">
            <span className="eyebrow shrink-0 text-ink-faint">{copy.directory.filterStatus}</span>
            <div className="flex min-w-0 flex-wrap gap-x-4 gap-y-1">
              {STATUS_FILTERS.map((option) => (
                <Toggle
                  key={option ?? "all"}
                  active={phase === option}
                  onClick={() => setPhase(option)}
                >
                  {option === null ? copy.phase.all : copy.phase[option]}
                </Toggle>
              ))}
            </div>
          </div>

          <div className="flex min-w-0 items-baseline gap-3">
            <span className="eyebrow shrink-0 text-ink-faint">{copy.directory.filterSubject}</span>
            <div className="flex min-w-0 flex-wrap gap-x-4 gap-y-1">
              <Toggle active={tag === null} onClick={() => setTag(null)}>
                {copy.directory.allTags}
              </Toggle>
              {activeTags.map((option) => (
                <Toggle
                  key={option}
                  active={tag === option}
                  onClick={() => setTag(tag === option ? null : option)}
                >
                  {copy.tags[option]}
                </Toggle>
              ))}
            </div>
          </div>
        </div>
      </div>

      {hasFilters && (
        <p className="tnum mt-6 text-xs text-ink-faint">
          {results.length === 1
            ? copy.directory.countOne
            : fill(copy.directory.countMany, { count: results.length })}
        </p>
      )}

      <div className="mt-10">
        {groups.length === 0 ? (
          <div className="border-t border-rule py-20 text-center">
            <p className="font-serif text-xl text-ink">{copy.directory.noResults}</p>
            <p className="mt-2 text-sm text-ink-soft">{copy.directory.noResultsHint}</p>
          </div>
        ) : (
          groups.map((group) => <MonthSection key={group.key} group={group} />)
        )}
      </div>

      <aside className="mt-20 border-t border-ink pt-6">
        <h2 className="font-serif text-xl text-ink">{copy.directory.contributeTitle}</h2>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-soft">
          {copy.directory.contributeBody}
        </p>
        <a
          href={NEW_SCHOLARSHIP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 border-b border-accentInk/40 pb-0.5 text-sm font-medium text-accentInk transition-colors hover:border-accentInk"
        >
          {copy.footer.addScholarship}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </aside>
    </main>
  );
};

export default Directory;
