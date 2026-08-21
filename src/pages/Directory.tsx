import { useMemo, useState } from "react";
import { useLocale } from "@/contexts/locale-context";
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
 * The board's column geometry, shared by the month bands and every row so the
 * rule down the middle runs unbroken from the first entry to the last.
 */
const COLUMNS =
  "grid grid-cols-[3rem_minmax(0,1fr)] sm:grid-cols-[4.5rem_minmax(0,1fr)_auto]";

/**
 * A filter. Selected reads as a stamped block rather than a button, which is
 * how the rest of the page marks anything that is currently true.
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
    className={`eyebrow whitespace-nowrap px-1.5 py-1 transition-colors ${
      active ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
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
    <li className="group relative border-t border-rule">
      <a
        href={entry.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${COLUMNS} transition-colors group-hover:bg-wash`}
      >
        {/* The departure time: the one thing a reader scans for. */}
        <div className="py-4 pr-3 text-right sm:py-5 sm:pr-5">
          {timing.deadline ? (
            <>
              <div
                className={`tnum font-mono text-[1.375rem] font-semibold leading-none sm:text-[1.75rem] ${
                  urgent ? "text-signal" : "text-ink"
                }`}
              >
                {dayOfMonth(timing.deadline)}
              </div>
              <div className="eyebrow mt-1.5 text-ink-faint">
                {shortMonth(timing.deadline, locale)}
              </div>
            </>
          ) : (
            <div className="font-mono text-[1.375rem] leading-none text-ink-faint sm:text-[1.75rem]">
              &infin;
            </div>
          )}
        </div>

        <div className="min-w-0 border-l border-rule py-4 pl-4 sm:py-5 sm:pl-6">
          <h3 className="font-display text-[1.0625rem] font-semibold uppercase leading-tight tracking-[0.01em] text-ink [overflow-wrap:anywhere] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4 sm:text-[1.1875rem]">
            {entry.name}
            {timing.projected && (
              <span
                className="ml-1.5 cursor-help align-middle font-mono text-sm font-normal text-ink-faint"
                title={copy.directory.projected}
              >
                &asymp;
              </span>
            )}
          </h3>

          <p className="eyebrow mt-2 break-words text-ink-soft">
            {status && (
              <span className={urgent ? "text-signal" : undefined}>
                {urgent && <span aria-hidden="true">&#9642; </span>}
                {status}
              </span>
            )}
            {status && meta.length > 0 && <span className="text-ink-faint"> &middot; </span>}
            {meta.join(" · ")}
            {entry.typical_amount_sek && (
              <span className="sm:hidden">
                <span className="text-ink-faint"> &middot; </span>
                <span className="tnum text-ink">
                  {fill(copy.directory.typicalAmount, {
                    amount: formatAmount(entry.typical_amount_sek, locale),
                  })}
                </span>
              </span>
            )}
          </p>

          {note && (
            <p className="mt-2.5 max-w-prose text-[0.8125rem] leading-relaxed text-ink-soft">
              {note}
            </p>
          )}
        </div>

        {/* Amounts right-align into a column of their own, as on any board. */}
        <div className="col-start-3 hidden items-start justify-end gap-4 py-5 pl-6 sm:flex">
          {entry.typical_amount_sek ? (
            <div className="tnum whitespace-nowrap font-mono text-[0.8125rem] font-medium text-ink">
              {fill(copy.directory.typicalAmount, {
                amount: formatAmount(entry.typical_amount_sek, locale),
              })}
            </div>
          ) : null}
          <span
            className="font-mono text-sm text-ink-faint transition-colors group-hover:text-ink"
            aria-hidden="true"
          >
            &#8599;
          </span>
        </div>
      </a>

      {/* Outside the row link, so it is not swallowed by it. */}
      <a
        href={reportUrl(entry.id, entry.name)}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-1.5 right-0 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-faint opacity-0 hover:text-ink hover:underline focus-visible:opacity-100 group-hover:opacity-100"
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
    <section className="mt-14 first:mt-0">
      <div className={`${COLUMNS} border-b-2 border-ink`}>
        <div aria-hidden="true" />
        <div className="flex items-baseline justify-between border-l border-rule py-1.5 pl-4 sm:col-span-2 sm:pl-6">
          <h2 className="eyebrow text-ink">{heading}</h2>
          <span className="tnum font-mono text-[0.6875rem] text-ink-faint">
            {String(group.items.length).padStart(2, "0")}
          </span>
        </div>
      </div>
      <ul>
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

  // The board's third counter: how long the next deadline leaves you.
  const daysToNext = useMemo(() => {
    const open = scholarships
      .map((entry) => getTiming(entry).daysUntilDeadline)
      .filter((days): days is number => days !== null && days >= 0);
    return open.length > 0 ? Math.min(...open) : null;
  }, []);

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

  const nextLabel = (() => {
    if (daysToNext === null) return copy.directory.boardNextNone;
    if (daysToNext === 0) return copy.directory.boardNextToday;
    return fill(copy.directory.boardNext, { days: daysToNext });
  })();

  return (
    <main className="mx-auto w-full max-w-5xl px-5 pb-24 sm:px-8">
      <header className="pt-10 sm:pt-14">
        <h1 className="max-w-3xl font-display text-[2rem] font-bold uppercase leading-[0.95] tracking-[-0.01em] text-ink sm:text-[3.25rem]">
          {copy.directory.tagline}
        </h1>
        <p className="mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-ink-soft">
          {copy.directory.standfirst}
        </p>
      </header>

      {/* The status band. The only place a number is allowed to be loud. */}
      <div className="slab mt-8 flex flex-wrap items-center gap-x-6 gap-y-1 px-4 py-3 sm:px-5">
        <span className="eyebrow">
          <span className="tnum text-amber">{scholarships.length}</span>{" "}
          {copy.directory.boardTotal}
        </span>
        <span className="eyebrow text-boardInk/30" aria-hidden="true">
          &#9474;
        </span>
        <span className="eyebrow">
          <span className="tnum text-amber">{openNow}</span> {copy.directory.boardOpen}
        </span>
        <span className="eyebrow text-boardInk/30" aria-hidden="true">
          &#9474;
        </span>
        <span className="eyebrow text-boardInk/70">{nextLabel}</span>
      </div>

      <div className="sticky top-0 z-10 -mx-5 border-b border-rule bg-paper/95 px-5 pb-4 pt-4 backdrop-blur sm:-mx-8 sm:px-8">
        <div className="grid grid-cols-[3rem_minmax(0,1fr)_auto] items-baseline border-b-2 border-ink pb-2 sm:grid-cols-[4.5rem_minmax(0,1fr)_auto]">
          <span className="eyebrow text-ink-faint">{copy.directory.searchLabel}</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.directory.searchPlaceholder}
            aria-label={copy.directory.searchAria}
            className="w-full bg-transparent py-1 font-mono text-[0.875rem] text-ink outline-none placeholder:text-ink-faint"
          />
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="eyebrow shrink-0 text-ink-soft hover:text-ink"
            >
              &#215; {copy.directory.clearFilters}
            </button>
          )}
        </div>

        <div className="mt-3 space-y-1.5">
          <div className="grid grid-cols-[3rem_minmax(0,1fr)] items-baseline sm:grid-cols-[4.5rem_minmax(0,1fr)]">
            <span className="eyebrow text-ink-faint">{copy.directory.filterStatus}</span>
            <div className="-mx-1.5 flex min-w-0 flex-wrap">
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

          <div className="grid grid-cols-[3rem_minmax(0,1fr)] items-baseline sm:grid-cols-[4.5rem_minmax(0,1fr)]">
            <span className="eyebrow text-ink-faint">{copy.directory.filterSubject}</span>
            <div className="-mx-1.5 flex min-w-0 flex-wrap">
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
        <p className="eyebrow tnum mt-5 text-ink-faint">
          {results.length === 1
            ? copy.directory.countOne
            : fill(copy.directory.countMany, { count: results.length })}
        </p>
      )}

      <div className="mt-10">
        {groups.length === 0 ? (
          <div className="border-y-2 border-ink py-20 text-center">
            <p className="font-display text-xl font-semibold uppercase text-ink">
              {copy.directory.noResults}
            </p>
            <p className="mt-3 text-sm text-ink-soft">{copy.directory.noResultsHint}</p>
          </div>
        ) : (
          groups.map((group) => <MonthSection key={group.key} group={group} />)
        )}
      </div>

      <aside className="mt-20 border-2 border-ink p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold uppercase tracking-[0.01em] text-ink">
          {copy.directory.contributeTitle}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
          {copy.directory.contributeBody}
        </p>
        <a
          href={NEW_SCHOLARSHIP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="eyebrow mt-5 inline-flex items-center gap-2 bg-ink px-3 py-2 text-paper transition-opacity hover:opacity-80"
        >
          {copy.footer.addScholarship}
          <span aria-hidden="true">&#8599;</span>
        </a>
      </aside>
    </main>
  );
};

export default Directory;
