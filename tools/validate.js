#!/usr/bin/env node
// Checks the exercise base. Errors fail (exit 1); warnings are printed only.
import { fileURLToPath } from "node:url";
import { loadDb } from "./build-bundle.js";
import { slug } from "../src/compute.js";

export function validate(db) {
  const errors = [], warnings = [];
  const muscleIds = new Set(db.muscles.map(m => m.id));
  const groupIds = new Set(db.groups.map(g => g.id));
  if (db.muscles.length !== 25) errors.push(`expected 25 muscles (frozen taxonomy), got ${db.muscles.length}`);
  for (const m of db.muscles) {
    if (!groupIds.has(m.group)) errors.push(`muscle ${m.id}: unknown group ${m.group}`);
    if (!m.name?.en || !m.name?.ru) errors.push(`muscle ${m.id}: needs name.en and name.ru`);
  }
  const seen = new Map();
  for (const ex of db.exercises) {
    const where = `exercise ${ex.id}`;
    if (ex.id !== slug(ex.id)) errors.push(`${where}: id must be a lowercase slug`);
    if (!ex.name?.en || !ex.name?.ru) errors.push(`${where}: needs name.en and name.ru`);
    for (const key of [ex.id, ...(ex.aliases ?? []).map(a => a.toLowerCase())]) {
      if (seen.has(key) && seen.get(key) !== ex.id) errors.push(`${where}: "${key}" also used by ${seen.get(key)}`);
      seen.set(key, ex.id);
    }
    const ws = Object.entries(ex.weights ?? {});
    if (!ws.length) errors.push(`${where}: no weights`);
    for (const [m, w] of ws) {
      if (!muscleIds.has(m)) errors.push(`${where}: unknown muscle ${m}`);
      if (!(w > 0 && w <= 1)) errors.push(`${where}: weight ${m}=${w} must be in (0, 1]`);
    }
    if (ws.length && Math.max(...ws.map(([, w]) => w)) < 1)
      warnings.push(`${where}: no muscle at 1.0 (the limiting muscle should get 1.0)`);
    if (!ex.source?.kind) errors.push(`${where}: needs source.kind (estimate | study | …)`);
  }
  return { errors, warnings };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { errors, warnings } = validate(loadDb());
  warnings.forEach(w => console.warn("warn:", w));
  errors.forEach(e => console.error("error:", e));
  console.log(`${errors.length} errors, ${warnings.length} warnings`);
  process.exit(errors.length ? 1 : 0);
}
