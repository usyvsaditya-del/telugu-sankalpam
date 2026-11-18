// check_ui.mjs — checks of the page itself (template.html) that the other checks cannot see:
//  - the build's <!--page--> marker is there, and every element the script looks up by a literal
//    id ($('name')) exists in the markup or in a template that renders it;
//  - no link points at "#": tabs route on the hash, so such a link would switch tabs;
//  - tab buttons keep their text in inner spans (applyStatic rewrites [data-i18n] text, which
//    would wipe out the icons);
//  - the colours the drawings and the map read (--maroon, --gold, --gold-ink, --paper, --line,
//    --kumkum, --mantra-bg, the moon) are opaque hex in the light and the dark token blocks;
//  - every page-text key the page uses exists in English and in Telugu, Tamil, Kannada and Hindi
//    (a missing key would put English on another language's page), except keys shown on one page only;
//  - every sandhya step, drawn in each of the five languages as the page draws it, has its own
//    title and instructions (no English fallback, nothing empty, no placeholder left unfilled),
//    and no step number is written by hand;
//  - WCAG text contrast of at least 4.5:1: the text colours on card glass over each sky (night,
//    dawn, day, dusk; top, middle, horizon and glow), on the reading paper and on the tab bar;
//    ink and muted text straight on the sky and on each glass tint; the "now" pill and today's
//    date on kumkum. Small text never sits on the bare sky in gold: the masthead is a glass band.
// Run: node check_ui.mjs   (exits 1 on any failure)
import { readFileSync } from 'fs';
import { UI_EN } from './ui.js';
import { UI_I18N } from './ui_i18n.js';
import { SANDHYA_KINDS, sandhyaSteps, localizeSteps } from './sandhya.js';

const src = readFileSync(new URL('./template.html', import.meta.url), 'utf8');
const fails = [];

