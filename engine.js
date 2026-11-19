// engine.js — Drik-ganita panchangam for any place, Telugu (amanta lunar) usage, English text.
// Pure functions, no DOM: the page inlines this file (build.sh strips the `export`s).
//
// Sun: VSOP87 as abridged by Meeus (~1″). Moon: Meeus ch. 47 (longitude ~10″, latitude ~4″).
// Sidereal = apparent longitude (with nutation) − mean Lahiri ayanamsa, the convention that
// reproduces drikpanchang.com: 24 sankranti moments of 2026–27 agree to ±0.4 min (1 sd), and
// sunrise/sunset, tithi, nakshatra, yoga, karana end times and kalams agree within 2 min on 18
// day pages across Bengaluru, Hyderabad, Chennai, Varanasi and Tirupati.
// Times are Julian Days (UT) internally; the page formats them in the place's zone.

const D2R = Math.PI / 180;
const norm = (x) => ((x % 360) + 360) % 360;
const sinD = (x) => Math.sin(x * D2R);
const cosD = (x) => Math.cos(x * D2R);

const DELTA_T_DAYS = 69.5 / 86400; // TT − UT, good to a second or two for 2020–2030

export const jdFromDate = (d) => d.getTime() / 86400000 + 2440587.5;
export const dateFromJd = (jd) => new Date((jd - 2440587.5) * 86400000);

// ---------- time zones ----------
// Indian places carry a fixed tz (5.5). Places abroad carry an IANA zone ("America/New_York"),
// whose offset changes with summer time; the browser's own zone database gives it for any instant.
const zoneFormatters = {};
export function zoneOffset(zone, jd) {
  const d = dateFromJd(jd), ms = Math.floor(d.getTime() / 1000) * 1000;
  const f = (zoneFormatters[zone] ??= new Intl.DateTimeFormat('en-US', { timeZone: zone, hourCycle: 'h23',
    year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }));
  const p = Object.fromEntries(f.formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
  return (Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second) - ms) / 3600000;
}
// Hours ahead of UTC at a place at a given instant.
export const tzAt = (place, jd) => (place.zone ? zoneOffset(place.zone, jd) : place.tz);

// ---------- Sun ----------
// Earth's heliocentric longitude, VSOP87 (Meeus Appendix III): [A, B, C] = A·cos(B + C·τ),
// in 1e-8 rad, τ in Julian millennia from J2000.
const VSOP_L = [
  [[175347046,0,0],[3341656,4.6692568,6283.07585],[34894,4.6261,12566.1517],[3497,2.7441,5753.3849],
   [3418,2.8289,3.5231],[3136,3.6277,77713.7715],[2676,4.4181,7860.4194],[2343,6.1352,3930.2097],
   [1324,0.7425,11506.7698],[1273,2.0371,529.691],[1199,1.1096,1577.3435],[990,5.233,5884.927],
   [902,2.045,26.298],[857,3.508,398.149],[780,1.179,5223.694],[753,2.533,5507.553],[505,4.583,18849.228],
   [492,4.205,775.523],[357,2.92,0.067],[317,5.849,11790.629],[284,1.899,796.298],[271,0.315,10977.079],
   [243,0.345,5486.778],[206,4.806,2544.314],[205,1.869,5573.143],[202,2.458,6069.777],[156,0.833,213.299],
   [132,3.411,2942.463],[126,1.083,20.775],[115,0.645,0.98],[103,0.636,4694.003],[102,0.976,15720.839],
   [102,4.267,7.114],[99,6.21,2146.17],[98,0.68,155.42],[86,5.98,161000.69],[85,1.3,6275.96],
   [85,3.67,71430.7],[80,1.81,17260.15],[79,3.04,12036.46],[75,1.76,5088.63],[74,3.5,3154.69],
   [74,4.68,801.82],[70,0.83,9437.76],[62,3.98,8827.39],[61,1.82,7084.9],[57,2.78,6286.6],
   [56,4.39,14143.5],[56,3.47,6279.55],[52,0.19,12139.55],[52,1.33,1748.02],[51,0.28,5856.48],
   [49,0.49,1194.45],[41,5.37,8429.24],[41,2.4,19651.05],[39,6.17,10447.39],[37,6.04,10213.29],
   [37,2.57,1059.38],[36,1.71,2352.87],[36,1.78,6812.77],[33,0.59,17789.85],[30,0.44,83996.85],
   [30,2.74,1349.87],[25,3.16,4690.48]],
  [[628331966747,0,0],[206059,2.678235,6283.07585],[4303,2.6351,12566.1517],[425,1.59,3.523],
   [119,5.796,26.298],[109,2.966,1577.344],[93,2.59,18849.23],[72,1.14,529.69],[68,1.87,398.15],
   [67,4.41,5507.55],[59,2.89,5223.69],[56,2.17,155.42],[45,0.4,796.3],[36,0.47,775.52],[29,2.65,7.11],
   [21,5.34,0.98],[19,1.85,5486.78],[19,4.97,213.3],[17,2.99,6275.96],[16,0.03,2544.31],[16,1.43,2146.17],
   [15,1.21,10977.08],[12,2.83,1748.02],[12,3.26,5088.63],[12,5.27,1194.45],[12,2.08,4694],
   [11,0.77,553.57],[10,1.3,6286.6],[10,4.24,1349.87],[9,2.7,242.73],[9,5.64,951.72],[8,5.3,2352.87],
   [6,2.65,9437.76],[6,4.67,4690.48]],
  [[52919,0,0],[8720,1.0721,6283.0758],[309,0.867,12566.152],[27,0.05,3.52],[16,5.19,26.3],
   [16,3.68,155.42],[10,0.76,18849.23],[9,2.06,77713.77],[7,0.83,775.52],[5,4.66,1577.34],[4,1.03,7.11],
   [4,3.44,5573.14],[3,5.14,796.3],[3,6.05,5507.55],[3,1.19,242.73],[3,6.12,529.69],[3,0.31,398.15],
   [3,2.28,553.57],[2,4.38,5223.69],[2,3.75,0.98]],
  [[289,5.844,6283.076],[35,0,0],[17,5.49,12566.15],[3,5.2,155.42],[1,4.72,3.52],[1,5.3,18849.23],[1,5.97,242.73]],
  [[114,3.142,0],[8,4.13,6283.08],[1,3.84,12566.15]],
  [[1,3.14,0]],
];

// Sun's geocentric longitude, mean equinox of date, with aberration (no nutation).
export function sunLongitude(jdUT) {
  const tau = (jdUT + DELTA_T_DAYS - 2451545) / 365250;
  let L = 0, tp = 1;
  for (const series of VSOP_L) {
    let s = 0;
    for (const [A, B, C] of series) s += A * Math.cos(B + C * tau);
    L += s * tp; tp *= tau;
  }
  const M = 357.5291092 + 35999.0502909 * tau * 10;
  const R = 1.000140 - 0.016708 * cosD(M) - 0.000139 * cosD(2 * M); // Earth–Sun distance, AU
  return norm((L / 1e8) / D2R + 180 - 0.09033 / 3600 - 20.4898 / 3600 / R);
}

// Nutation in longitude (degrees), main terms (~0.5″).
export function nutation(jdUT) {
  const T = (jdUT + DELTA_T_DAYS - 2451545) / 36525;
  const Om = 125.04452 - 1934.136261 * T, L = 280.4665 + 36000.7698 * T, Lp = 218.3165 + 481267.8813 * T;
  return (-17.2 * sinD(Om) - 1.32 * sinD(2 * L) - 0.23 * sinD(2 * Lp) + 0.21 * sinD(2 * Om)) / 3600;
}

