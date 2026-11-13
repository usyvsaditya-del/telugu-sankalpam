// deities.js — presiding deity of each kshetra in places.js, for the place card.
//
// Key    Exactly the place name as written in places.js, bracketed old name included.
// deity  The presiding deity as devotees name the murti, with "Sri" (under 60 chars).
//        Where one row stands for a town with two or three great temples, all are named
//        (Kanchipuram, Kumbakonam, Chidambaram). Srirangam names only Sri Ranganatha: Thiruvanaikaval,
//        which places.js folds into Srirangam's row, is a separate temple.
// form   Picks the emblem: vishnu, krishna, rama, narasimha, shiva, devi, murugan, ganesha,
//        hanuman, guru, ayyappa, surya, brahma, other. krishna / rama / narasimha only when
//        that avatara is the presiding deity; guru for saints' samadhis and mathas whose
//        object of worship is the guru (Mantralayam, Shirdi).
// tags   The kshetra's standing, from a fixed list, only when the place is on that list.
//        Tags belong to the place, not only to the temple named in `deity`: Varanasi is a
//        Shakti Peetha through Vishalakshi, though the card shows Sri Kashi Visweswara.
//
// Tag policy (decisions a reviewer may want to change):
//   Jyotirlinga    The 12 commonly accepted sites. Rival claimants in places.js carry no tag:
//                  Parli Vaijnath and Baijnath (Deoghar is tagged for Vaidyanath),
//                  Aundha Nagnath and Jageshwar (Nageshwar near Dwarka is tagged).
//   Shakti Peetha  The 18 Maha Shakti Peethas of the Ashtadasha stotram (15 are in places.js;
//                  Lanka, Pradyumna and Kashmir are not) plus the Kalika Purana's four Adi
//                  Shakti Peethas (Kamakhya, Kalighat, Tara Tarini, Vimala at Puri) and Tripura
//                  Sundari. Popular but contested claimants carry no tag: Vaishno Devi, Ambaji,
//                  Kangra, Chintpurni, Naina Devi, Kanyakumari, Deoghar, Tarapith, Pavagadh,
//                  Maihar, Vindhyachal, Tuljapur, Saptashrungi.
//   Matha          Seats of a sampradaya only: Sringeri, Jyotirmath, Udupi, Mantralayam,
//                  Gorakhpur. Saints' samadhis (Shirdi, Alandi, Akkalkot...) use form guru
//                  without the tag.
//   Divya Desam    Not added to big Shaiva towns whose Divya Desam is a lesser temple there
//                  (Madurai, Thanjavur, Mayiladuthurai, Chengannur).
//
// Left out (chief temple genuinely unclear): Kurukshetra, Pehowa, Siddhpur, Naimisharanya,
// Majuli, Maheshwar, Rudraprayag. City rows known chiefly for another faith's shrine
// (Amritsar, Ajmer, Nanded) are not covered either.
//
// Written from general knowledge, not from a downloaded source. deities_check_tags.mjs checks
// keys, forms, tags and the counts of the closed lists.

