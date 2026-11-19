// sandhya.js — Sandhyavandanam for Krishna Yajurveda (Taittiriya), Apastamba sutra, in the order
// printed in Telugu sandhyavandanam books. Pure data + small pure functions; no DOM.
// Text is plain English transliteration without svaras: a reading aid, not a substitute for
// learning from a guru. mantras_te.js has the same text in Telugu script, line for line.
// Checked twice against published Telugu texts (the second time with the Telugu script, Nov 2026,
// which settled the order: avahanam before the japa sankalpam, Harihara before udvasanam).
// The opening (Apavitrah pavitro va, then an achamanam) and an achamanam after each part follow
// corrections from the site's owner (18 and 19 Nov 2026). The order of the steps matches the
// Telugu "Krishna Yajurveda sandhyavandanam vidhi" on poojalu.com, though its opening achamanam is
// one said with the Gayatri. The achamanam here is the one the owner named by its first and
// last lines, "Trir achamed dhridayangamabhir adbhih" and "Athapa upaspriset": the Apastamba
// Dharmasutra's own rule for it, 1.5.16.2-8 in GRETIL's text, without the opening word "asinas"
// of 16.2, which the instruction's "Sitting" carries. The lines between are GRETIL's and not
// yet confirmed by him. Each line is said while doing its act as Haradatta's commentary explains
// it: the left hand, feet and head sprinkled, the lips touched with the three middle fingers,
// the eyes, nostrils and ears with the fingers he names, the hands washed at the end. Wiping the
// lips with the right thumb is Telugu practice. He called it "sroutyachamanam"; books mostly
// call an achamanam by Apastamba's rule the smrityachamanam and give the srauta and srutya names
// to other forms, so the step is titled by its opening words. Most other Telugu texts open
// with the Kesava names instead, so the page keeps them as the next step. A review pass on
// 18 Nov added pranayamam before the arghya and the tarpanam, as every text checked has it.
// A vaidika should still review it before the site is shared widely.
// Families differ in small details (direction, arghya count, which achamanam, extra
// namaskarams); the page says so.
//
// A step is { id, title, how, mantra, note?, ref?, sankalpam?, japa?, abhivadanam?, arghya?, breath?,
// mudras?, nyasa?, pictures? }; `pictures` lists picture files, under site/public, shown above the mantra.
// `mantra` is a string ("\n" = new line) or an array of parts: strings and { v } for filled-in words.
// A step that repeats another has `ref` (the id of the step it repeats) and no mantra.
// Instructions name other steps as "{step:<id>}"; numberStepRefs() turns that into the step's
// number, so adding a step never leaves a wrong number behind.

