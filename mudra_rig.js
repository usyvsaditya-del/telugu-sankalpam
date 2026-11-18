// mudra_rig.js — draws the Gayatri mudras as line drawings worked out from joint angles, so the
// mudra player can move the hands from one mudra to the next. Pure: a pose goes in, SVG comes out.
//
// How it draws. Each hand is a small 3D skeleton: a palm, four fingers of three bones, a thumb,
// and the forearm. A pose gives each hand a place, a turn, and the bend of every joint. Every bone
// is a rounded, tapering tube; seen from the front, a tube is a flat rounded shape of the same
// width. Each finger, the thumb and the palm are filled with the paper colour and outlined, then
// painted back to front, so a nearer part hides the lines of the parts behind it. A few mudras
// also show the practitioner (head, shoulders, upper arms), faded in by the pose's `body` value.
//
// The left hand is the mirror image of a right hand given the same numbers, so a symmetric mudra
// needs only the right hand. Poses are set from these numbers, not traced from any picture.
//
// Units: 1 is about 2 mm. World axes: x to the viewer's right, y up, z towards the viewer.
// The practitioner faces the viewer, so their right hand is on the viewer's left.

const RAD = Math.PI / 180;
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit = (a) => scl(a, 1 / (Math.hypot(a[0], a[1], a[2]) || 1));

// Turn a vector: tilt (rx: fingers towards the palm side), then swing about the vertical (ry:
// the palm towards the viewer's right), then roll in the picture plane (rz: anticlockwise). Degrees.
function turn(v, rx, ry, rz) {
  let c = Math.cos(rx * RAD), s = Math.sin(rx * RAD);
  v = [v[0], v[1] * c - v[2] * s, v[1] * s + v[2] * c];
  c = Math.cos(ry * RAD); s = Math.sin(ry * RAD);
  v = [v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c];
  c = Math.cos(rz * RAD); s = Math.sin(rz * RAD);
  return [v[0] * c - v[1] * s, v[0] * s + v[1] * c, v[2]];
}

// A right hand at rest: palm towards the viewer, fingers up, wrist at the origin, thumb at +x.
// base = knuckle, len = the three bones, r = their half-widths, spread = resting angle (degrees,
// + towards the thumb).
const FINGER = {
  i: { base: [10.5, 38, 0], len: [21, 13, 10], r: [4.4, 4.0, 3.6], spread: 5 },
  m: { base: [3.5, 40, 0], len: [23, 14.5, 11], r: [4.5, 4.1, 3.7], spread: 1 },
  r: { base: [-3.5, 38.5, 0], len: [21.5, 13.5, 10.5], r: [4.3, 3.9, 3.5], spread: -3 },
  l: { base: [-10.5, 34, 0], len: [17, 10.5, 9], r: [3.9, 3.5, 3.2], spread: -8 },
};
const THUMB = { base: [12, 10, 4], len: [17, 12, 10], r: [6.6, 5.0, 4.4] };
const FOREARM = 130;                       // wrist to elbow
const SHOULDER = [-100, 106, -34];         // the right shoulder; the left is its mirror

// A hand pose. at: wrist position. rx/ry/rz: turn (see turn()). f: bend of each finger's three
// joints in degrees, + towards the palm. s: extra spread per finger. t: thumb — ab swings it away
// from the index finger, op brings it in front of the palm, f bends its two joints. w: bend at the
// wrist, [towards the palm side, towards the thumb side] in degrees, applied to the forearm.
export const HAND0 = {
  at: [0, 0, 0], rx: 0, ry: 0, rz: 0, w: [0, 0],
  f: { i: [0, 0, 0], m: [0, 0, 0], r: [0, 0, 0], l: [0, 0, 0] },
  s: { i: 0, m: 0, r: 0, l: 0 },
  t: { ab: 30, op: 15, f: [6, 6] },
};
// A pose. R, L: hands. body: 0..1, how much of the practitioner shows. tilt: [x, y] degrees,
// turns the whole scene (x: the top towards the viewer). cam: [x, y, width] of the view.
export const CAM_HANDS = [0, 36, 190];
export const CAM_BODY = [0, 105, 460];
const POSE0 = { body: 0, tilt: [0, 0], cam: CAM_HANDS };
const ASPECT = 135 / 190;

const clone = (x) => JSON.parse(JSON.stringify(x));
function merge(base, over) {
  if (over === undefined) return clone(base);
  if (Array.isArray(base) || typeof base !== 'object') return Array.isArray(over) ? over.slice() : over;
  const out = {};
  for (const k of Object.keys(base)) out[k] = merge(base[k], over[k]);
  return out;
}

