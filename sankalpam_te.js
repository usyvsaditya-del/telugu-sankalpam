// sankalpam_te.js — the sankalpam's words in Telugu letters: the same table as engine.js
// SANKALPA_EN, for sankalpam(p, jd, place, { words }). Telugu is the master for Kannada and
// Devanagari too (indic.js). The fixed wording is as Telugu purohits say it; the day's names are
// the Sanskrit forms the sankalpam uses (the tithi in the locative, the vaara's planet, the
// nakshatra and yoga stems). Samvatsara, ritu and month come from names_i18n.js, so the
// sankalpam names the year and month exactly as the panchangam tab shows them.
//
// sankalpaWordsTe(te) takes NAMES_I18N.te, so this file needs no imports in the browser bundle.

const TITHI = ['ప్రథమాయాం', 'ద్వితీయాయాం', 'తృతీయాయాం', 'చతుర్థ్యాం', 'పంచమ్యాం', 'షష్ఠ్యాం', 'సప్తమ్యాం',
  'అష్టమ్యాం', 'నవమ్యాం', 'దశమ్యాం', 'ఏకాదశ్యాం', 'ద్వాదశ్యాం', 'త్రయోదశ్యాం', 'చతుర్దశ్యాం', 'పౌర్ణమాస్యాం'];
const AMAVASYA = 'అమావాస్యాయాం';
const VARA = ['భాను', 'ఇందు', 'భౌమ', 'సౌమ్య', 'గురు', 'భృగు', 'స్థిర'];
const NAKSHATRA = ['అశ్వినీ', 'భరణీ', 'కృత్తికా', 'రోహిణీ', 'మృగశిరా', 'ఆర్ద్రా', 'పునర్వసు', 'పుష్య', 'ఆశ్లేషా',
  'మఘా', 'పూర్వఫల్గునీ', 'ఉత్తరఫల్గునీ', 'హస్త', 'చిత్రా', 'స్వాతీ', 'విశాఖా', 'అనూరాధా', 'జ్యేష్ఠా', 'మూలా',
  'పూర్వాషాఢా', 'ఉత్తరాషాఢా', 'శ్రవణ', 'ధనిష్ఠా', 'శతభిషా', 'పూర్వాభాద్రపదా', 'ఉత్తరాభాద్రపదా', 'రేవతీ'];
const YOGA = ['విష్కంభ', 'ప్రీతి', 'ఆయుష్మాన్', 'సౌభాగ్య', 'శోభన', 'అతిగండ', 'సుకర్మ', 'ధృతి', 'శూల', 'గండ',
  'వృద్ధి', 'ధ్రువ', 'వ్యాఘాత', 'హర్షణ', 'వజ్ర', 'సిద్ధి', 'వ్యతీపాత', 'వరీయాన్', 'పరిఘ', 'శివ', 'సిద్ధ',
  'సాధ్య', 'శుభ', 'శుక్ల', 'బ్రహ్మ', 'ఇంద్ర', 'వైధృతి'];
// Karana k = 0..59 by half-tithi, as engine.js karanaName(k, true).
const KARANA_MOVING = ['బవ', 'బాలవ', 'కౌలవ', 'తైతిల', 'గరజ', 'వణిజ', 'విష్టి'];
const KARANA_FIXED = ['శకుని', 'చతుష్పాద', 'నాగ'];

export const VENUES_TE = { home: 'స్వగృహే', temple: 'దేవాలయే', river: 'పుణ్యనదీ తీరే' };

