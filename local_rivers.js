// local_rivers.js — the river a family at each place actually names in the sankalpam.
//
// Keyed by the exact place name in places.js. A place has an entry only when a river flows
// through or along the town (within about 5 km of its centre), or the temple of a pilgrimage
// place stands on its bank. No entry means: coastal only, a hill shrine with only a tank or
// spring, or only a small local stream or urban drain. The sankalpam then falls back to the
// regional river band (engine.js riverLine) and the family fills in its own river.
//
// Fields
//   river  Common English name. A sangamam (confluence) lists every river, joined by " and ".
//   sk     Name for the sankalpam: the Sanskrit / Puranic name where one is well attested
//          (Penna → Pinakini, Vaigai → Kritamala, Hooghly → Bhagirathi, Jhelum → Vitasta ...),
//          otherwise the common name. Same order and count as `river`.
//   bank   "uttare" | "dakshine" | "purve" | "paschime" for the bank the town (or, for a temple
//          town, the temple) stands on — only where a source or certain knowledge says so.
//          null when the town straddles the river, sits on an island, at a sangamam, at a
//          source, or the bank is not certain.
//   conf   "high": confirmed on a public page (named in the trailing comment) or certain.
//          Every entry here is "high"; fairly-sure guesses were checked and either upgraded
//          or dropped, so no "medium" entries remain.
//
// Built 14 Nov 2026 from general knowledge, checked against the public pages named per row
// (mostly en.wikipedia.org/wiki/<page>). Check script: local_rivers_check.mjs.

