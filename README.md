# Sankalpam · Telugu Panchangam

A free, open website for the daily panchangam, sankalpam and Krishna Yajurveda
sandhyavandanam, computed for wherever you are.

Live: **https://telugu-sankalpam.web.app**

*In fond remembrance of Yeragudipati Bhujanga Rao.*

## What it does
- **Panchangam:** a lunar-month calendar (amanta, Telugu month names) and a day sheet. It shows
  tithi, nakshatram, yogam and karanam with end times, chandra and surya rasi, moonrise and
  moonset, Rahu kaalam, Yamagandam, Gulika kaalam, Abhijit, and vrata days.
- **Sankalpam:** built for the day, the place and the person (gotram, name), in Full, Laghu or
  Short form.
  - In the Deccan, it uses the Srisailam direction and the river band.
  - North and east of it, it uses the north Indian form: region, river and the town's
    traditional name.
  - The great kshetras (Kashi, Tirumala, Srisailam, Kamakhya …) get their own wording.
  - Abroad, the place line is left for the family to fill in.
- **Sandhyavandanam:** the Apastamba order for Pratah, Madhyahnikam and Sayam, picked by the
  time of day, with:
  - a pranayamam breathing timer
  - an arghya countdown
  - a Gayatri japa counter and timer
  - the purva and uttara mudras in sequence
- **Places:** 646 places in India and abroad, a map of kshetras with their deities, and "use my
  location".

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
| `template.html` | The page: layout, styles and the user-interface script. |
| `build.sh` | Inlines the modules into `site/public/index.html` (and `panchangam.html`, a single-file copy). |
| `check.mjs` | Prints Bengaluru values to compare with drikpanchang.com. |
| `IDEAS.md` | Ideas and open questions for what to build next. |

## Build and deploy
```sh
sh build.sh
node check.mjs
cd site && npx -y firebase-tools@13 deploy --only hosting --project <your-firebase-project>
```

## Please help
- **Mantra text** is plain English transliteration without svaras. It is a reading aid, not a
  substitute for a guru. Corrections from vaidikas are very welcome.
- **Kshetra wordings, river lines and traditional town names** are drafted from common usage and
  checked once. Families and regions differ, and every line can be edited on the page. Please
  open an issue when your family's wording differs.
- **Vrata days** follow the rules computed panchangams use; matha panchangams can differ by a day.

## Licence
MIT; see `LICENSE`. The mantras themselves are ancient texts and belong to no one.