// ---------- Moon ----------
// [D, M, M', F, coefficient ×1e-6 deg] — Meeus table 47.A (longitude)
const MOON_LON = [
  [0,0,1,0,6288774],[2,0,-1,0,1274027],[2,0,0,0,658314],[0,0,2,0,213618],[0,1,0,0,-185116],
  [0,0,0,2,-114332],[2,0,-2,0,58793],[2,-1,-1,0,57066],[2,0,1,0,53322],[2,-1,0,0,45758],
  [0,1,-1,0,-40923],[1,0,0,0,-34720],[0,1,1,0,-30383],[2,0,0,-2,15327],[0,0,1,2,-12528],
  [0,0,1,-2,10980],[4,0,-1,0,10675],[0,0,3,0,10034],[4,0,-2,0,8548],[2,1,-1,0,-7888],
  [2,1,0,0,-6766],[1,0,-1,0,-5163],[1,1,0,0,4987],[2,-1,1,0,4036],[2,0,2,0,3994],
  [4,0,0,0,3861],[2,0,-3,0,3665],[0,1,-2,0,-2689],[2,0,-1,2,-2602],[2,-1,-2,0,2390],
  [1,0,1,0,-2348],[2,-2,0,0,2236],[0,1,2,0,-2120],[0,2,0,0,-2069],[2,-2,-1,0,2048],
  [2,0,1,-2,-1773],[2,0,0,2,-1595],[4,-1,-1,0,1215],[0,0,2,2,-1110],[3,0,-1,0,-892],
  [2,1,1,0,-810],[4,-1,-2,0,759],[0,2,-1,0,-713],[2,2,-1,0,-700],[2,1,-2,0,691],
  [2,-1,0,-2,596],[4,0,1,0,549],[0,0,4,0,537],[4,-1,0,0,520],[1,0,-2,0,-487],
  [2,1,0,-2,-399],[0,0,2,-2,-381],[1,1,1,0,351],[3,0,-2,0,-340],[4,0,-3,0,330],
  [2,-1,2,0,327],[0,2,1,0,-323],[1,1,-1,0,299],[2,0,3,0,294],
];
// Meeus table 47.B (latitude), largest terms
const MOON_LAT = [
  [0,0,0,1,5128122],[0,0,1,1,280602],[0,0,1,-1,277693],[2,0,0,-1,173237],[2,0,-1,1,55413],
  [2,0,-1,-1,46271],[2,0,0,1,32573],[0,0,2,1,17198],[2,0,1,-1,9266],[0,0,2,-1,8822],
  [2,-1,0,-1,8216],[2,0,-2,-1,4324],[2,0,1,1,4200],[2,1,0,-1,-3359],[2,-1,-1,1,2463],
  [2,-1,0,1,2211],[2,-1,-1,-1,2065],[0,1,-1,-1,-1870],[4,0,-1,-1,1828],[0,1,0,1,-1794],
  [0,0,0,3,-1749],[0,1,-1,1,-1565],[1,0,0,1,-1491],[0,1,1,1,-1475],[0,1,1,-1,-1410],
  [0,1,0,-1,-1344],[1,0,0,-1,-1335],[0,0,3,1,1107],[4,0,0,-1,1021],[4,0,-1,1,833],
];

function moonArgs(jdUT) {
  const T = (jdUT + DELTA_T_DAYS - 2451545) / 36525;
  const T2 = T * T, T3 = T2 * T, T4 = T3 * T;
  return {
    T,
    Lp: 218.3164477 + 481267.88123421 * T - 0.0015786 * T2 + T3 / 538841 - T4 / 65194000,
    D: 297.8501921 + 445267.1114034 * T - 0.0018819 * T2 + T3 / 545868 - T4 / 113065000,
    M: 357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + T3 / 24490000,
    Mp: 134.9633964 + 477198.8675055 * T + 0.0087414 * T2 + T3 / 69699 - T4 / 14712000,
    F: 93.272095 + 483202.0175233 * T - 0.0036539 * T2 - T3 / 3526000 + T4 / 863310000,
    E: 1 - 0.002516 * T - 0.0000074 * T2,
  };
}
const series = (terms, a, fn) => {
  let s = 0;
  for (const [d, m, mp, f, c] of terms) {
    const e = m === 0 ? 1 : Math.abs(m) === 1 ? a.E : a.E * a.E;
    s += c * e * fn(d * a.D + m * a.M + mp * a.Mp + f * a.F);
  }
  return s;
};

// Moon's geocentric longitude, mean equinox of date (no nutation).
export function moonLongitude(jdUT) {
  const a = moonArgs(jdUT);
  const A1 = 119.75 + 131.849 * a.T, A2 = 53.09 + 479264.29 * a.T;
  const s = series(MOON_LON, a, sinD) + 3958 * sinD(A1) + 1962 * sinD(a.Lp - a.F) + 318 * sinD(A2);
  return norm(a.Lp + s / 1e6);
}
// Moon's ecliptic latitude (degrees).
export function moonLatitude(jdUT) {
  const a = moonArgs(jdUT);
  const A1 = 119.75 + 131.849 * a.T, A3 = 313.45 + 481266.484 * a.T;
  const s = series(MOON_LAT, a, sinD) - 2235 * sinD(a.Lp) + 382 * sinD(A3) + 175 * sinD(A1 - a.F)
    + 175 * sinD(A1 + a.F) + 127 * sinD(a.Lp - a.Mp) - 115 * sinD(a.Lp + a.Mp);
  return s / 1e6;
}

// ---------- sidereal positions ----------
// Mean Lahiri ayanamsa: 23.857° + 22.46″ at J2000 (the 22.46″ is fitted to drikpanchang's
// sankranti moments), advancing with general precession (50.29″/yr).
export const ayanamsa = (jdUT) => 23.857 + 22.46 / 3600 + ((jdUT - 2451545) / 36525) * (5029.0966 / 3600);
export const siderealSun = (jd) => norm(sunLongitude(jd) + nutation(jd) - ayanamsa(jd));
export const siderealMoon = (jd) => norm(moonLongitude(jd) + nutation(jd) - ayanamsa(jd));
export const elongation = (jd) => norm(moonLongitude(jd) - sunLongitude(jd));

// ---------- rising and setting ----------
const OBLIQUITY = (jd) => 23.439291 - 0.0130042 * ((jd - 2451545) / 36525);
function altitude(jdUT, lat, lon, eclLon, eclLat) {
  const eps = OBLIQUITY(jdUT);
  const ra = Math.atan2(sinD(eclLon) * cosD(eps) - Math.tan(eclLat * D2R) * sinD(eps), cosD(eclLon)) / D2R;
  const dec = Math.asin(sinD(eclLat) * cosD(eps) + cosD(eclLat) * sinD(eps) * sinD(eclLon)) / D2R;
  const gmst = norm(280.46061837 + 360.98564736629 * (jdUT - 2451545));
  return Math.asin(sinD(lat) * sinD(dec) + cosD(lat) * cosD(dec) * cosD(gmst + lon - ra)) / D2R;
}
// The sun's geometric altitude in degrees (no refraction) at a place: the page's sky and the
// sandhya grade (stars out, faded, sun up) are drawn from it.
export const sunAltitude = (jd, lat, lon) => altitude(jd, lat, lon, sunLongitude(jd) + nutation(jd), 0);
const moonAltitude = (jd, lat, lon) => altitude(jd, lat, lon, moonLongitude(jd) + nutation(jd), moonLatitude(jd));

function bisect(f, a, b, iters = 40) {
  let fa = f(a);
  for (let i = 0; i < iters; i++) {
    const m = (a + b) / 2, fm = f(m);
    if ((fa < 0) === (fm < 0)) { a = m; fa = fm; } else b = m;
  }
  return (a + b) / 2;
}

