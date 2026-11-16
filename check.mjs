// check.mjs — compares engine output with drikpanchang.com values (Bengaluru), and smoke-tests the month view.
import { panchang, monthDays, sankalpam, srisailamDirection, NAMES, jdFromDate, dateFromJd } from './engine.js';
import { skyPhase } from './sandhya.js';
const BLR = { name: 'Bengaluru', lat: 12.9716, lon: 77.5946, tz: 5.5 };
const t = (jd) => dateFromJd(jd).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
for (const [y, m, d] of [[2026, 11, 13], [2026, 3, 20]]) {
  const p = panchang(y, m, d, BLR);
  console.log(`\n== ${y}-${m}-${d} ${NAMES.vara[p.vara]} | ${NAMES.masa[p.masa.index]} ${p.tithi[0].paksha} | ${p.samvatsara} ${p.shaka} | ${NAMES.ritu[p.ritu]} ${p.ayana} | marks ${p.marks}`);
  console.log('rise/set', t(p.sunrise), t(p.sunset));
  for (const k of ['tithi', 'nakshatra', 'yoga', 'karana']) console.log(k.padEnd(9), p[k].map((s) => `${s.name}→${t(s.end)}`).join(' | '));
  console.log('rahu', t(p.rahu.start), t(p.rahu.end), 'gulika', t(p.gulika.start), 'yama', t(p.yamagandam.start), 'abhijit', t(p.abhijit.start), t(p.abhijit.end));
}
const t0 = performance.now();
const { month, days } = monthDays(jdFromDate(new Date('2026-11-13T06:00:00Z')), BLR);
console.log(`\nmonth ${NAMES.masa[month.index]} adhika=${month.adhika}: ${days.length} days, ${Math.round(performance.now() - t0)} ms`);
console.log(days.map((p) => `${p.date.d}/${p.date.m}:${p.tithi[0].name}${p.marks.length ? '[' + p.marks.map((m) => m.name).join(', ') + ']' : ''}`).join(' '));
for (const c of [['Bengaluru', 12.97, 77.59], ['Hyderabad', 17.385, 78.4867], ['Vijayawada', 16.506, 80.648], ['Tirupati', 13.63, 79.42]])
  console.log(c[0], srisailamDirection(c[1], c[2]));
const p = panchang(2026, 11, 13, BLR);
console.log('\n' + sankalpam(p, p.sunrise + 0.1, BLR).map((x) => (typeof x === 'string' ? x : `[${x.v}]`)).join(''));

// The page's sky (skyPhase): dawn before sunrise, day at noon, dusk at sunset, night late and early.
const sky = (jd) => skyPhase(jd, p).phase;
const skyWant = [[p.sunrise - 30 / 1440, 'dawn'], [p.sunrise + 60 / 1440, 'dawn'], [(p.sunrise + p.sunset) / 2, 'day'],
  [p.sunset, 'dusk'], [p.sunset + 0.25, 'night'], [p.sunrise - 0.2, 'night']];
const skyBad = skyWant.filter(([jd, ph]) => sky(jd) !== ph);
if (skyBad.length) { console.error('FAIL skyPhase:', skyBad.map(([jd, ph]) => `${t(jd)} wanted ${ph}, got ${sky(jd)}`).join('; ')); process.exit(1); }
console.log('\nsky phases ok: dawn, day, dusk and night fall where they should');
