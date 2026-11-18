# Sankalpam · Telugu Panchangam

A free, open website for the daily panchangam, sankalpam and Krishna Yajurveda
sandhyavandanam, computed for wherever you are.

Live: **https://telugu-sankalpam.web.app**

*In fond remembrance of Yeragudipati Bhujanga Rao.*

## What it does
- **Panchangam:** a lunar-month calendar (amanta, Telugu month names) and a day sheet. It shows
  tithi, nakshatram, yogam and karanam with end times, chandra and surya rasi, moonrise and
  moonset, Rahu kaalam, Yamagandam, Gulika kaalam, Abhijit, and vrata days. For today, a bar from
  sunrise to sunset shows the kaalams and where the sun is now.
- **Sankalpam:** built for the day, the place and the person (gotram, name), in Full, Laghu or
  Short form.
  - In the Deccan, it uses the Srisailam direction and the river band.
  - North and east of it, it uses the north Indian form: region, river and the town's
    traditional name.
  - The great kshetras (Kashi, Tirumala, Srisailam, Kamakhya …) get their own wording.
  - Abroad, the place line is left for the family to fill in.
- **Sandhyavandanam:** the Apastamba order for Pratah, Madhyahnikam and Sayam, picked by the
  time of day (and kept while you are reading, when the clock moves on), with:
  - the grade of the hour by the sky: for Pratah uttama while the stars are out, madhyama once
    they fade, adhama after sunrise; for Sayam the reverse
  - a pranayamam breathing timer
  - an arghya countdown
  - a Gayatri japa counter and timer
  - line drawings of the 24 purva and 8 uttara mudras, the hands moving from one mudra to the next
- **Places:** 646 places in India and abroad, a map of kshetras with their deities, and "use my
  location".
- **Languages:** English, Telugu, Tamil, Kannada and Hindi. In Telugu, Kannada and Hindi the
  mantras, the sankalpam and place names are in that script too, all made from one Telugu-script
  text. The English page shows the mantras and the sankalpam in Roman letters with pronunciation
  marks (IAST), made from the same Telugu text. Tamil shows mantras in plain English letters for
  now, because Tamil script has no letters for the Sanskrit aspirated and voiced sounds.

Everything is computed in the browser; nothing is sent to a server. Gotram, name and location
stay in the phone's own storage.

## How accurate it is
Checked against drikpanchang.com:
- 18 day pages (Bengaluru, Hyderabad, Chennai, Varanasi, Tirupati): sunrise and sunset, the angas'
  end times, and the kalams, all within 2 minutes.
- 24 sankranti moments in 2026–27: within ±0.4 minutes (1 sd).
- 10 moonrises and moonsets: within 1 minute.
- All 50 Sankatahara Chavithi dates for Hyderabad and Varanasi in 2026–27: exact.
- 160 lunar fortnights across 4 cities: exactly one of each vrata in every fortnight.

The astronomy:
- Sun: VSOP87 as abridged by Meeus.
- Moon: Meeus chapter 47.
- Sidereal positions use the mean Lahiri ayanamsa, fitted to drikpanchang's sankranti times.

## Files
| File | What it is |
|---|---|
| `engine.js` | Astronomy, panchangam, vrata rules, time zones, sankalpam text and place wording (pure functions). |
| `sandhya.js` | Sandhyavandanam steps and mantra text; which sandhya fits a time. |
| `places.js` | 499 Indian places (metros, Tier 1/2/3, kshetrams). |
| `places_abroad.js` | US cities, world capitals and diaspora cities, with time zones. |
| `deities.js` | Presiding deity, emblem and standing of 210 kshetrams. |
| `local_rivers.js` | The river (or sangamam) and bank for 201 towns, used in the sankalpam. |
| `mudra_rig.js` | Draws each Gayatri mudra from joint angles (two hands, and the body for four of them) and blends one pose into the next. |
| `ui.js`, `ui_i18n.js`, `names_i18n.js` | Page text in English, and in Telugu, Tamil, Kannada and Hindi; panchangam names in those languages. |
| `mantras_te.js` | The sandhyavandanam mantras, abhivadanam and mudra names in Telugu script. |
| `sankalpam_te.js` | The sankalpam's wording and day names in Telugu script (the same table `engine.js` uses in English). |
| `places_te.js` | Place, state and deity names, and every phrase of the sankalpam's place line, in Telugu script. |
| `indic.js` | Writes Telugu-script text in Kannada or Devanagari letters (the three share one Unicode layout), or in Roman letters with pronunciation marks for the English page. |
| `template.html` | The page: layout, styles and the user-interface script. The design notes are in the comment at the top of its styles. |
| `build.sh` | Inlines the modules into `site/public/index.html` (and `panchangam.html`, a single-file copy). |
| `site/public/img/` | The Devi's pictures for the dhyanam step (`DHYANA_PICTURES` in `sandhya.js`): made for the site with an AI image tool, WebP, 720 by 900, without metadata. |
| `check.mjs` | Prints Bengaluru values to compare with drikpanchang.com. |
| `check_mudras.mjs` | Checks that every mudra in the sandhya steps has a drawing, and that each draws and moves cleanly. |
| `check_te.mjs` | Checks the Telugu-script text: same lines as the English, no stray English letters, every place and phrase covered. |
| `check_ui.mjs` | Checks the page: every element the script uses exists, page text and every sandhya step's words in all five languages (step numbers filled in, none written by hand), the drawings' colours opaque, text contrast (WCAG 4.5:1) over every sky, light and dark, and the dhyanam pictures (whole 720 by 900 WebP files without metadata, and none unlisted). |
| `IDEAS.md` | Ideas and open questions for what to build next. |

## Build and deploy
```sh
sh build.sh
node check.mjs
node check_mudras.mjs
node check_te.mjs
node check_ui.mjs
cd site && npx -y firebase-tools@13 deploy --only hosting --project <your-firebase-project>
```

## Please help
- **Mantra text** is without svaras, in Telugu script (from which the Kannada, the Devanagari and
  the English page's Roman letters with pronunciation marks are made) and in plain English letters
  for Tamil. It is a reading aid, not a substitute for a guru.
  Corrections from vaidikas are very welcome; a Telugu correction fixes all four.
- **Kshetra wordings, river lines and traditional town names** are drafted from common usage and
  checked once. Families and regions differ, and every line can be edited on the page. Please
  open an issue when your family's wording differs.
- **Mudra drawings** show the usual form of each mudra, drawn from its description and checked
  against the pictures in a printed Telugu sandhyavandanam book. Families differ in small
  details, and a few (Kurmam, Varaham) are described differently from book to book. To correct
  one, change its pose in `mudra_rig.js`: each pose is a few numbers per hand.
- **Vrata days** follow the rules computed panchangams use; matha panchangams can differ by a day.

## Licence
MIT; see `LICENSE`. The mantras themselves are ancient texts and belong to no one. The Devi's
pictures in `site/public/img/` were made for this site with an AI image tool; whether they share
the code's licence is an open question (IDEAS.md).