export const DEITIES = {
  // ---- Andhra Pradesh ----
  "Tirupati": { deity: "Sri Govindaraja Swami", form: "vishnu", tags: [] },
  "Vijayawada": { deity: "Sri Kanaka Durga Ammavaru", form: "devi", tags: [] },
  "Srikakulam": { deity: "Sri Suryanarayana Swami (Arasavalli)", form: "surya", tags: [] },
  "Bhimavaram": { deity: "Sri Someswara Swami (Somarama)", form: "shiva", tags: ["Pancharama"] },
  "Tirumala": { deity: "Sri Venkateswara Swami", form: "vishnu", tags: ["Divya Desam"] },
  "Srikalahasti": { deity: "Sri Kalahasteeswara Swami and Sri Gnana Prasunambika Devi", form: "shiva", tags: ["Pancha Bhoota Sthalam (Air)"] },
  "Srisailam": { deity: "Sri Mallikarjuna Swami and Sri Bhramaramba Devi", form: "shiva", tags: ["Jyotirlinga", "Shakti Peetha"] },
  "Simhachalam": { deity: "Sri Varaha Lakshmi Narasimha Swami", form: "narasimha", tags: [] },
  "Annavaram": { deity: "Sri Veera Venkata Satyanarayana Swami", form: "vishnu", tags: [] },
  "Mantralayam": { deity: "Sri Raghavendra Swami", form: "guru", tags: ["Matha"] },
  "Ahobilam": { deity: "Sri Ahobila Narasimha Swami", form: "narasimha", tags: ["Divya Desam"] },
  "Puttaparthi": { deity: "Sri Sathya Sai Baba (Prasanthi Nilayam)", form: "guru", tags: [] },
  "Lepakshi": { deity: "Sri Veerabhadra Swami", form: "shiva", tags: [] },
  "Draksharamam": { deity: "Sri Bhimeswara Swami and Sri Manikyamba Devi", form: "shiva", tags: ["Pancharama", "Shakti Peetha"] },
  "Samalkot": { deity: "Sri Kumara Bhimeswara Swami (Kumararama)", form: "shiva", tags: ["Pancharama"] },
  "Palakollu": { deity: "Sri Ksheera Ramalingeswara Swami (Ksheerarama)", form: "shiva", tags: ["Pancharama"] },
  "Amaravati": { deity: "Sri Amareswara Swami (Amararama)", form: "shiva", tags: ["Pancharama"] },
  "Mangalagiri": { deity: "Sri Panakala Lakshmi Narasimha Swami", form: "narasimha", tags: [] },
  "Pithapuram": { deity: "Sri Puruhutika Devi and Sri Kukkuteswara Swami", form: "devi", tags: ["Shakti Peetha"] },
  "Kanipakam": { deity: "Sri Varasiddhi Vinayaka Swami", form: "ganesha", tags: [] },
  "Vontimitta": { deity: "Sri Kodandarama Swami", form: "rama", tags: [] },
  "Dwaraka Tirumala": { deity: "Sri Venkateswara Swami", form: "vishnu", tags: [] },
  "Antarvedi": { deity: "Sri Lakshmi Narasimha Swami", form: "narasimha", tags: [] },
  "Srikurmam": { deity: "Sri Kurmanatha Swami", form: "vishnu", tags: [] },
  "Mahanandi": { deity: "Sri Mahanandeeswara Swami", form: "shiva", tags: [] },
  "Yaganti": { deity: "Sri Uma Maheswara Swami", form: "shiva", tags: [] },
  "Kadiri": { deity: "Sri Khadri Lakshmi Narasimha Swami", form: "narasimha", tags: [] },

  // ---- Telangana ----
  "Bhadrachalam": { deity: "Sri Sita Ramachandra Swami", form: "rama", tags: [] },
  "Yadagirigutta": { deity: "Sri Lakshmi Narasimha Swami", form: "narasimha", tags: [] },
  "Basara": { deity: "Sri Gnana Saraswati Devi", form: "devi", tags: [] },
  "Vemulawada": { deity: "Sri Raja Rajeswara Swami", form: "shiva", tags: [] },
  "Kaleshwaram": { deity: "Sri Kaleshwara Mukteshwara Swami", form: "shiva", tags: [] },
  "Alampur": { deity: "Sri Jogulamba Devi and Sri Bala Brahmeswara Swami", form: "devi", tags: ["Shakti Peetha"] },
  "Chilkur": { deity: "Sri Chilkur Balaji (Venkateswara)", form: "vishnu", tags: [] },
  "Ramappa (Palampet)": { deity: "Sri Ramalingeswara Swami", form: "shiva", tags: [] },

  // ---- Karnataka ----
  "Mysuru (Mysore)": { deity: "Sri Chamundeshwari Devi", form: "devi", tags: ["Shakti Peetha"] },
  "Udupi": { deity: "Sri Krishna (Udupi Sri Krishna Matha)", form: "krishna", tags: ["Matha"] },
  "Sringeri": { deity: "Sri Sharadamba and Sri Chandramouleeswara", form: "devi", tags: ["Matha"] },
  "Dharmasthala": { deity: "Sri Manjunatha Swami", form: "shiva", tags: [] },
  "Kukke Subramanya": { deity: "Sri Kukke Subramanya Swami", form: "murugan", tags: [] },
  "Kollur": { deity: "Sri Mookambika Devi", form: "devi", tags: [] },
  "Gokarna": { deity: "Sri Mahabaleshwara Swami (Atmalinga)", form: "shiva", tags: [] },
  "Horanadu": { deity: "Sri Annapoorneshwari Devi", form: "devi", tags: [] },
  "Melukote (Melkote)": { deity: "Sri Cheluvanarayana Swami", form: "vishnu", tags: [] },
  "Srirangapatna": { deity: "Sri Ranganatha Swami", form: "vishnu", tags: [] },
  "Nanjangud": { deity: "Sri Srikanteshwara Swami (Nanjundeshwara)", form: "shiva", tags: [] },
  "Hampi": { deity: "Sri Virupaksha Swami (Pampapati)", form: "shiva", tags: [] },
  "Murudeshwar": { deity: "Sri Murudeshwara Swami", form: "shiva", tags: [] },
  "Kateel": { deity: "Sri Durgaparameshwari Devi", form: "devi", tags: [] },
  "Belur": { deity: "Sri Chennakeshava Swami", form: "vishnu", tags: [] },
  "Talakaveri": { deity: "Sri Kaveri Amma", form: "devi", tags: [] },
  "Ganagapur": { deity: "Sri Narasimha Saraswati (Sri Dattatreya)", form: "guru", tags: [] },
  "Sirsi": { deity: "Sri Marikamba Devi", form: "devi", tags: [] },
  "Saundatti": { deity: "Sri Renuka Yellamma Devi", form: "devi", tags: [] },
  "Badami": { deity: "Sri Banashankari Devi", form: "devi", tags: [] },

  // ---- Tamil Nadu ----
  "Madurai": { deity: "Sri Meenakshi Sundareswarar", form: "devi", tags: [] },
  "Thanjavur": { deity: "Sri Brihadeeswarar and Sri Periyanayaki", form: "shiva", tags: [] },
  "Tirunelveli": { deity: "Sri Nellaiappar and Sri Kanthimathi Amman", form: "shiva", tags: [] },
  "Mayiladuthurai (Mayavaram)": { deity: "Sri Mayuranathar and Sri Abhayambigai", form: "shiva", tags: [] },
  "Srirangam": { deity: "Sri Ranganatha Swami", form: "vishnu", tags: ["Divya Desam"] }, // Thiruvanaikaval (Water lingam) is a separate temple nearby
  "Rameswaram": { deity: "Sri Ramanatha Swami and Sri Parvathavardhini", form: "shiva", tags: ["Jyotirlinga", "Char Dham"] },
  "Kanchipuram": { deity: "Sri Kamakshi, Sri Ekambareswarar and Sri Varadaraja", form: "devi", tags: ["Pancha Bhoota Sthalam (Earth)", "Shakti Peetha", "Divya Desam", "Sapta Puri"] },
  "Kumbakonam": { deity: "Sri Adi Kumbeswarar and Sri Sarangapani", form: "shiva", tags: ["Divya Desam"] },
  "Chidambaram": { deity: "Sri Nataraja and Sri Govindaraja", form: "shiva", tags: ["Pancha Bhoota Sthalam (Space)", "Divya Desam"] },
  "Tiruvannamalai": { deity: "Sri Arunachaleswarar and Sri Unnamulai Amman", form: "shiva", tags: ["Pancha Bhoota Sthalam (Fire)"] },
  "Thiruparankundram": { deity: "Sri Subramanya Swami (with Deivanai)", form: "murugan", tags: ["Arupadai Veedu"] },
  "Tiruchendur": { deity: "Sri Subramanya Swami (Senthil Andavar)", form: "murugan", tags: ["Arupadai Veedu"] },
  "Palani": { deity: "Sri Dhandayuthapani Swami", form: "murugan", tags: ["Arupadai Veedu"] },
  "Swamimalai": { deity: "Sri Swaminatha Swami", form: "murugan", tags: ["Arupadai Veedu"] },
  "Tiruttani": { deity: "Sri Subramanya Swami", form: "murugan", tags: ["Arupadai Veedu"] },
  "Pazhamudircholai": { deity: "Sri Solaimalai Murugan", form: "murugan", tags: ["Arupadai Veedu"] },
  "Sriperumbudur": { deity: "Sri Adikesava Perumal and Sri Ramanuja", form: "vishnu", tags: [] },
  "Tiruvallur": { deity: "Sri Veeraraghava Perumal", form: "vishnu", tags: ["Divya Desam"] },
  "Mamallapuram": { deity: "Sri Sthalasayana Perumal", form: "vishnu", tags: ["Divya Desam"] },
  "Srivilliputhur": { deity: "Sri Andal and Sri Vatapatrasayi", form: "vishnu", tags: ["Divya Desam"] },
  "Alwarthirunagari": { deity: "Sri Adinatha Perumal", form: "vishnu", tags: ["Divya Desam"] },
  "Thiruvarur": { deity: "Sri Thyagaraja Swami and Sri Kamalambal", form: "shiva", tags: [] },
  "Thiruvaiyaru": { deity: "Sri Panchanadeeswarar (Aiyarappar)", form: "shiva", tags: [] },
  "Kanyakumari": { deity: "Sri Bhagavathy Amman (Devi Kanyakumari)", form: "devi", tags: [] },
  "Suchindram": { deity: "Sri Thanumalayan Swami", form: "shiva", tags: [] },
  "Melmaruvathur": { deity: "Sri Adhiparasakthi", form: "devi", tags: [] },
  "Samayapuram": { deity: "Sri Samayapuram Mariamman", form: "devi", tags: [] },
  "Vaitheeswaran Koil": { deity: "Sri Vaidyanatha Swami and Sri Thaiyal Nayaki", form: "shiva", tags: ["Navagraha Sthalam"] },
  "Thirukkadaiyur": { deity: "Sri Amritaghateswarar and Sri Abhirami", form: "shiva", tags: [] },
  "Sholingur": { deity: "Sri Yoga Narasimha Swami", form: "narasimha", tags: ["Divya Desam"] },
  "Thirukoshtiyur": { deity: "Sri Sowmya Narayana Perumal", form: "vishnu", tags: ["Divya Desam"] },
  "Courtallam": { deity: "Sri Kutralanathar", form: "shiva", tags: [] },
  "Thirukoilur": { deity: "Sri Ulagalantha Perumal (Trivikrama)", form: "vishnu", tags: ["Divya Desam"] },
  "Sankarankovil": { deity: "Sri Sankaranarayana Swami and Sri Gomathi Amman", form: "shiva", tags: [] },

  // ---- Kerala ----
  "Thiruvananthapuram (Trivandrum)": { deity: "Sri Anantha Padmanabha Swami", form: "vishnu", tags: ["Divya Desam"] },
  "Thrissur": { deity: "Sri Vadakkunnathan", form: "shiva", tags: [] },
  "Sabarimala": { deity: "Sri Ayyappa Swami", form: "ayyappa", tags: [] },
  "Guruvayur": { deity: "Sri Guruvayurappan", form: "krishna", tags: [] },
  "Chottanikkara": { deity: "Sri Chottanikkara Bhagavathy (Rajarajeswari)", form: "devi", tags: [] },
  "Ettumanoor": { deity: "Sri Ettumanoorappan (Mahadeva)", form: "shiva", tags: [] },
  "Vaikom": { deity: "Sri Vaikathappan (Mahadeva)", form: "shiva", tags: [] },
  "Kodungallur": { deity: "Sri Kodungallur Bhagavathy", form: "devi", tags: [] },
  "Kalady": { deity: "Sri Adi Shankaracharya (Janmabhumi)", form: "guru", tags: [] },
  "Thirunelli": { deity: "Sri Maha Vishnu (Thirunelli Perumal)", form: "vishnu", tags: [] },
  "Aranmula": { deity: "Sri Parthasarathy Swami", form: "krishna", tags: ["Divya Desam"] },
  "Ambalappuzha": { deity: "Sri Krishna (Parthasarathy)", form: "krishna", tags: [] },
  "Thiruvalla": { deity: "Sri Vallabha Swami", form: "vishnu", tags: ["Divya Desam"] },
  "Chengannur": { deity: "Sri Mahadeva and Sri Bhagavathy", form: "shiva", tags: [] },
  "Taliparamba": { deity: "Sri Rajarajeswara Swami", form: "shiva", tags: [] },

  // ---- Puducherry ----
  "Thirunallar": { deity: "Sri Dharbaranyeswarar and Sri Saneeswara Bhagavan", form: "shiva", tags: ["Navagraha Sthalam"] },

  // ---- Maharashtra ----
  "Nashik": { deity: "Sri Kalaram (Sri Rama, Panchavati)", form: "rama", tags: [] },
  "Kolhapur": { deity: "Sri Mahalakshmi (Ambabai)", form: "devi", tags: ["Shakti Peetha"] },
  "Pandharpur": { deity: "Sri Vitthala and Sri Rakhumai", form: "krishna", tags: [] },
  "Shirdi": { deity: "Sri Sai Baba (Samadhi Mandir)", form: "guru", tags: [] },
  "Trimbakeshwar": { deity: "Sri Trimbakeshwar", form: "shiva", tags: ["Jyotirlinga"] },
  "Bhimashankar": { deity: "Sri Bhimashankar", form: "shiva", tags: ["Jyotirlinga"] },
  "Grishneshwar (Ellora)": { deity: "Sri Grishneshwar", form: "shiva", tags: ["Jyotirlinga"] },
  "Aundha Nagnath": { deity: "Sri Nagnath", form: "shiva", tags: [] },
  "Parli Vaijnath": { deity: "Sri Vaidyanath (Vaijnath)", form: "shiva", tags: [] },
  "Shani Shingnapur": { deity: "Sri Shani Dev", form: "other", tags: [] },
  "Tuljapur": { deity: "Sri Tulja Bhavani", form: "devi", tags: [] },
  "Mahur": { deity: "Sri Renuka Devi", form: "devi", tags: ["Shakti Peetha"] },
  "Saptashrungi (Vani)": { deity: "Sri Saptashrungi Devi", form: "devi", tags: [] },
  "Morgaon": { deity: "Sri Mayureshwar (Moreshwar)", form: "ganesha", tags: ["Ashtavinayak"] },
  "Theur": { deity: "Sri Chintamani Vinayak", form: "ganesha", tags: ["Ashtavinayak"] },
  "Ranjangaon": { deity: "Sri Mahaganapati", form: "ganesha", tags: ["Ashtavinayak"] },
  "Ozar": { deity: "Sri Vighneshwar", form: "ganesha", tags: ["Ashtavinayak"] },
  "Lenyadri": { deity: "Sri Girijatmaj", form: "ganesha", tags: ["Ashtavinayak"] },
  "Pali": { deity: "Sri Ballaleshwar", form: "ganesha", tags: ["Ashtavinayak"] },
  "Jejuri": { deity: "Sri Khandoba (Malhari Martand)", form: "shiva", tags: [] },
  "Alandi": { deity: "Sri Sant Dnyaneshwar Maharaj", form: "guru", tags: [] },
  "Dehu": { deity: "Sri Sant Tukaram Maharaj", form: "guru", tags: [] },
  "Ganpatipule": { deity: "Sri Swayambhu Ganapati", form: "ganesha", tags: [] },
  "Akkalkot": { deity: "Sri Swami Samarth Maharaj", form: "guru", tags: [] },
  "Shegaon": { deity: "Sri Sant Gajanan Maharaj", form: "guru", tags: [] },
  "Mahabaleshwar": { deity: "Sri Mahabaleshwar", form: "shiva", tags: [] },
  "Ramtek": { deity: "Sri Rama (Ramtek Gad Mandir)", form: "rama", tags: [] },
  "Ambajogai": { deity: "Sri Yogeshwari Devi", form: "devi", tags: [] },

  // ---- Gujarat ----
  "Dwarka": { deity: "Sri Dwarkadhish", form: "krishna", tags: ["Char Dham", "Sapta Puri", "Divya Desam"] },
  "Somnath": { deity: "Sri Somnath", form: "shiva", tags: ["Jyotirlinga"] },
  "Nageshwar": { deity: "Sri Nageshwar", form: "shiva", tags: ["Jyotirlinga"] },
  "Bet Dwarka": { deity: "Sri Dwarkadhish (Bet Dwarka)", form: "krishna", tags: [] },
  "Ambaji": { deity: "Sri Ambaji (Arasuri Amba)", form: "devi", tags: [] },
  "Pavagadh": { deity: "Sri Mahakali (Kalika Mata)", form: "devi", tags: [] },
  "Dakor": { deity: "Sri Ranchhodraiji", form: "krishna", tags: [] },
  "Shamlaji": { deity: "Sri Shamlaji (Gadadhar)", form: "vishnu", tags: [] },
  "Bahucharaji": { deity: "Sri Bahuchara Mata", form: "devi", tags: [] },

  // ---- Rajasthan ----
  "Pushkar": { deity: "Sri Brahma (Jagatpita Brahma Mandir)", form: "brahma", tags: [] },
  "Nathdwara": { deity: "Sri Shrinathji", form: "krishna", tags: [] },
  "Khatu Shyam": { deity: "Sri Khatu Shyam Ji", form: "krishna", tags: [] },
  "Salasar Balaji": { deity: "Sri Salasar Balaji (Hanuman)", form: "hanuman", tags: [] },
  "Mehandipur Balaji": { deity: "Sri Mehandipur Balaji (Hanuman)", form: "hanuman", tags: [] },
  "Deshnoke": { deity: "Sri Karni Mata", form: "devi", tags: [] },
  "Mount Abu": { deity: "Sri Arbuda Devi (Adhar Devi)", form: "devi", tags: [] },

  // ---- Madhya Pradesh ----
  "Ujjain": { deity: "Sri Mahakaleshwar", form: "shiva", tags: ["Jyotirlinga", "Shakti Peetha", "Sapta Puri"] },
  "Omkareshwar": { deity: "Sri Omkareshwar and Sri Mamleshwar", form: "shiva", tags: ["Jyotirlinga"] },
  "Amarkantak": { deity: "Sri Narmada Mata", form: "devi", tags: [] },
  "Chitrakoot": { deity: "Sri Kamtanath (Kamadgiri)", form: "rama", tags: [] },
  "Orchha": { deity: "Sri Ram Raja", form: "rama", tags: [] },
  "Datia": { deity: "Sri Pitambara Devi (Baglamukhi)", form: "devi", tags: [] },
  "Maihar": { deity: "Sri Sharada Devi", form: "devi", tags: [] },
  "Khajuraho": { deity: "Sri Matangeshwar Mahadev", form: "shiva", tags: [] },

  // ---- Chhattisgarh ----
  "Dongargarh": { deity: "Sri Bamleshwari Devi", form: "devi", tags: [] },
  "Rajim": { deity: "Sri Rajiv Lochan", form: "vishnu", tags: [] },
  "Ratanpur": { deity: "Sri Mahamaya Devi", form: "devi", tags: [] },
  "Dantewada": { deity: "Sri Danteshwari Devi", form: "devi", tags: [] },

  // ---- Odisha ----
  "Bhubaneswar": { deity: "Sri Lingaraj", form: "shiva", tags: [] },
  "Puri": { deity: "Sri Jagannath, Sri Balabhadra and Sri Subhadra", form: "vishnu", tags: ["Char Dham", "Shakti Peetha"] },
  "Konark": { deity: "Sri Surya Deva (Konark Sun Temple)", form: "surya", tags: [] },
  "Tara Tarini": { deity: "Sri Tara Tarini", form: "devi", tags: ["Shakti Peetha"] },
  "Jajpur": { deity: "Sri Biraja Devi (Girija)", form: "devi", tags: ["Shakti Peetha"] },

  // ---- West Bengal ----
  "Dakshineswar": { deity: "Sri Bhavatarini Kali", form: "devi", tags: [] },
  "Kalighat": { deity: "Sri Dakshina Kali (Kalighat)", form: "devi", tags: ["Shakti Peetha"] },
  "Tarapith": { deity: "Sri Tara Ma", form: "devi", tags: [] },
  "Mayapur": { deity: "Sri Radha Madhava", form: "krishna", tags: [] },
  "Gangasagar": { deity: "Sri Kapila Muni", form: "guru", tags: [] },
  "Tarakeswar": { deity: "Sri Tarakeswar (Baba Taraknath)", form: "shiva", tags: [] },

  // ---- Jharkhand ----
  "Deoghar": { deity: "Sri Baidyanath", form: "shiva", tags: ["Jyotirlinga"] },
  "Basukinath": { deity: "Sri Basukinath", form: "shiva", tags: [] },
  "Rajrappa": { deity: "Sri Chhinnamastika Devi", form: "devi", tags: [] },

  // ---- Bihar ----
  "Gaya": { deity: "Sri Vishnupada", form: "vishnu", tags: ["Shakti Peetha"] },
  "Sitamarhi": { deity: "Sri Janaki (Sita Mata)", form: "devi", tags: [] },
  "Sonepur": { deity: "Sri Harihar Nath", form: "shiva", tags: [] },

  // ---- Uttar Pradesh ----
  "Varanasi (Kashi)": { deity: "Sri Kashi Visweswara", form: "shiva", tags: ["Jyotirlinga", "Shakti Peetha", "Sapta Puri"] },
  "Prayagraj (Allahabad)": { deity: "Sri Veni Madhava", form: "vishnu", tags: ["Shakti Peetha"] },
  "Gorakhpur": { deity: "Sri Guru Gorakhnath", form: "guru", tags: ["Matha"] },
  "Mathura": { deity: "Sri Keshav Dev (Sri Krishna Janmabhoomi)", form: "krishna", tags: ["Sapta Puri", "Divya Desam"] },
  "Vrindavan": { deity: "Sri Banke Bihari", form: "krishna", tags: [] },
  "Ayodhya": { deity: "Sri Ram Lalla (Sri Rama)", form: "rama", tags: ["Sapta Puri", "Divya Desam"] },
  "Vindhyachal": { deity: "Sri Vindhyavasini Devi", form: "devi", tags: [] },
  "Govardhan": { deity: "Sri Giriraj Ji (Govardhan)", form: "krishna", tags: [] },
  "Barsana": { deity: "Sri Radha Rani (Ladli Ji)", form: "devi", tags: [] },
  "Gokul": { deity: "Sri Bal Krishna (Gokulnath)", form: "krishna", tags: ["Divya Desam"] },
  "Nandgaon": { deity: "Sri Krishna (Nand Bhavan)", form: "krishna", tags: [] },

  // ---- Uttarakhand ----
  "Haridwar": { deity: "Sri Maya Devi and Sri Ganga Mata", form: "devi", tags: ["Sapta Puri"] },
  "Rishikesh": { deity: "Sri Hrishikesh Narayan (Bharat Mandir)", form: "vishnu", tags: [] },
  "Kedarnath": { deity: "Sri Kedarnath (Kedareswara)", form: "shiva", tags: ["Jyotirlinga", "Chota Char Dham"] },
  "Badrinath": { deity: "Sri Badrinarayan", form: "vishnu", tags: ["Char Dham", "Chota Char Dham", "Divya Desam"] },
  "Gangotri": { deity: "Sri Ganga Mata", form: "devi", tags: ["Chota Char Dham"] },
  "Yamunotri": { deity: "Sri Yamuna Mata", form: "devi", tags: ["Chota Char Dham"] },
  "Jyotirmath (Joshimath)": { deity: "Sri Narasimha Swami", form: "narasimha", tags: ["Matha", "Divya Desam"] },
  "Devprayag": { deity: "Sri Raghunath Ji", form: "rama", tags: ["Divya Desam"] },
  "Uttarkashi": { deity: "Sri Kashi Vishwanath (Uttarkashi)", form: "shiva", tags: [] },
  "Jageshwar": { deity: "Sri Jageshwar Mahadev", form: "shiva", tags: [] },
  "Kainchi Dham": { deity: "Sri Neem Karoli Baba", form: "guru", tags: [] },

  // ---- Himachal Pradesh ----
  "Kangra": { deity: "Sri Vajreshwari Devi", form: "devi", tags: [] },
  "Jwalamukhi": { deity: "Sri Jwala Devi", form: "devi", tags: ["Shakti Peetha"] },
  "Chintpurni": { deity: "Sri Chintpurni Devi (Chhinnamastika)", form: "devi", tags: [] },
  "Naina Devi": { deity: "Sri Naina Devi", form: "devi", tags: [] },
  "Baijnath": { deity: "Sri Vaidyanath (Baijnath)", form: "shiva", tags: [] },

  // ---- Jammu and Kashmir ----
  "Vaishno Devi": { deity: "Sri Mata Vaishno Devi", form: "devi", tags: [] },
  "Amarnath": { deity: "Sri Amarnath (Baba Barfani)", form: "shiva", tags: [] },
  "Kheer Bhawani (Tulmul)": { deity: "Sri Ragnya Devi (Kheer Bhawani)", form: "devi", tags: [] },

  // ---- Assam ----
  "Kamakhya": { deity: "Sri Kamakhya Devi", form: "devi", tags: ["Shakti Peetha"] },

  // ---- Tripura ----
  "Tripura Sundari Temple": { deity: "Sri Tripura Sundari", form: "devi", tags: ["Shakti Peetha"] },
};
