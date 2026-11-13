# Progress — exercise-db (branch `feature/exercise-db`)

## Current Status
- **Last Updated:** 2026-11-12 11:40
- **Status:** In Progress — first slice done, waiting for Ivan's review
- **Completion:** ~35% of the first milestone (open base + end-of-workout card); video overlay not started

## Current Context (read this first)
**What's working**
- Open exercise base: `data/muscles.json` (25 frozen groups, en/ru names, optional short names, body-map views) + `data/exercises/*.json` (44 exercises imported from Ivan's `exercise_volume.csv`, en/ru names, aliases, equipment where clear, weights, source).
- `src/compute.js`: sets × weights → per-muscle volume; warm-ups excluded; fractional sets; unknown exercises reported.
- `npm test` (7 tests, all pass): every one of the 7 sessions in `examples/ivan/session_log.csv` reproduces `volume_log.csv` to 0.005; warm-up, dropset, unknown, validation, bundle freshness, locale parity.
- `npm run lint` (tools/validate.js): 0 errors, 1 warning (plate-pinch-hold has no 1.0 weight).
- Card `app/` (served from repo root): 9:16, 360×640 CSS px; session + language pickers outside the card; body map heat by absolute bins; top 5 muscles; finger-tendon line; exercises with ● per set, ◐ half, ○ warm-up; footer «Мышцы — по таблице, не измерены». Checked by headless-Chrome screenshots for 2026-06-01, -03, -04 (ru) and en; console clean.

**What's not working / not done**
- No PNG export / Web Share of the card yet (the actual Instagram deliverable). Not checked at 1080×1920.
- Body figure is hand-drawn ellipses; looks rough.
- No way to log a session in the app — it reads `examples/ivan/session_log.csv`.
- Licence not chosen. Repo name `effective-sets` is a working name.
- Built-in browser preview can't start this server (the session's launch.json belongs to paper-planes); `.claude/launch.json` here works when a session runs from this folder.

**What's next**
1. Ivan reviews the card on real sessions; decide card content changes.
2. PNG export at 1080×1920 (render the card DOM → canvas, or draw directly to canvas) + Web Share.
3. Quick in-gym logging (tap exercise, tap +1 set / +0.5 drop), stored in IndexedDB, exports the same CSV.
4. Better body art (keep `data-m` keys).
5. Video overlay (MediaPipe pose from ~/Code/bikefit, clip pipeline from ~/Code/data-stories), in-browser.

## Timeline
- 2026-11-12 10:5x — Found Ivan's material: training log `~/Documents/Claude/Projects/тренировки`, muscle-overlay idea in `~/Code/awesome-tools/idea.md` (2026-10-29), rep-counter brief `~/Code/projects/codex/briefs/07-rep-counter.md`, activity2story research.
- 2026-11-12 11:07 — Throwaway mockup of the card (scratchpad) on session 2026-06-01; matched volume_log for all 25 muscles.
- 2026-11-12 11:15 — Repo created: `main` = empty root commit, work on `feature/exercise-db`. Copied session_log/volume_log/exercise_volume to `examples/ivan/`.
- 2026-11-12 11:20 — `data/muscles.json` written by hand; `tools/import-csv.js` generated 44 exercise files; `tools/build-bundle.js`, `tools/validate.js`.
- 2026-11-12 11:25 — `src/compute.js` + `test/compute.test.js`: 7/7 pass.
- 2026-11-12 11:30 — Card moved into `app/` on top of the base; `src/body.js`, `src/i18n.js`, `locales/ru.json`, `locales/en.json`.
- 2026-11-12 11:35 — Fixed layout overflow found on real data (long muscle names, subtitle, warm-up label): short names in muscles.json, nowrap + ellipsis, ○ legend in the section title.
- 2026-11-12 11:40 — README, docs/FORMAT.md, requests.md, CLAUDE.md, this file.

## Decisions
- **Repo name / location** — Context: new project, Ivan didn't name it. Options: gym-card, effective-sets, workout-app. Choice: `~/Code/effective-sets` (the core idea). Impact: folder only; easy to rename.
- **One exercise per file + generated bundle** — Context: Ivan wants a base others can build trackers on. Options: single CSV (compact, merge conflicts, no room for names/notes); single JSON (same conflicts); one JSON per exercise (small PRs, per-exercise discussion). Choice: per-file source + `data/bundle.json` for the browser (a browser can't list a folder). Test fails if the bundle is stale.
- **Only non-zero weights stored** — keeps files readable; absent = 0.
- **`source` on every exercise** — Ivan: the muscles must be labelled as table-based, not measured. Making provenance a field puts that honesty into the data. All current weights are `estimate`.
- **Taxonomy kept exactly as the constitution froze it** (25 groups, same order = CSV column order) so Ivan's existing logs stay valid.
- **Absolute heat bins** (0, <1, 1–2, 2–3.5, 3.5–5, 5+) rather than relative to the day's max, so cards are comparable across days.
- **Exercise/muscle names live in the data, UI strings in locales** — per Ivan's rule «for ui strings always use translation helper and update actual locales».
- **Short display names** for long muscle names (e.g. hamstrings ru «Бицепс бедра») — the card is 360 px wide; the full name stays in the tooltip.
- **Data not changed during import** — plate pinch hold max weight is 0.7; reported as a validator warning, left for Ivan.

## Challenges & Solutions
- **file:// page can't run in the built-in browser preview** (static snapshot) and **ES modules need http** — Tried: preview_start with a file URL (static only), preview_start by name (picked paper-planes' launch.json, port 8020 busy). Final: a short-lived `python3 -m http.server` inside one command + headless Chrome `--screenshot`/`--enable-logging` to read console. Lesson: preview tools follow the session cwd's launch.json.
- **Write refused to overwrite locale stubs** created by shell — had to Read them first.
- **Label bug caught before render**: `t.n(...).replace(/^\S+\s/, "")` would have cut «эффективных»; removed.

## Files Modified
- `data/muscles.json` — taxonomy, names, short names, body views, notes from the constitution.
- `data/exercises/*.json` (44) — generated by `tools/import-csv.js`.
- `data/bundle.json` — generated.
- `src/compute.js` — volume maths, session CSV parser, warm-up detection.
- `src/body.js` — body-map shapes keyed by muscle id; `drawBody()`.
- `src/i18n.js` — `loadLocale()`, `t()`, `t.n()` plurals via Intl.PluralRules, `t.num()`.
- `app/index.html`, `app/card.css`, `app/card.js` — the card.
- `locales/ru.json`, `locales/en.json` — UI strings.
- `tools/import-csv.js`, `tools/build-bundle.js`, `tools/validate.js`.
- `test/compute.test.js` — 7 tests.
- `examples/ivan/*.csv` — fixture copy of the live log (2026-05-20 … 2026-06-05).
- `README.md`, `docs/FORMAT.md`, `requests.md`, `CLAUDE.md`, `.claude/launch.json`, `package.json`.

## Next Steps
- [ ] Ivan: review the card; answer open questions (plate pinch hold 1.0? licence? repo name?)
- [ ] PNG export 1080×1920 + Web Share
- [ ] In-gym quick logging (IndexedDB, CSV export)
- [ ] Better body art
- [ ] Video overlay in the browser (pose + muscle glow + set counter)
- [ ] Decide licence before publishing