export const SANDHYA_KINDS = {
  pratah: {
    label: 'Pratah', title: 'Pratah Sandhyavandanam', japaName: 'pratah sandhya', kale: 'Pratah kale', arghyas: 3,
    arghyaHow: 'Do pranayamam (step {step:pranayamam}). Then stand facing east, before sunrise. Fill both joined palms with water and let it flow out over the fingertips at the end of each Gayatri.',
    japaHow: 'Stand facing east and do japam until the sun is seen.',
    upasthanaTitle: 'Mitra upasthanam', upasthanaHow: 'Do pranayamam (step {step:pranayamam}). Then stand facing east, palms joined.',
  },
  madhyahnika: {
    label: 'Madhyah­nikam', title: 'Madhyahnikam', japaName: 'madhyahnika sandhya', kale: 'Madhyahna kale', arghyas: 2, // soft hyphen for narrow phones
    arghyaHow: 'Do pranayamam (step {step:pranayamam}). Then stand facing the sun around midday (some families face north). Fill both joined palms with water and let it flow out over the fingertips at the end of each Gayatri. Some families offer three.',
    japaHow: 'Sit facing east or north for japam.',
    upasthanaTitle: 'Surya upasthanam', upasthanaHow: 'Do pranayamam (step {step:pranayamam}). Then stand facing the sun, palms joined.',
  },
  sayam: {
    label: 'Sayam', title: 'Sayam Sandhyavandanam', japaName: 'sayam sandhya', kale: 'Sayam kale', arghyas: 3,
    arghyaHow: 'Do pranayamam (step {step:pranayamam}). Then face west while the sun is still above the horizon, seated (some families stand). Fill both joined palms with water and let it flow out over the fingertips at the end of each Gayatri.',
    japaHow: 'Sit facing west and do japam until the stars appear.',
    upasthanaTitle: 'Varuna upasthanam', upasthanaHow: 'Do pranayamam (step {step:pranayamam}). Then sit or stand facing west, palms joined.',
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

// The sky the page draws behind its panels, from the sun's altitude at the place (degrees, from
// sunAltitude in engine.js) and whether it is morning: night while the stars are out (the sun more
// than 6 degrees below the horizon, the end of civil twilight), dawn or dusk from then until the
// sun is 10 degrees up, and day above that.
export function skyPhase(alt, morning) {
  if (alt < -6) return 'night';
  if (alt < 10) return morning ? 'dawn' : 'dusk';
  return 'day';
}

// The three grades of a sandhya by the sky, as the sandhyavandanam books teach them: Pratah is best
// while the stars are still out, middling once they have faded, lowest after sunrise; Sayam is
// best while the sun is up, middling after sunset, lowest once the stars are out. The stars count
// as out while the sun is more than 6 degrees below the horizon; the sun is up from -0.833 degrees
// (its upper limb on the horizon, as sunrise is timed). Madhyahnikam has no such grades: null.
export function sandhyaGrade(kind, alt) {
  const starsOut = alt < -6, sunUp = alt >= -0.833;
  if (kind === 'pratah') return starsOut ? 'uttama' : sunUp ? 'adhama' : 'madhyama';
  if (kind === 'sayam') return sunUp ? 'uttama' : starsOut ? 'adhama' : 'madhyama';
  return null;
}

// ---------- text ----------
// Said first, sprinkling water on the head: whoever remembers Vishnu is pure within and without.
const APAVITRA = [
  'Apavitrah pavitro va, sarvavastham gato\'pi va',
  'Yah smaret pundarikaksham, sa bahyabhyantaras suchih',
  'Pundarikaksha pundarikaksha pundarikakshaya namah',
].join('\n');

// The Apastamba Dharmasutra's rule for achamanam (1.5.16.2-8, GRETIL's text), from the first to the
// last line the site's owner gave: a line per act, keeping the sutra's own "dvir ity eke" ("some
// say twice"), which he has not yet said whether his family says aloud. The first line ends with the
// family's "swaha swaha swaha", said with the three sips (19 Nov 2026); that is not the sutra's.
const ACHAMANAM_APASTAMBA = [
  'Trir achamed dhridayangamabhir adbhih, swaha swaha swaha',
  'Trir oshthau parimrijet, dvir ity eke',
  'Sakrid upaspriset, dvir ity eke',
  'Dakshinena panina savyam prokshya',
  'Padau siras chendriyany upasprisec chakshushi nasike srotre cha',
  'Athapa upaspriset',
].join('\n');

// Srautachamanam, the achamanam with Vedic words: three sips with the three padas of the Gayatri,
// then one act for each phrase of Apo hi shtha, the seven vyahritis, the Gayatri and Apo jyotih,
// at the 24 places of the Kesava names ("devyah padais tribhih pitva, ablingair navabhih sprset",
// as a Telugu book of 1914 quotes it). A line here groups the acts the step's "how" lists together.
// Said before the japam (the site's owner, 19 Nov 2026).
const SRAUTACHAMANAM = [
  'Om tat savitur varenyagum swaha', 'Bhargo devasya dhimahi swaha', 'Dhiyo yo nah prachodayat swaha',
  'Apo hi shtha mayobhuvah, ta na urje dadhatana',
  'Mahe ranaya chakshase, yo vah sivatamo rasah',
  'Tasya bhajayateha nah, usatir iva matarah',
  'Tasma aranga mama vah, yasya kshayaya jinvatha, apo janayatha cha nah',
  'Om bhuh, Om bhuvah, Ogum suvah',
  'Om mahah, Om janah, Om tapah, Ogum satyam',
  'Om tat savitur varenyam, bhargo devasya dhimahi, dhiyo yo nah prachodayat',
  'Om apo jyoti raso\'mritam brahma, bhur bhuvas suvarom',
].join('\n');

// The 24 Kesavadi names: three sips, then 21 names, three to a line to keep the phone screen short.
const KESAVADI = [
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

// Kara nyasam and anga nyasam before the japam, as Telugu Krishna Yajurveda sandhyavandanam
// texts print them (haindavam.org, vignanam.org and hindupad.com all have the "-atmane" words).
const GAYATRI_NYASAM = [
  'Om tat savituh brahmatmane angushthabhyam namah',
  'Varenyam vishnvatmane tarjanibhyam namah',
  'Bhargo devasya rudratmane madhyamabhyam namah',
  'Dhimahi satyatmane anamikabhyam namah',
  'Dhiyo yo nah jnanatmane kanishthikabhyam namah',
  'Prachodayat sarvatmane karatala karaprishthabhyam namah',
  'Om tat savituh brahmatmane hridayaya namah',
  'Varenyam vishnvatmane sirase swaha',
  'Bhargo devasya rudratmane sikhayai vashat',
  'Dhimahi satyatmane kavachaya hum',
  'Dhiyo yo nah jnanatmane netratrayaya vaushat',
  'Prachodayat sarvatmane astraya phat',
  'Om bhur bhuvas suvarom iti digbandhah',
].join('\n');

// The drawing for each line of GAYATRI_NYASAM, in order (mudra_rig.js, NYASA_POSES and NYASA_CUES):
// the kara nyasam's thumbs, four fingers and palms, the anga nyasam's six places, the digbandham.
export const NYASA_LINES = ['angushtha', 'tarjani', 'madhyama', 'anamika', 'kanishthika', 'karatala',
  'hridaya', 'siras', 'sikha', 'kavacha', 'netra', 'astra', 'digbandha'];

// The nyasam after the japam: the same lines, but the last releases the directions (digvimokah),
// the vyahritis in the reverse order, as haindavam.org gives it.
const GAYATRI_NYASAM_AFTER = GAYATRI_NYASAM.replace(/[^\n]*$/, 'Suvar bhuvar bhurom iti digvimokah');
export const NYASA_LINES_AFTER = [...NYASA_LINES.slice(0, -1), 'digvimoka'];

// The Devi's form at each sandhya, said after the Gayatri dhyanam and "yo devas savita": Brahmi
// in the morning, Vishnu's form at midday, Siva's form in the evening. The site's owner named
// the morning and evening verses by their first words; the midday one completes the set, and he
// said it stays (19 Nov 2026). The words are as a Hindi Shukla Yajurveda sandhya-vidhi prints
// them (copies on narindersharmasite.wordpress.com and transliteral.org), without the morning
// verse's closing instruction, "mantrenavahayed devim ayantim surya mandalat" ("one should
// invite the Devi coming from the sun's orb"). No Telugu printing has been found. The Taittiriya
// tarpanam (step tarpanam) names Raudri at midday and Vaishnavi in the evening, the other way
// round: a known difference, and the owner said both stay as they are (19 Nov 2026). Do not
// "correct" either.
const KALA_DHYANAM = {
  pratah: [
    'Balam vidyam tu gayatrim, lohitam chaturananam',
    'Raktambara dvayopetam akshasutra karam tatha',
    'Kamandalu dharam devim, hamsa vahana samsthitam',
    'Brahmanim brahma daivatyam, brahma loka nivasinim',
  ],
  madhyahnika: [
    'Madhyahne vishnu rupam cha, tarkshyastham pita vasasam',
    'Yuvatim cha yajurvedam, surya mandala samsthitam',
  ],
  sayam: [
    'Sayahne siva rupam cha, vriddham vrishabha vahinim',
    'Surya mandala madhyastham, sama veda samayutam',
  ],
};

// Pictures of the Devi for each sandhya's verse (step kala-dhyanam), an image to fix the mind on,
// made by the site's owner with an AI image tool from prompts written to the three verses, which
// asked for the manner of Raja Ravi Varma's paintings (19 Nov 2026). Three of each, the first
// shown unless the reader picks another; the page says how they were made, and to go by the verse
// where they differ. Files in site/public/img/, 720 by 900 WebP with no metadata (check_ui.mjs).
export const DHYANA_PICTURES = Object.fromEntries(['pratah', 'madhyahnika', 'sayam']
  .map((k) => [k, [1, 2, 3].map((n) => `img/gayatri_${k}_${n}.webp`)]));

const DIG_DEVATA = ['Namah prachyai', 'Namo dakshinayai', 'Namah pratichyai', 'Nama udichyai', 'Nama urdhvayai',
  "Namo'dharayai", "Namo'vantarayai"]
  .map((d) => `${d} dise yas cha devata etasyam prativasanty etabhyas cha namah`).join('\n');

// Sandhya devata namaskaram in full, from vignanam.org's Telugu sandhya, followed there by "Om namo
// bhagavate vasudevaya" and the verse asking Sandhya to protect (completed at the site owner's
// word, 19 Nov 2026). Two words follow the regular sandhi where vignanam does not: "akarshin
// namo" (akarshit + namah; vignanam akarshir) and "akasan namah" (vignanam akasat namah).
const SANDHYA_DEVATA = [
  'Sandhyayai namah, Savitryai namah, Gayatryai namah, Sarasvatyai namah',
  'Sarvabhyo devatabhyo namah, devebhyo namah, rishibhyo namah',
  'Munibhyo namah, gurubhyo namah, pitribhyo namah',
  'Kamo\'karshin namo namah, manyur akarshin namo namah',
  'Prithivyapas tejo vayur akasan namah',
  'Om namo bhagavate vasudevaya',
  'Yagum sada sarva bhutani, charani sthavarani cha',
  'Sayam pratar namasyanti, sa ma sandhya\'bhirakshatu',
].join('\n');

// The third marjanam (Taittiriya Samhita 5.6.1), said after the second as vignanam.org has it;
// added at the site owner's word (19 Nov 2026). vignanam has an extra "yah" before "sivena ma
// chakshusha", which the Samhita text does not; the page leaves it out.
const HIRANYAVARNA = [
  'Hiranyavarnah suchayah pavakah, yasu jatah kasyapo yasv indrah',
  'Agnim ya garbham dadhire virupah, ta na apah sagum syona bhavantu',
  'Yasagum raja varuno yati madhye, satyanrite avapasyan jananam',
  'Madhuschutah suchayo yah pavakah, ta na apah sagum syona bhavantu',
  'Yasam deva divi krinvanti bhaksham, ya antarikshe bahudha bhavanti',
  'Yah prithivim payasondanti sukrah, ta na apah sagum syona bhavantu',
  'Sivena ma chakshusha pasyatapah, sivaya tanuvopa sprisata tvacham me',
  'Sarvagum agnigum rapsushado huve vo, mayi varcho balam ojo nidhatta',
].join('\n');

// The meaning of the Gayatri, said right after the Gayatri dhyanam as haindavam.org has it, at
// the site owner's word (19 Nov 2026); vignanam.org says it after the 24 mudras.
const YO_DEVAH = [
  'Yo devas savita\'smakam, dhiyo dharmadi gocharah',
  'Prerayet tasya yad bhargah, tad varenyam upasmahe',
].join('\n');

// Muni namaskaram, after the dig devata namaskaram (vignanam.org).
const MUNI_NAMASKARAM = [
  'Namo ganga yamunayor madhye ye vasanti, te me prasannatmanas chiranjivitam vardhayanti',
  'Namo ganga yamunayor munibhyas cha namo, namo ganga yamunayor munibhyas cha namah',
].join('\n');

// The closing namaskarams after the udvasanam, as vignanam.org gives them, its spelling slips
// corrected (janardanam, jagattrayam, upabruve, vrijanam as in Rig Veda 1.185.11). Its
// "akasat patitam" verse comes before "sarva vedeshu", with the refrain vignanam adds to it ("sri
// kesavam pratigacchaty om nama iti"); the owner dropped the Surya Narayana step it was in before,
// keeping only these lines here, and dropped the Yama vandanam too (19 Nov 2026). Its "namo
// brahmanya devaya", which vignanam says after the Harihara verses, before the udvasanam, is at
// the end of the Harihara step here. The owner says both.
// "Stutva devam janardana om nama iti" is vignanam's reading, vocative or a slip for janardanam.
const BHAGAVAN_NAMASKARAM = [
  'Namo\'stv anantaya sahasra murtaye, sahasra padakshi siroru bahave',
  'Sahasra namne purushaya sasvate, sahasra koti yuga dharine namah',
  'Idam dyavaprithivi satyam astu, pitar matar yad ihopabruve vam',
  'Bhutam devanam avame avobhih, vidyamesham vrijanam jiradanum',
  'Akasat patitam toyam, yatha gacchati sagaram',
  'Sarva deva namaskarah, kesavam prati gacchati',
  'Sri kesavam pratigacchaty om nama iti',
  'Sarva vedeshu yat punyam, sarva tirtheshu yat phalam',
  'Tat phalam purusha apnoti, stutva devam janardanam',
  'Stutva devam janardana om nama iti',
  'Vasanad vasudevasya, vasitam te jagattrayam',
  'Sarva bhuta nivaso\'si, sri vasudeva namo\'stu te',
  'Sri vasudeva namo\'stu te om nama iti',
].join('\n');

// The Harihara verses, then "namo brahmanya devaya", which vignanam.org's text says next and the
// site's owner says too (19 Nov 2026).
const HARIHARA = [
  'Sivaya vishnurupaya, sivarupaya vishnave',
  'Sivasya hridayam vishnur, vishnos cha hridayam sivah',
  'Yatha sivamayo vishnur, evam vishnumayah sivah',
  'Yathantaram na pasyami, tatha me svastir ayushi',
  'Namo brahmanya devaya, go brahmana hitaya cha',
  'Jagad dhitaya krishnaya, govindaya namo namah',
].join('\n');

// The closing samarpanam in the order the site's owner gave it (19 Nov 2026): "yasya smritya",
// "mantrahinam", the sandhya offered ("anena ... priyatam"), "abrahmalokat", "kayena vacha", then
// the offering to Parameswara and Narayana's name three times. He named most verses by their first
// words; the rest is their common wording ("ye santi brahmana devah" as haindavam.org has it), for
// him to confirm (IDEAS.md).
const samarpanamLines = (k) => [
  'Yasya smritya cha namoktya, tapo yajna kriyadishu',
  'Nyunam sampurnatam yati, sadyo vande tam achyutam',
  'Mantrahinam kriyahinam, bhaktihinam janardana',
  'Yat kritam tu maya deva, paripurnam tad astu me',
  `Anena ${k.japaName}vandanena bhagavan sarvatmakah sri parameswarah priyatam`,
  'Abrahmalokad aseshat, alokaloka parvatat',
  'Ye santi brahmana devah, tebhyo nityam namo namah',
  'Kayena vacha manasendriyair va, buddhyatmana va prakriteh svabhavat',
  'Karomi yad yat sakalam parasmai, narayanayeti samarpayami',
  'Om tat sat, sri parameswararpanam astu',
  'Om narayanaya namah, om narayanaya namah, om narayanaya namah',
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

// A step's instructions can name another step as "{step:<id>}": this puts that step's number
// (counting from 1) in its place. An id that is not in `steps` is left as it is, for
// check_ui.mjs to catch.
export function numberStepRefs(text, steps) {
  return text.replace(/\{step:([\w-]+)\}/g, (whole, id) => {
    const i = steps.findIndex((s) => s.id === id);
    return i < 0 ? whole : String(i + 1);
  });
}

// The steps of one sandhya with their words in one language. `X` is that language's table from
// ui_i18n.js (null or undefined for English). Each title, instruction and note is looked up most
// specific first: step.<id>.<field>.<sandhya>, step.<id>.<field>, and for a repeated step
// step.again.<ref>.<field>, shared by every repeat; the English from sandhyaSteps() when there is
// none (a note only where the English has one). "{n}" becomes the sandhya's arghya count and
// "{step:<id>}" that step's number. Mantras are left as they are. The page (template.html
// localSteps) and check_ui.mjs both use this, so the check sees what the page shows.
export function localizeSteps(kindKey, X) {
  const steps = sandhyaSteps(kindKey), arghyas = String(SANDHYA_KINDS[kindKey].arghyas);
  const pick = (field, st) => X?.[`step.${st.id}.${field}.${kindKey}`] ?? X?.[`step.${st.id}.${field}`]
    ?? (st.ref ? X?.[`step.again.${st.ref}.${field}`] : undefined);
  return steps.map((st) => {
    const out = { ...st };
    for (const f of ['title', 'how', 'note']) {
      if (typeof st[f] !== 'string') continue;
      out[f] = numberStepRefs((pick(f, st) || st[f]).replace(/\{n\}/g, arghyas), steps);
    }
    return out;
  });
}

// The full sequence for one sandhya. Repeated steps point back with `ref` instead of repeating text.
// Achamanam comes again after each part of the rite, at the seven points where the poojalu.com
// text marks "achamya": after prasanam, aghamarshanam, atma pradakshinam, tarpanam, avahanam,
// the japam with its mudras, and abhivadanam. Other Telugu texts mark most of these, not all.
export function sandhyaSteps(kindKey) {
  const k = SANDHYA_KINDS[kindKey];
  const lines = (a) => a.join('\n');
  const mamopatta = 'Mamopatta samasta duritakshaya dwara Sri Parameswara preetyartham, ';
  const again = (n) => ({ id: `achamanam${n}`, title: 'Achamanam', ref: 'achamanam',
    how: 'Do achamanam again, as in step {step:achamanam} (or step {step:achamanam-kesava}, as your family does).' });
  return [
    { id: 'apavitra', title: 'Suddhi: apavitrah pavitro va',
      how: 'Remember Vishnu as you say the verse, and sprinkle a little water on your head three times with the fingers of the right hand.',
      mantra: APAVITRA },
    { id: 'achamanam', title: 'Achamanam: trir achamet',
      how: 'Sitting, do one thing for each line as you say it: sip a little water from the right palm three times, once at each swaha, so that it reaches the heart; wipe the lips three times with the right thumb (some families twice); touch the lips once with the three middle fingers (some twice); sprinkle water on the left hand with the right; sprinkle both feet and the head, then touch the eyes with thumb and ring finger, the nostrils with thumb and forefinger and the ears with thumb and little finger; then wash the hands.',
      note: 'These lines are the rule for achamanam in the Apastamba Dharmasutra (1.5.16), said a line at a time; as the sutra says, some wipe the lips twice, and some touch them twice. An achamanam by this rule is usually called the smrityachamanam. With the three sips this family says "swaha" three times.',
      mantra: ACHAMANAM_APASTAMBA },
    { id: 'achamanam-kesava', title: 'Achamanam with the Kesava names (in many families)',
      how: 'Most printed Telugu books open with this achamanam, with Vishnu\'s names, in place of the one in step {step:achamanam}; follow your family. Sip a little water from the right palm at each of the first three names. Then touch the face and limbs with the fingers of the right hand as each following name is said.',
      mantra: KESAVADI },
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
    again(2),
    { id: 'punarmarjanam', title: 'Punar marjanam',
      how: 'Sprinkle water on the head again at each line, as in marjanam (step {step:marjanam}).',
      mantra: 'Dadhikravno akarisham, jishnor asvasya vajinah\nSurabhi no mukha karat, pra na ayugumshi tarishat\n' + APO_HI_SHTHA + '\nOm bhur bhuvas suvah' },
    { id: 'marjanam3', title: 'Marjanam: hiranyavarnah',
      how: 'Sprinkle water on the head again at each line, as in marjanam (step {step:marjanam}).',
      mantra: HIRANYAVARNA },
    { id: 'aghamarshanam', title: 'Aghamarshanam',
      how: 'Take water in the right palm and hold it near the nose. Say the mantra, then cast the water away to the left without looking at it.',
      mantra: 'Drupadad iva munchatu, drupadad iven mumuchanah\nSvinnah snatvi malad iva, putam pavitrenevajyam\nApah sundhantu mainasah' },
    again(3),
    { id: 'arghyam', title: `Arghya pradanam: ${k.arghyas} arghyas`, arghya: true,
      how: k.arghyaHow,
      mantra: `${mamopatta}${k.japaName} arghya pradanam karishye\n\n${kindKey === 'madhyahnika' ? HAMSAS + '\n' : ''}${GAYATRI}`,
      note: 'If the right time has passed, first say "Kalatita dosha pariharartham prayaschittartham turiyarghya pradanam karishye" and offer one more arghya with the Gayatri: the prayaschitta arghya, which some books call the turiyarghya.' },
    { id: 'pradakshinam', title: 'Atma pradakshinam',
      how: 'Take water in the right palm, turn around once clockwise where you stand, and sprinkle the water around you.',
      mantra: 'Udyantam astam yantam adityam abhidhyayan\nKurvan brahmano vidvan sakalam bhadram asnute\nAsav adityo brahmeti, brahmaiva san brahmapyeti ya evam veda\nAsav adityo brahma' },
    again(4),
    { id: 'tarpanam', title: 'Sandhya tarpanam',
      how: 'Do pranayamam (step {step:pranayamam}). Then pour a little water over the fingertips for each name.',
      mantra: lines(TARPANAM[kindKey]) },
    again(5),
    { id: 'avahanam', title: 'Gayatri avahanam',
      how: 'Invite the Devi with palms joined.',
      mantra: `${OMITYEKAKSHARAM}\n${AVAHANAM}` },
    // The japam starts with the srautachamanam, the achamanam with the Gayatri's padas (the site's
    // owner, 19 Nov 2026: "not Kesava, it is Om tat savitur ... swaha"). vignanam.org says the
    // Kesava names here; a Telugu Srauta Saiva text says the Gayatri's padas.
    { id: 'achamanam6', title: 'Srautachamanam (before the japam)',
      how: 'Sip a little water from the right palm at each of the first three lines. Then do one thing for each phrase that follows: wash both palms with water, twice; wipe the upper, then the lower lip with the right thumb; sprinkle water on the head, twice; sprinkle water on the left hand, both feet and the head. Then touch the chin; the left and right nostril with thumb and forefinger; the left and right eye and the left and right ear with thumb and ring finger; the navel with thumb and little finger, then the heart and the head; and the left and right shoulder.',
      mantra: SRAUTACHAMANAM },
    // The rishi, chandas and devata lines once said after the japa sankalpam are dropped (the
    // site's owner, 19 Nov 2026); no Telugu text checked had them there.
    { id: 'japa-prep', title: 'Preparing for Gayatri japam',
      how: 'Do pranayamam (step {step:pranayamam}). Then say the japa sankalpam.',
      mantra: `${mamopatta}${k.japaName}nga yathasakti gayatri maha mantra japam karishye` },
    { id: 'nyasam', title: 'Kara nyasam and anga nyasam',
      how: 'With the kara nyasam, touch the fingers each line names: draw the forefingers along the thumbs, then the thumbs along the forefingers, middle, ring and little fingers, from base to tip; at the sixth line, pass the palms and the backs of the hands over each other. With the anga nyasam, touch the heart, the head, the crown, both shoulders with the arms crossed, and both eyes and the point between the brows; at "astraya phat" circle the right hand around the head and clap it on the left palm. At the last line, snap the fingers around the head to close the directions (some families hook the two forefingers together).',
      mantra: GAYATRI_NYASAM, nyasa: NYASA_LINES },
    { id: 'dhyanam', title: 'Gayatri dhyanam',
      how: 'Meditate on the Devi in this form.',
      mantra: DHYANAM },
    // "Yo devas savita" belongs to the dhyanam (the site's owner, 19 Nov 2026), right after the
    // Gayatri dhyanam as haindavam.org has it, and before the verse for this sandhya.
    { id: 'yo-devah', title: 'Yo devas savita',
      how: 'Still meditating on the Devi, say this verse, which gives the meaning of the Gayatri.',
      mantra: YO_DEVAH },
    { id: 'kala-dhyanam', title: 'Dhyanam for this sandhya',
      how: 'Meditate on the Devi in the sun\'s orb, in the form she takes at this hour.',
      pictures: DHYANA_PICTURES[kindKey], mantra: lines(KALA_DHYANAM[kindKey]) },
    { id: 'purvamudra', title: 'Purva mudras: 24 (in many families)', mudras: PURVA_MUDRAS,
      how: 'Before japam, show the 24 Gayatri mudras in this order, with the hand positions your guru taught. Play moves the drawing from one mudra to the next.' },
    { id: 'japam', title: 'Gayatri japam', japa: true,
      how: `${k.japaHow} Say the Gayatri 108 times, or 28, or at least 10. Tap the counter for each one.`,
      mantra: GAYATRI },
    // After the japam the nyasam is said again, ending with the digvimokam, which releases the
    // directions bound before the japam (the site's owner, 19 Nov 2026; haindavam.org's
    // japavasanam has it too). The page has the fingers go round the head the other way; neither
    // the owner nor haindavam.org says which way, so IDEAS.md asks.
    { id: 'nyasam2', title: 'Nyasam again (after the japam)', nyasa: NYASA_LINES_AFTER,
      how: 'Do the kara and anga nyasam again, as in step {step:nyasam}. At the last line, snap the fingers round the head the other way, to release the directions.',
      mantra: GAYATRI_NYASAM_AFTER },
    { id: 'uttaramudra', title: 'Uttara mudras: 8 (in many families)', mudras: UTTARA_MUDRAS,
      how: 'After japam, show the 8 closing mudras in this order.' },
    { id: 'brahmarpanam', title: 'Japa samarpanam',
      how: 'Offer the japam with these words.',
      mantra: `${k.kale} gayatri mahamantra jape sarvam parabrahmarpanam astu` }, // the site's owner's words, 19 Nov 2026
    again(7),
    { id: 'upasthanam', title: k.upasthanaTitle, how: k.upasthanaHow, mantra: lines(UPASTHANAM[kindKey]) },
    { id: 'digdevata', title: 'Dig devata namaskaram',
      how: 'Turn to each direction in order and bow: east, south, west, north, above, below, and all between.',
      mantra: DIG_DEVATA },
    { id: 'muni', title: 'Muni namaskaram', how: 'Bow to the sages who live between the Ganga and the Yamuna.', mantra: MUNI_NAMASKARAM },
    { id: 'sandhyadevata', title: 'Sandhya devata namaskaram', how: 'Bow with joined palms.', mantra: SANDHYA_DEVATA },
    { id: 'harihara', title: 'Harihara vandanam', how: 'Bow with joined palms.', mantra: HARIHARA },
    { id: 'udvasanam', title: 'Gayatri udvasanam',
      how: 'Bid the Devi farewell.',
      mantra: 'Uttame sikhare jate, bhumyam parvata murdhani\nBrahmanebhyo\'bhyanujnata, gaccha devi yathasukham\nStuto maya varada vedamata, prachodayanti pavane dvijata\nAyuh prithivyam dravinam brahmavarchasam, mahyam dattva prajatum brahmalokam' },
    { id: 'namaskarams', title: 'Bhagavan namaskaram', how: 'Bow with joined palms.', mantra: BHAGAVAN_NAMASKARAM },
    { id: 'abhivadanam', title: 'Abhivadanam', abhivadanam: true,
      how: 'Touch both ears, then bow, introducing yourself by pravara, gotram, sutra and veda. Fill in your details above.' },
    // After the abhivadanam the achamanam is the Kesava names (the site's owner, 19 Nov 2026).
    { id: 'achamanam8', title: 'Achamanam (Kesava names)', ref: 'achamanam-kesava',
      how: 'Do achamanam with the Kesava names, as in step {step:achamanam-kesava}.' },
    { id: 'samarpanam', title: 'Samarpanam',
      how: 'Offer the whole sandhyavandanam with these verses.',
      mantra: samarpanamLines(k) },
  ];
}
