# AGENTS.md

The working guide for this repository: what it is, how to change it safely, and
what it should look like. It is the single source of project convention — there is
no separate per-tool instructions file. Read it before editing.

## What this project is

**Svenska stipendier** is an open database of scholarships available to students in
Sweden, plus a static site that browses it. A student finds an entry, clicks
through to the awarding body, and applies themselves. The project never submits
anything on anyone's behalf, holds no accounts, and stores nothing about
applicants.

An earlier version (Lomira) automated application submission via Supabase, Mailgun
and an LLM. All of it was removed; it survives only in git history. **Do not
reintroduce a backend, database, auth, or analytics without being asked.**

Stack: Vite + React 18 + TypeScript + Tailwind. Data is JSON on disk. Deployed as
a static build (Vercel, SPA rewrite in `vercel.json`).

## Commands

```bash
npm run dev       # dev server on http://localhost:8080
npm run validate  # validate data/scholarships/*.json against data/schema.json
npm run lint      # ESLint
npm run build     # production build into dist/
```

Node 20 or newer. No environment variables, no API keys, no secrets — if a task
seems to need one, the task is wrong for this project.

CI (`.github/workflows/ci.yml`) runs `node scripts/validate-data.mjs` and
`npm run build` on every pull request. Run `npm run validate` after a data change,
and `npm run lint && npm run build` after a code change, before reporting done.

## Repository map

```
data/scholarships/<id>.json   one scholarship each — the source of truth
data/schema.json              what a scholarship file may contain
scripts/validate-data.mjs     the validator (zero dependencies, on purpose)
src/lib/scholarships.ts       loads data at build time, deadline logic, grouping
src/lib/i18n.ts               every user-visible string, sv + en, plus formatters
src/lib/site.ts               all GitHub contribution links, built from GITHUB_REPO
src/lib/seo.ts                per-route title/description/canonical/hreflang
src/pages/Directory.tsx       the list, search and filters — the whole product
src/pages/About.tsx           prose page
src/components/ui/            unused shadcn scaffold (see "Components")
```

## Architecture rules

### 1. Data is the source of truth

`src/lib/scholarships.ts` loads every file with
`import.meta.glob("/data/scholarships/*.json")` — the leading slash resolves from
the project root, not `src/`. Entries with `status: "discontinued"` are filtered
out at load.

**Changing what the site shows means editing a data file, never a component.** If
a component contains a scholarship name, a deadline, or a hardcoded count, that is
a bug.

### 2. Deadlines are projected, and must be labelled as such

Stored dates record the last confirmed round. Most entries are
`recurrence: "annual"`, so `getTiming()` rolls a past date forward to the next
occurrence of the same month and day, preserves the length of the open→deadline
window, and sets `projected: true`.

Anything rendered from a `projected` timing must carry the `≈` marker and the
`copy.directory.projected` tooltip. **Never present a projected date as
confirmed** — students plan around these.

Reuse these rather than reimplementing them: `getTiming`, `compareByUrgency`,
`groupByDeadlineMonth`, `countOpenNow`, `activeTags`. Each takes a `today`
parameter so behaviour stays testable; don't call `new Date()` inline in a
component.

### 3. Everything is bilingual

`App.tsx` mounts the same route tree twice: `/` (Swedish) and `/en` (English).
`LocaleContext` supplies `copy`, `locale`, and `pathFor()`.

- **No user-visible string literal belongs in a component.** Add it to both the
  `sv` and `en` blocks of `src/lib/i18n.ts` in the same change. Long prose pages
  may keep a local `content = { sv, en }` object (see `About.tsx`), but never a
  single-language string.
- Swedish is the default and the primary voice. Write the Swedish first, then the
  English — not a translation of a translation.
- Interpolate with `fill(copy.x.y, { count })`, never string concatenation.
- Format dates, months and amounts with the `Intl` helpers in `i18n.ts`
  (`formatDate`, `monthLabel`, `shortMonth`, `dayOfMonth`, `formatAmount`). Never
  hand-roll a date format.
- Internal links go through `pathFor()` so the locale prefix survives.
- Locale comes from `navigator.language` on first visit, then localStorage. There
  is no geolocation call and must not be one.

