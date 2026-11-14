// sandhya.js — Sandhyavandanam for Krishna Yajurveda (Taittiriya), Apastamba sutra, in the order
// printed in Telugu sandhyavandanam books. Pure data + small pure functions; no DOM.
// Text is plain English transliteration without svaras: a reading aid, not a substitute for
// learning from a guru. mantras_te.js has the same text in Telugu script, line for line.
// Checked twice against published Telugu texts (the second time with the Telugu script, Nov 2026,
// which settled the order: avahanam before the japa sankalpam, Harihara before udvasanam);
// a vaidika should still review it before the site is shared widely. Families differ in small
// details (direction, arghya count, extra namaskarams); the page says so.
//
// A step is { id, title, how, mantra, note?, ref?, sankalpam?, japa?, abhivadanam?, arghya? }.
// `mantra` is a string ("\n" = new line) or an array of parts: strings and { v } for filled-in words.

export const SANDHYA_KINDS = {
  pratah: {
    label: 'Pratah', title: 'Pratah Sandhyavandanam', japaName: 'pratah sandhya', arghyas: 3,
    arghyaHow: 'Stand facing east, before sunrise. Fill both joined palms with water and let it flow out over the fingertips at the end of each Gayatri.',
    japaHow: 'Stand facing east and do japam until the sun is seen.',
    upasthanaTitle: 'Mitra upasthanam', upasthanaHow: 'Do pranayamam (step 3). Then stand facing east, palms joined.',
  },
  madhyahnika: {
    label: 'Madhyah­nikam', title: 'Madhyahnikam', japaName: 'madhyahnika sandhya', arghyas: 2, // soft hyphen for narrow phones
    arghyaHow: 'Stand facing the sun around midday (some families face north). Fill both joined palms with water and let it flow out over the fingertips at the end of each Gayatri. Some families offer three.',
    japaHow: 'Sit facing east or north for japam.',
    upasthanaTitle: 'Surya upasthanam', upasthanaHow: 'Do pranayamam (step 3). Then stand facing the sun, palms joined.',
  },
  sayam: {
    label: 'Sayam', title: 'Sayam Sandhyavandanam', japaName: 'sayam sandhya', arghyas: 3,
    arghyaHow: 'Face west while the sun is still above the horizon, seated (some families stand). Fill both joined palms with water and let it flow out over the fingertips at the end of each Gayatri.',
    japaHow: 'Sit facing west and do japam until the stars appear.',
    upasthanaTitle: 'Varuna upasthanam', upasthanaHow: 'Do pranayamam (step 3). Then sit or stand facing west, palms joined.',
  },
};

// ---------- timing ----------
// The day is split in fifths: pratah and sangava (0–2/5), madhyahna (2/5–3/5), aparahna (3/5–4/5).
// Pratah sandhya begins in the last two muhurtas of night (96 min before sunrise) and its arghya
// is due by sunrise; Sayam begins 72 min (3 ghatikas) before sunset and is due by 72 min after.
const MIN = 1 / 1440;
export function sandhyaTimes(p) {
  const day = p.sunset - p.sunrise;
  return {
    sunrise: p.sunrise, sunset: p.sunset, noon: (p.sunrise + p.sunset) / 2,
    pratahStart: p.sunrise - 96 * MIN, pratahEnd: p.sunrise + (2 * day) / 5,
    madhyahna: { start: p.sunrise + (2 * day) / 5, end: p.sunrise + (3 * day) / 5 },
    madhyahnikaEnd: p.sunrise + (4 * day) / 5,
    sayamStart: p.sunset - 72 * MIN, sayamDue: p.sunset + 72 * MIN,
  };
}

// Which sandhya fits a moment. `pToday` is the civil day's panchang, `pPrev` the day before.
// Before the pre-dawn window, the moment still belongs to the previous day's Sayam (the vaidika day
// runs from sunrise to sunrise).
export function sandhyaContext(jd, pToday, pPrev) {
  const t = sandhyaTimes(pToday);
  if (jd < t.pratahStart) return { kind: 'sayam', day: pPrev };
  if (jd < t.madhyahna.start) return { kind: 'pratah', day: pToday };
  if (jd < t.sayamStart) return { kind: 'madhyahnika', day: pToday };
  return { kind: 'sayam', day: pToday };
}

