// Tiny translation helper: flat JSON locales in /locales, {var} interpolation, CLDR plural keys.
export const LANGS = ["ru", "en"];

export async function loadLocale(lang, base = "../locales/") {
  const res = await fetch(`${base}${lang}.json`);
  if (!res.ok) throw new Error(`locale ${lang}: ${res.status}`);
  const dict = await res.json();
  const rules = new Intl.PluralRules(lang);
  const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
  const t = (key, vars = {}) => {
    const s = dict[key];
    if (s == null) { console.warn(`i18n: missing "${key}" in ${lang}`); return key; }
    return fill(s, vars);
  };
  // tn("card.sets", 19) -> card.sets.many; fractional counts land on "other"
  t.n = (key, count, vars = {}) => t(`${key}.${rules.select(count)}`, { count, ...vars });
  t.lang = lang;
  t.num = v => (Math.round(v * 100) / 100).toLocaleString(lang, { maximumFractionDigits: 2 });
  return t;
}
