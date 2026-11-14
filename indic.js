// indic.js — writes Telugu-script text in Kannada or Devanagari letters.
//
// Telugu is the master copy for every Indian-script text the page shows in Sanskrit (mantras,
// the sankalpam) and for place names. Telugu, Kannada and Devanagari share one Unicode layout
// (inherited from ISCII), so a letter maps to the letter at the same position in the other block:
// Telugu U+0C00–U+0C7F, Kannada U+0C80–U+0CFF (+0x80), Devanagari U+0900–U+097F (−0x300).
// Conjuncts, anusvara (ం), visarga (ః), avagraha (ఽ) and the Yajurveda "గ్ం" all carry across.
//
// Devanagari for Hindi readers: Telugu short e/o (ె ొ, which Sanskrit never uses) become the
// ordinary long forms, and ళ ఱ become ल र, as Hindi writes those sounds.
// Tamil cannot be made this way (it has no aspirated or voiced letters); callers keep the
// English-letters text for Tamil.

const TE0 = 0x0c00, TE1 = 0x0c7f;
const HI_FIX = {
  0x0946: 0x0947, 0x094a: 0x094b,   // short e, o signs → long
  0x090e: 0x090f, 0x0912: 0x0913,   // short e, o letters → long
  0x0933: 0x0932, 0x0931: 0x0930,   // ळ → ल, ऱ → र
};

// Scripts this module can write. 'te' returns the text unchanged.
export const INDIC = { te: true, kn: true, hi: true };

export function indic(text, lang) {
  if (typeof text !== 'string' || lang === 'te' || !INDIC[lang]) return text;
  let out = '';
  for (const ch of text) {
    const c = ch.codePointAt(0);
    if (c < TE0 || c > TE1) { out += ch; continue; }
    let m = lang === 'kn' ? c + 0x80 : c - 0x300;
    if (lang === 'hi') m = HI_FIX[m] ?? m;
    out += String.fromCodePoint(m);
  }
  return out;
}

// The same for mantra parts: strings are converted; {v} parts (filled-in words) are converted
// only when they are in Telugu letters, so a gotram typed in English stays as typed.
export function indicParts(parts, lang) {
  return (Array.isArray(parts) ? parts : [parts]).map((x) =>
    (typeof x === 'string' ? indic(x, lang) : { ...x, v: indic(x.v, lang) }));
}
