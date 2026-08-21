// Loads every scholarship in data/scholarships/ at build time.
//
// The data files are the source of truth for this site. Nothing here reads a
// database: to change what the directory shows, edit a file in data/ and open a
// pull request.

export type ApplyVia = "website" | "email" | "post";
export type Recurrence = "annual" | "one-off" | "rolling";

export type Tag =
  | "utlandsstudier"
  | "examensarbete"
  | "forskning"
  | "foretagsstipendium"
  | "kultur"
  | "medlemskap"
  | "region"
  | "kvinnor"
  | "internationellt"
  | "ai"
  | "kth"
  | "chalmers";

export interface Scholarship {
  id: string;
  name: string;
  url: string;
  opens?: string | null;
  deadline?: string | null;
  recurrence?: Recurrence;
  apply_via: ApplyVia;
  apply_email?: string;
  report_required?: boolean;
  typical_amount_sek?: number;
  tags: Tag[];
  notes?: { sv?: string | null; en?: string | null };
  status?: "active" | "discontinued";
  last_verified: string;
}

const modules = import.meta.glob<Scholarship>("/data/scholarships/*.json", {
  eager: true,
  import: "default",
});

export const scholarships: Scholarship[] = Object.values(modules).filter(
  (entry) => entry.status !== "discontinued"
);

export const discontinuedCount =
  Object.values(modules).length - scholarships.length;

/** Every tag that at least one scholarship actually carries, most common first. */
export const activeTags: Tag[] = (() => {
  const counts = new Map<Tag, number>();
  for (const entry of scholarships) {
    for (const tag of entry.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);
})();

// ---------------------------------------------------------------------------
// Dates
//
// A stored deadline is the last one we confirmed. For an annual scholarship
// that date goes stale every year, so we roll it forward to the next time it
// comes round and mark the result as projected -- the UI says so, rather than
// quietly presenting a guess as fact.
// ---------------------------------------------------------------------------

export type Phase = "open" | "upcoming" | "closed" | "rolling" | "unknown";

export interface Timing {
  phase: Phase;
  /** The deadline being shown, ISO date. */
  deadline: string | null;
  /** The opening date being shown, ISO date. */
  opens: string | null;
  /** True when the dates were rolled forward from a past cycle rather than confirmed. */
  projected: boolean;
  /** Days from today until the shown deadline; negative once it has passed. */
  daysUntilDeadline: number | null;
}

const DAY = 24 * 60 * 60 * 1000;

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const toISO = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;

const parse = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

/** Same month and day, in the earliest year that is not before `notBefore`. */
const rollForward = (iso: string, notBefore: Date) => {
  const date = parse(iso);
  const rolled = new Date(notBefore.getFullYear(), date.getMonth(), date.getDate());
  if (rolled < notBefore) rolled.setFullYear(rolled.getFullYear() + 1);
  return rolled;
};

export function getTiming(entry: Scholarship, today = new Date()): Timing {
  const now = startOfDay(today);

  if (entry.recurrence === "rolling" || !entry.deadline) {
    return {
      phase: entry.recurrence === "rolling" ? "rolling" : "unknown",
      deadline: null,
      opens: entry.opens ?? null,
      projected: false,
      daysUntilDeadline: null,
    };
  }

  const storedDeadline = parse(entry.deadline);
  const stillCurrent = storedDeadline >= now;
  const annual = entry.recurrence !== "one-off";

  let deadline = storedDeadline;
  let opens = entry.opens ? parse(entry.opens) : null;
  let projected = false;

  if (!stillCurrent && annual) {
    deadline = rollForward(entry.deadline, now);
    if (entry.opens) {
      // Keep the window's shape: the opening date sits the same number of days
      // before the deadline as it did in the confirmed cycle.
      const window = storedDeadline.getTime() - parse(entry.opens).getTime();
      opens = new Date(deadline.getTime() - window);
    }
    projected = true;
  }

  const daysUntilDeadline = Math.round((deadline.getTime() - now.getTime()) / DAY);

  let phase: Phase;
  if (daysUntilDeadline < 0) phase = "closed";
  else if (opens && opens > now) phase = "upcoming";
  else phase = "open";

  return {
    phase,
    deadline: toISO(deadline),
    opens: opens ? toISO(opens) : null,
    projected,
    daysUntilDeadline,
  };
}

/** Open first, then soonest to open, with closed and undated entries last. */
export function compareByUrgency(a: Scholarship, b: Scholarship, today = new Date()) {
  const ta = getTiming(a, today);
  const tb = getTiming(b, today);
  const rank = (t: Timing) =>
    t.phase === "open" ? 0 : t.phase === "upcoming" ? 1 : t.phase === "rolling" ? 2 : 3;

  const byRank = rank(ta) - rank(tb);
  if (byRank !== 0) return byRank;

  const da = ta.daysUntilDeadline;
  const db = tb.daysUntilDeadline;
  if (da !== null && db !== null && da !== db) return da - db;
  return a.name.localeCompare(b.name, "sv");
}
