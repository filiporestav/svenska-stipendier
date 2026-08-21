# Contributing

The most valuable contribution is keeping the scholarship data correct. You do not need to know React, or run anything locally, to help.

## The quickest way: open an issue

- [Add a scholarship we are missing](../../issues/new?template=new-scholarship.yml)
- [Report something wrong with an entry](../../issues/new?template=fix-scholarship.yml)

Fill in what you know, leave the rest blank. Someone will turn it into a data file.

## Editing the data yourself

Each scholarship is one file at `data/scholarships/<id>.json`. To change one, click the pencil icon on GitHub, edit, and open a pull request. A check validates the format automatically; if it fails, the message tells you what to fix.

### Adding a scholarship

Create `data/scholarships/<id>.json`, where `<id>` is the name in lowercase with hyphens between words and no Swedish characters - `Gålöstiftelsen` becomes `galostiftelsen`.

```json
{
  "id": "example-stiftelse",
  "name": "Example Stiftelse",
  "url": "https://example.se/stipendium/",
  "opens": "2026-09-01",
  "deadline": "2026-10-31",
  "recurrence": "annual",
  "apply_via": "website",
  "tags": ["utlandsstudier"],
  "last_verified": "2026-08-21"
}
```

Required: `id`, `name`, `url`, `deadline`, `apply_via`, `tags`, `last_verified`.

| Field | What it means |
| --- | --- |
| `id` | Must match the filename without `.json`. |
| `name` | The official name, as the awarding body writes it. |
| `url` | The page a student applies from - as specific as you can get, not just the organisation's front page. |
| `opens` | When the window opens, `YYYY-MM-DD`. Use `null` if not published. |
| `deadline` | The last day to apply. Only `null` when `recurrence` is `rolling`. |
| `recurrence` | `annual` if it comes back each year, `rolling` if you can apply any time, `one-off` if it will not return. |
| `apply_via` | `website`, `email` or `post`. |
| `apply_email` | Only with `apply_via: "email"`, and only an organisational address. |
| `report_required` | `true` when recipients must report back on how the money was spent. |
| `typical_amount_sek` | A typical grant, as a whole number of kronor. Indicative, not a promise. |
| `tags` | Facets for filtering. Only values listed in `data/schema.json`. |
| `notes` | A short factual note, `{"sv": "…", "en": "…"}`. Eligibility quirks, how to apply, when decisions land. |
| `last_verified` | The date you checked this against the source. Update it whenever you touch the entry. |

### Updating an existing scholarship

Change the fields that moved and set `last_verified` to today. If a deadline has passed and the scholarship recurs annually, you do not need to do anything - the site projects the next date. Update it once the awarding body publishes real dates, which is better than a projection.

### A scholarship that no longer exists

Do not delete the file. Set `"status": "discontinued"` and update `last_verified`. The entry drops off the site but the record stays, so nobody re-adds it from an old list.

### Adding a new tag

Add it to the `tags` enum in `data/schema.json` and to both language blocks under `tags` in `src/lib/i18n.ts`, in the same pull request that first uses it. The validator rejects tags it does not know.

## What does not belong in the data

- **Anything about a specific person.** No names, no "I applied and got 20 000", no private email addresses. The files describe scholarships, not applicants.
- **Private individuals' contact details.** Organisational addresses only. If a foundation's stated contact is someone's personal address, write a note pointing at their website instead of copying the address in.
- **Opinions dressed as facts.** "Probably not worth applying" is not data. "Requires a doctorate" is.
- **Guesses.** If you cannot confirm a date, leave it `null` rather than inventing one.

## Checking your work

```bash
npm install
npm run validate
```

The validator checks the schema, that ids match filenames, that dates are real and in order, that tags are known, and that no two entries collide. The same command runs in CI.

## Code changes

Bug fixes and improvements to the site are welcome. Run `npm run lint` and `npm run build` before opening a pull request. Keep the site static - no backend, no accounts, no tracking.

## Licence

Contributions to `data/` are published under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); code contributions under the MIT licence.
