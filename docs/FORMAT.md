# Format and rules

Source: Ivan's training-log constitution (`~/Documents/Claude/Projects/тренировки/constitution.md`,
last updated 2026-06-04). This file is the public version of those rules.

## Counting

1. **Sets, not reps.** A session is a list of exercises with the number of sets.
2. **Every set is hard and honest:** it ends at 0–2 reps in reserve (RIR) with clean form.
   The number of reps does not matter.
3. **One set ≈ one unit of stimulus** for the muscle that limits the exercise (weight 1.0).
   Helpers get fractions.
4. **Volume is per muscle group:** `volume[m] = Σ sets × weight[exercise][m]`.
5. **Dropsets:** the working set counts 1.0, each drop adds 0.5 → log `1.5`. Fractional sets are allowed.
6. **Warm-up sets are logged, not counted.** Mark them with `(warm-up)` (also `warmup`, `разминка`).

## Exercise file — `data/exercises/<id>.json`

```json
{
  "id": "pull-up",
  "name":   { "en": "Pull-up",  "ru": "Подтягивания" },
  "short":  { "en": "Pull-ups", "ru": "Подтягивания" },
  "aliases": ["pull-up"],
  "equipment": ["bar"],
  "weights": { "lats": 1, "mid_lower_trap": 0.6, "biceps": 0.5 },
  "source": { "kind": "estimate", "by": "Ivan's training log", "date": "2026-06-04" }
}
```

- `id`: lowercase slug, also the file name.
- `aliases`: names a log may use; matching is case-insensitive.
- `weights`: only non-zero muscles, values in (0, 1]. One muscle should be 1.0 (warning otherwise).
- `equipment`: filled only when known; `[]` means not stated.
- `source.kind`: `estimate` today. Weights are expert estimates, not measurements. When a weight is
  backed by a study, say so here.

## Muscles — `data/muscles.json`

25 groups, frozen on 2026-06-04: do not add, split or merge without a decision.
Their order is the column order of volume tables. `body` lists the body-map views where the group
has a shape; `finger_tendons` has none (it is load on the finger pulleys, not a muscle).

## Session log — CSV

```
date,exercise,sets
2026-06-03,calf raise,1.5
2026-06-03,hip abduction (machine) (warm-up),1
```
