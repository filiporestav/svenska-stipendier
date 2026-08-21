# Svenska stipendier

An open database of scholarships that students in Sweden can apply for, plus the site that browses it.

Every scholarship is one JSON file in [`data/scholarships/`](data/scholarships). The site is a static page built from those files — there is no database, no login, and nothing to pay for. You click through to the awarding body and apply yourself.

**The data is the point.** If you know a scholarship we are missing, a deadline that moved, or one that no longer exists, open an issue or send a pull request. See [CONTRIBUTING.md](CONTRIBUTING.md).

## What's in a scholarship file

```json
{
  "id": "kraftska-sallskapet",
  "name": "Kraftska Sällskapet",
  "url": "https://www.kraftska.se/stipendie/",
  "opens": "2025-10-01",
  "deadline": "2026-02-15",
  "recurrence": "annual",
  "apply_via": "website",
  "tags": ["utlandsstudier"],
  "typical_amount_sek": 10000,
  "last_verified": "2026-07-27"
}
```

Every field is documented in [`data/schema.json`](data/schema.json), and `npm run validate` checks each file against it. The same check runs on every pull request.

### About the dates

Stored dates are the last round we confirmed. Most Swedish scholarships recur annually, so the site rolls a past date forward to the next expected occurrence and marks it with `≈`. That is an estimate from last year's cycle, not an announcement — always check the awarding body's own page before you rely on it.

## Running it locally

```bash
npm install
npm run dev       # http://localhost:8080
npm run validate  # check the data files
npm run build     # production build into dist/
npm run lint
```

Node 20 or newer. No environment variables, no API keys, no accounts.

## Project layout

```
data/scholarships/   one JSON file per scholarship — the source of truth
data/schema.json     what a scholarship file may contain
scripts/             the data validator
src/lib/scholarships.ts   loads the data at build time, works out deadlines
src/pages/Directory.tsx   the list, search and filters
```

## History

This started as Lomira, a service that filled in and submitted scholarship applications automatically, built on Supabase, Mailgun and an LLM. That version is gone; what was useful about it was the research, so the list is now open instead. The old implementation is in this repository's git history.

## Licence

Code is MIT. The scholarship data in `data/` is [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — use it, build on it, just credit the project.

The data is maintained by volunteers and comes with no guarantee of accuracy. Verify against the awarding body before applying.
