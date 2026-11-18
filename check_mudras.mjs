// check_mudras.mjs — checks the mudra and nyasa drawings: every mudra the sandhya steps name has a
// pose, every nyasa line a pose and the marks of what it touches, every drawing draws without
// broken numbers, and the hands can move between each pair of neighbours. Each nyasa step's lines
// and its drawings must stay in step.
// Run: node check_mudras.mjs   (exits 1 on any failure)
import { PURVA_MUDRAS, UTTARA_MUDRAS, NYASA_LINES, NYASA_LINES_AFTER, localizeSteps } from './sandhya.js';
import { MUDRA_POSES, NYASA_POSES, NYASA_CUES, resolvePose, blendPose, mudraSvg } from './mudra_rig.js';

const fails = [];
const bad = (s) => /NaN|Infinity|undefined/.test(s);
// A list of frames, each a name with its pose (and, for the nyasa lines, its marks).
function check(label, names, poses, cues) {
  names.forEach((name, i) => {
    if (!poses[name]) { fails.push(`${label} ${name}: no pose`); return; }
    if (cues && !cues[name]) { fails.push(`${label} ${name}: no marks`); return; }
    const o = cues ? { cue: cues[name] } : {};
    const a = resolvePose(poses[name]), d = mudraSvg(a, o);
    const vb = d.viewBox.split(' ').map(Number);
    if (vb.length !== 4 || !vb.every(Number.isFinite) || vb[2] <= 0 || vb[3] <= 0) fails.push(`${label} ${name}: viewBox "${d.viewBox}"`);
    if (bad(d.svg) || d.svg.length < 500) fails.push(`${label} ${name}: drawing is broken or empty (${d.svg.length} chars)`);
    if (cues) {
      const lit = (d.svg.match(/class="hl"/g) || []).length, want = (cues[name].hl || []).length;
      if (lit !== want) fails.push(`${label} ${name}: ${lit} parts coloured, ${want} named`);
      if (!/class="arh?"/.test(d.svg)) fails.push(`${label} ${name}: no marks drawn`);
    }
    const next = names[(i + 1) % names.length];
    if (poses[next]) {
      const b = resolvePose(poses[next]);
      for (const k of [0.25, 0.5, 0.75]) {
        const m = mudraSvg(blendPose(a, b, k), o);
        if (bad(m.svg) || bad(m.viewBox)) fails.push(`${label} ${name} → ${next} at ${k}: broken numbers`);
      }
    }
  });
}
check('mudra', PURVA_MUDRAS, MUDRA_POSES);
check('mudra', UTTARA_MUDRAS, MUDRA_POSES);
check('nyasa', NYASA_LINES, NYASA_POSES, NYASA_CUES);
check('nyasa after the japam', NYASA_LINES_AFTER, NYASA_POSES, NYASA_CUES);
const extra = Object.keys(MUDRA_POSES).filter((n) => !PURVA_MUDRAS.includes(n) && !UTTARA_MUDRAS.includes(n));
if (extra.length) fails.push(`poses with no step: ${extra.join(', ')}`);
const extraNyasa = [...new Set([...Object.keys(NYASA_POSES), ...Object.keys(NYASA_CUES)])].filter((n) => !NYASA_LINES.includes(n) && !NYASA_LINES_AFTER.includes(n));
if (extraNyasa.length) fails.push(`nyasa drawings with no line: ${extraNyasa.join(', ')}`);
for (const kind of ['pratah', 'madhyahnika', 'sayam']) {
  const nyasaSteps = localizeSteps(kind, null).filter((s) => s.nyasa);
  if (nyasaSteps.length !== 2) fails.push(`${kind}: ${nyasaSteps.length} nyasa steps, 2 expected`);
  for (const st of nyasaSteps) {
    const n = st.mantra.split('\n').length;
    if (n !== st.nyasa.length) fails.push(`${kind} ${st.id}: ${n} lines for ${st.nyasa.length} drawings`);
  }
}
console.log(fails.length ? `FAIL\n  ${fails.join('\n  ')}` : `ok: ${PURVA_MUDRAS.length} purva + ${UTTARA_MUDRAS.length} uttara mudras and ${NYASA_LINES.length} nyasa lines, before and after the japam, draw and move`);
process.exit(fails.length ? 1 : 0);