// Sunrise/sunset for the civil date (y, m, d) at a place.
// −0.833° = upper limb on the horizon with standard refraction (what drikpanchang uses).
export function sunTimes(y, m, d, place) {
  const { lat, lon } = place;
  const utcMidnight = jdFromDate(new Date(Date.UTC(y, m - 1, d)));
  const tz = tzAt(place, utcMidnight + 0.5 - lon / 360); // the zone's offset around local noon
  const jd0 = utcMidnight - tz / 24;
  const noon = jd0 + (12 - lon / 15 + tz) / 24;
  const f = (jd) => sunAltitude(jd, lat, lon) + 0.833;
  return { rise: bisect(f, noon - 0.5, noon), set: bisect((jd) => -f(jd), noon, noon + 0.5) };
}

// Moonrise or moonset within [a, b] (JD), or null. drikpanchang times these by the Moon's centre
// crossing the true horizon as seen from the place, without refraction: a geocentric altitude of
// about +0.95° (the Moon's parallax). Ten sample rises and sets agree within 1 min.
export function moonEvent(a, b, place, rising = true) {
  const f = (jd) => (moonAltitude(jd, place.lat, place.lon) - 0.95) * (rising ? 1 : -1);
  const step = 1 / 72; // 20 minutes
  let prev = f(a);
  for (let t = a + step; t <= b + 1e-9; t += step) {
    const cur = f(Math.min(t, b));
    if (prev < 0 && cur >= 0) return bisect(f, t - step, Math.min(t, b), 30);
    prev = cur;
  }
  return null;
}

// ---------- angular-quantity transitions ----------
function nextCrossing(fn, jd, target, ratePerDay) {
  const diff = (j) => ((fn(j) - target + 540) % 360) - 180;
  const guess = jd + norm(target - fn(jd)) / ratePerDay;
  return bisect(diff, Math.max(jd, guess - 1.5), guess + 1.5, 45);
}

const tithiFn = (jd) => elongation(jd);
const nakFn = (jd) => siderealMoon(jd);
const yogaFn = (jd) => norm(siderealMoon(jd) + siderealSun(jd));
const tithiAt = (jd) => Math.floor(elongation(jd) / 12);

function segments(fn, span, rate, jdStart, jdEnd) {
  const out = [];
  const n = Math.round(360 / span);
  let jd = jdStart;
  let idx = Math.floor(fn(jd) / span);
  while (jd < jdEnd) {
    const end = nextCrossing(fn, jd, ((idx + 1) % n) * span, rate);
    out.push({ index: idx, start: jd, end });
    jd = end + 1e-7;
    idx = (idx + 1) % n;
  }
  return out;
}

// ---------- names (Telugu usage, English spelling) ----------
export const NAMES = {
  tithi: ['Padyami','Vidiya','Thadiya','Chavithi','Panchami','Shashti','Saptami','Ashtami',
    'Navami','Dasami','Ekadasi','Dwadasi','Trayodasi','Chaturdasi','Pournami'],
  // Sanskrit forms, as spoken in the sankalpam
  tithiSankalpa: ['Prathamayam','Dwitiyayam','Tritiyayam','Chaturthyam','Panchamyam','Shashtyam',
    'Saptamyam','Ashtamyam','Navamyam','Dasamyam','Ekadasyam','Dwadasyam','Trayodasyam',
    'Chaturdasyam','Pournamasyam'],
  nakshatra: ['Aswini','Bharani','Krittika','Rohini','Mrigasira','Arudra','Punarvasu','Pushyami',
    'Aslesha','Makha','Pubba','Uttara','Hasta','Chitta','Swati','Visakha','Anuradha','Jyeshta',
    'Moola','Purvashadha','Uttarashadha','Sravanam','Dhanishta','Satabhisham','Purvabhadra',
    'Uttarabhadra','Revati'],
  nakshatraSankalpa: ['Aswini','Bharani','Krittika','Rohini','Mrigasira','Ardra','Punarvasu','Pushya',
    'Aslesha','Magha','Purvaphalguni','Uttaraphalguni','Hasta','Chitra','Swati','Visakha','Anuradha',
    'Jyeshtha','Mula','Purvashadha','Uttarashadha','Sravana','Dhanishtha','Satabhisha',
    'Purvabhadrapada','Uttarabhadrapada','Revati'],
  yoga: ['Vishkambha','Priti','Ayushman','Saubhagya','Sobhana','Atiganda','Sukarma','Dhriti',
    'Soola','Ganda','Vriddhi','Dhruva','Vyaghata','Harshana','Vajra','Siddhi','Vyatipata',
    'Variyan','Parigha','Siva','Siddha','Sadhya','Subha','Sukla','Brahma','Indra','Vaidhriti'],
  karanaMoving: ['Bava','Balava','Kaulava','Taitila','Garaja','Vanija','Vishti'],
  vara: ['Aadivaram','Somavaram','Mangalavaram','Budhavaram','Guruvaram','Sukravaram','Sanivaram'],
  varaShort: ['Aadi','Soma','Mangala','Budha','Guru','Sukra','Sani'],
  // The sankalpam's names of the days, by their lords. Thursday is Brihaspati, as the site's
  // owner's family says it (19 Nov 2026); it was Guru.
  varaSankalpa: ['Bhanu','Indu','Bhauma','Saumya','Brihaspati','Bhrigu','Sthira'],
  masa: ['Chaitram','Vaisakham','Jyeshtam','Ashadham','Sravanam','Bhadrapadam','Aswayujam',
    'Karthikam','Margasiram','Pushyam','Magham','Phalgunam'],
  masaSankalpa: ['Chaitra','Vaisakha','Jyeshta','Ashadha','Sravana','Bhadrapada','Aswayuja',
    'Karthika','Margasira','Pushya','Magha','Phalguna'],
  rashi: ['Mesha','Vrishabha','Mithuna','Karkataka','Simha','Kanya','Tula','Vrischika','Dhanus',
    'Makara','Kumbha','Meena'],
  ritu: ['Vasanta','Greeshma','Varsha','Sarad','Hemanta','Sisira'],
  samvatsara: ['Prabhava','Vibhava','Sukla','Pramoda','Prajapati','Angirasa','Srimukha','Bhava',
    'Yuva','Dhatu','Eswara','Bahudhanya','Pramadhi','Vikrama','Vrisha','Chitrabhanu','Swabhanu',
    'Tarana','Parthiva','Vyaya','Sarvajit','Sarvadhari','Virodhi','Vikruti','Khara','Nandana',
    'Vijaya','Jaya','Manmadha','Durmukhi','Hevilambi','Vilambi','Vikari','Sarvari','Plava',
    'Subhakrut','Sobhakrut','Krodhi','Viswavasu','Parabhava','Plavanga','Keelaka','Saumya',
    'Sadharana','Virodhikrut','Paridhavi','Pramadeecha','Ananda','Rakshasa','Nala','Pingala',
    'Kalayukti','Siddharthi','Raudri','Durmati','Dundubhi','Rudhirodgari','Raktakshi','Krodhana',
    'Akshaya'],
};

export const tithiName = (i) => (i === 29 ? 'Amavasya' : NAMES.tithi[i % 15]);
export const tithiSankalpa = (i) => (i === 29 ? 'Amavasyayam' : NAMES.tithiSankalpa[i % 15]);
export const pakshaName = (i) => (i < 15 ? 'Sukla' : 'Bahula');

// k = 0..59 (half-tithis). The fixed karanas in Telugu usage, and their Sanskrit forms.
export function karanaName(k, sanskrit = false) {
  if (k === 0) return 'Kimstughna';
  if (k >= 57) return (sanskrit ? ['Sakuni', 'Chatushpada', 'Naga'] : ['Sakuni', 'Chatushpada', 'Nagavam'])[k - 57];
  return NAMES.karanaMoving[(k - 1) % 7];
}

// Rahu / Yamagandam / Gulika: which eighth of the daytime, by weekday (Sun=0).
const RAHU = [8, 2, 7, 5, 6, 4, 3], YAMA = [5, 4, 3, 2, 1, 7, 6], GULIKA = [7, 6, 5, 4, 3, 2, 1];

