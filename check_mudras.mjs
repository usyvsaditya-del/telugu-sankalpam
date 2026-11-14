// check_mudras.mjs — checks the mudra drawings: every mudra the sandhya steps name has a pose, every
// pose draws without broken numbers, and the hands can move between each pair of neighbours.
// Run: node check_mudras.mjs   (exits 1 on any failure)
import { PURVA_MUDRAS, UTTARA_MUDRAS } from './sandhya.js';
import { MUDRA_POSES, resolvePose, blendPose, mudraSvg } from './mudra_rig.js';

const fails = [];
const bad = (s) => /NaN|Infinity|undefined/.test(s);
for (const list of [PURVA_MUDRAS, UTTARA_MUDRAS]) {
  list.forEach((name, i) => {
    if (!MUDRA_POSES[name]) { fails.push(`${name}: no pose`); return; }
    const a = resolvePose(MUDRA_POSES[name]), d = mudraSvg(a);
    const vb = d.viewBox.split(' ').map(Number);
    if (vb.length !== 4 || !vb.every(Number.isFinite) || vb[2] <= 0 || vb[3] <= 0) fails.push(`${name}: viewBox "${d.viewBox}"`);
    if (bad(d.svg) || d.svg.length < 500) fails.push(`${name}: drawing is broken or empty (${d.svg.length} chars)`);
    const next = list[(i + 1) % list.length];
    if (MUDRA_POSES[next]) {
      const b = resolvePose(MUDRA_POSES[next]);
      for (const k of [0.25, 0.5, 0.75]) {
        const m = mudraSvg(blendPose(a, b, k));
        if (bad(m.svg) || bad(m.viewBox)) fails.push(`${name} → ${next} at ${k}: broken numbers`);
      }
    }
  });
}
const extra = Object.keys(MUDRA_POSES).filter((n) => !PURVA_MUDRAS.includes(n) && !UTTARA_MUDRAS.includes(n));
if (extra.length) fails.push(`poses with no step: ${extra.join(', ')}`);
console.log(fails.length ? `FAIL\n  ${fails.join('\n  ')}` : `ok: ${PURVA_MUDRAS.length} purva + ${UTTARA_MUDRAS.length} uttara mudras draw and move`);
process.exit(fails.length ? 1 : 0);
