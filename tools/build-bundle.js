#!/usr/bin/env node
// data/muscles.json + data/exercises/*.json -> data/bundle.json (one file the browser can fetch).
// The per-exercise files are the source of truth; the bundle is generated, never edited by hand.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

export function loadDb() {
  const tax = JSON.parse(readFileSync(join(root, "data/muscles.json"), "utf8"));
  const dir = join(root, "data/exercises");
  const exercises = readdirSync(dir)
    .filter(f => f.endsWith(".json"))
    .sort()
    .map(f => JSON.parse(readFileSync(join(dir, f), "utf8")));
  return { version: tax.version, groups: tax.groups, muscles: tax.muscles, exercises };
}

export const bundleText = db => JSON.stringify(db) + "\n";

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const db = loadDb();
  writeFileSync(join(root, "data/bundle.json"), bundleText(db));
  console.log(`bundle: ${db.muscles.length} muscles, ${db.exercises.length} exercises`);
}
