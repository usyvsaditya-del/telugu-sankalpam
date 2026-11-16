// check_te.mjs — checks the Telugu-script text: every sandhya step with an English mantra has a
// Telugu one with the same number of lines; no English letters inside Telugu text; the Kannada
// and Devanagari made from it contain no Telugu letters; the Telugu sankalpam is built for every
// tithi, nakshatra, yoga, karana and month without gaps. The pronunciation lines (Roman letters
// with marks, made from the Telugu by roman()) leave no Telugu letters, and each one still says
// what its English twin in sandhya.js says, compared on a letter skeleton that ignores spelling
// style, so a change to one text that is not made in the other shows up here.
// Run: node check_te.mjs   (exits 1 on any failure)
import { SANDHYA_KINDS, sandhyaSteps, PURVA_MUDRAS, UTTARA_MUDRAS } from './sandhya.js';
import { sandhyaMantrasTe, PURVA_MUDRAS_TE, UTTARA_MUDRAS_TE, abhivadanamTe, TURIYARGHYA_TE } from './mantras_te.js';
import { sankalpaWordsTe } from './sankalpam_te.js';
import { NAMES_I18N } from './names_i18n.js';
import { indic, indicParts, roman, romanParts, softBreaks, SHY } from './indic.js';
import { panchang, sankalpam, jdFromDate } from './engine.js';

const fails = [];
const latin = /[A-Za-z]/;
const teluguBlock = /[ఀ-౿]/;
const lineCount = (s) => s.split('\n').length;

// Letter skeleton: marks dropped, h dropped (aspirates, sh, ch), w = v, m = n, ṛ = ri or ru.
const skeleton = (s) => s.toLowerCase().replace(/[ṛṝ]/g, 'ri').normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/ru/g, 'ri').replace(/w/g, 'v').replace(/ee/g, 'i').replace(/oo/g, 'u').replace(/aa/g, 'a')
  .replace(/[^a-z]/g, '').replace(/h/g, '').replace(/m/g, 'n');
function similarity(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return 1 - d[a.length][b.length] / Math.max(a.length, b.length, 1);
}
let roLines = 0, roWorst = 1, brokenWords = 0;

for (const kind of Object.keys(SANDHYA_KINDS)) {
  const TE = sandhyaMantrasTe(kind);
  for (const st of sandhyaSteps(kind)) {
    if (typeof st.mantra !== 'string') continue;
    const te = TE[st.id];
    if (!te) { fails.push(`${kind}/${st.id}: no Telugu mantra`); continue; }
    if (lineCount(te) !== lineCount(st.mantra)) fails.push(`${kind}/${st.id}: ${lineCount(te)} Telugu lines, ${lineCount(st.mantra)} English`);
    if (latin.test(te)) fails.push(`${kind}/${st.id}: English letters in the Telugu text`);
    for (const l of ['kn', 'hi']) if (teluguBlock.test(indic(te, l))) fails.push(`${kind}/${st.id}: Telugu letters left in ${l}`);
    const en = st.mantra.split('\n');
    te.split('\n').forEach((line, i) => {
      const ro = roman(line);
      roLines++;
      // Soft break points change nothing but the invisible marks, in every script.
      const sb = softBreaks(line), unmark = (x) => x.split(SHY).join('');
      if (sb.includes(SHY)) brokenWords++;
      if (unmark(sb) !== line || unmark(roman(sb)) !== ro || ['kn', 'hi'].some((l) => unmark(indic(sb, l)) !== indic(line, l)))
        fails.push(`${kind}/${st.id} line ${i + 1}: soft break points change the text`);
      if (teluguBlock.test(ro)) fails.push(`${kind}/${st.id} line ${i + 1}: Telugu letters left in the pronunciation line`);
      const sim = similarity(skeleton(ro), skeleton(en[i] ?? ''));
      roWorst = Math.min(roWorst, sim);
      if (sim < 0.9) fails.push(`${kind}/${st.id} line ${i + 1}: Telugu and English differ (${sim.toFixed(2)}): "${ro}" / "${en[i]}"`);
    });
  }
  for (const id of Object.keys(TE)) if (!sandhyaSteps(kind).some((s) => s.id === id)) fails.push(`${kind}/${id}: Telugu mantra for a step that does not exist`);
}
if (PURVA_MUDRAS_TE.length !== PURVA_MUDRAS.length || UTTARA_MUDRAS_TE.length !== UTTARA_MUDRAS.length) fails.push('mudra name lists differ in length');
for (const n of [...PURVA_MUDRAS_TE, ...UTTARA_MUDRAS_TE, TURIYARGHYA_TE]) if (latin.test(n)) fails.push(`English letters in "${n}"`);
const abhi = abhivadanamTe({}).filter((x) => typeof x === 'string').join('');
if (latin.test(abhi)) fails.push('English letters in the Telugu abhivadanam');
if (teluguBlock.test(roman(abhi))) fails.push('Telugu letters left in the abhivadanam pronunciation');