// Amanta lunar month: named from the sun's sidereal sign at the new moon that starts it.
export function lunarMonth(jd) {
  const back = jd - elongation(jd) / 12.19;               // rough previous new moon
  let start = nextCrossing(tithiFn, back - 2, 0, 12.19);
  if (start > jd) start = nextCrossing(tithiFn, start - 32, 0, 12.19);
  const end = nextCrossing(tithiFn, start + 25, 0, 12.19);
  const s1 = Math.floor(siderealSun(start) / 30), s2 = Math.floor(siderealSun(end) / 30);
  return { index: (s1 + 1) % 12, adhika: s1 === s2, start, end };
}

// The year's reckoning at a moment: Shaka year and samvatsara turn at Ugadi (Chaitra Sukla
// Padyami), so they come from the lunar month, not the Gregorian date. Stepping back `index`
// months from this month's start lands within a month of Ugadi, whose Gregorian year it shares.
export function kalaAt(jd) {
  const month = lunarMonth(jd);
  const ugadiYear = dateFromJd(month.start - month.index * 29.53).getUTCFullYear();
  const shaka = ugadiYear - 78;
  const ss = siderealSun(jd);
  return {
    month, shaka, samvatsara: NAMES.samvatsara[(shaka + 11) % 60], ritu: Math.floor(month.index / 2),
    ayana: ss >= 270 || ss < 90 ? 'Uttarayanam' : 'Dakshinayanam',
  };
}

// Angas prevailing at one moment (used for "now" and the sankalpam).
export function angasAt(jd) {
  const e = elongation(jd), ms = siderealMoon(jd), ss = siderealSun(jd);
  return {
    tithi: Math.floor(e / 12), nakshatra: Math.floor(ms / (360 / 27)), yoga: Math.floor(norm(ms + ss) / (360 / 27)),
    karana: Math.floor(e / 6), moonRashi: Math.floor(ms / 30), sunRashi: Math.floor(ss / 30),
  };
}

// ---------- vrata days ----------
// OBSERVANCE NOTE: rules commonly used by computed panchangams. Families following a matha's
// panchangam (Smarta vs Vaishnava Ekadasi, Madhva rules) may keep some on a different day.
// d = the day's sun times; prev/next = neighbouring days' sunrise and sunset; tithis = segments.
function observances(d, prev, next, tithis, place) {
  const marks = [];
  const t0 = tithis[0].index;
  const kshaya = (i) => tithis.some((s) => s.index === i && s.start > d.rise + 1e-6 && s.end < d.nextRise);
  const atSunriseOrKshaya = (i) => t0 === i || kshaya(i);

  // Ekadasi: on the day it holds at sunrise; if it holds at two sunrises, Smartas keep the first
  // and Vaishnavas the second; if it holds at none (kshaya), on the day it runs.
  for (const i of [10, 25]) {
    if (t0 === i) {
      if (tithiAt(prev.rise) === i) marks.push({ name: 'Ekadasi (Vaishnava)' });
      else if (tithiAt(d.nextRise) === i) marks.push({ name: 'Ekadasi (Smarta)' });
      else marks.push({ name: 'Ekadasi' });
    } else if (kshaya(i)) marks.push({ name: 'Ekadasi' });
  }
  // Pournami / Amavasya: the first day it holds at sunrise, or the day it runs when kshaya.
  const firstOrKshaya = (i) => (t0 === i && tithiAt(prev.rise) !== i) || kshaya(i);
  if (firstOrKshaya(14)) marks.push({ name: 'Pournami' });
  if (firstOrKshaya(29)) marks.push({ name: 'Amavasya' });

  // Pradosham: Trayodasi during pradosha kala (sunset to 6 ghatikas after); the first such day.
  const inPradosha = (set) => [0, 0.25, 0.5, 0.75, 1].some((k) => [12, 27].includes(tithiAt(set + k * 0.1)));
  if (inPradosha(d.set) && !inPradosha(prev.set)) marks.push({ name: 'Pradosham' });

  // Masa Sivaratri: Bahula Chaturdasi at nishita (the middle of the night).
  if (tithiAt((d.set + d.nextRise) / 2) === 28) marks.push({ name: 'Masa Sivaratri' });

  // Sankatahara Chavithi: Bahula Chavithi at moonrise, the first such evening. When Chavithi
  // misses every moonrise, the day it holds at sunrise (or runs, if kshaya) — as drikpanchang does.
  const chavithiAtMoonrise = (set, nextRise) => {
    const mr = moonEvent(set - 2 / 24, nextRise, place, true);
    return mr != null && tithiAt(mr) === 18;
  };
  if ([17, 18, 19].includes(tithiAt(d.set)) || t0 === 18) {
    const today = chavithiAtMoonrise(d.set, d.nextRise), before = chavithiAtMoonrise(prev.set, d.rise);
    if ((today && !before) || (!today && !before && (t0 === 18 || kshaya(18)))) marks.push({ name: 'Sankatahara Chavithi' });
  }

  // Sankramanam: the Sun enters a new rashi between the previous sunset and this sunset
  // (a transit at night is observed on the following day).
  const s1 = Math.floor(siderealSun(prev.set) / 30), s2 = Math.floor(siderealSun(d.set) / 30);
  if (s1 !== s2) {
    const at = bisect((jd) => (((siderealSun(jd) - s2 * 30 + 540) % 360) - 180), prev.set, d.set, 40);
    marks.push({ name: `${NAMES.rashi[s2]} Sankramanam`, at });
  }
  return marks;
}

// ---------- the day ----------
// Full panchangam for a civil date at a place. place = { name, lat, lon, tz | zone, ... }.
export function panchang(y, m, d, place) {
  const civ = (k) => { const t = new Date(Date.UTC(y, m - 1, d + k)); return [t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate()]; };
  const { rise, set } = sunTimes(y, m, d, place);
  const prevT = sunTimes(...civ(-1), place), nextT = sunTimes(...civ(1), place);
  const nextRise = nextT.rise;

  const tithis = segments(tithiFn, 12, 12.19, rise, nextRise).map((s) => ({
    ...s, name: tithiName(s.index), paksha: pakshaName(s.index) }));
  const naks = segments(nakFn, 360 / 27, 13.18, rise, nextRise).map((s) => ({ ...s, name: NAMES.nakshatra[s.index] }));
  const yogas = segments(yogaFn, 360 / 27, 14.2, rise, nextRise).map((s) => ({ ...s, name: NAMES.yoga[s.index] }));
  const karanas = segments(tithiFn, 6, 12.19, rise, nextRise).map((s) => ({ ...s, name: karanaName(s.index) }));
  const moonRasis = segments(nakFn, 30, 13.18, rise, nextRise).map((s) => ({ ...s, name: NAMES.rashi[s.index] }));

  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  const dayLen = set - rise;
  const part = (n) => ({ start: rise + ((n - 1) * dayLen) / 8, end: rise + (n * dayLen) / 8 });
  const mid = (rise + set) / 2, muhurta = dayLen / 15;
  const kala = kalaAt(rise);
  const sunSid = siderealSun(rise);

  return {
    date: { y, m, d }, place, sunrise: rise, sunset: set, nextSunrise: nextRise,
    moonrise: moonEvent(rise, nextRise, place, true), moonset: moonEvent(rise, nextRise, place, false),
    vara: weekday,
    tithi: tithis, nakshatra: naks, yoga: yogas, karana: karanas, moonRasis,
    masa: kala.month, // { index, adhika, start, end }
    ritu: kala.ritu, ayana: kala.ayana, shaka: kala.shaka, samvatsara: kala.samvatsara,
    sunRashi: Math.floor(sunSid / 30), moonRashi: moonRasis[0].index,
    elongation: elongation(rise),
    marks: observances({ rise, set, nextRise }, { rise: prevT.rise, set: prevT.set }, nextT, tithis, place),
    rahu: part(RAHU[weekday]), yamagandam: part(YAMA[weekday]), gulika: part(GULIKA[weekday]),
    abhijit: { start: mid - muhurta / 2, end: mid + muhurta / 2, observed: weekday !== 3 },
  };
}