// The bones of one hand in its own frame, grouped into parts that are each outlined as one shape.
function handParts(h) {
  const parts = [];
  // thumb direction: m0 along its first bone; p is the way its joints bend (towards the palm)
  const ab = h.t.ab * RAD, op = h.t.op * RAD;
  const m0 = [Math.sin(ab) * Math.cos(op), Math.cos(ab) * Math.cos(op), Math.sin(op)];
  let p = [-0.55, -0.05, 0.85];
  p = unit(add(p, scl(m0, -dot(p, m0))));
  const mcp = add(THUMB.base, scl(m0, THUMB.len[0]));

  // palm: four metacarpal tubes, the little-finger edge, the ball of the thumb; plus the forearm
  const palm = [];
  for (const k of 'imrl') {
    const F = FINGER[k];
    palm.push([[F.base[0] * 0.75, 9, 0], [F.base[0], F.base[1] - 3, 0], 6.6, 6.0]);
  }
  palm.push([[-11, 7, 0], [-12, 30, 0], 6.8, 6.0]);
  const depthPts = palm.map((s) => scl(add(s[0], s[1]), 0.5));
  palm.push([THUMB.base, mcp, THUMB.r[0], THUMB.r[0] * 0.78]);
  const elbow = turn([0, -FOREARM, 0], h.w[0], 0, h.w[1]);
  palm.push([[0, 8, 0], elbow, 11.5, 15]);
  parts.push({ name: 'palm', segs: palm, depthPts, elbow });

  // fingers
  for (const k of 'imrl') {
    const F = FINGER[k], sp = (F.spread + h.s[k]) * RAD;
    const u0 = [Math.sin(sp), Math.cos(sp), 0], n = [0, 0, 1];
    let at = F.base, cum = 0;
    const segs = [], joints = [F.base];
    for (let j = 0; j < 3; j++) {
      cum += h.f[k][j] * RAD;
      const d = add(scl(u0, Math.cos(cum)), scl(n, Math.sin(cum)));
      const next = add(at, scl(d, F.len[j]));
      segs.push([at, next, F.r[j], j < 2 ? F.r[j + 1] : F.r[j] * 0.92]);
      joints.push(next); at = next;
    }
    // the nail faces away from the palm side of the last bone
    const nail = add(scl(n, -Math.cos(cum)), scl(u0, Math.sin(cum)));
    parts.push({ name: k, segs, joints, nail, palmSide: scl(nail, -1), tipR: F.r[2] });
  }

  // thumb: two bones beyond the ball of the thumb
  {
    let cum = h.t.f[0] * RAD;
    const d1 = add(scl(m0, Math.cos(cum)), scl(p, Math.sin(cum)));
    const ip = add(mcp, scl(d1, THUMB.len[1]));
    cum += h.t.f[1] * RAD;
    const d2 = add(scl(m0, Math.cos(cum)), scl(p, Math.sin(cum)));
    const tip = add(ip, scl(d2, THUMB.len[2]));
    const nail = scl(add(scl(p, Math.cos(cum)), scl(m0, -Math.sin(cum))), -1);
    parts.push({ name: 't', segs: [[mcp, ip, THUMB.r[1], THUMB.r[2]], [ip, tip, THUMB.r[2], THUMB.r[2] * 0.92]],
      joints: [mcp, ip, tip], nail, palmSide: scl(nail, -1), tipR: THUMB.r[2] });
  }
  return parts;
}

// The whole scene can be turned (tilt) about a point in front of the chest.
const PIVOT = [0, 40, 0];
function tiltFn(tilt) {
  const [ax, ay] = tilt;
  const rot = (v) => {
    let c = Math.cos(ax * RAD), s = Math.sin(ax * RAD);
    v = [v[0], v[1] * c - v[2] * s, v[1] * s + v[2] * c];
    c = Math.cos(ay * RAD); s = Math.sin(ay * RAD);
    return [v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c];
  };
  return { pt: (v) => add(rot(add(v, scl(PIVOT, -1))), PIVOT), dir: rot };
}

// Place a hand in the world. A left hand is worked out as a right hand, then mirrored.
function placeHand(h, left, T) {
  const flip = (v) => (left ? [-v[0], v[1], v[2]] : v);
  const pt = (v) => T.pt(flip(add(turn(v, h.rx, h.ry, h.rz), h.at)));
  const dir = (v) => T.dir(flip(turn(v, h.rx, h.ry, h.rz)));
  return handParts(h).map((P) => ({
    name: (left ? 'L' : 'R') + P.name,
    segs: P.segs.map(([a, b, ra, rb]) => [pt(a), pt(b), ra, rb]),
    joints: P.joints && P.joints.map(pt),
    elbow: P.elbow && pt(P.elbow),
    depthPts: (P.depthPts || P.segs.map((s) => scl(add(s[0], s[1]), 0.5))).map(pt),
    nail: P.nail && dir(P.nail), palmSide: P.palmSide && dir(P.palmSide), tipR: P.tipR,
  }));
}

// Fill in a pose: defaults for anything not given, the left hand as the mirror of the right when
// it is not given, and "touch" (slide each hand sideways until the named fingertips meet in the
// middle, with a gap; 't' is the thumb).
export function resolvePose(pose) {
  const R = merge(HAND0, pose.R || {});
  const L = merge(HAND0, pose.L || pose.R || {});
  if (pose.touch) {
    const { f = 'imrl', gap = 0 } = pose.touch;
    for (const h of [R, L]) {
      let xmax = -Infinity;
      for (const P of handParts(h)) if (f.includes(P.name)) {
        const tip = add(turn(P.joints[P.joints.length - 1], h.rx, h.ry, h.rz), h.at);
        xmax = Math.max(xmax, tip[0] + P.tipR);
      }
      h.at = [h.at[0] - gap / 2 - xmax, h.at[1], h.at[2]];
    }
  }
  const out = merge(POSE0, pose);
  out.R = R; out.L = L; delete out.touch;
  return out;
}

// Blend two resolved poses: k = 0 gives a, 1 gives b.
export function blendPose(a, b, k) {
  if (typeof a === 'number') return a + (b - a) * k;
  if (Array.isArray(a)) return a.map((x, i) => blendPose(x, b[i], k));
  if (!a || typeof a !== 'object') return k < 0.5 ? a : b;
  const out = {};
  for (const key of Object.keys(a)) out[key] = blendPose(a[key], b[key], k);
  return out;
}

