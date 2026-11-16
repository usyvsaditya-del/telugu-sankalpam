// check.mjs — compares engine output with drikpanchang.com values (Bengaluru), and smoke-tests the month view.
import { panchang, monthDays, sankalpam, srisailamDirection, NAMES, jdFromDate, dateFromJd } from './engine.js';
import { skyPhase, sandhyaGrade } from './sandhya.js';
import { sunAltitude } from './engine.js';
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

// The page's sky (skyPhase) and the sandhya grades (sandhyaGrade), from the sun's altitude.
const alt = (jd) => sunAltitude(jd, BLR.lat, BLR.lon), noon = (p.sunrise + p.sunset) / 2;
const sky = (jd) => skyPhase(alt(jd), jd < noon);
const want = [
  [sky(p.sunrise - 96 / 1440), 'night', 'sky 96 min before sunrise (stars out)'], [sky(p.sunrise - 10 / 1440), 'dawn', 'sky 10 min before sunrise'],
  [sky(p.sunrise + 20 / 1440), 'dawn', 'sky 20 min after sunrise'], [sky(noon), 'day', 'sky at noon'], [sky(p.sunset), 'dusk', 'sky at sunset'],
  [sky(p.sunset + 60 / 1440), 'night', 'sky an hour after sunset'],
  [sandhyaGrade('pratah', alt(p.sunrise - 90 / 1440)), 'uttama', 'Pratah 90 min before sunrise'],
  [sandhyaGrade('pratah', alt(p.sunrise - 10 / 1440)), 'madhyama', 'Pratah 10 min before sunrise'],
  [sandhyaGrade('pratah', alt(p.sunrise + 5 / 1440)), 'adhama', 'Pratah 5 min after sunrise'],
  [sandhyaGrade('sayam', alt(p.sunset - 30 / 1440)), 'uttama', 'Sayam 30 min before sunset'],
  [sandhyaGrade('sayam', alt(p.sunset + 10 / 1440)), 'madhyama', 'Sayam 10 min after sunset'],
  [sandhyaGrade('sayam', alt(p.sunset + 70 / 1440)), 'adhama', 'Sayam 70 min after sunset'],
  [sandhyaGrade('madhyahnika', alt(noon)), null, 'Madhyahnikam has no grade'],
];
const bad = want.filter(([got, w]) => got !== w);
if (bad.length) { console.error('FAIL sky/grade:', bad.map(([got, w, what]) => `${what}: wanted ${w}, got ${got}`).join('; ')); process.exit(1); }
console.log(`\nsky phases and sandhya grades ok (${want.length} cases)`);