// Civil date (y, m, d) of a JD at a place (or for a fixed offset in hours).
export function civilDate(jd, placeOrTz) {
  const tz = typeof placeOrTz === 'number' ? placeOrTz : tzAt(placeOrTz, jd);
  const t = dateFromJd(jd + tz / 24);
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() };
}

// All days of the amanta month containing jd: each day belongs to the month whose
// tithi is running at that day's sunrise.
export function monthDays(jd, place) {
  const month = lunarMonth(jd);
  const first = civilDate(month.start, place);
  const days = [];
  for (let i = -1; i < 33; i++) {
    const dt = new Date(Date.UTC(first.y, first.m - 1, first.d + i));
    const p = panchang(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate(), place);
    if (p.sunrise >= month.start && p.sunrise < month.end) days.push(p);
    if (p.sunrise >= month.end) break;
  }
  return { month, days };
}

// ---------- sankalpam: place ----------
// Telugu sankalpams place the speaker by direction from Srisailam (16.07 N, 78.87 E) and by
// river band.
const SRISAILAM = { lat: 16.0733, lon: 78.8684 };
const DIRS = ['Uttara', 'Eesanya', 'Purva', 'Agneya', 'Dakshina', 'Nairuti', 'Paschima', 'Vayavya'];
export function srisailamDirection(lat, lon) {
  const p1 = SRISAILAM.lat * D2R, p2 = lat * D2R, dl = (lon - SRISAILAM.lon) * D2R;
  const brg = norm(Math.atan2(Math.sin(dl) * Math.cos(p2),
    Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl)) / D2R);
  return { bearing: brg, name: DIRS[Math.round(brg / 45) % 8] };
}

// Each river is a rough polyline [lon, lat] from source to sea. A place is north or south of it
// by the river's latitude at the place's longitude; up to 2° beyond either end, the river is taken
// to continue at its end latitude (to the coast). Good enough to choose the phrase; editable.
const RIVERS = {
  Godavari: [[73.53, 19.93], [75.38, 19.48], [77.3, 19.15], [77.95, 18.88], [79.9, 18.8], [80.89, 17.67], [81.78, 17.0], [82.25, 16.7]],
  Krishna: [[73.65, 17.92], [74.6, 16.85], [75.88, 16.33], [77.35, 16.4], [78.87, 16.08], [79.31, 16.57], [80.62, 16.51], [81.1, 15.85]],
  Kaveri: [[75.49, 12.39], [75.96, 12.46], [76.68, 12.42], [77.17, 12.27], [77.8, 11.8], [78.68, 10.86], [79.4, 10.95], [79.85, 11.14]],
};
function riverSide(river, lat, lon) {
  const pts = RIVERS[river], first = pts[0], last = pts[pts.length - 1];
  if (lon < first[0]) return first[0] - lon <= 2 ? (lat > first[1] ? 'N' : 'S') : null;
  if (lon > last[0]) return lon - last[0] <= 2 ? (lat > last[1] ? 'N' : 'S') : null;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
    if (lon >= x1 && lon <= x2) return lat > y1 + ((lon - x1) / (x2 - x1)) * (y2 - y1) ? 'N' : 'S';
  }
  return null;
}
export function riverLine(lat, lon, state = '') {
  if (state === 'Kerala') return ''; // Kerala sankalpams do not use the Deccan rivers
  const g = riverSide('Godavari', lat, lon), k = riverSide('Krishna', lat, lon), c = riverSide('Kaveri', lat, lon);
  if (lat > 22 || (!g && !k && !c)) return ''; // north India or outside the Deccan: family to fill in
  if (g === 'N') return 'Godavaryah uttare tire';
  if (g === 'S' && k === 'N') return 'Krishna Godavaryor madhya pradese';
  if (k === 'S' && c === 'N') return 'Krishna Kaveryor madhya pradese';
  if (c === 'S') return 'Kaveryah dakshine tire';
  if (k === 'S') return 'Krishnayah dakshine tire';
  if (g === 'S') return 'Godavaryah dakshine tire';
  return '';
}
const baseName = (place) => place.name.replace(/\s*\(.*\)$/, '').replace(/,.*$/, '');

// ---------- desha north and east of the Deccan ----------
// Sankalpams there follow the north Indian form: Aryavarta (or the land's own old name), the
// river, and the city by its traditional name. Three sources, in order:
//  1. River cities, written by hand, because the bank matters and rough river lines are not
//     precise enough near the water.
//  2. Bands worked out from the major rivers (rough polylines [lon, lat], latitude read at the
//     place's longitude): between Ganga and Yamuna, near the Ganga, Bhagirathi, Brahmaputra or
//     Mahanadi, or north of the Narmada.
//  3. Nothing, rather than a guess: the family fills it in.
const NORTH_RIVERS = {
  Ganga: [[78.38, 28.2], [79.58, 27.39], [79.92, 27.07], [80.33, 26.47], [81.03, 26.07], [81.35, 25.7], [81.88, 25.43],
    [82.57, 25.15], [83.02, 25.32], [83.58, 25.58], [83.98, 25.57], [85.15, 25.62], [85.7, 25.48], [86.47, 25.38],
    [87.0, 25.26], [87.64, 25.25], [87.92, 24.81]],
  Yamuna: [[78.03, 27.17], [79.03, 26.77], [79.73, 26.12], [80.15, 25.95], [81.88, 25.43]],
  Narmada: [[72.6, 21.65], [72.98, 21.71], [73.75, 21.83], [74.9, 22.03], [75.59, 22.18], [76.15, 22.24],
    [77.72, 22.75], [79.8, 23.13], [79.95, 23.12], [80.37, 22.6], [81.75, 22.67]],
  Brahmaputra: [[89.98, 26.02], [90.62, 26.17], [91.74, 26.19], [92.8, 26.62], [94.2, 26.9], [94.91, 27.48], [95.65, 27.83]],
  Mahanadi: [[83.97, 21.47], [84.32, 20.84], [85.19, 20.35], [85.88, 20.46], [86.68, 20.3]],
};
// The Bhagirathi–Hooghly runs north to south, so its longitude is read at the place's latitude: [lat, lon].
const BHAGIRATHI = [[21.65, 88.05], [22.19, 88.19], [22.57, 88.35], [22.9, 88.39], [23.4, 88.37], [24.18, 88.25], [24.81, 87.92]];
function interp(pts, x) {
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
    if (x >= x1 && x <= x2) return y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);
  }
  return null;
}
// Written by hand and checked once against public sources (Wikipedia and others). An empty string
// means "no river line" where a band would otherwise apply wrongly. Applies in the Deccan too.
const RIVER_CITIES = {
  delhi: 'Yamunayah paschime tire', noida: 'Ganga Yamunayor madhye', ghaziabad: 'Ganga Yamunayor madhye',
  meerut: 'Ganga Yamunayor madhye', aligarh: 'Ganga Yamunayor madhye', saharanpur: 'Ganga Yamunayor madhye',
  muzaffarnagar: 'Ganga Yamunayor madhye', faridabad: 'Yamunayah paschime tire', gurugram: '',
  yamunanagar: 'Yamunayah paschime tire', panipat: 'Yamunayah paschime tire', sonipat: 'Yamunayah paschime tire',
  karnal: 'Yamunayah paschime tire', agra: 'Yamunayah tire', kanpur: 'Gangayah dakshine tire',
  lucknow: 'Gomatyah tire', patna: 'Gangayah dakshine tire', bhagalpur: 'Gangayah dakshine tire',
  begusarai: 'Gangayah uttare tire', kolkata: 'Bhagirathyah purve tire', howrah: 'Bhagirathyah paschime tire',
  dakshineswar: 'Bhagirathyah purve tire', baharampur: 'Bhagirathyah purve tire',
  guwahati: 'Brahmaputrasya dakshine tire', dibrugarh: 'Brahmaputrasya dakshine tire', tezpur: 'Brahmaputrasya uttare tire',
  majuli: 'Brahmaputra madhye', ahmedabad: 'Sabhramatyah tire', gandhinagar: 'Sabhramatyah tire',
  surat: 'Tapyah dakshine tire', bharuch: 'Narmadayah uttare tire', jabalpur: 'Narmadayah uttare tire',
  narmadapuram: 'Narmadayah dakshine tire', maheshwar: 'Narmadayah uttare tire', kota: 'Charmanvatyah tire',
  cuttack: 'Mahanadyah dakshine tire', sambalpur: 'Mahanadyah purve tire', srinagar: 'Vitastayah tire',
  shirdi: 'Krishna Godavaryor madhya pradese', nanded: 'Godavaryah tire', sangli: 'Krishnayah tire',
  ratnagiri: '', ganpatipule: '',
};

