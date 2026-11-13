// Effective-set volume: sets × per-muscle weight, summed per muscle.
// No dependencies; runs in the browser and in Node.
// Rules (docs/FORMAT.md): a set is taken to 0–2 RIR; fractional sets are allowed
// (a drop adds 0.5); warm-up sets are logged but add 0.

export const slug = name =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const WARMUP = /\(?\s*(warm-?up|разминка)\s*\)?/i;
export const isWarmup = name => WARMUP.test(name);
export const baseName = name => name.replace(WARMUP, "").replace(/\s+/g, " ").trim();

/** Index exercises by id and by every alias, so log names like "pull-up" resolve. */
export function indexExercises(exercises) {
  const byKey = new Map();
  for (const ex of exercises) {
    byKey.set(ex.id, ex);
    for (const a of ex.aliases ?? []) byKey.set(a.toLowerCase(), ex);
  }
  return name => byKey.get(name.toLowerCase()) ?? byKey.get(slug(name));
}

/**
 * @param {{exercise: string, sets: number}[]} entries one session
 * @param {{id: string}[]} muscles taxonomy (order is kept)
 * @param {(name: string) => object|undefined} find from indexExercises
 * @returns {{volume: Record<string, number>, items: object[], unknown: string[]}}
 */
export function computeVolume(entries, muscles, find) {
  const volume = Object.fromEntries(muscles.map(m => [m.id, 0]));
  const items = [];
  const unknown = [];
  for (const { exercise, sets } of entries) {
    const warmup = isWarmup(exercise);
    const ex = find(baseName(exercise));
    if (!ex) unknown.push(exercise);
    if (ex && !warmup) {
      for (const [m, w] of Object.entries(ex.weights)) {
        if (!(m in volume)) throw new Error(`${ex.id}: unknown muscle "${m}"`);
        volume[m] += sets * w;
      }
    }
    items.push({ name: exercise, exercise: ex, sets, warmup });
  }
  for (const m in volume) volume[m] = Math.round(volume[m] * 1e6) / 1e6;
  return { volume, items, unknown };
}

/** Parse "date,exercise,sets" CSV into Map(date -> entries). Exercise names may not contain commas. */
export function parseSessionLog(csv) {
  const [, ...rows] = csv.trim().split(/\r?\n/);
  const byDate = new Map();
  for (const row of rows) {
    if (!row.trim()) continue;
    const first = row.indexOf(","), last = row.lastIndexOf(",");
    const date = row.slice(0, first).trim();
    const entry = { exercise: row.slice(first + 1, last).trim(), sets: Number(row.slice(last + 1)) };
    if (!byDate.has(date)) byDate.set(date, []);
    byDate.get(date).push(entry);
  }
  return byDate;
}

/** Total working sets in a session (warm-ups excluded). */
export const workingSets = items =>
  items.filter(i => !i.warmup).reduce((s, i) => s + i.sets, 0);