export const LOCAL_RIVERS = {
  // ---- Metros ----
  "Delhi": { river: "Yamuna", sk: "Yamuna", bank: null, conf: "high" }, // wiki Delhi: straddles, chiefly west
  "Kolkata": { river: "Hooghly", sk: "Bhagirathi", bank: "purve", conf: "high" }, // wiki Kolkata: eastern bank
  "Hyderabad": { river: "Musi", sk: "Musi", bank: null, conf: "high" }, // wiki Hyderabad; old name Muchukunda (wiki Musi_River_(India))
  "Ahmedabad": { river: "Sabarmati", sk: "Sabhramati", bank: null, conf: "high" }, // wiki Ahmedabad
  "Pune": { river: "Mula and Mutha", sk: "Mula and Mutha", bank: null, conf: "high" }, // wiki Pune: old city at the confluence

  // ---- Andhra Pradesh ----
  "Vijayawada": { river: "Krishna", sk: "Krishnaveni", bank: "uttare", conf: "high" }, // wiki Vijayawada; north bank (Guntur dist. across)
  "Nellore": { river: "Penna", sk: "Pinakini", bank: "dakshine", conf: "high" }, // wiki Nellore; wiki Penna_River (Pinakini)
  "Kurnool": { river: "Tungabhadra", sk: "Tungabhadra", bank: "dakshine", conf: "high" }, // wiki Kurnool: southern banks
  "Rajahmahendravaram (Rajahmundry)": { river: "Godavari", sk: "Godavari", bank: "purve", conf: "high" }, // wiki Rajahmahendravaram: river flows to the west of the city
  "Tirupati": { river: "Swarnamukhi", sk: "Swarnamukhi", bank: null, conf: "high" }, // wiki Tirupati: passes through the city
  "Srikakulam": { river: "Nagavali", sk: "Nagavali", bank: null, conf: "high" }, // wiki Nagavali_River (also Langulya)
  "Srikalahasti": { river: "Swarnamukhi", sk: "Swarnamukhi", bank: null, conf: "high" }, // wiki Srikalahasti; wiki Srikalahasti_temple
  "Srisailam": { river: "Krishna", sk: "Krishnaveni", bank: null, conf: "high" }, // wiki Mallikarjuna_Temple,_Srisailam (Patala Ganga)
  "Annavaram": { river: "Pampa", sk: "Pampa", bank: null, conf: "high" }, // wiki Annavaram: hill overlooks the Pampa
  "Mantralayam": { river: "Tungabhadra", sk: "Tungabhadra", bank: null, conf: "high" }, // wiki Mantralayam
  "Puttaparthi": { river: "Chitravathi", sk: "Chitravati", bank: null, conf: "high" }, // wiki Puttaparthi; wiki Chitravathi_River
  "Amaravati": { river: "Krishna", sk: "Krishnaveni", bank: "dakshine", conf: "high" }, // wiki Amaravati,_Andhra_Pradesh: right (south) bank
  "Kanipakam": { river: "Bahuda", sk: "Bahuda", bank: null, conf: "high" }, // hindupedia.com/en/Kanipakkam_Sri_Varasidhi_Vinayakar
  "Antarvedi": { river: "Vasishta Godavari", sk: "Vasishta Godavari", bank: null, conf: "high" }, // wiki Antarvedi: where it meets the sea

  // ---- Telangana ----
  "Karimnagar": { river: "Manair", sk: "Manair", bank: null, conf: "high" }, // wiki Karimnagar,_Telangana
  "Khammam": { river: "Munneru", sk: "Munneru", bank: "purve", conf: "high" }, // wiki Khammam: river on the western side of the city
  "Ramagundam": { river: "Godavari", sk: "Godavari", bank: null, conf: "high" }, // wiki Ramagundam
  "Bhadrachalam": { river: "Godavari", sk: "Godavari", bank: null, conf: "high" }, // wiki Bhadrachalam
  "Basara": { river: "Godavari", sk: "Godavari", bank: null, conf: "high" }, // wiki Basara,_Telangana
  "Kaleshwaram": { river: "Godavari and Pranahita", sk: "Godavari and Pranahita", bank: null, conf: "high" }, // wiki Kaleshwaram
  "Alampur": { river: "Tungabhadra and Krishna", sk: "Tungabhadra and Krishnaveni", bank: null, conf: "high" }, // wiki Alampur_Jogulamba_Temple: near the confluence

  // ---- Karnataka ----
  "Mangaluru (Mangalore)": { river: "Netravati and Gurupura", sk: "Netravati and Phalguni", bank: null, conf: "high" }, // wiki Mangaluru: Kudla = confluence; wiki Gurupura_River (Phalguni)
  "Shivamogga (Shimoga)": { river: "Tunga", sk: "Tunga", bank: null, conf: "high" }, // wiki Shivamogga,_Karnataka
  "Hosapete (Hospet)": { river: "Tungabhadra", sk: "Tungabhadra", bank: null, conf: "high" }, // wiki Hosapete
  "Karwar": { river: "Kali", sk: "Kali", bank: "dakshine", conf: "high" }, // wiki Karwar: mouth of the Kali; Sadashivgad on the north bank
  "Sringeri": { river: "Tunga", sk: "Tunga", bank: null, conf: "high" }, // wiki Tunga_River
  "Dharmasthala": { river: "Netravati", sk: "Netravati", bank: null, conf: "high" }, // wiki Dharmasthala
  "Kukke Subramanya": { river: "Kumaradhara", sk: "Kumaradhara", bank: null, conf: "high" }, // wiki Kukke_Subramanya
  "Kollur": { river: "Souparnika", sk: "Souparnika", bank: "dakshine", conf: "high" }, // wiki Kollur_Mookambika_Temple: southern bank
  "Horanadu": { river: "Bhadra", sk: "Bhadra", bank: null, conf: "high" }, // wiki Annapoorneshwari_Temple; wiki Bhadra_River
  "Srirangapatna": { river: "Kaveri", sk: "Kaveri", bank: null, conf: "high" }, // wiki Srirangapatna (island town)
  "Nanjangud": { river: "Kabini", sk: "Kapila", bank: null, conf: "high" }, // wiki Srikanteshwara_Temple,_Nanjangud (Kapila = Kabini)
  "Hampi": { river: "Tungabhadra", sk: "Tungabhadra", bank: "dakshine", conf: "high" }, // wiki Hampi,_Karnataka: southern banks
  "Kateel": { river: "Nandini", sk: "Nandini", bank: null, conf: "high" }, // wiki Kateel: temple on an islet in the river
  "Belur": { river: "Yagachi", sk: "Yagachi", bank: null, conf: "high" }, // wiki Belur,_Karnataka
  "Talakaveri": { river: "Kaveri", sk: "Kaveri", bank: null, conf: "high" }, // wiki Talakaveri (source)
  "Ganagapur": { river: "Bhima and Amarja", sk: "Bhimarathi and Amarja", bank: null, conf: "high" }, // wiki Ganagapura: Sangam kshetra

  // ---- Tamil Nadu ----
  "Coimbatore": { river: "Noyyal", sk: "Noyyal", bank: null, conf: "high" }, // wiki Coimbatore,_Tamil_Nadu
  "Madurai": { river: "Vaigai", sk: "Kritamala", bank: null, conf: "high" }, // wiki Madurai,_Tamil_Nadu
  "Tiruchirappalli (Trichy)": { river: "Kaveri", sk: "Kaveri", bank: null, conf: "high" }, // wiki Tiruchirappalli (corporation includes Srirangam)
  "Salem": { river: "Thirumanimuthar", sk: "Thirumanimuthar", bank: null, conf: "high" }, // wiki Salem,_Tamil_Nadu
  "Tiruppur": { river: "Noyyal", sk: "Noyyal", bank: null, conf: "high" }, // wiki Tiruppur,_Tamil_Nadu
  "Tirunelveli": { river: "Tamirabarani", sk: "Tamraparni", bank: null, conf: "high" }, // wiki Tirunelveli (town west bank, Palayamkottai east)
  "Erode": { river: "Kaveri", sk: "Kaveri", bank: "paschime", conf: "high" }, // wiki Erode,_Tamil_Nadu; west bank from own knowledge (Pallipalayam, Namakkal dist., across)
  "Vellore": { river: "Palar", sk: "Palar", bank: null, conf: "high" }, // wiki Vellore,_Tamil_Nadu
  "Cuddalore": { river: "Gadilam", sk: "Gadilam", bank: null, conf: "high" }, // wiki Cuddalore: Gadilam runs across the town
  "Karur": { river: "Amaravathi", sk: "Amaravati", bank: null, conf: "high" }, // wiki Karur,_Tamil_Nadu
  "Hosur": { river: "Thenpennai", sk: "Dakshina Pinakini", bank: null, conf: "high" }, // wiki Hosur; wiki Thenpennai_River (Dakshina Pinakini)
  "Mayiladuthurai (Mayavaram)": { river: "Kaveri", sk: "Kaveri", bank: null, conf: "high" }, // wiki Mayiladuthurai: river bisects the town
  "Srirangam": { river: "Kaveri and Kollidam", sk: "Kaveri and Kollidam", bank: null, conf: "high" }, // wiki Srirangam: island between the two
  "Kanchipuram": { river: "Vegavati", sk: "Vegavati", bank: null, conf: "high" }, // wiki Kanchipuram: Vegavathy and Palar
  "Kumbakonam": { river: "Kaveri", sk: "Kaveri", bank: "dakshine", conf: "high" }, // wiki Kumbakonam: Kaveri to the north
  "Tiruvallur": { river: "Cooum", sk: "Cooum", bank: null, conf: "high" }, // wiki Tiruvallur: on the banks of the Coovum
  "Alwarthirunagari": { river: "Tamirabarani", sk: "Tamraparni", bank: null, conf: "high" }, // wiki Alwarthirunagari_Temple
  "Thiruvarur": { river: "Odambokki", sk: "Odambokki", bank: null, conf: "high" }, // wiki Thiruvarur: passes through the centre
  "Thiruvaiyaru": { river: "Kaveri", sk: "Kaveri", bank: "uttare", conf: "high" }, // wiki Thiruvaiyaru: reached from Thanjavur across the Kaveri
  "Courtallam": { river: "Chittar", sk: "Chittar", bank: null, conf: "high" }, // wiki Courtallam: the falls are on the Chittar
  "Thirukoilur": { river: "Thenpennai", sk: "Dakshina Pinakini", bank: null, conf: "high" }, // wiki Veerateeswarar_Temple,_Thirukovilur

  // ---- Kerala ----
  "Malappuram": { river: "Kadalundi", sk: "Kadalundi", bank: null, conf: "high" }, // wiki Malappuram,_Kerala
  "Palakkad": { river: "Bharathappuzha", sk: "Bharathappuzha", bank: null, conf: "high" }, // wiki Palakkad: river flows through Palakkad
  "Kasaragod": { river: "Chandragiri", sk: "Payaswini", bank: null, conf: "high" }, // wiki Kasaragod: on its estuary; wiki Chandragiri_River (Payaswini)
  "Pathanamthitta": { river: "Achankovil", sk: "Achankovil", bank: null, conf: "high" }, // wiki Pathanamthitta,_Kerala
  "Sabarimala": { river: "Pamba", sk: "Pampa", bank: null, conf: "high" }, // wiki Pamba_River
  "Kodungallur": { river: "Periyar", sk: "Purna", bank: null, conf: "high" }, // wiki Kodungallur,_Kerala
  "Kalady": { river: "Periyar", sk: "Purna", bank: "uttare", conf: "high" }, // wiki Kalady: shrine on the northern bank; inditales.com/kalady-adi-shankaracharya-birthplace (Poorna)
  "Aranmula": { river: "Pamba", sk: "Pampa", bank: "dakshine", conf: "high" }, // wiki Aranmula_Parthasarathy_Temple: southern bank
  "Thiruvalla": { river: "Manimala", sk: "Manimala", bank: "uttare", conf: "high" }, // wiki Thiruvalla,_Kerala: northern banks
  "Chengannur": { river: "Pamba", sk: "Pampa", bank: null, conf: "high" }, // wiki Chengannur,_Kerala

  // ---- Puducherry ----
  "Yanam": { river: "Gautami Godavari", sk: "Gautami", bank: null, conf: "high" }, // wiki Yanam,_Puducherry

  // ---- Goa ----
  "Panaji": { river: "Mandovi", sk: "Mandovi", bank: "dakshine", conf: "high" }, // wiki Mandovi_River: Panaji on the left (south) bank

  // ---- Maharashtra ----
  "Kalyan-Dombivli": { river: "Ulhas", sk: "Ulhas", bank: null, conf: "high" }, // wiki Ulhas_River: flows through Kalyan and Dombivli
  "Nashik": { river: "Godavari", sk: "Godavari", bank: null, conf: "high" }, // certain (Panchavati ghats)
  "Kolhapur": { river: "Panchganga", sk: "Panchaganga", bank: null, conf: "high" }, // wiki Kolhapur,_Maharashtra
  "Sangli": { river: "Krishna", sk: "Krishnaveni", bank: null, conf: "high" }, // wiki Sangli,_Maharashtra
  "Dhule": { river: "Panzara", sk: "Panzara", bank: null, conf: "high" }, // wiki Dhule,_Maharashtra (Deopur across the river)
  "Nanded": { river: "Godavari", sk: "Godavari", bank: null, conf: "high" }, // wiki Nanded: old city north bank, new city south
  "Pandharpur": { river: "Bhima", sk: "Chandrabhaga", bank: "paschime", conf: "high" }, // wiki Pandharpur: western bank of the Bhima (Chandrabhaga)
  "Trimbakeshwar": { river: "Godavari", sk: "Godavari", bank: null, conf: "high" }, // wiki Trimbakeshwar (source)
  "Bhimashankar": { river: "Bhima", sk: "Bhimarathi", bank: null, conf: "high" }, // wiki Bhimashankar (source)
  "Morgaon": { river: "Karha", sk: "Karha", bank: null, conf: "high" }, // wiki Ganesha_Temple,_Morgaon
  "Theur": { river: "Mula-Mutha", sk: "Mula-Mutha", bank: null, conf: "high" }, // ashtavinayak.net/theur.php: road from temple gate to the river
  "Ozar": { river: "Kukadi", sk: "Kukadi", bank: null, conf: "high" }, // wiki Vigneshwara_Temple,_Ozar; wiki Kukadi_River
  "Lenyadri": { river: "Kukadi", sk: "Kukadi", bank: null, conf: "high" }, // wiki Lenyadri
  "Pali": { river: "Amba", sk: "Amba", bank: null, conf: "high" }, // wiki Ballaleshwar_Pali
  "Alandi": { river: "Indrayani", sk: "Indrayani", bank: null, conf: "high" }, // wiki Alandi,_Maharashtra
  "Dehu": { river: "Indrayani", sk: "Indrayani", bank: null, conf: "high" }, // wiki Dehu
  "Mahabaleshwar": { river: "Krishna", sk: "Krishnaveni", bank: null, conf: "high" }, // wiki Mahabaleshwar (source)
  "Ambajogai": { river: "Jayanti", sk: "Jayanti", bank: null, conf: "high" }, // wiki Ambajogai

  // ---- Gujarat ----
  "Surat": { river: "Tapi", sk: "Tapati", bank: null, conf: "high" }, // wiki Surat,_Gujarat; wiki Tapti_River (goddess Tapati)
  "Gandhinagar": { river: "Sabarmati", sk: "Sabhramati", bank: "paschime", conf: "high" }, // wiki Gandhinagar,_Gujarat: west bank
  "Bharuch": { river: "Narmada", sk: "Narmada", bank: "uttare", conf: "high" }, // wiki Bharuch,_Gujarat; north bank (Ankleshwar across)
  "Dwarka": { river: "Gomti", sk: "Gomati", bank: null, conf: "high" }, // wiki Dwarka,_Gujarat
  "Somnath": { river: "Hiran, Kapila and Saraswati", sk: "Hiranya, Kapila and Saraswati", bank: null, conf: "high" }, // wiki Somnath_temple: Triveni Sangam
  "Siddhpur": { river: "Saraswati", sk: "Saraswati", bank: null, conf: "high" }, // wiki Siddhpur
  "Shamlaji": { river: "Meshvo", sk: "Meshvo", bank: null, conf: "high" }, // wiki Shamlaji

  // ---- Rajasthan ----
  "Kota": { river: "Chambal", sk: "Charmanvati", bank: null, conf: "high" }, // wiki Kota,_Rajasthan; wiki Chambal_River (Charmanvati)
  "Chittorgarh": { river: "Berach", sk: "Berach", bank: null, conf: "high" }, // wiki Chittorgarh
  "Nathdwara": { river: "Banas", sk: "Banas", bank: null, conf: "high" }, // wiki Nathdwara

  // ---- Madhya Pradesh ----
  "Jabalpur": { river: "Narmada", sk: "Narmada", bank: "uttare", conf: "high" }, // wiki Jabalpur; wiki Gwarighat (ghats ~9 km from the listed centre, inside the city)
  "Ujjain": { river: "Kshipra", sk: "Kshipra", bank: "purve", conf: "high" }, // wiki Ujjain: eastern bank
  "Mandsaur": { river: "Shivna", sk: "Shivna", bank: null, conf: "high" }, // wiki Pashupatinath_Temple,_Mandsaur
  "Narmadapuram (Hoshangabad)": { river: "Narmada", sk: "Narmada", bank: "dakshine", conf: "high" }, // wiki Narmadapuram: south bank
  "Omkareshwar": { river: "Narmada", sk: "Narmada", bank: null, conf: "high" }, // wiki Omkareshwar (island)
  "Maheshwar": { river: "Narmada", sk: "Narmada", bank: "uttare", conf: "high" }, // wiki Maheshwar: northern bank
  "Amarkantak": { river: "Narmada", sk: "Narmada", bank: null, conf: "high" }, // wiki Amarkantak (source)
  "Chitrakoot": { river: "Mandakini", sk: "Mandakini", bank: null, conf: "high" }, // greenmesg.org/bharatavarsha/pilgrimages/uttar_pradesh/chitrakoot.php (Ramghat)
  "Orchha": { river: "Betwa", sk: "Vetravati", bank: null, conf: "high" }, // wiki Orchha; wiki Betwa_River (Vetravati)

  // ---- Chhattisgarh ----
  "Bilaspur": { river: "Arpa", sk: "Arpa", bank: null, conf: "high" }, // wiki Bilaspur,_Chhattisgarh
  "Korba": { river: "Hasdeo", sk: "Hasdeo", bank: null, conf: "high" }, // vikaspedia.in Korba district overview
  "Jagdalpur": { river: "Indravati", sk: "Indravati", bank: "dakshine", conf: "high" }, // britannica.com/place/Jagdalpur: just south of the Indravati
  "Rajim": { river: "Mahanadi and Pairi", sk: "Mahanadi and Pairi", bank: null, conf: "high" }, // wiki Pairi_River: joins the Mahanadi at Rajim
  "Dantewada": { river: "Shakini and Dakini", sk: "Shakini and Dakini", bank: null, conf: "high" }, // wiki Dantewada

  // ---- Odisha ----
  "Cuttack": { river: "Mahanadi", sk: "Mahanadi", bank: null, conf: "high" }, // wiki Cuttack,_Odisha (between Mahanadi and Kathajodi)
  "Rourkela": { river: "Sankh and Koel", sk: "Sankh and Koel", bank: null, conf: "high" }, // wiki Brahmani_River: formed at their confluence near Rourkela
  "Sambalpur": { river: "Mahanadi", sk: "Mahanadi", bank: "purve", conf: "high" }, // wiki Sambalpur,_Odisha: river to the west of the city
  "Balasore": { river: "Budhabalanga", sk: "Budhabalanga", bank: null, conf: "high" }, // britannica.com/place/Baleshwar
  "Baripada": { river: "Budhabalanga", sk: "Budhabalanga", bank: "purve", conf: "high" }, // wiki Baripada,_Odisha: east bank
  "Tara Tarini": { river: "Rushikulya", sk: "Rishikulya", bank: null, conf: "high" }, // wiki Tara_Tarini
  "Jajpur": { river: "Baitarani", sk: "Vaitarani", bank: null, conf: "high" }, // wiki Baitarani_River; wiki Biraja_Temple

  // ---- West Bengal ----
  "Howrah": { river: "Hooghly", sk: "Bhagirathi", bank: "paschime", conf: "high" }, // wiki Howrah: western bank
  "Durgapur": { river: "Damodar", sk: "Damodar", bank: "uttare", conf: "high" }, // wiki Durgapur: northern bank
  "Siliguri": { river: "Mahananda", sk: "Mahananda", bank: null, conf: "high" }, // wiki Siliguri; wiki Mahananda_River
  "Bardhaman (Burdwan)": { river: "Damodar", sk: "Damodar", bank: "uttare", conf: "high" }, // wiki Bardhaman: northern bank
  "Malda": { river: "Mahananda", sk: "Mahananda", bank: null, conf: "high" }, // wiki Malda: on both banks
  "Baharampur": { river: "Bhagirathi", sk: "Bhagirathi", bank: "purve", conf: "high" }, // wiki Baharampur: eastern side
  "Krishnanagar": { river: "Jalangi", sk: "Jalangi", bank: "dakshine", conf: "high" }, // wiki Krishnanagar: southern banks
  "Jalpaiguri": { river: "Teesta", sk: "Teesta", bank: null, conf: "high" }, // wiki Jalpaiguri; wiki Teesta_River
  "Cooch Behar": { river: "Torsa", sk: "Torsa", bank: "purve", conf: "high" }, // wiki Cooch_Behar: Torsa on the western side of town
  "Dakshineswar": { river: "Hooghly", sk: "Bhagirathi", bank: "purve", conf: "high" }, // wiki Dakshineswar_Kali_Temple: eastern bank
  "Kalighat": { river: "Adi Ganga", sk: "Adi Ganga", bank: null, conf: "high" }, // wiki Kalighat: now on the Adi Ganga
  "Tarapith": { river: "Dwaraka", sk: "Dwaraka", bank: null, conf: "high" }, // wiki Tarapith; wiki Tarapith_Temple
  "Mayapur": { river: "Bhagirathi and Jalangi", sk: "Bhagirathi and Jalangi", bank: null, conf: "high" }, // wiki Mayapur: confluence
  "Gangasagar": { river: "Hooghly", sk: "Bhagirathi", bank: null, conf: "high" }, // wiki Gangasagar: where the Ganga meets the sea

  // ---- Jharkhand ----
  "Jamshedpur": { river: "Subarnarekha and Kharkai", sk: "Suvarnarekha and Kharkai", bank: null, conf: "high" }, // wiki Jamshedpur: confluence
  "Medininagar (Daltonganj)": { river: "North Koel", sk: "North Koel", bank: null, conf: "high" }, // wiki Medininagar
  "Rajrappa": { river: "Damodar and Bhairavi", sk: "Damodar and Bhairavi", bank: null, conf: "high" }, // wiki Rajrappa; wiki Chhinnamasta_Temple

  // ---- Bihar ----
  "Patna": { river: "Ganga", sk: "Ganga", bank: "dakshine", conf: "high" }, // wiki Patna: southern bank
  "Gaya": { river: "Phalgu", sk: "Phalgu", bank: "paschime", conf: "high" }, // wiki Gaya: Phalgu on the eastern side
  "Bhagalpur": { river: "Ganga", sk: "Ganga", bank: "dakshine", conf: "high" }, // wiki Bhagalpur: southern bank
  "Muzaffarpur": { river: "Burhi Gandak", sk: "Burhi Gandak", bank: null, conf: "high" }, // wiki Muzaffarpur
  "Sonepur": { river: "Gandak and Ganga", sk: "Gandaki and Ganga", bank: null, conf: "high" }, // wiki Sonepur,_Bihar

  // ---- Uttar Pradesh ----
  "Lucknow": { river: "Gomti", sk: "Gomati", bank: null, conf: "high" }, // wiki Lucknow: divides the city
  "Kanpur": { river: "Ganga", sk: "Ganga", bank: "dakshine", conf: "high" }, // wiki Kanpur: right (south-west) bank
  "Ghaziabad": { river: "Hindon", sk: "Hindon", bank: null, conf: "high" }, // wiki Ghaziabad: Hindon divides the city
  "Agra": { river: "Yamuna", sk: "Yamuna", bank: null, conf: "high" }, // wiki Agra (both banks)
  "Varanasi (Kashi)": { river: "Ganga", sk: "Ganga", bank: "paschime", conf: "high" }, // wiki Varanasi: left (west) bank
  "Prayagraj (Allahabad)": { river: "Ganga and Yamuna", sk: "Ganga and Yamuna", bank: null, conf: "high" }, // wiki Prayagraj
  "Bareilly": { river: "Ramganga", sk: "Ramganga", bank: null, conf: "high" }, // wiki Bareilly
  "Moradabad": { river: "Ramganga", sk: "Ramganga", bank: null, conf: "high" }, // wiki Moradabad; wiki Ramganga (right bank)
  "Gorakhpur": { river: "Rapti", sk: "Rapti", bank: null, conf: "high" }, // wiki Gorakhpur
  "Jhansi": { river: "Pahuj", sk: "Pahuj", bank: null, conf: "high" }, // wiki Jhansi; wiki Pahuj_River
  "Mirzapur": { river: "Ganga", sk: "Ganga", bank: "dakshine", conf: "high" }, // certain; wiki Vindhyachal (8 km away, on the Ganga)
  "Azamgarh": { river: "Tamsa", sk: "Tamasa", bank: null, conf: "high" }, // wiki Azamgarh
  "Jaunpur": { river: "Gomti", sk: "Gomati", bank: null, conf: "high" }, // wiki Jaunpur
  "Mathura": { river: "Yamuna", sk: "Yamuna", bank: "paschime", conf: "high" }, // wiki Mathura (Vishram Ghat); west bank certain
  "Vrindavan": { river: "Yamuna", sk: "Yamuna", bank: "paschime", conf: "high" }, // wiki Vrindavan: west bank
  "Ayodhya": { river: "Saryu", sk: "Sarayu", bank: "dakshine", conf: "high" }, // wiki Ayodhya; wiki Ghaghara (Saryu); south bank certain
  "Vindhyachal": { river: "Ganga", sk: "Ganga", bank: "dakshine", conf: "high" }, // wiki Maa_Vindhyavasini_Dhaam,_Vindhyachal
  "Naimisharanya": { river: "Gomti", sk: "Gomati", bank: null, conf: "high" }, // wiki Naimisharanya
  "Gokul": { river: "Yamuna", sk: "Yamuna", bank: null, conf: "high" }, // certain (Gokul barrage); bank not confirmed

  // ---- Uttarakhand ----
  "Haldwani": { river: "Gaula", sk: "Gaula", bank: null, conf: "high" }, // wiki Haldwani
  "Almora": { river: "Kosi", sk: "Kaushiki", bank: null, conf: "high" }, // wiki Almora; wiki Kosi_River_(Uttarakhand)
  "Haridwar": { river: "Ganga", sk: "Ganga", bank: "paschime", conf: "high" }, // wiki Haridwar: right (west) bank
  "Rishikesh": { river: "Ganga", sk: "Ganga", bank: "paschime", conf: "high" }, // wiki Rishikesh: right (west) bank
  "Kedarnath": { river: "Mandakini", sk: "Mandakini", bank: null, conf: "high" }, // wiki Kedarnath; wiki Mandakini_River
  "Badrinath": { river: "Alaknanda", sk: "Alakananda", bank: null, conf: "high" }, // wiki Badrinath
  "Gangotri": { river: "Bhagirathi", sk: "Bhagirathi", bank: null, conf: "high" }, // wiki Gangotri
  "Yamunotri": { river: "Yamuna", sk: "Yamuna", bank: null, conf: "high" }, // wiki Yamunotri (source)
  "Jyotirmath (Joshimath)": { river: "Alaknanda", sk: "Alakananda", bank: null, conf: "high" }, // wiki Alaknanda_River: flows on to Joshimath
  "Rudraprayag": { river: "Alaknanda and Mandakini", sk: "Alakananda and Mandakini", bank: null, conf: "high" }, // wiki Rudraprayag
  "Devprayag": { river: "Bhagirathi and Alaknanda", sk: "Bhagirathi and Alakananda", bank: null, conf: "high" }, // wiki Devprayag
  "Uttarkashi": { river: "Bhagirathi", sk: "Bhagirathi", bank: null, conf: "high" }, // certain

  // ---- Himachal Pradesh ----
  "Mandi": { river: "Beas", sk: "Vipasha", bank: null, conf: "high" }, // wiki Mandi,_Himachal_Pradesh; wiki Beas_River (Vipasa)
  "Kullu": { river: "Beas", sk: "Vipasha", bank: null, conf: "high" }, // wiki Kullu
  "Manali": { river: "Beas", sk: "Vipasha", bank: null, conf: "high" }, // wiki Manali,_Himachal_Pradesh

  // ---- Haryana ----
  "Pehowa": { river: "Saraswati", sk: "Saraswati", bank: null, conf: "high" }, // wiki Pehowa: Prithudak on the Sarasvati (now seasonal)

  // ---- Jammu and Kashmir ----
  "Srinagar": { river: "Jhelum", sk: "Vitasta", bank: null, conf: "high" }, // wiki Srinagar
  "Jammu": { river: "Tawi", sk: "Tawi", bank: null, conf: "high" }, // wiki Jammu: city straddles the Tawi
  "Anantnag": { river: "Jhelum", sk: "Vitasta", bank: null, conf: "high" }, // wiki Jhelum_River: Lidder joins at Khanabal, Veshaw at Sangam (Anantnag)
  "Baramulla": { river: "Jhelum", sk: "Vitasta", bank: null, conf: "high" }, // wiki Baramulla: old town north bank, new town south
  "Udhampur": { river: "Devika", sk: "Devika", bank: null, conf: "high" }, // dailyexcelsior.com/udhampur-a-historical-perspective: "Flowing close to the town"

  // ---- Ladakh ----
  "Leh": { river: "Indus", sk: "Sindhu", bank: null, conf: "high" }, // wiki Leh: on the bank of the Indus
  "Kargil": { river: "Suru", sk: "Suru", bank: null, conf: "high" }, // wiki Kargil

  // ---- Assam ----
  "Guwahati": { river: "Brahmaputra", sk: "Brahmaputra", bank: "dakshine", conf: "high" }, // wiki Guwahati: south bank
  "Silchar": { river: "Barak", sk: "Barak", bank: null, conf: "high" }, // wiki Silchar
  "Dibrugarh": { river: "Brahmaputra", sk: "Brahmaputra", bank: "dakshine", conf: "high" }, // wiki Dibrugarh; south bank certain
  "Nagaon": { river: "Kolong", sk: "Kolong", bank: null, conf: "high" }, // wiki Nagaon; wiki Kolong_River
  "Tezpur": { river: "Brahmaputra", sk: "Brahmaputra", bank: "uttare", conf: "high" }, // wiki Tezpur: north bank
  "Kamakhya": { river: "Brahmaputra", sk: "Brahmaputra", bank: "dakshine", conf: "high" }, // wiki Kamakhya: Nilachal hill on the south bank, Guwahati
  "Majuli": { river: "Brahmaputra", sk: "Brahmaputra", bank: null, conf: "high" }, // wiki Majuli (river island)

  // ---- Arunachal Pradesh ----
  "Pasighat": { river: "Siang", sk: "Brahmaputra", bank: null, conf: "high" }, // wiki Pasighat; wiki Siang_River (the Brahmaputra's upper course)

  // ---- Nagaland ----
  "Dimapur": { river: "Dhansiri", sk: "Dhansiri", bank: null, conf: "high" }, // wiki Dimapur

  // ---- Manipur ----
  "Imphal": { river: "Imphal", sk: "Imphal", bank: null, conf: "high" }, // wiki Imphal; wiki Imphal_River
  "Thoubal": { river: "Thoubal", sk: "Thoubal", bank: null, conf: "high" }, // wiki Thoubal_River: flows through the centre of the town

  // ---- Dadra and Nagar Haveli and Daman and Diu ----
  "Silvassa": { river: "Damanganga", sk: "Damanganga", bank: "uttare", conf: "high" }, // wiki Damanganga_River: Silvassa on the north bank
  "Daman": { river: "Damanganga", sk: "Damanganga", bank: null, conf: "high" }, // wiki Damanganga_River: Daman on both banks of the mouth
};
