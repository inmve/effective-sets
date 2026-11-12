import { computeVolume, indexExercises, parseSessionLog, workingSets } from "../src/compute.js";
import { drawBody } from "../src/body.js";
import { loadLocale, LANGS } from "../src/i18n.js";

const SESSION_LOG = "../examples/ivan/session_log.csv";
const MAX_EXERCISE_ROWS = 14;
// Absolute bins, so cards from different days are comparable: [upper limit, colour token]
const BINS = [[0.05, "--body"], [1, "--heat-1"], [2, "--heat-2"], [3.5, "--heat-3"], [5, "--heat-4"], [Infinity, "--heat-5"]];
const heat = v => `var(${BINS.find(([lim]) => v < lim)[1]})`;
const $ = id => document.getElementById(id);

const params = new URLSearchParams(location.search);
const lang = LANGS.includes(params.get("lang")) ? params.get("lang") : "ru";

const [t, db, log] = await Promise.all([
  loadLocale(lang),
  fetch("../data/bundle.json").then(r => r.json()),
  fetch(SESSION_LOG).then(r => r.text()),
]);
const sessions = parseSessionLog(log);
const dates = [...sessions.keys()].sort().reverse();
const date = sessions.has(params.get("date")) ? params.get("date") : dates[0];
const find = indexExercises(db.exercises);
const muscleName = Object.fromEntries(db.muscles.map(m => [m.id, m.name[lang]]));
const muscleShort = Object.fromEntries(db.muscles.map(m => [m.id, m.short?.[lang] ?? m.name[lang]]));

/* controls (not part of the card) */
$("date").innerHTML = dates.map(d => `<option ${d === date ? "selected" : ""}>${d}</option>`).join("");
$("lang").innerHTML = LANGS.map(l => `<option ${l === lang ? "selected" : ""}>${l}</option>`).join("");
$("controls").addEventListener("change", () => {
  location.search = new URLSearchParams({ date: $("date").value, lang: $("lang").value });
});

/* card */
document.documentElement.lang = lang;
document.title = t("app.title");
document.querySelectorAll("[data-i18n]").forEach(n => { n.textContent = t(n.dataset.i18n); });

const { volume, items, unknown } = computeVolume(sessions.get(date), db.muscles, find);
if (unknown.length) console.warn("not in the exercise base:", unknown);
const total = workingSets(items);
const worked = items.filter(i => !i.warmup);
const ranked = db.muscles.map(m => m.id).filter(m => m !== "finger_tendons").sort((a, b) => volume[b] - volume[a]);

$("cardDate").textContent = new Date(`${date}T12:00:00`)
  .toLocaleDateString(lang, { weekday: "short", day: "numeric", month: "long", year: "numeric" });
$("total").textContent = t.num(total);
$("totalLabel").textContent = t.n("card.sets", total);
$("sub").textContent = `${t.n("card.exerciseCount", worked.length)} · ${t("card.mainWork", { muscle: muscleShort[ranked[0]].toLowerCase() })}`;

for (const view of ["front", "back"])
  drawBody($(view), view, { fill: m => heat(volume[m]), label: m => `${muscleName[m]}: ${t.num(volume[m])}` });

$("legend").innerHTML = `<span>0</span>` + BINS.slice(1).map(([, v]) => `<i style="background:var(${v})"></i>`).join("")
  + `<span>5+</span><span>· ${t("card.legend")}</span>`;

const maxV = volume[ranked[0]] || 1;
$("top").innerHTML = ranked.slice(0, 5).map(m =>
  `<div class="row"><span title="${muscleName[m]}">${muscleShort[m]}</span><div class="bar"><i style="width:${volume[m] / maxV * 100}%;background:${heat(volume[m])}"></i></div><span class="v">${t.num(volume[m])}</span></div>`
).join("");
$("tendon").innerHTML = volume.finger_tendons > 0 ? t("card.tendon", { value: t.num(volume.finger_tendons) }) : "";

if (items.some(i => i.warmup))
  document.querySelector('[data-i18n="card.exercises"]').insertAdjacentHTML("beforeend", ` <span class="warm-key">· ○ ${t("card.warmup")}</span>`);
const dots = (n, warm) => warm ? "○".repeat(Math.max(1, Math.round(n))) : "●".repeat(Math.floor(n)) + (n % 1 >= 0.5 ? "◐" : "");
const label = i => i.exercise ? i.exercise.short?.[lang] ?? i.exercise.name[lang] : `${i.name} (${t("card.unknown")})`;
const shown = items.length > MAX_EXERCISE_ROWS ? items.slice(0, MAX_EXERCISE_ROWS - 1) : items;
$("ex").innerHTML = shown.map(i =>
  `<div class="row${i.warmup ? " warm" : ""}" title="${t.num(i.sets)}"><span>${label(i)}</span><span class="dots">${dots(i.sets, i.warmup)}</span></div>`
).join("") + (shown.length < items.length ? `<div class="row more">${t("card.more", { count: items.length - shown.length })}</div>` : "");