### 4. Contribution links come from one constant

Every "add a scholarship", "report a problem" and "edit this file" link is built
in `src/lib/site.ts` from `GITHUB_REPO`. Never hardcode a GitHub URL elsewhere.

### 5. Static means static

No backend, no accounts, no analytics, no cookies, no third-party requests beyond
the font stylesheet in `index.html`. Don't add a fetch to anything.

## Data conventions

`data/schema.json` is authoritative; `CONTRIBUTING.md` explains each field for
humans. The rules that bite most often:

- `id` must equal the filename without `.json`: lowercase, hyphenated, no Swedish
  characters (`Gålöstiftelsen` → `galostiftelsen`).
- `url` points at the page a student applies from, as specific as possible — not
  the organisation's front page.
- `deadline` is `null` only when `recurrence` is `rolling`.
- `last_verified` is a claim that someone checked the source that day. Update it
  whenever you touch an entry; never bump it without actually checking.
- A scholarship that stops existing gets `"status": "discontinued"` — **never
  delete the file**, or it gets re-added later from a stale list.
- **Adding a tag is a three-place change in one commit**: the `tags` enum in
  `data/schema.json`, the `tags` blocks for both `sv` and `en` in
  `src/lib/i18n.ts`, and the `Tag` union in `src/lib/scholarships.ts`. The
  validator rejects unknown tags.
- Never write anything about an individual applicant, and never a private
  person's contact details — organisational addresses only.
- Never guess a date. `null` beats a plausible invention.

## Design language

The site is **an index of deadlines, not a feed of cards**. The reference is a
printed timetable or an editorial listings page: paper, ink, hairline rules,
tabular figures, one accent. Every rule below follows from that. If a change would
make the page feel more like a marketing site or a dashboard, it is the wrong
change.

### Tokens, and only tokens

The palette lives in `src/index.css` as HSL triplets, exposed through
`tailwind.config.ts`:

| Token | Class | Use |
| --- | --- | --- |
| `--paper` | `bg-paper` | Page ground. Warm off-white; pure white glares in long lists. |
| `--ink` | `text-ink`, `border-ink` | Body text, and the heavy rule that closes a masthead. |
| `--ink-soft` | `text-ink-soft` | Secondary text: status lines, notes, meta. |
| `--ink-faint` | `text-ink-faint` | Tertiary: eyebrows, counts, placeholders, idle icons. |
| `--rule` | `border-rule` | Hairline dividers between rows — the main structural device. |
| `--rule-strong` | `border-rule-strong`, `bg-rule-strong` | Section rules: the search underline, the line beside a month heading. |
| `--accent-ink` | `text-accentInk`, `border-accentInk` | Links, the active-filter underline, hover state on the row arrow. |
| `--signal` | `text-signal` | **Urgency only** — a deadline within `URGENT_DAYS` (7). |
| `--wash` | `bg-wash` | The one fill tint, for quiet blocks. |

`--signal` is reserved. If it appears anywhere decorative, that is a bug.

shadcn's tokens (`--background`, `--primary`, `--muted`, …) are aliased onto the
same palette so any stray primitive doesn't look foreign, but new code should use
the semantic names above.

**Never write a raw colour.** No hex, no `rgb()`, no Tailwind palette classes
(`text-neutral-900`, `bg-white`, `text-green-600`). Dark mode works purely by
redefining these variables under a `prefers-color-scheme` media query, so a
hardcoded colour silently breaks it.

### Typography

- **Instrument Serif** (`font-serif`) for display: the masthead, page titles, the
  large day numeral in the date gutter, empty-state lines. It ships regular and
  italic only — **never** add `font-bold` or `font-medium` to it. Emphasis comes
  from size.
- **Inter** (`font-sans`) for everything read in quantity, including scholarship
  names. The base layer sets `h1`–`h3` to serif, so a heading meant to be sans —
  like a row title or an eyebrow `h2` — sets `font-sans` explicitly.
- `.tnum` on every date, amount, count and countdown, so figures line up down the
  page.
- `.eyebrow` for small ruled labels: month headings, filter legends, the summary
  line (11px, uppercase, wide tracking).
