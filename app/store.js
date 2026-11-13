// localStorage wrapper for logged sessions and the chosen language.
// Every access is guarded: private mode or blocked storage must not break the page.
const KEY = "effective-sets/v1/sessions";
const LANG_KEY = "effective-sets/v1/lang";

export function loadSessions() {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "{}") ?? {}; } catch { return {}; }
}
export function saveSessions(sessions) {
  try { localStorage.setItem(KEY, JSON.stringify(sessions)); return true; } catch { return false; }
}

export function pickLang(langs) {
  const fromUrl = new URLSearchParams(location.search).get("lang");
  if (langs.includes(fromUrl)) { try { localStorage.setItem(LANG_KEY, fromUrl); } catch {} return fromUrl; }
  try { const saved = localStorage.getItem(LANG_KEY); if (langs.includes(saved)) return saved; } catch {}
  const nav = (navigator.language || "").slice(0, 2);
  return langs.includes(nav) ? nav : langs[0];
}

export const loadDb = () => fetch("../data/bundle.json").then(r => r.json());
