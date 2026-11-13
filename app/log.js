import { loadLocale, LANGS } from "../src/i18n.js";
import { addSets, moveDay, recentExercises, toCsv, today, totalSets, STEP_DROP } from "../src/sessions.js";
import { loadDb, loadSessions, saveSessions, pickLang } from "./store.js";

const $ = id => document.getElementById(id);
const lang = pickLang(LANGS);
const [t, db] = await Promise.all([loadLocale(lang), loadDb()]);

document.documentElement.lang = lang;
document.title = t("app.title");
document.querySelectorAll("[data-i18n]").forEach(n => { n.textContent = t(n.dataset.i18n); });
document.querySelectorAll("[data-i18n-placeholder]").forEach(n => { n.placeholder = t(n.dataset.i18nPlaceholder); });
document.querySelectorAll("[data-i18n-aria]").forEach(n => { n.setAttribute("aria-label", t(n.dataset.i18nAria)); });

const byId = new Map(db.exercises.map(e => [e.id, e]));
const nameOf = id => byId.get(id)?.name[lang] ?? id;
let sessions = loadSessions();
let date = new URLSearchParams(location.search).get("date") || today();

/* ---------- date: today by default, editable so the same screen works after the workout ---------- */
function dateText(d) {
  const diff = Math.round((new Date(today() + "T12:00") - new Date(d + "T12:00")) / 864e5);
  if (diff === 0) return t("log.today");
  if (diff === 1) return t("log.yesterday");
  return new Date(d + "T12:00").toLocaleDateString(lang, { weekday: "short", day: "numeric", month: "short" });
}
$("date").max = today();
$("date").addEventListener("change", e => {
  const to = e.target.value;
  if (!to || to === date) return;
  // Rows already logged under the old date move with it (logging afterwards, fixing the day).
  if (sessions[date] && sessions[to] && !confirm(t("log.mergeConfirm", { day: dateText(to) }))) {
    e.target.value = date; return;
  }
  sessions = moveDay(sessions, date, to);
  date = to;
  commit();
});

/* ---------- rows ---------- */
const dots = n => "●".repeat(Math.floor(n)) + (n % 1 ? "◐" : "");
function renderRows() {
  const rows = sessions[date] ?? [];
  $("rows").innerHTML = rows.map(r => `
    <li class="row" data-ex="${r.exercise}">
      <span class="name">${nameOf(r.exercise)}</span>
      <span class="dots" aria-label="${t.num(r.sets)}">${dots(r.sets)}</span>
      <span class="ctrl">
        <button class="minus" data-step="${r.sets % 1 ? -STEP_DROP : -1}" aria-label="${t("log.minus")}">−</button>
        <button class="drop" data-step="${STEP_DROP}" aria-label="${t("log.drop")}">+½</button>
        <button class="plus" data-step="1" aria-label="${t("log.plus")}">+1</button>
      </span>
    </li>`).join("");
  $("empty").hidden = rows.length > 0;
}
$("rows").addEventListener("click", e => {
  const b = e.target.closest("button[data-step]");
  if (!b) return;
  sessions = addSets(sessions, date, b.closest(".row").dataset.ex, Number(b.dataset.step));
  commit();
});

/* ---------- add exercise: recent first, then search by name / alias in both languages ---------- */
const norm = s => s.toLowerCase().replace(/ё/g, "е");
function renderResults() {
  const q = norm($("search").value.trim());
  const inDay = new Set((sessions[date] ?? []).map(r => r.exercise));
  let list;
  if (q) {
    // rank: name starts with the query, then shorter names ("Подтягивания" before "Подтягивания лучника")
    const names = e => [e.name.ru, e.name.en, e.short?.ru, e.short?.en, ...(e.aliases ?? [])].filter(Boolean).map(norm);
    const score = e => {
      const hits = names(e).filter(s => s.includes(q));
      if (!hits.length) return null;
      return (hits.some(s => s.startsWith(q)) ? 0 : 1000) + Math.min(...hits.map(s => s.length));
    };
    list = db.exercises.map(e => [e, score(e)]).filter(([, s]) => s !== null).sort((a, b) => a[1] - b[1]).map(([e]) => e);
  } else if (document.activeElement === $("search")) {
    const recent = recentExercises(sessions).filter(id => byId.has(id));
    list = [...recent, ...db.exercises.map(e => e.id).filter(id => !recent.includes(id))].map(id => byId.get(id));
  } else list = [];
  list = list.filter(e => !inDay.has(e.id)).slice(0, 8);
  $("results").innerHTML = list.map(e =>
    `<li><button data-id="${e.id}"><span>${e.name[lang]}</span><small>+1</small></button></li>`).join("")
    + (q && !list.length ? `<li class="muted" style="padding:12px 16px">${t("log.noMatch")}</li>` : "");
}
$("search").addEventListener("input", renderResults);
$("search").addEventListener("focus", renderResults);
$("search").addEventListener("blur", () => setTimeout(renderResults, 150));
$("results").addEventListener("pointerdown", e => e.preventDefault()); // keep focus while tapping a result
$("results").addEventListener("click", e => {
  const b = e.target.closest("button[data-id]");
  if (!b) return;
  // You usually add an exercise right after its first set, so adding counts that set; − undoes it.
  sessions = addSets(sessions, date, b.dataset.id, 1);
  $("search").value = "";
  $("search").blur();
  commit();
});

/* ---------- save + footer ---------- */
let csvUrl;
function commit() {
  saveSessions(sessions);
  const n = totalSets(sessions, date);
  $("date").value = date;
  $("dateLabel").textContent = dateText(date);
  $("total").textContent = n ? t.n("log.total", n, { n: t.num(n) }) : "";
  $("finish").href = `card.html?date=${date}`;
  $("finish").setAttribute("aria-disabled", String(!n));
  if (csvUrl) URL.revokeObjectURL(csvUrl);
  csvUrl = URL.createObjectURL(new Blob([toCsv(sessions)], { type: "text/csv" }));
  $("csv").href = csvUrl;
  $("csv").hidden = !Object.keys(sessions).length;
  history.replaceState(null, "", `?date=${date}`);
  renderRows();
  renderResults();
}
commit();
