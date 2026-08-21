<p align="center">
  <a href="https://svenska-stipendier.vercel.app">
    <img src="docs/screenshot.png" alt="Svenska stipendier: scholarships listed by deadline, with search and filters" width="880">
  </a>
</p>

<h1 align="center">Svenska stipendier</h1>

<p align="center">
  A free list of scholarships you can apply for as a student or researcher in Sweden,<br>
  kept as open data.
</p>

<p align="center">
  <a href="https://svenska-stipendier.vercel.app"><b>Open the site</b></a> ·
  <a href="data/scholarships">Browse the data</a> ·
  <a href="CONTRIBUTING.md">Contribute</a> ·
  <a href="../../issues/new?template=new-scholarship.yml">Add a scholarship</a> ·
  <a href="../../issues/new?template=fix-scholarship.yml">Report a problem</a>
</p>

<p align="center">
  <a href="https://svenska-stipendier.vercel.app"><img src="https://img.shields.io/badge/site-svenska--stipendier.vercel.app-1a1a1a" alt="Live site"></a>
  <a href="https://github.com/filiporestav/svenska-stipendier/actions/workflows/ci.yml"><img src="https://github.com/filiporestav/svenska-stipendier/actions/workflows/ci.yml/badge.svg" alt="CI status"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/code-MIT-blue" alt="Code: MIT"></a>
  <a href="https://creativecommons.org/licenses/by/4.0/"><img src="https://img.shields.io/badge/data-CC%20BY%204.0-green" alt="Data: CC BY 4.0"></a>
  <a href="https://www.linkedin.com/in/filiporestav"><img src="https://img.shields.io/badge/LinkedIn-filiporestav-0A66C2?logo=linkedin&logoColor=white" alt="LinkedIn"></a>
</p>

---

## What it is

There is a lot of scholarship money in Sweden, and it is spread thin. Hundreds of small foundations each hand out their own grants, on their own website, on their own schedule. Nobody lists them all in one place, so students either pay a subscription site to look for them or never hear about them, and every year plenty of the money goes unclaimed.

This is that list, and it is free. Each scholarship is one JSON file in [`data/scholarships/`](data/scholarships), and the site is just a static page built from those files. There is no database, no account and nothing to pay for. You find something you can apply for, click through to the foundation, and apply there. We never touch your application and we store nothing about you.

- **Sorted by deadline**, so whatever closes next is at the top.
- **Search and filter** by subject, region, university, or what is open right now.
- **Swedish and English**, at `/` and `/en`.
- **The data is yours too.** Clone it, query it, build something better with it.

<p align="center">
  <img src="docs/search.png" alt="Filtering the list to scholarships open now and tagged for studies abroad" width="820">
</p>

Corrections are the most useful thing you can send us. If a scholarship is missing, a deadline has moved, or one is no longer given out, open an issue or a pull request. You do not need to know React, or run anything locally, to help. [CONTRIBUTING.md](CONTRIBUTING.md) explains how.

## What a scholarship file looks like

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

Every field is explained in [`data/schema.json`](data/schema.json), and `npm run validate` checks each file against it. The same check runs on every pull request, so a broken entry never reaches the site.

### A note on the dates

The dates here are from the last round we could confirm. Most Swedish scholarships come back at the same time each year, so the site moves a past date forward to when it expects the next one and marks it with `≈`. That is our guess from last year, not something the foundation has announced, so check their own page before you count on it.

## Running it locally

```bash
npm install
npm run dev       # http://localhost:8080
npm run validate  # check the data files
npm run build     # production build into dist/
npm run lint
```

You need Node 20 or newer. There are no environment variables, API keys or accounts to set up.

## Project layout

```
data/scholarships/        one JSON file per scholarship, the source of truth
data/schema.json          what a scholarship file may contain
scripts/                  the data validator
src/lib/scholarships.ts   loads the data at build time, works out deadlines
src/pages/Directory.tsx   the list, search and filters
```

It is a Vite, React, TypeScript and Tailwind app, deployed as a static build. [AGENTS.md](AGENTS.md) covers the conventions in more detail.

## Credits

The list is only worth anything because someone went and found all of these scholarships.

- [Alexander Karolin](https://www.linkedin.com/in/alexander-karolin/) and [Oskar Wallberg](https://www.linkedin.com/in/oskar-wallberg-b2643320a/) tracked down almost every entry in it.
- [Filip Orestav](https://www.linkedin.com/in/filiporestav) built the site and maintains the repository.

And everyone who has since sent in a correction. Your name belongs here too if you do.

## Licence

The code is [MIT](LICENSE). The scholarship data in `data/` is [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), so use it, build on it, just credit the project.

The list is kept up by volunteers and comes with no guarantee that it is right. Always check with the foundation before you apply.