// The town's own river, from local_rivers.js (the page attaches it to each place as `localRiver`:
// { river, sk, bank }). Sanskrit genitive for the bank phrase; a sangamam lists both rivers.
const MASC_RIVERS = { Brahmaputra: 'Brahmaputrasya', Shona: 'Shonasya', Sona: 'Shonasya', Sindhu: 'Sindhoh' };
function riverGen(sk) {
  if (MASC_RIVERS[sk]) return MASC_RIVERS[sk];
  if (/i$/.test(sk)) return sk.replace(/i$/, 'yah'); // Pinakini → Pinakinyah, Krishnaveni → Krishnavenyah
  if (/a$/.test(sk)) return `${sk}yah`;              // Ganga → Gangayah
  return null;                                       // other stems: "<name> nadi tire"
}
export function localRiverPhrase(lr) {
  if (!lr) return '';
  const names = lr.sk.split(' and ');
  if (names.length > 1) return `${names.join(' ')} sangame`;
  const gen = lr.bank ? riverGen(names[0]) : null;
  return gen ? `${gen} ${lr.bank} tire` : `${names[0]} nadi tire`;
}
// Traditional names, already in the locative ("in Pragjyotishapura").
// Karnavati for Ahmedabad is left out on purpose: the identification is disputed and the renaming is
// a live political question. Families who say it can type it in.
const CITY_NAMES = {
  guwahati: 'Pragjyotishapure', delhi: 'Indraprasthe', patna: 'Pataliputre', bharuch: 'Bhrigukacche',
  ajmer: 'Ajayamerau', 'mount abu': 'Arbuda kshetre', maheshwar: 'Mahishmati kshetre', jajpur: 'Viraja kshetre',
  'tripura sundari temple': 'Tripura Sundari kshetre',
  lucknow: 'Lakshmanapure', kolkata: 'Kalikata nagare', jaipur: 'Jayapure', gwalior: 'Gopachale',
  nellore: 'Vikramasimhapure', warangal: 'Ekasila nagare', thiruvananthapuram: 'Syanandurapure',
  tiruchirappalli: 'Trisirapure',
};
// The land, by state, outside the Deccan.
const ARYAVARTA = ['Uttar Pradesh', 'Uttarakhand', 'Bihar', 'Jharkhand', 'Delhi', 'Haryana', 'Punjab', 'Chandigarh',
  'Himachal Pradesh', 'Rajasthan', 'Madhya Pradesh', 'West Bengal', 'Gujarat'];
const LANDS = { Gujarat: 'Gurjara deshe', Assam: 'Kamarupa deshe', Odisha: 'Utkala deshe',
  Kerala: 'Kerala deshe', 'Jammu and Kashmir': 'Kashmira deshe', Chhattisgarh: 'Dakshina Kosala deshe' };
// The Telugu form (Srisailam direction and Deccan river band) applies in these states only.
const DECCAN = ['Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu', 'Maharashtra', 'Goa', 'Puducherry'];
// Aryavarta ends at the Narmada: places south of it (Surat, Khandwa …) are not called Aryavarta.
// "Kashmira" is the Valley only, not the Jammu region.
function regionLine(place) {
  const { state, lat, lon } = place;
  const n = interp(NORTH_RIVERS.Narmada, lon);
  const key = baseName(place).toLowerCase();
  const northBank = /^Narmadayah uttare/.test(RIVER_CITIES[key] || ''); // on the bank, where the rough line is too coarse
  const arya = ARYAVARTA.includes(state) && (northBank || !(n != null && lat < n));
  const land = state === 'Jammu and Kashmir' && lat < 33.3 ? '' : LANDS[state] || '';
  return [arya ? 'Aryavartaika deshe' : '', land].filter(Boolean).join(', ');
}
export function northRiverLine(place) {
  const key = baseName(place).toLowerCase();
  if (key in RIVER_CITIES) return RIVER_CITIES[key];
  if (place.localRiver) return localRiverPhrase(place.localRiver);
  const { lat, lon } = place;
  const g = interp(NORTH_RIVERS.Ganga, lon), y = interp(NORTH_RIVERS.Yamuna, lon);
  if (g != null && y != null && lat < g && lat > y) return 'Ganga Yamunayor madhye';
  if (g != null && Math.abs(lat - g) <= 0.9) return lat > g ? 'Gangayah uttare tire' : 'Gangayah dakshine tire';
  const bh = lat <= 24.81 ? interp(BHAGIRATHI, lat) : null;
  if (bh != null && Math.abs(lon - bh) <= 0.6) return lon > bh ? 'Bhagirathyah purve tire' : 'Bhagirathyah paschime tire';
  const b = interp(NORTH_RIVERS.Brahmaputra, lon);
  if (b != null && Math.abs(lat - b) <= 0.6) return lat > b ? 'Brahmaputrasya uttare tire' : 'Brahmaputrasya dakshine tire';
  const m = interp(NORTH_RIVERS.Mahanadi, lon);
  if (m != null && Math.abs(lat - m) <= 0.6) return lat > m ? 'Mahanadyah uttare tire' : 'Mahanadyah dakshine tire';
  const n = interp(NORTH_RIVERS.Narmada, lon);
  if (n != null && lat > n && lat - n <= 1.6) return 'Narmadayah uttare tire'; // within ~175 km of the river
  return '';
}
// A kshetram names its deity, as in "… Sri Subrahmanya Swami sannidhau". The page attaches the
// presiding deity from deities.js as `deity`; only pilgrimage places, and only when you are there.
const deityLine = (place) => (place.kind === 'pilgrimage' && place.deity && !place.noPreset
  ? `${place.deity.replace(/\s*\([^)]*\)/g, '').replace(/ and /g, ' ').trim()} sannidhau` : '');
const cityLine = (place) => CITY_NAMES[baseName(place).toLowerCase()] || kshetraLine(place);
// Places with no state (e.g. "my location" far from a listed place) go by latitude alone.
const inDeccan = (place) => (place.state ? DECCAN.includes(place.state) : place.lat <= 22)
  && riverLine(place.lat, place.lon, place.state) !== '';

// "Gandhinagar" → "Gandhinagare", not "Gandhinagar nagare".
export const kshetraLine = (place) => (/nagar$/i.test(baseName(place)) ? `${baseName(place)}e`
  : `${baseName(place)} ${place.kind === 'pilgrimage' ? 'kshetre' : 'nagare'}`);