// Where a moment stands for a given sandhya on a given day: early, on time, late (prayaschitta
// arghya due) or past its time.
export function sandhyaStatus(kind, jd, p) {
  const t = sandhyaTimes(p);
  if (kind === 'pratah') return jd < t.pratahStart ? 'early' : jd <= t.sunrise ? 'on-time' : jd <= t.pratahEnd ? 'late' : 'past';
  if (kind === 'madhyahnika') return jd < t.madhyahna.start ? 'early' : jd <= t.madhyahna.end ? 'on-time' : jd <= t.madhyahnikaEnd ? 'late' : 'past';
  return jd < t.sayamStart ? 'early' : jd <= t.sayamDue ? 'on-time' : 'late';
}

// ---------- text ----------
// The 24 Kesavadi names: three sips, then 21 names, three to a line to keep the phone screen short.
const ACHAMANAM = [
  'Om Kesavaya swaha', 'Om Narayanaya swaha', 'Om Madhavaya swaha',
  'Om Govindaya namah, Om Vishnave namah, Om Madhusudanaya namah',
  'Om Trivikramaya namah, Om Vamanaya namah, Om Sridharaya namah',
  'Om Hrishikesaya namah, Om Padmanabhaya namah, Om Damodaraya namah',
  'Om Sankarshanaya namah, Om Vasudevaya namah, Om Pradyumnaya namah',
  'Om Aniruddhaya namah, Om Purushottamaya namah, Om Adhokshajaya namah',
  'Om Narasimhaya namah, Om Achyutaya namah, Om Janardanaya namah',
  'Om Upendraya namah, Om Haraye namah, Om Sri Krishnaya namah',
].join('\n');

const PRANAYAMAM = [
  'Om bhuh, Om bhuvah, Ogum suvah, Om mahah, Om janah, Om tapah, Ogum satyam',
  'Om tat savitur varenyam, bhargo devasya dhimahi, dhiyo yo nah prachodayat',
  'Om apo jyoti raso\'mritam brahma bhur bhuvas suvarom',
].join('\n');

const APO_HI_SHTHA = [
  'Apo hi shtha mayobhuvah', 'Ta na urje dadhatana', 'Mahe ranaya chakshase',
  'Yo vah sivatamo rasah', 'Tasya bhajayateha nah', 'Usatir iva matarah',
  'Tasma aranga mama vah', 'Yasya kshayaya jinvatha', 'Apo janayatha cha nah',
].join('\n');

const GAYATRI = 'Om bhur bhuvas suvah\nTat savitur varenyam, bhargo devasya dhimahi, dhiyo yo nah prachodayat';
const HAMSAS = 'Hagumsas suchishad vasur antarikshasad dhota vedishad atithir duronasat\nNrishad varasad ritasad vyomasad abja goja ritaja adrija ritam brihat';

const PRASANAM = {
  pratah: [
    'Suryas cha ma manyus cha manyupatayas cha manyukritebhyah', 'Papebhyo rakshantam',
    'Yad ratriya papam akarsham', 'Manasa vacha hastabhyam', 'Padbhyam udarena sisna',
    'Ratris tad avalumpatu', 'Yat kincha duritam mayi', 'Idam aham mam amrita yonau',
    'Surye jyotishi juhomi swaha',
  ],
  madhyahnika: [
    'Apah punantu prithivim, prithivi puta punatu mam',
    'Punantu brahmanaspatir, brahma puta punatu mam',
    'Yad ucchishtam abhojyam, yad va duscharitam mama',
    'Sarvam punantu mam apo\'satam cha pratigrahagum swaha',
  ],
  sayam: [
    'Agnis cha ma manyus cha manyupatayas cha manyukritebhyah', 'Papebhyo rakshantam',
    'Yad ahna papam akarsham', 'Manasa vacha hastabhyam', 'Padbhyam udarena sisna',
    'Ahas tad avalumpatu', 'Yat kincha duritam mayi', 'Idam aham mam amrita yonau',
    'Satye jyotishi juhomi swaha',
  ],
};

