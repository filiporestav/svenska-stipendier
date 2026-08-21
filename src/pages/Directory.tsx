import { useMemo, useState } from "react";
import { ArrowUpRight, ExternalLink, Mail, Pencil, Search, X } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { fill, formatAmount, formatDate } from "@/lib/i18n";
import {
  Phase,
  Scholarship,
  Tag,
  activeTags,
  compareByUrgency,
  getTiming,
  scholarships,
} from "@/lib/scholarships";
import { NEW_SCHOLARSHIP_URL, reportUrl } from "@/lib/site";
import { Input } from "@/components/ui/input";

const PHASE_ORDER: Phase[] = ["open", "upcoming", "rolling", "closed"];

const phaseStyles: Record<Phase, string> = {
  open: "bg-success/15 text-success border-success/30",
  upcoming: "bg-warning/15 text-warning border-warning/30",
  rolling: "bg-accent text-accent-foreground border-accent",
  closed: "bg-muted text-muted-foreground border-border",
  unknown: "bg-muted text-muted-foreground border-border",
};

const Chip = ({
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
    className={`rounded-full border px-3 py-1 text-sm transition-colors ${
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
    }`}
  >
    {children}
  </button>
);

const ScholarshipRow = ({ entry }: { entry: Scholarship }) => {
  const { copy, locale } = useLocale();
  const timing = getTiming(entry);

  const dateLine = (() => {
    if (timing.phase === "rolling") return copy.phase.rolling;
    if (!timing.deadline) return copy.phase.unknown;
    if (timing.phase === "upcoming" && timing.opens) {
      return fill(copy.phase.opensOn, { date: formatDate(timing.opens, locale) });
    }
    return fill(copy.phase.deadlineOn, { date: formatDate(timing.deadline, locale) });
  })();

  const daysLeft =
    timing.phase === "open" && timing.daysUntilDeadline !== null
      ? timing.daysUntilDeadline === 1
        ? copy.phase.daysLeftOne
        : fill(copy.phase.daysLeftMany, { count: timing.daysUntilDeadline })
      : null;

  const note = entry.notes?.[locale] ?? entry.notes?.sv ?? null;

  return (
    <article className="group relative border-b border-border py-6 first:border-t">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h2 className="font-heading text-lg font-medium leading-tight text-foreground">
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary hover:underline underline-offset-4"
              >
                {entry.name}
                <ArrowUpRight className="ml-1 inline h-4 w-4 opacity-40 transition-opacity group-hover:opacity-100" />
              </a>
            </h2>
            <span
              className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                phaseStyles[timing.phase]
              }`}
            >
              {copy.phase[timing.phase]}
            </span>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            {dateLine}
            {daysLeft && <span className="text-foreground"> · {daysLeft}</span>}
            {timing.projected && (
              <span
                className="ml-2 cursor-help border-b border-dotted border-muted-foreground/50"
                title={copy.directory.projected}
              >
                ≈
              </span>
            )}
          </p>

          {note && <p className="mt-2 max-w-2xl text-sm text-foreground/80">{note}</p>}

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {entry.typical_amount_sek && (
              <span className="rounded bg-secondary px-2 py-0.5 text-secondary-foreground">
                {fill(copy.directory.typicalAmount, {
                  amount: formatAmount(entry.typical_amount_sek, locale),
                })}
              </span>
            )}
            {entry.tags.map((tag) => (
              <span key={tag} className="rounded bg-muted px-2 py-0.5">
                {copy.tags[tag]}
              </span>
            ))}
            {entry.report_required && (
              <span className="rounded bg-muted px-2 py-0.5">
                {copy.directory.reportRequired}
              </span>
            )}
            {entry.apply_via === "email" && (
              <span className="inline-flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {entry.apply_email
                  ? fill(copy.directory.applyByEmail, { email: entry.apply_email })
                  : copy.directory.applyByEmailGeneric}
              </span>
            )}
            {entry.apply_via === "post" && <span>{copy.directory.applyByPost}</span>}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-1 sm:items-end">
          <a
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {copy.directory.apply}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <span className="text-xs text-muted-foreground">
            {fill(copy.directory.lastVerified, {
              date: formatDate(entry.last_verified, locale),
            })}
          </span>
          <a
            href={reportUrl(entry.id, entry.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground opacity-0 transition-opacity hover:text-foreground hover:underline focus:opacity-100 group-hover:opacity-100"
          >
            <Pencil className="h-3 w-3" />
            {copy.directory.reportProblem}
          </a>
        </div>
      </div>
    </article>
  );
};

const Directory = () => {
  const { copy, locale } = useLocale();
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<Tag | null>(null);
  const [phase, setPhase] = useState<Phase | null>(null);

  const sorted = useMemo(() => [...scholarships].sort(compareByUrgency), []);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return sorted.filter((entry) => {
      if (tag && !entry.tags.includes(tag)) return false;
      if (phase && getTiming(entry).phase !== phase) return false;
      if (!needle) return true;
      return (
        entry.name.toLowerCase().includes(needle) ||
        (entry.notes?.sv ?? "").toLowerCase().includes(needle) ||
        (entry.notes?.en ?? "").toLowerCase().includes(needle)
      );
    });
  }, [sorted, query, tag, phase]);

  const hasFilters = query !== "" || tag !== null || phase !== null;
  const clearFilters = () => {
    setQuery("");
    setTag(null);
    setPhase(null);
  };

  const phaseCounts = useMemo(() => {
    const counts = new Map<Phase, number>();
    for (const entry of sorted) {
      const p = getTiming(entry).phase;
      counts.set(p, (counts.get(p) ?? 0) + 1);
    }
    return counts;
  }, [sorted]);

  return (
    <main className="mx-auto w-full max-w-4xl px-5 pb-24 pt-12 sm:px-8">
      <header className="mb-10">
        <h1 className="font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
          {copy.directory.title}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{copy.directory.subtitle}</p>
      </header>

      <div className="sticky top-0 z-10 -mx-5 mb-2 border-b border-border bg-background/95 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.directory.searchPlaceholder}
            aria-label={copy.directory.searchPlaceholder}
            className="pl-9"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Chip active={phase === null} onClick={() => setPhase(null)}>
            {copy.phase.all}
          </Chip>
          {PHASE_ORDER.filter((p) => phaseCounts.get(p)).map((p) => (
            <Chip key={p} active={phase === p} onClick={() => setPhase(phase === p ? null : p)}>
              {copy.phase[p]}
              <span className="ml-1.5 opacity-60">{phaseCounts.get(p)}</span>
            </Chip>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          <Chip active={tag === null} onClick={() => setTag(null)}>
            {copy.directory.allTags}
          </Chip>
          {activeTags.map((t) => (
            <Chip key={t} active={tag === t} onClick={() => setTag(tag === t ? null : t)}>
              {copy.tags[t]}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {results.length === 1
            ? copy.directory.countOne
            : fill(copy.directory.countMany, { count: results.length })}
        </span>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1 hover:text-foreground hover:underline"
          >
            <X className="h-3.5 w-3.5" />
            {copy.directory.clearFilters}
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
          {copy.directory.noResults}
        </p>
      ) : (
        <div>
          {results.map((entry) => (
            <ScholarshipRow key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      <div className="mt-12 rounded-lg border border-border bg-muted/40 p-6">
        <p className="text-sm text-foreground">{copy.footer.dataNote}</p>
        <a
          href={NEW_SCHOLARSHIP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          {copy.footer.addScholarship}
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </main>
  );
};

export default Directory;