// Full kshetra wording for the great kshetras: replaces the Srisailam-direction, river and town
// lines. Drafted from common usage and reviewed once; a purohit should confirm before relying on it.
// `names` are matched against the place name and any name in brackets, case-insensitively.
export const KSHETRAS = [
  { names: ['varanasi', 'kashi', 'banaras'], text: 'Avimukta Varanasi kshetre, Anandavane, Mahasmasane, Gaurimukhe, Trikantaka virajite, Bhagirathyah paschime tire, Sri Visweswara Annapurna sannidhau' },
  { names: ['prayagraj', 'prayag', 'allahabad'], text: 'Prayaga kshetre, Ganga Yamuna Saraswati Triveni sangame, Sri Venimadhava sannidhau' },
  { names: ['gaya'], text: 'Gaya kshetre, Phalgu nadi tire, Sri Vishnupada sannidhau' },
  { names: ['haridwar'], text: 'Gangadware, Haridwara kshetre, Bhagirathyah tire' },
  { names: ['rishikesh'], text: 'Hrishikesa kshetre, Bhagirathyah tire' },
  { names: ['badrinath'], text: 'Badarikashrame, Alakananda tire, Sri Badarinarayana sannidhau' },
  { names: ['kedarnath'], text: 'Kedara kshetre, Mandakini tire, Sri Kedareswara sannidhau' },
  { names: ['ayodhya'], text: 'Ayodhya kshetre, Sarayu nadi tire, Sri Ramachandra sannidhau' },
  { names: ['mathura'], text: 'Mathura kshetre, Yamuna tire, Sri Krishna janmasthane' },
  { names: ['vrindavan', 'vrindavana'], text: 'Vrindavana kshetre, Yamuna tire, Sri Radha Krishna sannidhau' },
  { names: ['kurukshetra'], text: 'Dharmakshetre Kurukshetre, Brahma sarovara tire' },
  { names: ['pushkar'], text: 'Pushkara kshetre, Pushkara tirtha tire, Sri Brahma sannidhau' },
  { names: ['ujjain', 'avantika'], text: 'Avantika kshetre, Kshipra nadi tire, Sri Mahakaleswara sannidhau' },
  { names: ['omkareshwar'], text: 'Omkara kshetre, Narmada tire, Sri Omkareswara Mamaleswara sannidhau' },
  { names: ['dwarka', 'dwaraka'], text: 'Dwaraka kshetre, Gomati tire, Sri Dwarakadheesa sannidhau' },
  { names: ['somnath', 'prabhas patan'], text: 'Prabhasa kshetre, Sri Somanatha sannidhau' },
  { names: ['puri', 'jagannath puri'], text: 'Purushottama kshetre, Neelachale, Sri Jagannatha Swami sannidhau' },
  { names: ['trimbakeshwar', 'trimbak'], text: 'Trayambaka kshetre, Brahmagiri parvate, Godavari udgama sthane, Sri Trayambakeswara sannidhau' },
  { names: ['nashik', 'nasik'], text: 'Panchavati kshetre, Godavaryah tire' },
  { names: ['pandharpur'], text: 'Pandharipura kshetre, Chandrabhaga tire, Sri Vitthala Rakhumai sannidhau' },
  { names: ['tirumala'], text: 'Seshachale, Venkatadri kshetre, Swami Pushkarini tire, Sri Venkateswara Swami sannidhau' },
  { names: ['srisailam'], text: 'Srisaila kshetre, Krishnaveni Patalaganga tire, Sri Bhramaramba Mallikarjuna Swami sannidhau' },
  { names: ['srikalahasti', 'kalahasti'], text: 'Sri Kalahasti kshetre, Swarnamukhi nadi tire, Sri Gnanaprasunamba Kalahasteeswara sannidhau' },
  { names: ['bhadrachalam'], text: 'Bhadradri kshetre, Godavaryah tire, Sri Sita Ramachandra Swami sannidhau' },
  { names: ['yadagirigutta', 'yadadri'], text: 'Yadadri kshetre, Sri Lakshmi Narasimha Swami sannidhau' },
  { names: ['simhachalam'], text: 'Simhachala kshetre, Sri Varaha Lakshmi Narasimha Swami sannidhau' },
  { names: ['annavaram'], text: 'Ratnagiri kshetre, Pampa nadi tire, Sri Veera Venkata Satyanarayana Swami sannidhau' },
  { names: ['mantralayam'], text: 'Mantralaya kshetre, Tungabhadra tire, Sri Raghavendra Swami brindavana sannidhau' },
  { names: ['sringeri'], text: 'Sringa giri kshetre, Tunga nadi tire, Sri Sarada Chandramouleeswara sannidhau' },
  { names: ['udupi'], text: 'Rajatapeetha pure, Udupi kshetre, Sri Krishna sannidhau' },
  { names: ['gokarna'], text: 'Gokarna kshetre, Sri Mahabaleswara sannidhau' },
  { names: ['srirangam'], text: 'Ubhaya Kaveri madhye, Sriranga kshetre, Sri Ranganatha Swami sannidhau' },
  { names: ['kanchipuram', 'kanchi'], text: 'Satyavrata kshetre, Kanchi nagare, Vegavati nadi tire, Sri Kamakshi Ekamreswara Varadaraja sannidhau' },
  { names: ['rameswaram'], text: 'Setubandhe, Gandhamadana parvate, Sri Ramanathaswami sannidhau' },
  { names: ['madurai'], text: 'Madhura kshetre, Kritamala nadi tire, Sri Meenakshi Sundareswara sannidhau' },
  { names: ['tiruvannamalai'], text: 'Arunachala kshetre, Sri Apeetakuchamba Arunachaleswara sannidhau' },
  { names: ['guruvayur'], text: 'Guruvayupura kshetre, Sri Guruvayupuresa sannidhau' },
  { names: ['kukke subramanya', 'kukke subrahmanya', 'kukke'], text: 'Kukke Subrahmanya kshetre, Kumaradhara nadi tire, Sri Subrahmanya Swami sannidhau' },
  { names: ['kamakhya'], text: 'Kamarupa kshetre, Pragjyotishapure, Nilachala parvate, Brahmaputrasya dakshine tire, Sri Kamakhya Devi sannidhau' },
  { names: ['kolhapur'], text: 'Karavira kshetre, Panchaganga tire, Sri Mahalakshmi sannidhau' },
  { names: ['bhubaneswar'], text: 'Ekamra kshetre, Bindu sarovara tire, Sri Lingaraja sannidhau' },
  { names: ['konark'], text: 'Arka kshetre, Chandrabhaga tire, Sri Surya Narayana sannidhau' },
  { names: ['chidambaram'], text: 'Chidambara kshetre, Sivaganga tirtha tire, Sri Nataraja sannidhau' },
  { names: ['kanyakumari'], text: 'Kanyakumari kshetre, Trisamudra sangame, Sri Kanyakumari Devi sannidhau' },
];
export function kshetraFor(place) {
  const names = [place.name, ...(place.name.match(/\(([^)]+)\)/g) || []).map((s) => s.slice(1, -1))]
    .map((s) => s.replace(/\s*\(.*\)$/, '').trim().toLowerCase());
  return KSHETRAS.find((k) => k.names.some((n) => names.includes(n))) || null;
}