const TARPANAM = {
  pratah: ['Sandhyam tarpayami', 'Gayatrim tarpayami', 'Brahmim tarpayami', 'Nimrujim tarpayami'],
  madhyahnika: ['Sandhyam tarpayami', 'Savitrim tarpayami', 'Raudrim tarpayami', 'Nimrujim tarpayami'],
  sayam: ['Sandhyam tarpayami', 'Sarasvatim tarpayami', 'Vaishnavim tarpayami', 'Nimrujim tarpayami'],
};

const UPASTHANAM = {
  pratah: [
    'Mitrasya charshani dhritah, sravo devasya sanasim, satyam chitrasravastamam',
    'Mitro janan yatayati prajanan, mitro dadhara prithivim uta dyam',
    'Mitrah krishtir animisha\'bhichashte, satyaya havyam ghritavad vidhema',
    'Pra sa mitra marto astu prayasvan, yasta aditya sikshati vratena',
    'Na hanyate na jiyate tvoto, nainam agumho asnotyantito na durat',
  ],
  madhyahnika: [
    'A satyena rajasa vartamano, nivesayann amritam martyam cha',
    'Hiranyayena savita rathena a devo yati bhuvana vipasyan',
    'Udvayam tamasas pari, pasyanto jyotir uttaram',
    'Devam devatra suryam, aganma jyotir uttamam',
    'Udu tyam jatavedasam, devam vahanti ketavah, drise visvaya suryam',
    'Chitram devanam udagad anikam, chakshur mitrasya varunasyagneh',
    'Apra dyava prithivi antarikshagum, surya atma jagatas tasthushas cha',
    'Tacchakshur devahitam purastach chhukram uccharat',
    'Pasyema saradas satam, jivema saradas satam',
    'Nandama saradas satam, modama saradas satam',
    'Bhavama saradas satam, srinavama saradas satam',
    'Prabravama saradas satam, ajitasyama saradas satam, jyok cha suryam drise',
    'Ya udagan mahato\'rnavad vibhrajamanas sarirasya madhyat',
    'Sa ma vrishabho lohitakshas suryo vipaschin manasa punatu',
  ],
  sayam: [
    'Imam me varuna srudhi havam adya cha mridaya, tvam avasyur achake',
    'Tattva yami brahmana vandamanas tadasaste yajamano havirbhih',
    'Ahedamano varuneha bodhyurusagumsa ma na ayuh pramoshih',
    'Yacchiddhi te viso yatha pra deva varuna vratam, minimasi dyavi dyavi',
    'Yat kinchedam varuna daivye jane\'bhidroham manushyas charamasi',
    'Achitti yat tava dharma yuyopima, ma nastasmad enaso deva ririshah',
    'Kitavaso yad riripur na divi, yad va gha satyam uta yan na vidma',
    'Sarva ta vishya sithireva devatha, te syama varuna priyasah',
  ],
};

const OMITYEKAKSHARAM = 'Om ityekaksharam brahma, agnir devata, brahma ity arsham, gayatram chandam, paramatmam sarupam, sayujyam viniyogam';

const NYASAM = [
  'Pranavasya rishir brahma, devi gayatri chandah, paramatma devata',
  'Bhuradi sapta vyahritinam, atri bhrigu kutsa vasishtha gautama kasyapa angirasa rishayah',
  'Gayatri ushnik anushtup brihati pankti trishtup jagatyas chandamsi',
  'Agni vayu arka vagisa varuna indra visvedeva devatah',
  'Gayatrya visvamitra rishih, gayatri chandah, savita devata',
  'Gayatri sirasah brahma rishih, anushtup chandah, paramatma devata',
].join('\n');

