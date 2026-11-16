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

// ----- Roman letters with pronunciation marks -----
// roman() writes Telugu-script Sanskrit in the Roman letters Sanskrit books use (IAST): ā ī ū are
// long vowels, ṭ ḍ ṇ ṣ are said with the tongue curled back, ś is a soft sh, ṛ is the vowel "ri",
// ṃ a nasal hum, ḥ a breath that echoes the vowel before it. The English page shows this line
// under each Telugu mantra line. Made from the Telugu master, it cannot drift from it.
// Telugu writes ం before every consonant; before a stop it is said as that stop's own nasal, so
// it is written so (ఉపేంద్రాయ → upendrāya, సంకల్పం → saṅkalpaṃ), as Sanskrit books in Roman letters do.
// One exception to IAST: the Yajurveda anusvara గ్ం is written "gum", as it is said and as the
// English text (sandhya.js) writes it (ఓగ్ం సువః → ogum suvaḥ).
const RO_VOWEL = { 'అ': 'a', 'ఆ': 'ā', 'ఇ': 'i', 'ఈ': 'ī', 'ఉ': 'u', 'ఊ': 'ū', 'ఋ': 'ṛ', 'ౠ': 'ṝ', 'ఌ': 'ḷ',
  'ౡ': 'ḹ', 'ఎ': 'e', 'ఏ': 'e', 'ఐ': 'ai', 'ఒ': 'o', 'ఓ': 'o', 'ఔ': 'au' };
const RO_SIGN = { 'ా': 'ā', 'ి': 'i', 'ీ': 'ī', 'ు': 'u', 'ూ': 'ū', 'ృ': 'ṛ', 'ౄ': 'ṝ', 'ౢ': 'ḷ', 'ౣ': 'ḹ',
  'ె': 'e', 'ే': 'e', 'ై': 'ai', 'ొ': 'o', 'ో': 'o', 'ౌ': 'au' };
const RO_CONS = { 'క': 'k', 'ఖ': 'kh', 'గ': 'g', 'ఘ': 'gh', 'ఙ': 'ṅ', 'చ': 'c', 'ఛ': 'ch', 'జ': 'j', 'ఝ': 'jh',
  'ఞ': 'ñ', 'ట': 'ṭ', 'ఠ': 'ṭh', 'డ': 'ḍ', 'ఢ': 'ḍh', 'ణ': 'ṇ', 'త': 't', 'థ': 'th', 'ద': 'd', 'ధ': 'dh',
  'న': 'n', 'ప': 'p', 'ఫ': 'ph', 'బ': 'b', 'భ': 'bh', 'మ': 'm', 'య': 'y', 'ర': 'r', 'ఱ': 'ṟ', 'ల': 'l',
  'ళ': 'ḷ', 'ఴ': 'ḻ', 'వ': 'v', 'శ': 'ś', 'ష': 'ṣ', 'స': 's', 'హ': 'h' };
const RO_MARK = { 'ం': 'ṃ', 'ః': 'ḥ', 'ఁ': 'm̐', 'ఽ': '\'' };
const VIRAMA = '్';
// The nasal ం becomes before each stop: the k-, c-, ṭ-, t- and p- groups.
const RO_NASAL = {};
for (const [nasal, group] of [['ṅ', 'కఖగఘ'], ['ñ', 'చఛజఝ'], ['ṇ', 'టఠడఢ'], ['n', 'తథదధ'], ['m', 'పఫబభ']])
  for (const c of group) RO_NASAL[c] = nasal;

export function roman(text) {
  if (typeof text !== 'string') return text;
  const ch = [...text];
  let out = '';
  for (let i = 0; i < ch.length; i++) {
    const c = ch[i];
    if (c === 'గ' && ch[i + 1] === VIRAMA && ch[i + 2] === 'ం') { out += 'gum'; i += 2; continue; }
    if (RO_CONS[c]) {
      out += RO_CONS[c];
      const next = ch[i + 1];
      if (next === VIRAMA) i++;                                   // no vowel: the consonant joins the next
      else if (RO_SIGN[next]) { out += RO_SIGN[next]; i++; }      // its vowel sign
      else out += 'a';                                            // the vowel every consonant carries
      continue;
    }
    if (c === 'ం' && RO_NASAL[ch[i + 1]]) { out += RO_NASAL[ch[i + 1]]; continue; }
    if (c === '‌' || c === '‍') continue;               // joiners only shape Telugu letters
    if (c >= '౦' && c <= '౯') { out += String(c.codePointAt(0) - 0x0c66); continue; }
    out += RO_VOWEL[c] ?? RO_SIGN[c] ?? RO_MARK[c] ?? c;
  }
  return out;
}

// The same for mantra parts, as indicParts: words typed in English pass through unchanged.
export function romanParts(parts) {
  return (Array.isArray(parts) ? parts : [parts]).map((x) => (typeof x === 'string' ? roman(x) : { ...x, v: roman(x.v) }));
}