const fx = (n) => (Math.round(n * 100) / 100).toString();
const scr = (v) => [v[0], -v[1]];

// A tapering tube seen side-on: two circles joined by their outside tangents. Screen coordinates
// (y down). Every shape winds the same way, so overlapping shapes fill as one.
function tube(a, b, ra, rb) {
  const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy);
  if (d <= Math.abs(ra - rb) + 0.05) {
    const [c, r] = ra >= rb ? [a, ra] : [b, rb];
    return `M${fx(c[0] - r)} ${fx(c[1])}A${fx(r)} ${fx(r)} 0 1 0 ${fx(c[0] + r)} ${fx(c[1])}A${fx(r)} ${fx(r)} 0 1 0 ${fx(c[0] - r)} ${fx(c[1])}Z`;
  }
  const ux = dx / d, uy = dy / d, nx = -uy, ny = ux;
  const sa = (ra - rb) / d, ca = Math.sqrt(1 - sa * sa);
  const ep = [sa * ux + ca * nx, sa * uy + ca * ny], em = [sa * ux - ca * nx, sa * uy - ca * ny];
  const A0 = [a[0] + ra * ep[0], a[1] + ra * ep[1]], A1 = [b[0] + rb * ep[0], b[1] + rb * ep[1]];
  const B1 = [b[0] + rb * em[0], b[1] + rb * em[1]], B0 = [a[0] + ra * em[0], a[1] + ra * em[1]];
  const s = (p) => `${fx(p[0])} ${fx(p[1])}`;
  return `M${s(A0)}L${s(A1)}A${fx(rb)} ${fx(rb)} 0 ${sa < 0 ? 1 : 0} 0 ${s(B1)}L${s(B0)}A${fx(ra)} ${fx(ra)} 0 ${sa > 0 ? 1 : 0} 0 ${s(A0)}Z`;
}
const ellipse = (cx, cy, rx, ry) =>
  `M${fx(cx - rx)} ${fx(cy)}A${fx(rx)} ${fx(ry)} 0 1 0 ${fx(cx + rx)} ${fx(cy)}A${fx(rx)} ${fx(ry)} 0 1 0 ${fx(cx - rx)} ${fx(cy)}Z`;

// Small marks that make a shape read as a finger: the nail when the back of the tip faces the
// viewer, and joint creases when the palm side does.
function marks(P, lw) {
  if (!P.joints) return '';
  const out = [];
  const J = P.joints.map(scr), last = J.length - 1;
  const a = J[last - 1], b = J[last], dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy);
  if (P.nail[2] > 0.25 && len > 2) {
    const c = [a[0] + dx * 0.66, a[1] + dy * 0.66];
    const ry = Math.max(len * 0.26, 1.1), rx = P.tipR * 0.58 * Math.min(1, P.nail[2] + 0.3);
    const ang = Math.atan2(dy, dx) / RAD;
    out.push(`<ellipse class="mk" cx="${fx(c[0])}" cy="${fx(c[1])}" rx="${fx(ry)}" ry="${fx(rx)}" transform="rotate(${fx(ang)} ${fx(c[0])} ${fx(c[1])})" stroke-width="${fx(lw * 0.7)}"/>`);
  }
  if (P.palmSide[2] > 0.35) {
    for (let j = 1; j < last; j++) {
      const p = J[j], q = J[j + 1], ex = q[0] - p[0], ey = q[1] - p[1], l = Math.hypot(ex, ey);
      if (l < 3) continue;
      const nx = -ey / l, ny = ex / l, w = (P.tipR || 4) * 0.55;
      out.push(`<path class="mk" d="M${fx(p[0] - nx * w)} ${fx(p[1] - ny * w)}L${fx(p[0] + nx * w)} ${fx(p[1] + ny * w)}" stroke-width="${fx(lw * 0.6)}"/>`);
    }
  }
  return out.join('');
}

const shape = (d, lw, extra = '') =>
  `<g><path class="o" d="${d}" stroke-width="${fx(lw * 2)}"/><path class="f" d="${d}"/>${extra}</g>`;

// The practitioner, seen from the front: seated, head with sikha and bottu, yajnopavitam over the
// left shoulder, upper arms from the shoulders to the elbows of the two hands.
function bodySvg(elbows, lw) {
  const out = [];
  const mk = (d, w = 0.8) => `<path class="mk" d="${d}" stroke-width="${fx(lw * w)}"/>`;
  out.push(shape('M-188 222Q-160 182 0 192Q160 182 188 222Q160 264 0 258Q-160 264-188 222Z', lw,
    mk('M-150 236Q-20 206 130 222') + mk('M-120 214Q20 236 150 238')));           // lap, crossed legs
  out.push(shape('M-100 -112Q-112 -104-110 -84L-92 160L92 160L110 -84Q112 -104 100 -112Q52 -128 0 -128Q-52 -128-100 -112Z', lw,
    mk('M58 -122Q10 10-78 150', 1.1)));                                            // torso, thread
  out.push(shape(tube([0, -112], [0, -152], 18, 16), lw));                         // neck
  out.push(shape(ellipse(-41, -198, 8, 13) + ellipse(41, -198, 8, 13), lw));       // ears
  out.push(shape(ellipse(0, -205, 40, 50), lw,
    mk('M-21 -210Q-15 -214-9 -210') + mk('M9 -210Q15 -214 21 -210') + mk('M0 -205L-3 -190L2 -188', 0.7)
    + mk('M-9 -178Q0 -173 9 -178') + `<circle class="dot" cx="0" cy="-230" r="3"/>`));    // face
  out.push(shape(ellipse(0, -258, 5, 7), lw));                                     // sikha
  for (const [e, sx] of [[elbows[0], -1], [elbows[1], 1]]) {
    const sh = [sx * -SHOULDER[0], -SHOULDER[1]];
    out.push(shape(tube(sh, scr(e), 17, 14), lw));                                 // upper arm
  }
  return out.join('');
}