const AVAHANAM = [
  'Ayatu varada devi, aksharam brahma sammitam',
  'Gayatrim chandasam matedam brahma jushasva me',
  'Yad ahnat kurute papam, tad ahnat pratimuchyate',
  'Yad ratriyat kurute papam, tad ratriyat pratimuchyate',
  'Sarva varne mahadevi, sandhya vidye sarasvati',
  'Ojo\'si, saho\'si, balam asi, bhrajo\'si, devanam dhama namasi',
  'Visvam asi visvayuh, sarvam asi sarvayur, abhibhur om',
  'Gayatrim avahayami, Savitrim avahayami, Sarasvatim avahayami',
  'Chandarshin avahayami, Sriyam avahayami',
  'Gayatrya gayatri chando visvamitra rishih savita devata',
  'Agnir mukham, brahma siro, vishnur hridayagum rudras sikha, prithivi yonih',
  'Pranapana vyanodana samana saprana sveta varna sankhyayana sagotra',
  'Gayatri chaturvimsatyakshara tripada shatkukshih panchasirshopanayane viniyogah',
].join('\n');

const DHYANAM = [
  'Mukta vidruma hema nila dhavala chhayair mukhais trikshanair',
  'Yuktam indu nibaddha ratna makutam tattvartha varnatmikam',
  'Gayatrim varadabhayankusa kasah subhram kapalam gadam',
  'Sankham chakram atharavinda yugalam hastair vahantim bhaje',
].join('\n');

const DIG_DEVATA = ['Namah prachyai', 'Namo dakshinayai', 'Namah pratichyai', 'Nama udichyai', 'Nama urdhvayai',
  "Namo'dharayai", "Namo'vantarayai"]
  .map((d) => `${d} dise yas cha devata etasyam prativasanty etabhyas cha namah`).join('\n');

const SANDHYA_DEVATA = [
  'Sandhyayai namah, Savitryai namah, Gayatryai namah, Sarasvatyai namah',
  'Sarvabhyo devatabhyo namo namah',
  'Kamo\'karshin namo namah, manyur akarshin namo namah',
].join('\n');

const HARIHARA = [
  'Sivaya vishnurupaya, sivarupaya vishnave',
  'Sivasya hridayam vishnur, vishnos cha hridayam sivah',
  'Yatha sivamayo vishnur, evam vishnumayah sivah',
  'Yathantaram na pasyami, tatha me svastir ayushi',
].join('\n');

const SURYA_NARAYANA = [
  'Namah savitre jagadeka chakshushe, jagat prasuti sthiti nasa hetave',
  'Trayimayaya trigunatma dharine, virinchi narayana sankaratmane',
  '',
  'Dhyeyah sada savitri mandala madhyavarti, narayanas sarasijasana sannivishtah',
  'Keyuravan makara kundalavan kiriti, hari hiranmaya vapur dhrita sankha chakrah',
  '',
  'Akasat patitam toyam, yatha gacchati sagaram',
  'Sarva deva namaskarah, kesavam prati gacchati',
].join('\n');

const YAMA_VANDANAM = [
  'Yamaya dharmarajaya mrityave chantakaya cha',
  'Vaivasvataya kalaya sarvabhuta kshayaya cha',
  'Audumbaraya dadhnaya nilaya parameshthine',
  'Vrikodaraya chitraya chitraguptaya vai namah',
  'Chitraguptaya vai nama om nama iti',
].join('\n');

const SAMARPANAM = [
  'Kayena vacha manasendriyair va, buddhyatmana va prakriteh svabhavat',
  'Karomi yad yat sakalam parasmai, narayanayeti samarpayami',
  'Om tat sat, brahmarpanam astu',
].join('\n');

// Gayatri mudras: 24 shown before japam (purva) and 8 after (uttara), in the order of the
// traditional verses. mudra_rig.js draws each one (keyed by these names); the drawings are a
// reading aid, and hand positions are learnt from a guru.
export const PURVA_MUDRAS = ['Sumukham', 'Samputam', 'Vitatam', 'Vistritam', 'Dvimukham', 'Trimukham',
  'Chaturmukham', 'Panchamukham', 'Shanmukham', 'Adhomukham', 'Vyapakanjalikam', 'Sakatam', 'Yamapasam',
  'Grathitam', 'Sammukhonmukham', 'Pralambam', 'Mushtikam', 'Matsyam', 'Kurmam', 'Varaham', 'Simhakrantam',
  'Mahakrantam', 'Mudgaram', 'Pallavam'];