// The desha words after "Bharata khande, Meroh dakshina digbhage" (or, abroad, after "prathama pade").
// Everything here is one editable line, so a family can change any part of it.
export function deshaFor(place) {
  if (place.abroad) {
    // America: as printed in Telugu sandhya books; elsewhere abroad the family fills it in.
    const text = place.kind === 'usa' || place.state === 'USA'
      ? `Krauncha dweepe, Ramanaka varshe, Aindrika khande, ${baseName(place)} nagare` : `${baseName(place)} nagare`;
    return { preset: false, abroad: true, text };
  }
  const k = place.noPreset ? null : kshetraFor(place);
  if (k) return { preset: true, text: k.text };
  if (!inDeccan(place)) {
    return { preset: false, north: true,
      text: [regionLine(place), northRiverLine(place), cityLine(place), deityLine(place)].filter(Boolean).join(', ') };
  }
  // Deccan: the Telugu river band, then the town's own river — unless the town's river is the
  // band's river (Rajahmundry, Vijayawada …), where the town's line says it more exactly.
  const key = baseName(place).toLowerCase();
  let river;
  if (key in RIVER_CITIES) river = RIVER_CITIES[key];
  else {
    const band = riverLine(place.lat, place.lon, place.state), own = localRiverPhrase(place.localRiver);
    const same = own && ['Godavari', 'Krishna', 'Kaveri'].some((r) => place.localRiver.sk.includes(r) && band.includes(r.slice(0, 5)));
    river = [same ? '' : band, own].filter(Boolean).join(', ');
  }
  return { preset: false, text: [`Srisailasya ${srisailamDirection(place.lat, place.lon).name} pradese`,
    river, cityLine(place), deityLine(place)].filter(Boolean).join(', ') };
}

export const VENUES = { home: 'swagruhe', temple: 'devalaye', river: 'punya nadi tire' };
export const PURPOSES = {
  sankalpam: { label: 'Sankalpam only' },
  puja: { label: 'Puja', end: (deity) => `${deity} devata preetyartham, yavachakti dhyana avahanadi shodasopachara pujam karishye` },
  pratah: { label: 'Pratah sandhyavandanam', end: () => 'pratah sandhyam upasishye', sandhya: true },
  madhyahnika: { label: 'Madhyahnikam', end: () => 'madhyahnika sandhyam upasishye', sandhya: true },
  sayam: { label: 'Sayam sandhyavandanam', end: () => 'sayam sandhyam upasishye', sandhya: true },
};

// The sankalpam's words in English letters. sankalpam_te.js has the same table in Telugu letters
// (the master for Kannada and Devanagari too); pass a table as o.words. The name lists are
// functions of the index the engine works out, so each table can use its own lists.
export const SANKALPA_EN = {
  opening: 'Mamopatta samasta duritakshaya dwara Sri Parameswara preetyartham, ',
  muhurte: 'subhe sobhane muhurte, Sri Mahavishnor ajnaya pravartamanasya, adya Brahmanah ',
  kalpe: 'dwitiya parardhe, Swetavaraha kalpe, Vaivaswata manvantare, Kaliyuge, prathama pade, ',
  bharata: 'Jambudweepe, Bharata varshe, Bharata khande, Meroh dakshina digbhage, ',
  sannidhau: 'samasta devata brahmana harihara guru charana sannidhau, ',
  vartamana: 'asmin vartamana vyavaharika chandramanena Prabhavadi shashti samvatsaranam madhye, ',
  samvatsare: ' nama samvatsare, ', ritau: ' ritau, ', mase: ' mase, ', pakshe: ' pakshe, ',
  tithau: ' subha tithau, ', vasara: ' vasara yuktayam, ',
  laghu: 'subha nakshatra, subha yoga, subha karana, evam guna viseshana visishtayam, asyam subha tithau, ',
  nakshatraYuktayam: ' nakshatra yuktayam, ', yogaYuktayam: ' yoga yuktayam, ', karanaYuktayam: ' karana yuktayam, ',
  evam: 'evam guna viseshana visishtayam, asyam ',
  sriman: 'Sriman ', gotrasya: ' gotrasya, ', namadheyasya: ' namadheyasya, ', dharmapatni: 'dharmapatni samethasya, ',
  phala: ['asmakam saha kutumbanam kshema sthairya vijaya abhaya ayur arogya aiswarya abhivruddhyartham, ',
    'dharma artha kama moksha chaturvidha phala purushartha siddhyartham, ishta kamyartha siddhyartham, '],
  more: '...', stop: '.', blank: '____', deity: 'Sri Parameswara', adhika: 'Adhika ',
  samvatsara: (i) => NAMES.samvatsara[i],
  ayana: (uttara) => (uttara ? 'Uttarayane' : 'Dakshinayane'),
  ritu: (i) => NAMES.ritu[i],
  masa: (i) => NAMES.masaSankalpa[i],
  paksha: (sukla) => (sukla ? 'Sukla' : 'Krishna'),
  tithi: (i) => tithiSankalpa(i),
  vara: (i) => NAMES.varaSankalpa[i],
  nakshatra: (i) => NAMES.nakshatraSankalpa[i],
  yoga: (i) => NAMES.yoga[i],
  karana: (k) => karanaName(k, true),
  venues: VENUES,
  ends: Object.fromEntries(Object.entries(PURPOSES).filter(([, x]) => x.end).map(([k, x]) => [k, x.end])),
};

// ---------- sankalpam ----------
// Returns parts: plain strings, and {v} for words filled in from the day, place or person, so the
// page can highlight them. `p` = panchang() of the day whose vaaram applies; `jd` = the moment.
// The kala words (samvatsara, ayana, ritu, masa, paksha, tithi, nakshatra, yoga, karana) are taken
// at `jd`, so a sankalpam after the new moon names the new month.
// o = { desha, venue, gotra, name, married, purpose, deity, mode, words } — all optional.
// mode 'full' (default) names every anga; 'laghu' says "subha nakshatra, subha yoga, subha karana"
// after the vaaram; 'short' is only "Mamopatta ... preetyartham" and the act.
// words: the word table (SANKALPA_EN by default). The desha line comes from deshaFor() in English
// letters; a caller writing another script passes its own line as o.desha.
export function sankalpam(p, jd, place, o = {}) {
  const W = o.words || SANKALPA_EN;
  const a = angasAt(jd), kala = kalaAt(jd);
  const v = (x) => ({ v: x });
  const masa = (kala.month.adhika ? W.adhika : '') + W.masa(kala.month.index);
  const d = deshaFor(place);
  const desha = (o.desha ?? d.text).trim();
  const pk = PURPOSES[o.purpose] ? o.purpose : 'sankalpam', purpose = PURPOSES[pk], end = W.ends[pk];
  const deity = o.deity || W.deity;
  const tithiWord = W.tithi(a.tithi);
  const mode = o.mode || (o.laghu ? 'laghu' : 'full');
  if (mode === 'short') return [W.opening, end ? v(end(deity)) : W.more, end ? W.stop : ''];

  const parts = [W.opening, W.muhurte, W.kalpe];
  if (!d.abroad) parts.push(W.bharata);
  if (desha) parts.push(v(desha), ', ');
  if (!d.preset && !purpose.sandhya) parts.push(v(W.venues[o.venue] || W.venues.home), ', ');
  if (!purpose.sandhya) parts.push(W.sannidhau);
  parts.push(
    W.vartamana,
    v(W.samvatsara(NAMES.samvatsara.indexOf(kala.samvatsara))), W.samvatsare,
    v(W.ayana(kala.ayana === 'Uttarayanam')), ', ',
    v(W.ritu(kala.ritu)), W.ritau, v(masa), W.mase,
    v(W.paksha(a.tithi < 15)), W.pakshe, v(tithiWord), W.tithau,
    v(W.vara(p.vara)), W.vasara,
  );
  if (mode === 'laghu') {
    parts.push(W.laghu);
  } else {
    parts.push(
      v(W.nakshatra(a.nakshatra)), W.nakshatraYuktayam,
      v(W.yoga(a.yoga)), W.yogaYuktayam, v(W.karana(a.karana)), W.karanaYuktayam,
      W.evam, v(tithiWord), W.tithau,
    );
  }
  if (!end) { parts.push(W.more); return parts; }
  if (!purpose.sandhya) {
    parts.push(W.sriman, v(o.gotra || W.blank), W.gotrasya, v(o.name || W.blank), W.namadheyasya);
    if (o.married !== false) parts.push(W.dharmapatni);
    parts.push(...W.phala);
  }
  parts.push(v(end(deity)), W.stop);
  return parts;
}