// A nyasa's marks over its drawing, in kumkum (see NYASA_CUES): an arrow along each finger the
// line strokes, from base to tip; a ring on each place it touches; a ring round the crown (astra,
// the digbandham), seen a little from above, its far half fine-dashed and its near half solid
// with the arrowhead, going clockwise as seen from above (a pradakshina), or the other way when
// reversed; dotted for the digbandham, with a tick at each snap; a turning arrow round each wrist
// (the hands turn over); a burst where the hands clap. Cue points are world [x, y]; the marks are
// drawn in screen coordinates.
function cueSvg(cue, parts, lw) {
  const w = lw * 1.5, out = [];
  const pt = (p) => `${fx(p[0])} ${fx(p[1])}`;
  const line = (a, b) => out.push(`<path class="ar" d="M${pt(a)}L${pt(b)}" stroke-width="${fx(w)}"/>`);
  // an arrowhead with its tip at tip, pointing along the unit vector (ux, uy)
  const head = (tip, ux, uy) => {
    const h = 5 * w, hw = 2 * w, b = [tip[0] - ux * h, tip[1] - uy * h];
    out.push(`<path class="arh" d="M${pt(tip)}L${pt([b[0] - uy * hw, b[1] + ux * hw])}L${pt([b[0] + uy * hw, b[1] - ux * hw])}Z"/>`);
  };
  // the point at angle deg (degrees; increasing turns clockwise as seen) on an ellipse about c
  const on = (c, rx, ry, deg) => [c[0] + rx * Math.cos(deg * RAD), c[1] + ry * Math.sin(deg * RAD)];
  // an elliptical arc from a0 to a1 as a polyline (exact for any ellipse), with a look:
  // 'solid', 'dash' (the far side) or 'dots'
  const arc = (c, rx, ry, a0, a1, look) => {
    const n = Math.max(8, Math.ceil(Math.abs(a1 - a0) / 4)), P = [];
    for (let k = 0; k <= n; k++) P.push(on(c, rx, ry, a0 + ((a1 - a0) * k) / n));
    const dash = look === 'dash' ? ` stroke-dasharray="${fx(w * 1.6)} ${fx(w * 1.6)}"` : look === 'dots' ? ` stroke-dasharray="${fx(w * 0.05)} ${fx(w * 2.4)}"` : '';
    out.push(`<path class="ar" d="M${P.map(pt).join('L')}" stroke-width="${fx(look === 'dash' ? w * 0.7 : w)}"${dash}/>`);
    return P;
  };
  // a ring seen a little from above: the far half (screen top) dashed, the near half drawn with an
  // arrowhead; clockwise from above, the near half runs right to left; reversed, left to right
  const ring = (c, rx, ry, { dotted = false, reverse = false } = {}) => {
    arc(c, rx, ry, 186, 354, dotted ? 'dots' : 'dash');
    const [a0, a1] = reverse ? [174, 6] : [6, 174];
    const k = dotted ? (a1 - a0) * 0.72 : 0;                 // dots for most of it, then solid
    if (dotted) arc(c, rx, ry, a0, a0 + k, 'dots');
    const P = arc(c, rx, ry, a0 + k, a1 - (a1 - a0) * 0.08, 'solid');
    const tip = on(c, rx, ry, a1), q = P[P.length - 1], d = Math.hypot(tip[0] - q[0], tip[1] - q[1]) || 1;
    head(tip, (tip[0] - q[0]) / d, (tip[1] - q[1]) / d);
  };
  for (const name of cue.stroke || []) {
    const P = parts.find((q) => q.name === name);
    if (!P || !P.joints) continue;
    const J = P.joints.map(scr), a = J[0], z = J[J.length - 1];
    const dx = z[0] - a[0], dy = z[1] - a[1], d = Math.hypot(dx, dy) || 1;
    const tip = [a[0] + dx * 0.97, a[1] + dy * 0.97];
    line([a[0] + dx * 0.08, a[1] + dy * 0.08], [tip[0] - (dx / d) * 4.5 * w, tip[1] - (dy / d) * 4.5 * w]);
    head(tip, dx / d, dy / d);
  }
  for (const [x, y, r] of cue.rings || []) out.push(`<circle class="ar" cx="${fx(x)}" cy="${fx(-y)}" r="${fx(r)}" stroke-width="${fx(w)}"/>`);
  if (cue.orbit) {
    const [x, y, rx, ry] = cue.orbit, c = [x, -y];
    ring(c, rx, ry, { dotted: cue.dotted, reverse: cue.reverse });
    for (let k = 0; k < (cue.snaps || 0); k++) {
      const deg = 45 + (k * 360) / cue.snaps, p = on(c, rx, ry, deg);
      let nx = Math.cos(deg * RAD) / rx, ny = Math.sin(deg * RAD) / ry;
      const nl = Math.hypot(nx, ny); nx /= nl; ny /= nl;
      line([p[0] + nx * 2.5 * w, p[1] + ny * 2.5 * w], [p[0] + nx * 6 * w, p[1] + ny * 6 * w]);
    }
  }
  for (const [x, y, rx, ry, rev] of cue.twists || []) ring([x, -y], rx, ry, { reverse: !!rev });
  if (cue.clap) {
    const [x, y] = cue.clap;
    for (const deg of [-150, -120, -90, -60, -30]) {
      const c = Math.cos(deg * RAD), sn = Math.sin(deg * RAD);
      line([x + c * 6 * w, -y + sn * 6 * w], [x + c * 11 * w, -y + sn * 11 * w]);
    }
  }
  return out.join('');
}