export const UTTARA_MUDRAS = ['Surabhi', 'Jnana', 'Vairagya', 'Yoni', 'Sankha', 'Pankaja', 'Linga', 'Nirvana'];

const ARSHEYA = { 1: 'ekarsheya', 2: 'dvyarsheya', 3: 'tryarsheya', 5: 'pancharsheya', 7: 'saptarsheya' };

// Abhivadanam in the Telugu form, from the person's pravara, gotram, sutra, sakha and name.
export function abhivadanam(c = {}) {
  const v = (x) => ({ v: x });
  const rishis = (c.pravara || '').split(/[,\s]+/).filter(Boolean);
  const arsheya = ARSHEYA[rishis.length];
  return [
    'Chatussagara paryantam go brahmanebhyah subham bhavatu\n',
    v(rishis.length ? rishis.join(' ') : '____'), ' ', ...(arsheya ? [v(arsheya), ' '] : []), 'pravaranvita, ',
    v(c.gotra || '____'), ' gotrah, ', v(c.sutra || 'Apastamba'), ' sutrah, ',
    v(c.sakha || 'Yajus'), ' sakhadhyayi, ', v(c.name || '____'), ' sarma aham bho abhivadaye',
  ];
}

// The full sequence for one sandhya. Repeated steps point back with `ref` instead of repeating text.
export function sandhyaSteps(kindKey) {
  const k = SANDHYA_KINDS[kindKey];
  const lines = (a) => a.join('\n');
  const mamopatta = 'Mamopatta samasta duritakshaya dwara Sri Parameswara preetyartham, ';
  return [
    { id: 'achamanam', title: 'Achamanam',
      how: 'Sip a little water from the right palm at each of the first three names. Then touch the face and limbs with the fingers of the right hand as each following name is said.',
      mantra: ACHAMANAM },
    { id: 'bhutocchatanam', title: 'Bhutocchatanam',
      how: 'Sit facing east or north. Sprinkle a few grains of akshata or a little water behind you.',
      mantra: 'Uttishthantu bhuta pisachah, ye te bhumi bharakah\nYe tesham avirodhena, brahma karma samarabhe' },
    { id: 'pranayamam', title: 'Pranayamam', breath: true,
      how: 'Hold the nose with the right hand as you were taught. Breathe in, hold the breath while saying the mantra in the mind, then breathe out. Three rounds; the timer below paces them.',
      mantra: PRANAYAMAM },
    { id: 'sankalpam', title: 'Sankalpam', sankalpam: true,
      how: 'Place the right palm over the left on the right thigh and say the sankalpam. The words for today, this place and this sandhya are filled in.' },
    { id: 'marjanam', title: 'Marjanam',
      how: 'With the ring finger, sprinkle water on the head at each line; on the feet at "Yasya kshayaya jinvatha"; on the head again at the last line. Then circle water around the head saying "Om bhur bhuvas suvah".',
      mantra: APO_HI_SHTHA + '\nOm bhur bhuvas suvah' },
    { id: 'prasanam', title: 'Prasanam',
      how: 'Take a little water in the right palm, say the mantra, and sip it at "swaha".',
      mantra: lines(PRASANAM[kindKey]) },
    { id: 'achamanam2', title: 'Achamanam', ref: 'achamanam', how: 'Do achamanam again, as in step 1.' },
    { id: 'punarmarjanam', title: 'Punar marjanam',
      how: 'Sprinkle water on the head again at each line, as in marjanam.',
      mantra: 'Dadhikravno akarisham, jishnor asvasya vajinah\nSurabhi no mukha karat, pra na ayugumshi tarishat\n' + APO_HI_SHTHA + '\nOm bhur bhuvas suvah' },
    { id: 'aghamarshanam', title: 'Aghamarshanam',
      how: 'Take water in the right palm and hold it near the nose. Say the mantra, then cast the water away to the left without looking at it.',
      mantra: 'Drupadad iva munchatu, drupadad iven mumuchanah\nSvinnah snatvi malad iva, putam pavitrenevajyam\nApah sundhantu mainasah' },
    { id: 'arghyam', title: `Arghya pradanam: ${k.arghyas} arghyas`, arghya: true,
      how: k.arghyaHow,
      mantra: `${mamopatta}${k.japaName} arghya pradanam karishye\n\n${kindKey === 'madhyahnika' ? HAMSAS + '\n' : ''}${GAYATRI}`,
      note: 'If the right time has passed, first say "Kalatita prayaschittartham turiyarghya pradanam karishye" and offer one more arghya (the turiyarghya) with the Gayatri.' },
    { id: 'pradakshinam', title: 'Atma pradakshinam',
      how: 'Take water in the right palm, turn around once clockwise where you stand, and sprinkle the water around you.',
      mantra: 'Udyantam astam yantam adityam abhidhyayan\nKurvan brahmano vidvan sakalam bhadram asnute\nAsav adityo brahmeti, brahmaiva san brahmapyeti ya evam veda\nAsav adityo brahma' },
    { id: 'tarpanam', title: 'Sandhya tarpanam',
      how: 'Pour a little water over the fingertips for each name.',
      mantra: lines(TARPANAM[kindKey]) },
    { id: 'achamanam3', title: 'Achamanam', ref: 'achamanam', how: 'Do achamanam again, as in step 1.' },
    { id: 'avahanam', title: 'Gayatri avahanam',
      how: 'Invite the Devi with palms joined.',
      mantra: `${OMITYEKAKSHARAM}\n${AVAHANAM}` },
    { id: 'japa-prep', title: 'Preparing for Gayatri japam',
      how: 'Do pranayamam (step 3). Say the japa sankalpam, then touch the head, mouth and heart as the rishi, chandas and devata are named.',
      mantra: `${mamopatta}${k.japaName}nga yathasakti gayatri maha mantra japam karishye\n\n` + NYASAM },
    { id: 'dhyanam', title: 'Gayatri dhyanam',
      how: 'Meditate on the Devi in this form.',
      mantra: DHYANAM },
    { id: 'purvamudra', title: 'Purva mudras: 24 (in many families)', mudras: PURVA_MUDRAS,
      how: 'Before japam, show the 24 Gayatri mudras in this order, with the hand positions your guru taught. Play moves the drawing from one mudra to the next.' },
    { id: 'japam', title: 'Gayatri japam', japa: true,
      how: `${k.japaHow} Say the Gayatri 108 times, or 28, or at least 10. Tap the counter for each one.`,
      mantra: GAYATRI },
    { id: 'uttaramudra', title: 'Uttara mudras: 8 (in many families)', mudras: UTTARA_MUDRAS,
      how: 'After japam, show the 8 closing mudras in this order.' },
    { id: 'upasthanam', title: k.upasthanaTitle, how: k.upasthanaHow, mantra: lines(UPASTHANAM[kindKey]) },
    { id: 'digdevata', title: 'Dig devata namaskaram',
      how: 'Turn to each direction in order and bow: east, south, west, north, above, below, and all between.',
      mantra: DIG_DEVATA },
    { id: 'sandhyadevata', title: 'Sandhya devata namaskaram', how: 'Bow with joined palms.', mantra: SANDHYA_DEVATA },
    { id: 'harihara', title: 'Harihara vandanam', how: 'Bow with joined palms.', mantra: HARIHARA },
    { id: 'udvasanam', title: 'Gayatri udvasanam',
      how: 'Bid the Devi farewell.',
      mantra: 'Uttame sikhare jate, bhumyam parvata murdhani\nBrahmanebhyo\'bhyanujnata, gaccha devi yathasukham' },
    { id: 'suryanarayana', title: 'Surya Narayana vandanam', how: 'Face the sun (or east) and bow.', mantra: SURYA_NARAYANA },
    { id: 'yama', title: 'Yama vandanam (in some families)', how: 'Face south and bow. Not every Telugu family says this; follow your elders.', mantra: YAMA_VANDANAM },
    { id: 'abhivadanam', title: 'Abhivadanam', abhivadanam: true,
      how: 'Touch both ears, then bow, introducing yourself by pravara, gotram, sutra and veda. Fill in your details above.' },
    { id: 'samarpanam', title: 'Samarpanam',
      how: 'Offer the whole act to Narayana. Finish with achamanam.',
      mantra: SAMARPANAM },
  ];
}
