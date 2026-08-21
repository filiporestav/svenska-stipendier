# AGENTS.md

The working guide for this repository: what it is, how to change it safely, and
what it should look like. It is the single source of project convention - there is
no separate per-tool instructions file. Read it before editing.

## What this project is

**Svenska stipendier** is an open database of scholarships available to students in
Sweden, plus a static site that browses it. A student finds an entry, clicks
through to the awarding body, and applies themselves. The project never submits
anything on anyone's behalf, holds no accounts, and stores nothing about
applicants.

An earlier version (Lomira) automated application submission via Supabase, Mailgun
and an LLM. All of it was removed, and this repository begins after the removal --
none of that code is in this history. **Do not reintroduce a backend, database,
auth, or analytics without being asked.**

Stack: Vite + React 18 + TypeScript + Tailwind. Data is JSON on disk. Deployed as
a static build to <https://svenska-stipendier.vercel.app> (Vercel, SPA rewrite in
`vercel.json`), rebuilt on every push to `main`.

## Commands

```bash
npm run dev       # dev server on http://localhost:8080
npm run validate  # validate data/scholarships/*.json against data/schema.json
npm run lint      # ESLint
npm run build     # production build into dist/
```

Node 20 or newer. No environment variables, no API keys, no secrets - if a task
seems to need one, the task is wrong for this project.

CI (`.github/workflows/ci.yml`) runs `node scripts/validate-data.mjs` and
`npm run build` on every pull request. Run `npm run validate` after a data change,
and `npm run lint && npm run build` after a code change, before reporting done.

## Repository map

```
data/scholarships/<id>.json   one scholarship each - the source of truth
data/schema.json              what a scholarship file may contain
scripts/validate-data.mjs     the validator (zero dependencies, on purpose)
src/lib/scholarships.ts       loads data at build time, deadline logic, grouping
src/lib/i18n.ts               every user-visible string, sv + en, plus formatters
src/lib/site.ts               SITE_URL, and every GitHub contribution link
src/lib/seo.ts                per-route title/description/canonical/hreflang
src/pages/Directory.tsx       the list, search and filters - the whole product
src/pages/About.tsx           prose page
src/components/ui/            unused shadcn scaffold (see "Components")
```

## Architecture rules

### 1. Data is the source of truth

`src/lib/scholarships.ts` loads every file with
`import.meta.glob("/data/scholarships/*.json")` - the leading slash resolves from
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
confirmed** - students plan around these.

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
  English - not a translation of a translation.
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

The deployed origin lives in the same file as `SITE_URL`, and `src/lib/seo.ts`
builds canonical and hreflang links from it rather than from `window.location` --
otherwise every Vercel preview deployment would canonicalise to itself and become
indexable. `index.html` repeats the origin because it is static; those two are the
only places the domain may appear.

### 5. Static means static

No backend, no accounts, no analytics, no cookies, no third-party requests beyond
the font stylesheet in `index.html`. Don't add a fetch to anything.

## Data conventions

`data/schema.json` is authoritative; `CONTRIBUTING.md` explains each field for
humans. The rules that bite most often:

- `id` must equal the filename without `.json`: lowercase, hyphenated, no Swedish
  characters (`Gålöstiftelsen` → `galostiftelsen`).
- `url` points at the page a student applies from, as specific as possible - not
  the organisation's front page.
- `deadline` is `null` only when `recurrence` is `rolling`.
- `last_verified` is a claim that someone checked the source that day. Update it
  whenever you touch an entry; never bump it without actually checking.
- A scholarship that stops existing gets `"status": "discontinued"` - **never
  delete the file**, or it gets re-added later from a stale list.
- **Adding a tag is a three-place change in one commit**: the `tags` enum in
  `data/schema.json`, the `tags` blocks for both `sv` and `en` in
  `src/lib/i18n.ts`, and the `Tag` union in `src/lib/scholarships.ts`. The
  validator rejects unknown tags.
- Never write anything about an individual applicant, and never a private
  person's contact details - organisational addresses only.
- Never guess a date. `null` beats a plausible invention.

## Design language

The site is **a departure board for deadlines**, not a feed of cards. The
reference is a printed timetable: white paper, one solid slab of ink, a hairline
spine the whole list hangs off, mono for anything scanned and condensed capitals
for the names. Every rule below follows from that. If a change would make the
page feel like a marketing site, a dashboard or a template, it is the wrong
change.

### Tokens, and only tokens

The palette lives in `src/index.css` as HSL triplets, exposed through
`tailwind.config.ts`:

| Token | Class | Use |
| --- | --- | --- |
| `--paper` | `bg-paper` | Page ground. Screen white, deliberately: the board is printed, not warmed up. |
| `--ink` | `text-ink`, `border-ink` | Text, the 2px rules, and the stamped blocks that mark an active filter. |
| `--ink-soft` | `text-ink-soft` | Secondary text: meta lines, notes, prose. |
| `--ink-faint` | `text-ink-faint` | Tertiary: legends, counts, placeholders, the idle arrow. |
| `--rule` | `border-rule` | Hairlines: between rows, and the spine beside the date rail. |
| `--rule-strong` | `border-rule-strong` | A hairline that must still read as ink in either theme. |
| `--board`, `--board-ink` | `.slab`, `bg-board`, `text-boardInk` | The one solid block: the status band and the footer. It inverts with the theme, so it stays the opposite of everything around it. |
| `--amber` | `text-amber` | Live counters on the slab. Nowhere else. |
| `--signal` | `text-signal` | **Urgency only** - a deadline within `URGENT_DAYS` (7). |
| `--wash` | `bg-wash` | Row hover, and nothing else. |

`--signal` and `--amber` are both reserved. If either appears as decoration, that
is a bug: the mark in the masthead is `bg-ink` for exactly this reason.

shadcn's tokens (`--background`, `--primary`, `--muted`, …) are aliased onto the
same palette so any stray primitive doesn't look foreign, but new code should use
the semantic names above.

**Never write a raw colour.** No hex, no `rgb()`, no Tailwind palette classes
(`text-neutral-900`, `bg-white`, `text-green-600`). Dark mode works purely by
redefining these variables under a `prefers-color-scheme` media query, so a
hardcoded colour silently breaks it.

### Typography

Three cuts of one superfamily, loaded in `index.html`. Which one a string gets is
decided by how it is read, not by where it sits.

- **IBM Plex Sans Condensed** (`font-display`) for names and titles, always
  uppercase, semibold or bold. The base layer sets `h1`-`h3` to it.
- **IBM Plex Mono** (`font-mono`) for anything scanned rather than read: day
  numerals, countdowns, amounts, counts, filter legends, nav, footer, masthead.
- **IBM Plex Sans** (`font-sans`) for prose only: the standfirst, the note under
  a scholarship, About paragraphs.
- `.eyebrow` is the board legend (mono, 11px, uppercase, `0.16em` tracking) and
  is the default for every small label on the site.
- `.tnum` on every date, amount, count and countdown.
- Section counts are zero-padded to two digits (`06`), the way a board prints
  them.
- Body sizes are bespoke and small: `text-[0.9375rem]` for prose,
  `text-[0.8125rem]` for notes. Match the neighbours rather than reaching for
  Tailwind's default scale.
- **No serif anywhere.** There is no `font-serif` in the theme.

### Layout and structure

- Content column is `max-w-5xl`, padded `px-5 sm:px-8`. Nav, board and footer
  share it. About narrows its prose with `max-w-2xl` inside the same column.
- `COLUMNS` in `Directory.tsx` is the geometry of the board:
  `grid-cols-[3rem_minmax(0,1fr)]`, widening to
  `sm:grid-cols-[4.5rem_minmax(0,1fr)_auto]`. The month bands use the same grid,
  so the hairline spine runs unbroken from the first row to the last. Anything
  new on the board hangs off that grid rather than inventing its own.
- The date rail is right-aligned: day numeral in mono, month in `.eyebrow`, `∞`
  when there is no date. Urgent rows colour the numeral and prefix the countdown
  with `▪`.
- Rows are `<li>` items separated by `border-t border-rule`. The whole row is one
  `<a>` to the awarding body; secondary actions (the "report an error" link) sit
  **outside** that anchor so they aren't swallowed by it.
- The status band and the footer are the only filled blocks. Use `.slab` for
  both; do not invent a third.
- Something that is currently true is stamped, not underlined:
  `bg-ink text-paper` on a filter, on the language in use, on a primary link. No
  pills, no button bars, no toolbars.
- `--radius` is `0`. Nothing on this site is rounded, and nothing has a shadow, a
  gradient or a card behind it. Where you want to group, use a rule.
- Icons are text glyphs (`↗`, `←`, `▪`, `│`), not an icon library. `lucide-react`
  is still installed but the board no longer imports it; don't reach for it.
- Mobile: the nav wraps, the amount column drops and the amount moves inline into
  the meta line. Test at 390px with real device emulation, not by narrowing a
  desktop window.

### Motion

Near none. `transition-colors` and `transition-opacity` at default durations, and
nothing else. No entrance animations, no parallax, no scroll-triggered reveals.

### Interaction and accessibility

- A global `:focus-visible` outline (2px ink, offset 2) is defined in
  `index.css`. Don't clear it with `focus:outline-none` unless you replace it
  with something at least as visible.
- Filter toggles carry `aria-pressed`; the language switch carries `aria-current`;
  decorative glyphs carry `aria-hidden`; the search input carries an `aria-label`
  from `copy.directory.searchAria`, because its visible label is only the legend.
- Controls that appear on hover must also appear on `focus-visible` - see the
  per-row report link.
- External links always get `target="_blank" rel="noopener noreferrer"` and a
  visible affordance (the `↗` glyph, or the row's hover underline).

### Components

`src/components/ui/` is shadcn scaffold from the original build and **nothing in
the app imports it any more**. Don't reach into it out of habit, and don't edit
those files - the pages are written with plain semantic elements and Tailwind, and
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

- One concern per pull request. Data changes and code changes stay separate - a
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