// The drawing for a resolved pose: { viewBox, svg } (SVG markup). CSS classes: .o outline (fill
// and stroke in the line colour), .f fill (paper colour), .mk marks, .dot the bottu. With a cue
// (o.cue, a nyasa's): .hl around a part the line touches, and .ar (stroke) and .arh (fill) for the
// kumkum marks.
export function mudraSvg(rp, o = {}) {
  const lw = o.lw ?? 1.3 * (rp.cam[2] / 190);
  const T = tiltFn(rp.tilt);
  const parts = [...placeHand(rp.R, false, T), ...placeHand(rp.L, true, T)];
  for (const P of parts) P.z = P.depthPts.reduce((s, v) => s + v[2], 0) / P.depthPts.length;
  parts.sort((a, b) => a.z - b.z);
  const lit = new Set((o.cue && o.cue.hl) || []);
  const tubes = (segs) => segs.map(([a, b, ra, rb]) => tube(scr(a), scr(b), ra, rb)).join('');
  const hands = parts.map((P) => {
    if (!lit.has(P.name)) return shape(tubes(P.segs), lw, marks(P, lw));
    // a coloured palm leaves its forearm (its last tube) in the paper colour
    const arm = P.name.endsWith('palm') ? P.segs.slice(-1) : [], own = P.segs.slice(0, P.segs.length - arm.length);
    return (arm.length ? shape(tubes(arm), lw) : '') + `<g class="hl">${shape(tubes(own), lw, marks(P, lw))}</g>`;
  }).join('');
  let body = '';
  if (rp.body > 0.01) {
    const el = parts.filter((P) => P.elbow).sort((a, b) => a.name.localeCompare(b.name)).map((P) => P.elbow);
    body = `<g opacity="${fx(Math.min(1, rp.body))}">${bodySvg([el[1], el[0]], lw)}</g>`;   // R, L
  }
  const [cx, cy, w] = rp.cam, h = w * ASPECT;
  return { viewBox: `${fx(cx - w / 2)} ${fx(-cy - h / 2)} ${fx(w)} ${fx(h)}`, svg: body + hands + (o.cue ? cueSvg(o.cue, parts, lw) : '') };
}

// ---- the mudras -------------------------------------------------------------------------------
// Each is a pose for the right hand (the left mirrors it) unless both are given. Set from the
// usual descriptions of the mudras and checked against the pictures in a printed Telugu
// sandhyavandanam book. Where that book draws the hands from above (Vyapakanjalikam, Sakatam),
// the scene is tilted to look down on them. Where books differ, the comment says which form is drawn.
const all = (a) => ({ i: a, m: a, r: a, l: a });
const fist = all([92, 100, 65]);
const FOLD = [92, 100, 65];                        // a finger folded into the palm
const together = { i: -4, m: -1, r: 2, l: 6 };     // fingers closed up, without their resting spread
const off = { at: [60, -420, 0] };                 // a hand not used in the mudra, out of view
const CAM_SEATED = [0, 2, 750];                    // the whole seated figure, for the hands on the knees
// The closed bud of Samputam, which Dvimukham to Panchamukham open finger by finger: hands cupped,
// heels together, forearms apart below.
const bud = (f, t) => ({ at: [-8, 0, 0], ry: 110, rz: 18, w: [40, 0], f, t });
const CUP = [22, 40, 30];                          // a finger curved over the bud to meet its partner

