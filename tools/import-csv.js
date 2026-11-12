#!/usr/bin/env node
// One-off importer: exercise_volume.csv (Ivan's training log) -> data/exercises/<id>.json
// Usage: node tools/import-csv.js [path/to/exercise_volume.csv]
// Re-running overwrites the generated files; hand edits to names/equipment belong in NAMES below.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { slug } from "../src/compute.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const csvPath = process.argv[2] ?? join(root, "examples/ivan/exercise_volume.csv");

// csv name -> [ru name, ru short, en short | null, equipment[]]
// Equipment is filled only when the name or the weights make it clear; [] = not stated.
const NAMES = {
  "chin-up":                            ["Подтягивания обратным хватом", "Подтяг. обратным", "Chin-ups", ["bar"]],
  "pull-up":                            ["Подтягивания", "Подтягивания", "Pull-ups", ["bar"]],
  "pull-up neutral grip":               ["Подтягивания нейтральным хватом", "Подтяг. нейтральным", "Neutral pull-ups", ["bar"]],
  "australian pull-up":                 ["Австралийские подтягивания", "Австралийские", "Australian rows", ["low-bar"]],
  "one-arm scapular pull-up":           ["Лопаточные подтягивания на одной руке", "Лопаточные 1 рукой", "1-arm scap pulls", ["bar"]],
  "dead hang (open hand)":              ["Вис открытым хватом", "Вис", "Dead hang", ["bar"]],
  "l-sit":                              ["Уголок", "Уголок", "L-sit", []],
  "incline push-up":                    ["Отжимания с упором (наклонные)", "Отжим. с упором", "Incline push-ups", []],
  "dips":                               ["Отжимания на брусьях", "Брусья", "Dips", ["parallel-bars"]],
  "step-up":                            ["Зашагивания", "Зашагивания", "Step-ups", ["box"]],
  "goblet squat (stone)":               ["Гоблет-присед с камнем", "Гоблет с камнем", "Stone goblet squat", ["stone"]],
  "deadlift (stone)":                   ["Становая тяга с камнем", "Становая с камнем", "Stone deadlift", ["stone"]],
  "calf raise":                         ["Подъёмы на носки", "Подъёмы на носки", "Calf raises", []],
  "push-up":                            ["Отжимания", "Отжимания", "Push-ups", []],
  "hollow hold":                        ["Лодочка (hollow hold)", "Лодочка", "Hollow hold", []],
  "hangboard one-arm crimp":            ["Вис на одной руке на зацепе (кримп)", "Кримп 1 рукой", "1-arm crimp hang", ["hangboard"]],
  "front lever tuck hold":              ["Передний вис в группировке", "Передний вис (tuck)", "Tuck front lever", ["bar"]],
  "archer pull-up":                     ["Подтягивания лучника", "Лучник", "Archer pull-ups", ["bar"]],
  "cable lateral raise":                ["Махи в стороны в блоке", "Махи (блок)", "Cable lateral raise", ["cable"]],
  "dumbbell lateral raise":             ["Махи гантелями в стороны", "Махи гантелями", "DB lateral raise", ["dumbbell"]],
  "single-arm cable triceps extension": ["Разгибание на трицепс одной рукой в блоке", "Трицепс 1 рукой", "1-arm cable triceps", ["cable"]],
  "overhead triceps extension":         ["Разгибание на трицепс из-за головы", "Трицепс из-за головы", "Overhead triceps", []],
  "single-arm cable curl":              ["Сгибание на бицепс одной рукой в блоке", "Бицепс 1 рукой", "1-arm cable curl", ["cable"]],
  "two-handed dumbbell curl":           ["Сгибание с гантелей двумя руками", "Бицепс гантелью", "Two-hand DB curl", ["dumbbell"]],
  "reverse wrist curl":                 ["Обратные сгибания запястий", "Обратн. запястья", "Reverse wrist curl", []],
  "lat pulldown (reverse grip)":        ["Тяга верхнего блока обратным хватом", "Верхний блок обр.", "Reverse lat pulldown", ["cable"]],
  "wrist curl":                         ["Сгибания запястий", "Запястья", "Wrist curl", []],
  "face pull":                          ["Тяга к лицу", "Тяга к лицу", "Face pulls", []],
  "band external rotation":             ["Наружная ротация с резиной", "Наружн. ротация", "External rotation", ["band"]],
  "lateral raise (stone)":              ["Махи в стороны с камнем", "Махи с камнем", "Stone lateral raise", ["stone"]],
  "leg raise":                          ["Подъём ног в висе", "Подъём ног", "Leg raises", ["bar"]],
  "leg extension":                      ["Разгибание ног в тренажёре", "Разгибание ног", "Leg extension", ["machine"]],
  "hip abduction (machine)":            ["Отведение бедра в тренажёре", "Отведение бедра", "Hip abduction", ["machine"]],
  "hip adduction (machine)":            ["Сведение бедра в тренажёре", "Сведение бедра", "Hip adduction", ["machine"]],
  "back extension (hyperextension)":    ["Гиперэкстензия", "Гиперэкстензия", "Back extension", ["bench"]],
  "leg curl":                           ["Сгибание ног в тренажёре", "Сгибание ног", "Leg curl", ["machine"]],
  "goblet squat":                       ["Гоблет-присед", "Гоблет-присед", "Goblet squat", []],
  "deadlift (sumo)":                    ["Становая тяга сумо", "Сумо", "Sumo deadlift", ["barbell"]],
  "tire flip":                          ["Переворот покрышки", "Покрышка", "Tire flip", ["tire"]],
  "overhead press":                     ["Жим над головой", "Жим над головой", "Overhead press", []],
  "plate pinch hold":                   ["Удержание блинов щипковым хватом", "Щипок блинов", "Plate pinch", ["plates"]],
  "cable triceps extension":            ["Разгибание на трицепс в блоке", "Трицепс (блок)", "Cable triceps", ["cable"]],
  "false grip pull-up":                 ["Подтягивания с фальс-хватом", "Фальс-хват", "False grip pull-ups", ["bar"]],
  "feet-elevated push-up":              ["Отжимания с ногами на возвышении", "Отжим. ноги выше", "Feet-up push-ups", []],
};

const enName = s => s.charAt(0).toUpperCase() + s.slice(1);
const [head, ...rows] = readFileSync(csvPath, "utf8").trim().split(/\r?\n/);
const muscles = head.split(",").slice(1).map(s => s.trim());
const outDir = join(root, "data/exercises");
mkdirSync(outDir, { recursive: true });

let n = 0;
for (const row of rows) {
  const cells = row.split(",").map(s => s.trim());
  const csvName = cells[0];
  if (!csvName) continue;
  const meta = NAMES[csvName];
  if (!meta) throw new Error(`No names for "${csvName}" — add it to NAMES`);
  const [ru, ruShort, enShort, equipment] = meta;
  const weights = {};
  muscles.forEach((m, i) => { const v = Number(cells[i + 1] || 0); if (v) weights[m] = v; });
  const ex = {
    id: slug(csvName),
    name: { en: enName(csvName), ru },
    short: { en: enShort ?? enName(csvName), ru: ruShort },
    aliases: [csvName],
    equipment,
    weights,
    source: { kind: "estimate", by: "Ivan's training log", date: "2026-06-04" },
  };
  writeFileSync(join(outDir, `${ex.id}.json`), JSON.stringify(ex, null, 2) + "\n");
  n++;
}
console.log(`wrote ${n} exercises to data/exercises/`);