export function sankalpaWordsTe(te) {
  return {
    opening: 'మమోపాత్త సమస్త దురితక్షయ ద్వారా శ్రీ పరమేశ్వర ప్రీత్యర్థం, ',
    muhurte: 'శుభే శోభనే ముహూర్తే, శ్రీ మహావిష్ణోరాజ్ఞయా ప్రవర్తమానస్య, అద్య బ్రహ్మణః ',
    kalpe: 'ద్వితీయ పరార్ధే, శ్వేతవరాహ కల్పే, వైవస్వత మన్వంతరే, కలియుగే, ప్రథమ పాదే, ',
    bharata: 'జంబూద్వీపే, భరత వర్షే, భరత ఖండే, మేరోః దక్షిణ దిగ్భాగే, ',
    sannidhau: 'సమస్త దేవతా బ్రాహ్మణ హరిహర గురు చరణ సన్నిధౌ, ',
    vartamana: 'అస్మిన్ వర్తమాన వ్యావహారిక చాంద్రమానేన ప్రభవాది షష్టి సంవత్సరాణాం మధ్యే, ',
    // The ritu is joined to ఋతౌ as books print it (శరదృతౌ; వసంత ఋతౌ), so it carries the word itself.
    samvatsare: ' నామ సంవత్సరే, ', ritau: ', ', mase: ' మాసే, ', pakshe: ' పక్షే, ',
    tithau: ' శుభ తిథౌ, ', vasara: ' వాసర యుక్తాయాం, ',
    laghu: 'శుభ నక్షత్ర, శుభ యోగ, శుభ కరణ, ఏవం గుణ విశేషణ విశిష్టాయాం, అస్యాం శుభ తిథౌ, ',
    nakshatraYuktayam: ' నక్షత్ర యుక్తాయాం, ', yogaYuktayam: ' యోగ యుక్తాయాం, ', karanaYuktayam: ' కరణ యుక్తాయాం, ',
    evam: 'ఏవం గుణ విశేషణ విశిష్టాయాం, అస్యాం ',
    sriman: 'శ్రీమాన్ ', gotrasya: ' గోత్రస్య, ', namadheyasya: ' నామధేయస్య, ', dharmapatni: 'ధర్మపత్నీ సమేతస్య, ',
    phala: ['అస్మాకం సహ కుటుంబానాం క్షేమ స్థైర్య విజయ అభయ ఆయురారోగ్య ఐశ్వర్యాభివృద్ధ్యర్థం, ',
      'ధర్మార్థ కామ మోక్ష చతుర్విధ ఫల పురుషార్థ సిద్ధ్యర్థం, ఇష్ట కామ్యార్థ సిద్ధ్యర్థం, '],
    more: '...', stop: '.', blank: '____', deity: 'శ్రీ పరమేశ్వర', adhika: 'అధిక ',
    samvatsara: (i) => te.samvatsara[i],
    ayana: (uttara) => (uttara ? 'ఉత్తరాయణే' : 'దక్షిణాయనే'),
    ritu: (i) => (te.ritu[i].endsWith('్') ? `${te.ritu[i].slice(0, -1)}ృతౌ` : `${te.ritu[i]} ఋతౌ`),
    masa: (i) => te.masaStem[i],
    paksha: (sukla) => (sukla ? 'శుక్ల' : 'కృష్ణ'),
    tithi: (i) => (i === 29 ? AMAVASYA : TITHI[i % 15]),
    vara: (i) => VARA[i],
    nakshatra: (i) => NAKSHATRA[i],
    yoga: (i) => YOGA[i],
    karana: (k) => (k === 0 ? 'కింస్తుఘ్న' : k >= 57 ? KARANA_FIXED[k - 57] : KARANA_MOVING[(k - 1) % 7]),
    venues: VENUES_TE,
    ends: {
      puja: (deity) => `${deity} దేవతా ప్రీత్యర్థం, యావచ్ఛక్తి ధ్యానావాహనాది షోడశోపచార పూజాం కరిష్యే`,
      pratah: () => 'ప్రాతస్సంధ్యాముపాసిష్యే',
      madhyahnika: () => 'మాధ్యాహ్నిక సంధ్యాముపాసిష్యే',
      sayam: () => 'సాయంసంధ్యాముపాసిష్యే',
    },
  };
}