export const MUDRA_POSES = {
  // hands wide apart, fingers bent straight across so the tips of both hands press together
  Sumukham: { R: { at: [-40, -10, 0], ry: 150, rz: -35, f: all([55, 15, 5]), t: { ab: 10, op: 20, f: [10, 10] } },
    touch: { f: 'imrl' } },
  // the closed bud: heels together, fingers curved over, tips meeting down the middle, hollow inside
  Samputam: { R: bud(all(CUP), { ab: 10, op: 35, f: [20, 25] }) },
  // open hands facing each other, a little apart, fingers together
  Vitatam: { R: { at: [-22, 0, 0], ry: 25, rz: -4, s: together, t: { ab: 0, op: -5, f: [5, 5] } } },
  // the same, wider apart, fingers a little spread
  Vistritam: { R: { at: [-48, 0, 0], ry: 25, s: { i: 2, m: 0, r: -1, l: -3 }, t: { ab: 8, op: 8, f: [5, 5] } } },
  // from the bud: little and ring fingertips meet; middle and index stand open
  Dvimukham: { R: bud({ i: [5, 5, 0], m: [5, 5, 0], r: CUP, l: CUP }, { ab: 0, op: -15, f: [5, 5] }) },
  // middle, ring and little meet; index open
  Trimukham: { R: bud({ i: [5, 5, 0], m: CUP, r: CUP, l: CUP }, { ab: 0, op: -15, f: [5, 5] }) },
  // all four fingers meet; the thumbs stand up apart
  Chaturmukham: { R: bud(all(CUP), { ab: 0, op: -25, f: [0, 0] }) },
  // the thumbs meet too (they are on the far side, so the bud is turned a little to show them)
  Panchamukham: { R: bud(all(CUP), { ab: 0, op: 20, f: [35, 35] }), tilt: [10, 40] },
  // hands turned on their sides, fingers curved to meet in one line, thumbs below nearly touching
  Shanmukham: { R: { at: [-30, 10, 0], ry: 15, rz: -80, f: { i: [30, 40, 25], m: [30, 40, 25], r: [30, 40, 25], l: [20, 25, 15] },
    t: { ab: 45, op: 20, f: [15, 15] } }, touch: { f: 'imr' } },
  // turned down: fingers pointing down and in, pressed together along the middle; thumbs across the top
  Adhomukham: { R: { at: [-30, 40, 0], ry: 175, rz: -118, f: all([25, 15, 10]), t: { ab: 65, op: 0, f: [5, 5] } },
    touch: { f: 'imrl' } },
  // seen from above: palms up and cupped into one bowl, little-finger edges together, thumbs out
  Vyapakanjalikam: { R: { at: [-12, 40, -30], rx: 90, rz: 180, f: all([15, 20, 10]), s: together, t: { ab: 45, op: 0, f: [5, 5] } },
    touch: { f: 'l' }, tilt: [60, 0] },
  // seen from above: palms down, three fingers folded, index fingers pointing forward, thumb tips meeting
  Sakatam: { R: { at: [-18, 40, -30], rx: 90, ry: 18, f: { i: [5, 5, 0], m: FOLD, r: FOLD, l: FOLD }, t: { ab: 75, op: 0, f: [0, 5] } },
    touch: { f: 't' }, tilt: [60, 0] },
  // the noose: the right fist's index finger raised, the left index hooked round it
  Yamapasam: { R: { at: [-14, 0, 4], ry: 30, f: { i: [0, 0, 0], m: FOLD, r: FOLD, l: FOLD }, t: { ab: 10, op: 40, f: [15, 25] } },
    L: { at: [-14, 30, -4], ry: 40, rz: -70, f: { i: [10, 95, 75], m: FOLD, r: FOLD, l: FOLD }, t: { ab: 10, op: 40, f: [15, 25] } } },
  // fingers knit together
  Grathitam: { R: { at: [-12, 0, -3.5], ry: 95, rz: -20, f: all([75, 30, 15]), s: { i: 6, m: 2, r: -2, l: -6 }, t: { ab: 15, op: 10, f: [10, 10] } },
    L: { at: [-12, 0, 3.5], ry: 95, rz: -20, f: all([75, 30, 15]), s: { i: 6, m: 2, r: -2, l: -6 }, t: { ab: 15, op: 10, f: [10, 10] } },
    tilt: [35, 0] },
  // the right hand above, palm down; the left below, palm up; fingers curved towards each other
  Sammukhonmukham: { R: { at: [-60, 84, 0], ry: 90, rz: -90, f: all([35, 40, 20]), t: { ab: 25, op: 10, f: [5, 5] } },
    L: { at: [-60, 6, 0], ry: -90, rz: -90, f: all([35, 40, 20]), t: { ab: 25, op: 10, f: [5, 5] } }, tilt: [22, 0] },
  // hands hanging down, backs to the front
  Pralambam: { R: { at: [-24, 90, 0], ry: 180, rz: 180, f: all([8, 6, 4]), t: { ab: 12, op: 5, f: [4, 4] } } },
  // both fists, thumbs up
  Mushtikam: { R: { at: [-18, 0, 0], ry: 25, f: fist, t: { ab: 8, op: 25, f: [5, 10] } }, touch: { f: 'imrl', gap: 2 } },
  // the right hand on the back of the left, both pointing down, thumbs out like fins, forearms crossed
  Matsyam: { R: { at: [-6, 85, 6], ry: 180, rz: 168, t: { ab: 75, op: -10, f: [0, 0] } },
    L: { at: [-6, 85, -2], ry: 180, rz: 168, t: { ab: 75, op: -10, f: [0, 0] } } },
  // the tortoise, from the side: the left hand palm up below, the right palm down on top, both
  // pointing the same way; middle and ring fingers folded, the others out as head and feet
  Kurmam: { R: { at: [40, 44, 0], ry: -90, rz: 90, f: { i: [5, 5, 0], m: FOLD, r: FOLD, l: [5, 5, 0] }, s: { l: -15 },
    t: { ab: 50, op: 0, f: [0, 5] } },
    L: { at: [-40, 30, 0], ry: -90, rz: -90, f: { i: [5, 5, 0], m: FOLD, r: FOLD, l: [60, 70, 40] }, t: { ab: 50, op: 0, f: [0, 0] } },
    tilt: [25, 0] },
  // the boar: hands facing, the folded middle, ring and little fingers of each hooked into the other's
  Varaham: { R: { at: [-24, 0, 4], ry: 90, rz: -10, f: { i: [50, 60, 40], m: [80, 95, 60], r: [80, 95, 60], l: [80, 95, 60] },
    t: { ab: 0, op: -15, f: [10, 10] } },
    L: { at: [-24, 0, -4], ry: 90, rz: -10, f: { i: [50, 60, 40], m: [80, 95, 60], r: [80, 95, 60], l: [80, 95, 60] },
      t: { ab: 0, op: -15, f: [10, 10] } }, touch: { f: 'mrl', gap: -14 }, tilt: [15, 0] },
  // hands raised beside the head, palms to the front
  Simhakrantam: { R: { at: [-118, 128, 6], f: all([4, 4, 2]), t: { ab: 25, op: 10, f: [4, 4] } }, body: 1, cam: CAM_BODY },
  // hands raised upright beside the ears, palms turned towards the head
  Mahakrantam: { R: { at: [-64, 150, -16], ry: 80, f: all([5, 5, 2]), s: together, t: { ab: 5, op: 15, f: [5, 5] } }, body: 1, cam: CAM_BODY },
  // the right fist upright, its elbow resting on the left palm
  Mudgaram: { R: { at: [-6, 130, 10], ry: 30, f: fist, t: { ab: 8, op: 40, f: [10, 20] } },
    L: { at: [-16, -22, 10], ry: -90, rz: -90, f: all([10, 10, 5]), t: { ab: 30, op: 10, f: [5, 5] } }, cam: [0, 75, 320] },
  // the right hand raised, palm to the front, fingers like a tender shoot
  Pallavam: { R: { at: [-6, 0, 0], ry: 15, f: { i: [6, 10, 6], m: [8, 12, 6], r: [10, 14, 8], l: [12, 16, 10] }, s: { i: 3, m: 1, r: -1, l: -3 },
    t: { ab: 40, op: 10, f: [5, 5] } }, L: off },

  // ---- uttara mudras
  // the cow: hands hanging, fingers of the two hands crossed near their tips like the udder
  Surabhi: { cam: [0, 66, 190], R: { at: [-22, 110, 0], ry: 150, rz: 172, f: all([15, 10, 5]), s: { i: 4, m: 1, r: -2, l: -4 },
    t: { ab: 20, op: 30, f: [10, 10] } }, touch: { f: 'imrl', gap: -12 } },
  // seated: the right hand at the chest, index finger touching the thumb; the left hand on the knee
  Jnana: { R: { at: [-30, 40, 30], ry: 60, rz: 10, f: { i: [45, 55, 35], m: [0, 0, 0], r: [0, 5, 5], l: [0, 5, 5] }, t: { ab: 30, op: 45, f: [15, 15] } },
    L: { at: [-150, -185, 40], rx: 90, rz: 180, f: { i: [60, 70, 40], m: [10, 10, 5], r: [10, 10, 5], l: [10, 10, 5] }, t: { ab: 30, op: 50, f: [20, 20] } },
    body: 1, cam: CAM_SEATED },
  // seated: both hands on the knees, palms up, index fingers touching the thumbs
  Vairagya: { R: { at: [-150, -185, 40], rx: 90, rz: 180, f: { i: [60, 70, 40], m: [10, 10, 5], r: [10, 10, 5], l: [10, 10, 5] },
    t: { ab: 30, op: 50, f: [20, 20] } }, body: 1, cam: CAM_SEATED },
  // hands joined in a pointed arch, heels together: the middle fingers up and touching, the
  // others folded inside
  Yoni: { R: { at: [-9, 0, 0], ry: 100, rz: -8, w: [28, 0], f: { i: [60, 70, 40], m: [5, 5, 0], r: [50, 50, 30], l: [30, 30, 20] },
    t: { ab: 5, op: 10, f: [5, 5] } }, touch: { f: 'm' } },
  // the conch: the right fist round the left thumb, the left fingers folded over its back to the right thumb
  Sankha: { R: { at: [-14, 8, 6], ry: 180, rz: -80, w: [0, -50], f: fist, t: { ab: 0, op: -10, f: [0, 0] } },
    L: { at: [-8, 2, -6], ry: 110, rz: -20, w: [25, 0], f: all([20, 25, 15]), t: { ab: 10, op: 60, f: [20, 20] } } },
  // the lotus: hands side by side, heels together, palms cupped, fingers open like petals
  Pankaja: { R: { at: [-9, 0, 0], ry: 15, rz: 10, w: [0, -28], f: all([15, 18, 10]), s: { i: 10, m: 4, r: -4, l: -12 },
    t: { ab: 25, op: 25, f: [10, 10] } } },
  // fingers clasped, the right thumb upright
  Linga: { R: { at: [-12, 0, -3.5], ry: 95, rz: -30, f: all([85, 50, 20]), t: { ab: 0, op: -30, f: [0, 0] } },
    L: { at: [-12, -2, 3.5], ry: 95, rz: -30, f: all([85, 50, 20]), t: { ab: 30, op: 60, f: [30, 30] } }, tilt: [20, 0] },
  // wrists crossed, the hands pressed together, fingers up and meeting at the tips
  Nirvana: { R: { at: [7, 0, 4], ry: 70, rz: 12, w: [32, 0], f: all([6, 6, 4]), t: { ab: 0, op: -15, f: [5, 5] } },
    L: { at: [7, 0, -4], ry: 70, rz: 12, w: [32, 0], f: all([6, 6, 4]), t: { ab: 0, op: -15, f: [5, 5] } } },
};

