# Progress — start-screen (branch `feature/start-screen`, stacked on `feature/exercise-db`)

## Current Status
- **Last Updated:** 2026-11-13
- **Status:** Ready for Review
- **Completion:** ~90% (works end to end; not tried on a real phone)

## Current Context (read this first)
**What's working**
- `app/index.html`: one question «Готов к тренировке?» / "Ready to work out?" and one button. The button reads «Записать тренировку», or «Продолжить запись» plus «Сегодня уже N подходов» when today already has sets.
- `app/log.html`: the date defaults to today and is editable (native date picker under the label). Each exercise row has − / +½ / +1. «− » undoes the last step: 1 for whole numbers, 0.5 after a drop. «+ упражнение» search over ru/en names and aliases, recent exercises first; adding an exercise counts its first set. «Готово → карточка» opens the card for that date. «Скачать CSV» exports the same `date,exercise,sets` CSV as the training log.
- Changing the date moves the logged rows with it (logging afterwards). If the target day already has rows, the app asks before merging.
- `app/card.html` (moved from index.html): your sessions plus the example sessions; yours win on the same date; example dates are marked «пример»; link back to the log.
- Storage: `localStorage` key `effective-sets/v1/sessions`, every access in try/catch.
- `src/sessions.js` pure model, 7 tests; 14/14 tests total. Headless Chrome run through CDP (scratchpad `drive.mjs`): home → log → search → +1/+½ → undo → move to yesterday → home → card; console clean.

**What's not working / not done**
- Not tried on a real phone (iOS Safari date picker, keyboard covering the list).
- No warm-up toggle in the log (warm-ups can still come from an imported CSV).
- Exercises outside the base can't be added from the UI.
- No CSV import into the app; no PNG export of the card.
- localStorage can be wiped by the browser; IndexedDB + export reminder would be safer later.

**What's next**
1. Ivan tries it on the phone in the gym.
2. PNG export of the card at 1080×1920 + Web Share.
3. Import his existing CSV log into the app.

## Timeline
- 2026-11-13 — Branch `feature/start-screen` from `feature/exercise-db` (main is still an empty root).
- 2026-11-13 — `src/sessions.js` + `test/sessions.test.js` (addSets, moveDay, recentExercises, toCsv, today, totalSets).
- 2026-11-13 — `app/index.html`, `app/log.html|css|js`, `app/store.js`, `app/base.css`; card moved to `app/card.html` and reads local sessions.
- 2026-11-13 — Locale keys `home.*`, `log.*`, `card.toLog`, `card.example` in ru and en.
- 2026-11-13 — Checked in headless Chrome at 390×844; fixed search ranking.

## Decisions
- **One button for during and after** — Ivan's choice from two sketches. Options: (a) one button, editable date; (b) «Начать» + «уже потренировался?» link. Chose (a): the log screen does not depend on a timer, so the same screen serves both.
- **Adding an exercise counts one set** — you usually add it right after the first set; − undoes it.
- **− undoes the last step** (−1, or −0.5 when the count is fractional) — first version was always −0.5, which needed two taps to undo +1.
- **localStorage, not IndexedDB, for now** — the data is a few KB; simpler. Revisit when there is more data or photos/video.
- **Local calendar date, not UTC** — a late-evening workout must stay on its day.
- **Stacked branch** — main has no code yet; `start-screen` builds on `exercise-db`. PR for exercise-db goes to main; this one targets exercise-db.

## Challenges & Solutions
- **Interactive check without the built-in browser** (its preview uses paper-planes' launch.json): drove headless Chrome over the DevTools protocol with Node 22's global WebSocket; clicks via `Runtime.evaluate`, screenshots via `Page.captureScreenshot`.
- **Search put «Подтягивания» last** for «подтяг» — rank by prefix match, then name length.

## Files Modified
- `src/sessions.js`, `test/sessions.test.js` — new.
- `app/index.html` — now the start screen; `app/card.html` — the card (moved), back link, example marker.
- `app/log.html`, `app/log.css`, `app/log.js`, `app/store.js`, `app/base.css` — new.
- `app/card.js` — reads local sessions, language from store.
- `locales/ru.json`, `locales/en.json` — new keys.
- `README.md`, `requests.md` — updated.

## Next Steps
- [ ] Try on the phone (iOS Safari)
- [ ] PNG export of the card + Web Share
- [ ] Import CSV into the app
- [ ] Warm-up toggle in the log
