# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Svenska stipendier** is an open database of scholarships available to students in Sweden, plus a static site that browses it. Users click through to the awarding body and apply themselves — the project does not submit anything on anyone's behalf.

- Frontend: Vite + React 18 + TypeScript + Tailwind CSS + Shadcn/ui
- Data: JSON files in `data/scholarships/`, one per scholarship
- No backend, no database, no authentication, no environment variables

An earlier version of this project automated application submission via Supabase, Mailgun and an LLM. All of that has been removed; it survives only in git history. Do not reintroduce a backend without being asked.

## Commands

```bash
npm run dev       # Dev server on port 8080
npm run validate  # Validate data/scholarships/*.json against data/schema.json
npm run build     # Production build
npm run lint      # ESLint
```

`npm run validate` and `npm run build` both run in CI on every pull request.

## Architecture

### Data is the source of truth

`data/scholarships/<id>.json` holds one scholarship each, and `data/schema.json` defines what those files may contain. `src/lib/scholarships.ts` loads them all at build time with `import.meta.glob("/data/scholarships/*.json")` — the leading slash resolves from the project root, not `src/`.

Changing what the site shows means editing a data file, never a component.

### Deadline projection

Stored deadlines record the last confirmed round. Most entries are `recurrence: "annual"`, so `getTiming()` in `src/lib/scholarships.ts` rolls a past date forward to the next occurrence of the same month and day, and flags the result `projected`. The UI marks projected dates with `≈` and a tooltip. Never present a projected date as confirmed.

### Routing and localisation

`App.tsx` mounts the same routes twice: `/` (Swedish) and `/en` (English). `LocaleContext` supplies strings from `src/lib/i18n.ts`. Locale comes from `navigator.language` on first visit and from localStorage after that — there is no geolocation API call any more.

### Contribution links

`src/lib/site.ts` builds every "add a scholarship", "report a problem" and "edit" link from `GITHUB_REPO`. Change it in one place if the repository moves.

## Key Conventions

- Shadcn/ui components in `src/components/ui/` are not modified directly — extend via wrapper components.
- A new tag must be added in three places in the same change: the enum in `data/schema.json`, and the `tags` blocks for both `sv` and `en` in `src/lib/i18n.ts`. The validator rejects unknown tags.
- Scholarships that stop existing get `"status": "discontinued"` rather than being deleted, so they are not re-added later from a stale list.
- Data files must never contain information about an individual applicant, or a private person's contact details. See CONTRIBUTING.md.
- Keep the site static. No accounts, no analytics, no third-party requests beyond the two font CDNs in `index.html`.