// ---- the nyasas -------------------------------------------------------------------------------
// One drawing for each line of the Gayatri kara and anga nyasam (GAYATRI_NYASAM and NYASA_LINES in
// sandhya.js), in the style of the mudras. Kara nyasam: both hands open, palms to the front; each
// line colours the fingers it names, with an arrow from base to tip for the stroke of the thumb (the
// forefinger strokes the thumb at the first line); at the sixth, one hand shows its palm and the
// other its back, both coloured, turning over. Anga nyasam: the seated figure, the right hand at
// the place the line names, with a ring on it; astra circles the head with the right hand and
// claps on the left palm; the digbandham snaps the fingers round the head.
// Set from the step's own description of the acts, not traced from any picture.
const KARA = { R: { at: [-62, 0, 0], s: { i: 4, m: 1, r: -2, l: -5 }, t: { ab: 50, op: 5, f: [3, 3] } }, cam: [0, 42, 240] };
const REST_L = { at: [-150, -185, 40], rx: 90, rz: 180, f: all([10, 10, 5]), t: { ab: 30, op: 10, f: [5, 5] } };
const FLAT = { f: all([4, 4, 2]), s: together, t: { ab: 8, op: 15, f: [8, 8] } };
const CAM_NYASA = [0, 128, 460];                  // the seated figure from the chest up, room above the head
const CAM_CROWN = [0, 150, 470];                  // the same, with room for a ring round the crown
const CROWN = [0, 268, 64, 15];                   // that ring: centre x, y and its two radii
const anga = (R, more = {}) => ({ R: { ...FLAT, ...R }, L: REST_L, body: 1, cam: CAM_NYASA, ...more });
// The right hand raised beside the head, its fingertips at the ring's near end, thumb on the
// middle finger to snap at each direction: the digbandham before the japam.
const DIGBANDHA = anga({ at: [-84, 182, 10], rz: -8, f: { i: [10, 10, 5], m: [35, 45, 25], r: [92, 100, 65], l: [92, 100, 65] },
  s: { i: 0, m: 0, r: 0, l: 0 }, t: { ab: 20, op: 55, f: [20, 25] } }, { cam: CAM_CROWN });
