#!/usr/bin/env node
// Validates data/scholarships/*.json against data/schema.json.
// No dependencies: it runs on a bare Node install, in CI and locally.
//
//   npm run validate

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "data", "scholarships");
const schema = JSON.parse(readFileSync(join(root, "data", "schema.json"), "utf8"));

const errors = [];
const fail = (file, msg) => errors.push(`${file}: ${msg}`);

const isDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));
const allowedTags = new Set(schema.properties.tags.items.enum);
const known = new Set(Object.keys(schema.properties));

const seenIds = new Map();
const seenUrls = new Map();

const files = readdirSync(dataDir).filter((f) => f.endsWith(".json")).sort();
if (files.length === 0) fail("data/scholarships", "no scholarship files found");

for (const file of files) {
  const path = join(dataDir, file);
  let entry;
  try {
    entry = JSON.parse(readFileSync(path, "utf8"));
  } catch (err) {
    fail(file, `is not valid JSON (${err.message})`);
    continue;
  }

  for (const key of schema.required) {
    if (!(key in entry)) fail(file, `missing required field "${key}"`);
  }
  for (const key of Object.keys(entry)) {
    if (!known.has(key)) fail(file, `unknown field "${key}" — add it to data/schema.json first`);
  }

  const slug = basename(file, ".json");
  if (entry.id !== slug) fail(file, `id "${entry.id}" does not match the filename`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(entry.id ?? "")) {
    fail(file, `id "${entry.id}" must be lowercase words joined by hyphens`);
  }
  if (seenIds.has(entry.id)) fail(file, `duplicate id, also used by ${seenIds.get(entry.id)}`);
  seenIds.set(entry.id, file);

  if (typeof entry.name !== "string" || entry.name.trim().length < 2) {
    fail(file, "name must be a non-empty string");
  }

  if (typeof entry.url !== "string" || !/^https?:\/\//.test(entry.url)) {
    fail(file, "url must start with http:// or https://");
  } else {
    const dupe = seenUrls.get(entry.url);
    // Two scholarships can legitimately share one portal, so this is a warning
    // surfaced as an error only when the names are also near-identical.
    if (dupe && dupe.name.toLowerCase() === (entry.name ?? "").toLowerCase()) {
      fail(file, `duplicates ${dupe.file} — same name and url`);
    }
    seenUrls.set(entry.url, { file, name: entry.name ?? "" });
  }

  for (const key of ["opens", "deadline"]) {
    const v = entry[key];
    if (v === undefined || v === null) continue;
    if (!isDate(v)) fail(file, `${key} "${v}" must be a real date in YYYY-MM-DD form`);
  }
  if (entry.opens && entry.deadline && entry.opens > entry.deadline) {
    fail(file, `opens (${entry.opens}) falls after deadline (${entry.deadline})`);
  }

  if (!isDate(entry.last_verified ?? "")) {
    fail(file, "last_verified must be a date in YYYY-MM-DD form");
  }

  if (entry.recurrence && !schema.properties.recurrence.enum.includes(entry.recurrence)) {
    fail(file, `recurrence must be one of ${schema.properties.recurrence.enum.join(", ")}`);
  }
  if (entry.recurrence !== "rolling" && !entry.deadline) {
    fail(file, "deadline may only be null when recurrence is \"rolling\"");
  }

  if (!schema.properties.apply_via.enum.includes(entry.apply_via)) {
    fail(file, `apply_via must be one of ${schema.properties.apply_via.enum.join(", ")}`);
  }
  if (entry.apply_email) {
    if (entry.apply_via !== "email") fail(file, "apply_email is set but apply_via is not \"email\"");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(entry.apply_email)) {
      fail(file, `apply_email "${entry.apply_email}" is not a valid address`);
    }
  }

  if (!Array.isArray(entry.tags)) {
    fail(file, "tags must be an array (use [] when none apply)");
  } else {
    for (const tag of entry.tags) {
      if (!allowedTags.has(tag)) {
        fail(file, `unknown tag "${tag}" — add it to data/schema.json in this same pull request`);
      }
    }
    if (new Set(entry.tags).size !== entry.tags.length) fail(file, "tags contains duplicates");
  }

  if (entry.typical_amount_sek !== undefined) {
    if (!Number.isInteger(entry.typical_amount_sek) || entry.typical_amount_sek < 1) {
      fail(file, "typical_amount_sek must be a positive whole number of kronor");
    }
  }

  if (entry.notes !== undefined) {
    if (typeof entry.notes !== "object" || entry.notes === null || Array.isArray(entry.notes)) {
      fail(file, "notes must be an object with sv and/or en keys");
    } else {
      for (const key of Object.keys(entry.notes)) {
        if (!["sv", "en"].includes(key)) fail(file, `notes has unexpected language "${key}"`);
      }
    }
  }

  if (entry.status !== undefined && !schema.properties.status.enum.includes(entry.status)) {
    fail(file, `status must be one of ${schema.properties.status.enum.join(", ")}`);
  }
}

if (errors.length > 0) {
  console.error(`\n${errors.length} problem${errors.length === 1 ? "" : "s"} found:\n`);
  for (const err of errors) console.error(`  ✗ ${err}`);
  console.error("\nSee CONTRIBUTING.md for what each field means.\n");
  process.exit(1);
}

console.log(`✓ ${files.length} scholarships valid`);
