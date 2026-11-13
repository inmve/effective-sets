# effective-sets — notes for agents

Read first: `docs/features/exercise-db/progress.md` (Current Context), then `docs/FORMAT.md`.
Ivan's original requests, verbatim: `requests.md` — append new ones there.

## Rules
- Source of truth for the base: `data/muscles.json` + `data/exercises/*.json`. `data/bundle.json` is generated (`npm run build`); never edit it by hand.
- The 25-muscle taxonomy is frozen; changes only on Ivan's explicit say-so.
- UI strings go through `t()` (`src/i18n.js`) with keys in **both** `locales/ru.json` and `locales/en.json`. Exercise and muscle names are data and live in the base.
- Everything must run in the browser with no server of ours and no third-party requests.
- The card must keep saying the muscles come from the table and are not measured.
- Before a commit/PR: `npm run build && npm run lint && npm test`.
- Git: never commit to `main`; feature branches from `main`.
- Ivan's live training log stays in `~/Documents/Claude/Projects/тренировки` (its AGENTS.md rules). `examples/ivan/` is a frozen copy used as a test fixture.