// The Telugu sankalpam across a year of days (every tithi, nakshatra, yoga, karana, month), with a
// Telugu desha line so that any English left would show.
const W = sankalpaWordsTe(NAMES_I18N.te);
const BLR = { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lon: 77.5946, tz: 5.5 };
let n = 0;
for (let k = 0; k < 400; k += 1) {
  const d = new Date(Date.UTC(2026, 0, 1 + k, 6));
  const p = panchang(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), BLR);
  for (const purpose of ['puja', 'pratah', 'sankalpam']) for (const mode of ['full', 'laghu', 'short']) {
    for (const jd of [p.sunrise + 0.05, p.sunrise + 0.45]) {
      const parts = sankalpam(p, jd, BLR, { words: W, purpose, mode, desha: 'శ్రీశైలస్య దక్షిణ ప్రదేశే' });
      const text = parts.map((x) => (typeof x === 'string' ? x : x.v)).join('');
      n++;
      if (latin.test(text) || /undefined|NaN/.test(text)) { fails.push(`sankalpam ${d.toISOString().slice(0, 10)} ${purpose}/${mode}: ${text.match(/[A-Za-z]+/g)?.slice(0, 4).join(' ')}`); break; }
      for (const l of ['kn', 'hi']) if (teluguBlock.test(indicParts(parts, l).map((x) => (typeof x === 'string' ? x : x.v)).join(''))) fails.push(`sankalpam: Telugu letters left in ${l}`);
      if (teluguBlock.test(romanParts(parts).map((x) => (typeof x === 'string' ? x : x.v)).join(''))) fails.push('sankalpam: Telugu letters left in the pronunciation line');
    }
  }
  if (fails.length > 20) break;
}
// Places: every place, state, deity and place-line phrase the engine can produce has a Telugu form.
let placeNote = 'places_te.js not present';
try {
  const T = await import('./places_te.js');
  const { deshaFor } = await import('./engine.js');
  const { PLACES } = await import('./places.js');
  const { PLACES_ABROAD } = await import('./places_abroad.js');
  const { LOCAL_RIVERS } = await import('./local_rivers.js');
  const { DEITIES } = await import('./deities.js');
  const all = [
    ...PLACES.map(([name, state, lat, lon, kind]) => ({ name, state, lat, lon, kind, tz: 5.5, localRiver: LOCAL_RIVERS[name], deity: DEITIES[name] ? DEITIES[name].deity : undefined })),
    ...PLACES_ABROAD.map(([name, state, lat, lon, kind, zone]) => ({ name, state, lat, lon, kind, zone, abroad: true })),
  ];
  const missing = { place: [], state: [], phrase: [], deity: [] };
  for (const p of all) {
    if (!T.PLACE_NAMES_TE[p.name]) missing.place.push(p.name);
    if (!T.STATE_NAMES_TE[p.state]) missing.state.push(p.state);
    for (const ph of deshaFor(p).text.split(/,\s*/)) if (ph && !T.DESHA_TE[ph]) missing.phrase.push(ph);
  }
  for (const d of Object.values(DEITIES)) if (!T.DEITY_NAMES_TE[d.deity]) missing.deity.push(d.deity);
  for (const [k, list] of Object.entries(missing)) if (list.length) fails.push(`${list.length} ${k} names without Telugu: ${[...new Set(list)].slice(0, 6).join(', ')}`);
  for (const table of ['PLACE_NAMES_TE', 'STATE_NAMES_TE', 'DESHA_TE', 'DEITY_NAMES_TE', 'TAGS_TE'])
    for (const [k, v] of Object.entries(T[table])) {
      if (latin.test(v)) fails.push(`${table}["${k}"] has English letters: ${v}`);
      for (const l of ['kn', 'hi']) if (teluguBlock.test(indic(v, l))) fails.push(`${table}["${k}"]: Telugu letters left in ${l}`);
    }
  placeNote = `${all.length} places, their states and place-line phrases, ${Object.keys(T.DEITY_NAMES_TE).length} deities`;
} catch (e) { if (e.code !== 'ERR_MODULE_NOT_FOUND') throw e; }

console.log(fails.length ? `FAIL\n  ${fails.slice(0, 30).join('\n  ')}` : `ok: Telugu mantras for every step of 3 sandhyas, 32 mudra names, ${n} Telugu sankalpams; ${placeNote}; Kannada and Devanagari clean; ${roLines} pronunciation lines clean and in step with the English (lowest match ${roWorst.toFixed(2)}); soft break points in ${brokenWords} lines change nothing else`);
process.exit(fails.length ? 1 : 0);
