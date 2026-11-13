// Logged sessions as a plain object: { "2026-11-13": [{ exercise: "pull-up", sets: 2 }, ...] }.
// Pure functions (return a new object) so they can be tested in Node; the browser keeps the
// object in localStorage (see app/store.js). Exercise is the base id; order = order of first set.

export const STEP_FULL = 1;
export const STEP_DROP = 0.5; // a drop after a set to failure adds 0.5 (docs/FORMAT.md)

/** Local calendar date as YYYY-MM-DD (not UTC: a late-evening workout stays on its day). */
export function today(now = new Date()) {
  const p = n => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

const round = n => Math.round(n * 2) / 2;

/** Add (or with a negative step, remove) sets. Rows that reach 0 disappear; a day with no rows disappears. */
export function addSets(sessions, date, exercise, step = STEP_FULL) {
  const day = (sessions[date] ?? []).map(r => ({ ...r }));
  const row = day.find(r => r.exercise === exercise);
  if (row) row.sets = round(Math.max(0, row.sets + step));
  else if (step > 0) day.push({ exercise, sets: round(step) });
  const kept = day.filter(r => r.sets > 0);
  const next = { ...sessions };
  if (kept.length) next[date] = kept; else delete next[date];
  return next;
}

export const totalSets = (sessions, date) => (sessions[date] ?? []).reduce((s, r) => s + r.sets, 0);

/** Move a whole day to another date (when you log afterwards and fix the date). Merges if the target has rows. */
export function moveDay(sessions, from, to) {
  if (from === to || !sessions[from]) return sessions;
  let next = { ...sessions };
  const rows = next[from];
  delete next[from];
  for (const r of rows) next = addSets(next, to, r.exercise, r.sets);
  return next;
}

/** Exercises ordered by how recently they were used (most recent day first). */
export function recentExercises(sessions) {
  const seen = new Set();
  for (const d of Object.keys(sessions).sort().reverse())
    for (const r of sessions[d]) seen.add(r.exercise);
  return [...seen];
}

/** Same CSV as the training log: date,exercise,sets */
export function toCsv(sessions) {
  const lines = ["date,exercise,sets"];
  for (const d of Object.keys(sessions).sort())
    for (const r of sessions[d]) lines.push(`${d},${r.exercise},${r.sets}`);
  return lines.join("\n") + "\n";
}

/** Map(date -> entries) in the shape computeVolume expects. */
export const toEntries = sessions =>
  new Map(Object.entries(sessions).map(([d, rows]) => [d, rows.map(r => ({ exercise: r.exercise, sets: r.sets }))]));