// ---- markup and script ----
if (!src.includes('<!--page-->')) fails.push('the <!--page--> marker that build.sh splits on is missing');
const ids = new Set([...src.matchAll(/\bid="([A-Za-z][\w-]*)"/g)].map((m) => m[1]));
const looked = new Set([...src.matchAll(/\$\('([A-Za-z][\w-]*)'\)/g)].map((m) => m[1]));
for (const id of looked) if (!ids.has(id)) fails.push(`$('${id}') looks up an id that nothing renders`);
if (/href="#/.test(src)) fails.push('a link points at "#…": it would switch tabs');
if (/<button class="tab"[^>]*\sdata-i18n="/.test(src)) fails.push('a tab button carries data-i18n itself: its icon would vanish');

// ---- tokens ----
// The declarations of the first block whose selector is exactly `sel`.
function block(sel) {
  const at = src.indexOf(sel + ' {');
  if (at < 0) { fails.push(`no CSS block for ${sel}`); return {}; }
  const body = src.slice(at + sel.length + 2, src.indexOf('}', at));
  return Object.fromEntries([...body.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
}
const light = block(':root'), darkBase = block(':root[data-theme="dark"]');
const opaque = ['--maroon', '--gold', '--gold-ink', '--paper', '--line', '--kumkum', '--touch', '--mantra-bg', '--moon-lit', '--moon-dark', '--moon-rim'];
for (const [name, T] of [['light', light], ['dark', darkBase]])
  for (const k of opaque) if (!/^#[0-9a-f]{6}$/i.test(T[k] || '')) fails.push(`${name} ${k} is "${T[k]}": the drawings need an opaque hex colour`);
// The media-query copy of the dark tokens must say the same as the [data-theme="dark"] block.
const mediaDark = block('  :root:not([data-theme="light"])');
for (const [k, v] of Object.entries(darkBase)) if (mediaDark[k] !== v) fails.push(`dark ${k}: the two dark blocks differ (${mediaDark[k]} / ${v})`);

// ---- page text in every language ----
const used = new Set([
  ...[...src.matchAll(/\bt\('([\w.]+)'/g)].map((m) => m[1]).filter((k) => !k.endsWith('.')), // 'mode.' + k: a prefix
  ...[...src.matchAll(/data-i18n(?:-aria|-ph)?="([\w.]+)"/g)].map((m) => m[1]),
]);
// Keys the script builds from a prefix and a known list.
const families = {
  'purpose.': ['sankalpam', 'puja', 'pratah', 'madhyahnika', 'sayam'], 'mode.': ['full', 'laghu', 'short'],
  'kind.': ['pratah', 'madhyahnika', 'sayam', 'metro', 'tier1', 'tier2', 'tier3', 'pilgrimage', 'usa', 'world'],
  'title.': ['pratah', 'madhyahnika', 'sayam'], 'venue.': ['home', 'temple', 'river'],
  'grade.': ['pratah.uttama', 'pratah.madhyama', 'pratah.adhama', 'sayam.uttama', 'sayam.madhyama', 'sayam.adhama'],
};
for (const [pre, list] of Object.entries(families)) for (const x of list) used.add(pre + x);
// Keys shown on one page only: the key to the Roman letters' marks (English), and the note that
// Tamil shows mantras in English letters (Tamil).
const ONLY = { 'sd.pron': [], 'foot.mantras': ['ta'] };
for (const k of used) {
  if (!(k in UI_EN)) { fails.push(`page text "${k}" is missing in English (ui.js)`); continue; }
  for (const l of ONLY[k] ?? ['te', 'ta', 'kn', 'hi']) if (!(k in UI_I18N[l])) fails.push(`page text "${k}" is missing in ${l} (ui_i18n.js)`);
}

// ---- sandhya steps in every language ----
// Renders every step of the three sandhyas in each language with localizeSteps (sandhya.js), the
// function the page itself uses, and fails where the page would show something wrong: a title,
// instruction or note that is empty, keeps a placeholder in braces (a "{step:…}" naming no step
// of that sandhya, or mistyped) or falls back to English. In the texts as written: no step number
// written by hand (use {step:<id>}), no translation for a step that no longer exists, and none of
// a repeated step's own, which would hide the shared step.again.<ref> text.
const kinds = Object.keys(SANDHYA_KINDS);
const stepIds = new Set(kinds.flatMap((k) => sandhyaSteps(k).map((s) => s.id)));
const repeats = new Set(kinds.flatMap((k) => sandhyaSteps(k).filter((s) => s.ref).map((s) => s.id)));
const handNumber = /\bstep \d|\d+వ అంశ|படி \d|ಹಂತ \d|चरण \d/;
const stepFails = new Set();
let stepTexts = 0, stepRefs = 0;
for (const k of kinds) {
  const en = localizeSteps(k, null);
  for (const st of en) if (st.ref && !en.some((s) => s.id === st.ref)) stepFails.add(`${k}/${st.id} repeats "${st.ref}", which ${k} does not have`);
  for (const l of ['en', 'te', 'ta', 'kn', 'hi']) {
    const out = l === 'en' ? en : localizeSteps(k, UI_I18N[l]);
    out.forEach((st, i) => {
      for (const f of ['title', 'how', 'note']) {
        if (typeof en[i][f] !== 'string') continue;
        stepTexts++;
        const where = `${l} ${k}/${st.id} ${f}`;
        if (!st[f].trim()) stepFails.add(`${where} is empty`);
        else if (/[{}]/.test(st[f])) stepFails.add(`${where} keeps a placeholder: ${st[f].match(/\{[^}]*\}?|\}/)[0]}`);
        if (l !== 'en' && st[f] === en[i][f]) stepFails.add(`${where} falls back to English (no translation in ui_i18n.js)`);
      }
    });
  }
}
const written = [
  ...kinds.flatMap((k) => sandhyaSteps(k).flatMap((s) => ['title', 'how', 'note'].filter((f) => typeof s[f] === 'string').map((f) => [`en ${k}/${s.id} ${f}`, s[f]]))),
  ...['te', 'ta', 'kn', 'hi'].flatMap((l) => Object.entries(UI_I18N[l]).filter(([key]) => key.startsWith('step.')).map(([key, v]) => [`${l} "${key}"`, v])),
];
for (const [where, v] of written) {
  if (!v.trim()) stepFails.add(`${where} is empty`);
  stepRefs += (v.match(/\{step:/g) || []).length;
  if (handNumber.test(v)) stepFails.add(`${where}: a step number written by hand; use {step:<id>}`);
}
for (const l of ['te', 'ta', 'kn', 'hi']) for (const key of Object.keys(UI_I18N[l])) {
  const m = key.match(/^step\.(again\.)?([\w-]+)\./);
  if (!m) continue;
  if (!stepIds.has(m[2])) stepFails.add(`${l}: "${key}" is for a sandhya step that does not exist`);
  else if (!m[1] && repeats.has(m[2])) stepFails.add(`${l}: "${key}" would hide the shared step.again text of this repeated step`);
}
fails.push(...stepFails);

// ---- contrast ----
const parse = (v, T) => {
  if (!v) return null;
  const ref = v.match(/^var\((--[\w-]+)\)$/); if (ref) return parse(T[ref[1]], T);
  let m = v.match(/^#([0-9a-f]{6})$/i);
  if (m) return { r: parseInt(m[1].slice(0, 2), 16), g: parseInt(m[1].slice(2, 4), 16), b: parseInt(m[1].slice(4), 16), a: 1 };
  m = v.match(/^rgb\((\d+)\s+(\d+)\s+(\d+)(?:\s*\/\s*([\d.]+))?\)$/);
  return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] == null ? 1 : +m[4] } : null;
};
const over = (top, bot) => ({ r: top.r * top.a + bot.r * (1 - top.a), g: top.g * top.a + bot.g * (1 - top.a), b: top.b * top.a + bot.b * (1 - top.a), a: 1 });
const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
let lowest = { r: 99 }, pairs = 0;
const need = (fg, bg, what) => {
  const r = ratio(fg.a < 1 ? over(fg, bg) : fg, bg); pairs++;
  if (r < lowest.r) lowest = { r, what };
  if (r < 4.5) fails.push(`contrast ${r.toFixed(2)}:1 for ${what}`);
};
const texts = ['--ink', '--muted', '--kumkum', '--zari', '--hema-ink', '--dhumra-ink', '--vidruma-ink', '--nila-ink', '--kesari-ink'];
const tints = ['--vidruma', '--hema', '--nila', '--dhumra', '--mukta', '--kesari'];
for (const theme of ['light', 'dark']) {
  const base = theme === 'light' ? light : { ...light, ...darkBase };
  for (const phase of ['night', 'dawn', 'day', 'dusk']) {
    const lightPhase = phase === 'night' ? {} : block(`:root[data-sky="${phase}"]`);
    const darkPhase = theme === 'dark' && phase !== 'night' ? block(`:root[data-theme="dark"][data-sky="${phase}"]`) : {};
    const paperNight = theme === 'light' && (phase === 'night' || phase === 'dawn') ? block(':root[data-sky="night"], :root[data-sky="dawn"]') : {};
    const T = theme === 'light' ? { ...base, ...lightPhase, ...paperNight } : { ...base, ...darkPhase };
    const stops = ['--sky-top', '--sky-mid', '--sky-low'].map((k) => parse(T[k], T));
    stops.push(over(parse(T['--glow'], T), stops[2]));
    const where = `${theme} ${phase}`;
    for (const [i, sky] of stops.entries()) {
      const glass = over(parse(T['--glass'], T), sky), chrome = over(parse(T['--chrome'], T), sky);
      for (const k of texts) need(parse(T[k], T), glass, `${k} on card glass, ${where} sky stop ${i + 1}`);
      for (const k of ['--ink', '--muted']) need(parse(T[k], T), sky, `${k} straight on the sky, ${where} sky stop ${i + 1}`);
      need(parse(T['--ink'], T), chrome, `--ink on the tab bar, ${where} sky stop ${i + 1}`);
    }
    const paper = parse(T['--paper-read'], T);
    for (const k of texts) need(parse(T[k], T), paper, `${k} on the reading paper, ${where}`);
    for (const tint of tints) for (const k of ['--ink', '--muted']) need(parse(T[k], T), parse(T[tint], T), `${k} on the ${tint.slice(2)} tint, ${where}`);
    need(parse(T['--glass-solid'], T), parse(T['--kumkum'], T), `the now pill and today's date (glass on kumkum), ${where}`);
  }
}

console.log(fails.length ? `FAIL\n  ${fails.slice(0, 40).join('\n  ')}`
  : `ok: ${looked.size} element lookups found; no "#" links; tab icons safe; drawing colours opaque in both themes; ${used.size} page-text keys in all five languages; ${stepIds.size} sandhya steps drawn in five languages (${stepTexts} texts, no English fallback, ${stepRefs} step numbers filled in); ${pairs} colour pairs at 4.5:1 or more (lowest ${lowest.r.toFixed(2)}:1, ${lowest.what})`);
process.exit(fails.length ? 1 : 0);