export const NYASA_POSES = {
  angushtha: KARA, tarjani: KARA, madhyama: KARA, anamika: KARA, kanishthika: KARA,
  // the right hand shows its palm, the left its back
  karatala: { ...KARA, L: { ...KARA.R, ry: 180 } },
  // the right palm flat on the heart, fingers towards the left shoulder
  hridaya: anga({ at: [-30, -22, 40], ry: 180, rz: -35 }),
  // the fingertips on the forehead, below the hair line
  siras: anga({ at: [-62, 158, 40], ry: 180, rz: -36 }),
  // the fingertips on the sikha at the crown
  sikha: anga({ at: [-70, 205, 20], ry: 180, rz: -50 }),
  // arms crossed, each hand on the other shoulder
  kavacha: anga({ at: [25, 40, 50], ry: 180, rz: -45 }, { L: { ...FLAT, at: [25, 40, 40], ry: 180, rz: -45 } }),
  // forefinger, middle and ring fingers on the right eye, the point between the brows and the left eye
  netra: anga({ at: [5, 126, 60], ry: 180, f: { i: [2, 2, 0], m: [2, 2, 0], r: [2, 2, 0], l: [92, 100, 65] },
    s: { i: 13, m: 0, r: -13, l: -10 }, t: { ab: 10, op: 45, f: [30, 30] } }),
  // the right hand raised beside the head to circle it (forefinger and middle finger out); the
  // left palm held flat for the clap
  astra: anga({ at: [-84, 182, 6], rz: -8, f: { i: [2, 2, 0], m: [2, 2, 0], r: [92, 100, 65], l: [92, 100, 65] }, t: { ab: 20, op: 40, f: [20, 20] } },
    { L: { at: [-34, 22, 40], rx: -90, ry: -90, f: all([4, 4, 2]), s: together, t: { ab: 10, op: 5, f: [5, 5] } }, cam: CAM_CROWN }),
  digbandha: DIGBANDHA,
};
// What each line touches (part names: R or L, then t thumb, i m r l fingers, palm) and its marks.
export const NYASA_CUES = {
  angushtha: { hl: ['Rt', 'Lt'], stroke: ['Rt', 'Lt'] },
  tarjani: { hl: ['Ri', 'Li'], stroke: ['Ri', 'Li'] },
  madhyama: { hl: ['Rm', 'Lm'], stroke: ['Rm', 'Lm'] },
  anamika: { hl: ['Rr', 'Lr'], stroke: ['Rr', 'Lr'] },
  kanishthika: { hl: ['Rl', 'Ll'], stroke: ['Rl', 'Ll'] },
  karatala: { hl: ['Rpalm', 'Lpalm'], twists: [[-62, 2, 18, 5], [62, 2, 18, 5, true]] },
  hridaya: { rings: [[14, 48, 16]] },
  siras: { rings: [[0, 238, 15]] },
  sikha: { rings: [[0, 258, 12]] },
  kavacha: { rings: [[-100, 106, 18], [100, 106, 18]] },
  netra: { rings: [[-15, 210, 7], [0, 223, 6], [15, 210, 7]] },
  astra: { orbit: CROWN, clap: [-4, 40] },
  digbandha: { orbit: CROWN, dotted: true, snaps: 4 },
};
