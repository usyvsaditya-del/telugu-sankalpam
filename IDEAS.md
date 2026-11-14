# Ideas for review: Sankalpam site

Drafted 14 Nov 2026 for the review session. Every idea stays anchored in shastra: it either helps
someone do a karma correctly and on time, or gets the computed part right so the family can
trust it. Each one says what it would take and the main risk.

## Recommended first: the highest value for Telugu Brahmin families

1. **Shraddha tithi finder.** Enter a parent's death tithi, paksha and masam once. The site gives
   this year's shraddha date for your town, the right day when the tithi is kshaya or repeated
   (aparahna rule), and the Mahalaya paksha date. It can also remind you a week ahead.
   *Takes:* the existing engine plus the aparahna rule. *Risk:* families differ on the kshaya-tithi
   rule, so show the rule used.

2. **Ekadasi with parana time.** Name each Ekadasi (Vaikuntha, Nirjala, Prabodhini …) and compute
   the parana window the next morning (after Hari vasara, before Dwadasi ends). Smarta and
   Vaishnava days shown side by side when they differ.
   *Takes:* engine work, all computed. *Risk:* low, and it is the question people ask most.

3. **Amavasya tarpanam guide.** Like the Sandhya tab: Apastamba tarpana vidhi, prachinaveeti
   cues, sankalpam filled in, pitru names kept on the phone only.
   *Takes:* text plus review by a vaidika. *Risk:* mantra accuracy, so the same review gate as sandhya.

4. **Kaala chakra dial (your clock idea).** A 24-hour ring from sunrise to sunrise showing Rahu,
   Yamagandam, Gulika, Abhijit, the three sandhya windows and when the tithi and nakshatram change,
   with a hand for "now". It puts the whole day's muhurta on one screen.
   *Takes:* drawing only; the numbers exist. *Risk:* none.

5. **Today's panchangam as a WhatsApp card.** One tap makes a maroon-and-gold image of today's
   panchangam for the family group ("Subhodayam" culture).
   *Takes:* canvas and Web Share. *Risk:* none, and it spreads the site on its own.

## Next
6. **Festival dates by rule.** Ugadi, Sri Rama Navami, Vinayaka Chavithi, Dasara, Deepavali,
   Karthika Somavarams, Maha Sivaratri, Sankranti, and Yajur Upakarma (Sravana Pournami),
   computed for your town with the rule shown.
7. **Pushkaralu calendar.** The river whose pushkaram is running (Jupiter's rasi: Godavari in
   Simha, Krishna in Kanya …), with the tirtha snana sankalpam. A distinctly Telugu tradition.
8. **Grahanam mode.** Eclipse times for your town, vedha/sutak start, and the grahana snana and
   japa sankalpam.
9. **Brahma yajnam and the rest of nitya karma.** Complete the Madhyahnikam with Brahma yajnam,
   and keep a private nitya-karma checklist (sandhya, brahma yajnam, deva puja, vaishvadevam).
   It is a checklist, not a streak counter.
10. **Gotra and pravara list.** Pick your gotram and the pravara rishis fill in (about 40 common
    gotras). It saves typing and avoids misspelt pravaras. *Risk:* the list needs a pandit's check.
11. **Tarabalam and Chandrabalam.** Enter your janma nakshatram once and see each day's tara and
    chandra balam, the personal side of muhurta.
12. **Yatra mode.** When you are physically at a kshetram, show its sankalpam wording, timings and
    a short sthala note.

## Later, or only with the right source
- **Svara audio** only from a pathashala or temple that permits it. Text-to-speech would get the
  svaras wrong.
- **Deity images** only from temple-approved or public-domain sources (e.g. Raja Ravi Varma);
  most temples do not permit photos of the moolavirat.
- **Tamil script for the mantras.** Telugu, Kannada and Hindi now show the mantras and the
  sankalpam in their own script, made from one Telugu-script text. Tamil still shows English
  letters: Tamil script has no aspirated or voiced letters, so Sanskrit needs a choice of style.
  The two usual ones are Grantha letters with superscript numbers (க², க³, க⁴), as Tamil
  sandhyavandanam books print, or plain Tamil letters with a note. Needs a Tamil reader to choose.
- **Calendar by language.** Choosing a language changes only the words. Each community also counts
  differently, and these would be separate calendar options:
  - Tamil families use solar months, and the Tamil year turns at Chithirai 1, not Ugadi.
  - Hindi-speaking families mostly use purnimanta months, so their Krishna paksha carries the next
    month's name.
  - North Indian panchangams name the year by a different count. For 2026 that may be Raudra
    rather than Parabhava; this is unverified.

## Open questions for the review
- Who reviews the mantra text and the kshetra wordings before wider sharing? The scripture
  review found these Telugu pieces still missing, left out because they should come from a
  vaidika rather than from memory: muni namaskaram, kara nyasa and anga nyasa, the third marjanam
  ("Hiranyavarnah suchayah pavakah ..."), and the farewell verse "Stuto maya varada vedamata ...".
- Hyderabad comes out "Srisailasya Uttara" by the map (344°, close to Vayavya). Which does your
  family say? The line can now be edited either way.
- Default sankalpam inside sandhya: Short (as now) or Full?
- A custom domain for the site later?
- The uttara mudras: the site uses Surabhi, Jnana, Vairagya, Yoni, Sankha, Pankaja, Linga, Nirvana.
  The Telugu book used for the drawings also prints Chakram (for Vairagyam) and Kurmah (for
  Shankhah) at 3 and 5, and some Telugu compilations end with Niryana. Which does your family say?
- Mudra drawings to confirm with someone who does them daily: Kurmam and Varaham (books describe
  them differently), Sammukhonmukham (the book's picture is unclear), Yamapasam.
- Place wordings the Telugu pass found doubtful in the English source (places_te.js follows the
  English for now): "Shakini Dakini sangame" is usually Śaṅkhinī–Ḍaṅkinī; "Biraja" is the Odia
  form of Virajā; "Omkareswara Mamaleswara" may be a mis-split of Omkara + Amaleswara;
  "Manair" is the Telugu Maneru. Several kshetra wordings also put a Tamil or Hindi form inside
  the Sanskrit (Kumbeswarar, Shrinathji, "Narmada Mata sannidhau"); a purohit should settle them.
- Hindi place names are made from the Telugu spellings, so a few read Telugu-style
  (हैदराबादु). A Hindi place list would fix that.
- The dedication line is in English in every language. How does the family write
  "Yeragudipati Bhujanga Rao" in Telugu?
- Word choices a native reader should confirm:
  - Tamil paksha: வளர்பிறை/தேய்பிறை or சுக்ல/கிருஷ்ண.
  - Kannada paksha: ಕೃಷ್ಣ or ಬಹುಳ.
  - Telugu yoga forms: శుభం or శుభ.
  - Telugu karanas: తైతుల/గరజి or తైతిల/గరజ.
  - Tamil Vishti: பத்திரை or விஷ்டி.
  - Telugu: సంకటహర చతుర్థి or చవితి.