- Body sizes are deliberately bespoke and small: `text-[0.9375rem]` for primary
  rows, `text-[0.8125rem]` for meta and notes. Match the neighbours rather than
  reaching for Tailwind's default scale.
- Sentence case in both languages.

### Layout and structure

- Content column is `max-w-3xl` (`max-w-2xl` for prose on About), padded
  `px-5 sm:px-8`. The masthead, nav and footer share the same column.
- Rows are `<li>` items separated by `border-t border-rule first:border-t-0`. The
  whole row is one `<a>` to the awarding body; secondary actions (the "report an
  error" link) sit **outside** that anchor so they aren't swallowed by it.
- The date gutter is the spine of the index:
  `grid-cols-[2.5rem_minmax(0,1fr)]`, widening to
  `sm:grid-cols-[3.25rem_minmax(0,1fr)_auto]` where a right-hand amount column
  appears. Day numeral in serif, month abbreviation in `.eyebrow`, `∞` when there
  is no date.
- Entries group by deadline month, each section headed by an eyebrow, a
  `h-px flex-1 bg-rule-strong` rule and a count. Rolling entries collect in a
  final undated group.
- Filters read as a legend, not a toolbar: text `Toggle`s that mark the active
  option with an `accentInk` underline. No pill chips, no button bars. The search
  field is a bare `<input>` under a `border-rule-strong` line — not a boxed input.
- `--radius` is `0.25rem`. Corners are nearly square; avoid `rounded-lg` and
  larger.
- **No shadows, no gradients, no filled cards.** Where you want to group things,
  use a rule.
- Mobile first: the grid collapses to two columns and the amount moves inline
  into the meta line. Test at 360px wide.

### Motion

Near none. `transition-colors` / `transition-opacity` at default durations, plus
the row arrow's 2px nudge on hover. No entrance animations, no parallax, no
scroll-triggered reveals.

### Interaction and accessibility

- A global `:focus-visible` ring is defined in `index.css`. Don't clear it with
  `focus:outline-none` unless you replace it with something at least as visible.
- Filter toggles carry `aria-pressed`; the language switch carries `aria-current`;
  icon-only links carry `aria-label`; decorative icons carry `aria-hidden`.
- Controls that appear on hover must also appear on `focus-visible` — see the
  per-row report link.
- External links always get `target="_blank" rel="noopener noreferrer"` and a
  visible affordance (an `ArrowUpRight`, or the row's hover underline).
- Inline links are drawn with a `border-b border-accentInk/30` that darkens on
  hover, not with `underline`.
- Icons: `lucide-react` only. `h-4 w-4` inline with text, `h-3 w-3` in meta rows.

### Components

`src/components/ui/` is shadcn scaffold from the original build and **nothing in
the app imports it any more**. Don't reach into it out of habit, and don't edit
those files — the pages are written with plain semantic elements and Tailwind, and
that is the house style. Small page-local components (`Toggle`, `Row`,
`MonthSection` in `Directory.tsx`) stay in the page file until a second page needs
them.

**Do not add dependencies.** `package.json` still carries a lot of unused scaffold
(recharts, embla, vaul, react-hook-form, react-query…). Removing one you have
confirmed is unused is welcome; adding one needs a reason stated in the PR.

### Voice

Sober, factual, useful. This is a reference work maintained by volunteers, not a
product being sold. No exclamation marks, no growth copy, no "amazing
opportunities". State what is known, mark what is estimated, and say plainly when
something is unverified. Never imply a scholarship is likely to be won, or that a
projected date is official.

## Working conventions

- One concern per pull request. Data changes and code changes stay separate — a
  data-only PR skips `npm ci` in CI and is the common contributor path.
- Commit subjects are imperative and sentence case, with no prefix or scope:
  "Drop leftovers from the old landing page", "Rename the project to Svenska
  stipendier".
- Comments explain *why*. Match the surrounding density: the `lib/` files carry a
  short block comment above each section, components carry a one-line note only
  where the layout would otherwise be puzzling.
- Don't commit `dist/`, `.env`, or anything under `node_modules/`.
- Prefer editing an existing file to adding one. This is a small site; a new
  abstraction has to earn its place.
