// places_abroad.js — places outside India for the panchangam page.
//
// Each row: [name, country, lat, lon, kind, timeZone]
//   name      English name a resident would recognise. A state or country is added in
//             brackets only where the bare name is ambiguous: "Portland (Oregon)",
//             "Edison (New Jersey)".
//   country   The country's common English short name; "USA", "UK" and "UAE" abbreviated.
//   lat, lon  Decimal degrees, north / east positive, so the Americas have negative lon
//             and the southern hemisphere negative lat. City centres. Target accuracy is
//             about 0.05 deg (roughly 5 km), which keeps sunrise within about 15 seconds.
//   kind      "usa"    a place in the United States (Washington, DC included);
//             "world"  everything else.
//   timeZone  IANA zone used to format times. Unlike India, most of these places keep
//             daylight saving time, so the UTC offset must be worked out for each date
//             from this zone, never once per place.
//             Each zone is the one tzdata's zone.tab lists for that country or region,
//             so it is often named after the largest city rather than the capital
//             (Beijing -> Asia/Shanghai, Ottawa -> America/Toronto, Abu Dhabi ->
//             Asia/Dubai). Country-named aliases are kept on purpose (Africa/Kampala, not
//             Africa/Nairobi): if one country changes its clocks, only its rows follow.
//             US rows use the most specific zone (America/Indiana/Indianapolis,
//             America/Detroit, America/Kentucky/Louisville) so past dates such as birth
//             dates get that city's own daylight-saving history; for dates since 2007
//             they behave exactly like America/New_York.
//
// How the list was chosen (rows appear in this order):
//   1. USA: the 30 most populous US cities, city proper, in 2020 Census order.
//      Nashville and Louisville count as their consolidated city-county governments.
//   2. USA: Telugu diaspora hubs outside that top 30.
//   3. World: the capitals of the 100 most populous countries other than India, in
//      descending population order (UN World Population Prospects 2024, mid-2024
//      estimates, Taiwan counted). India's capital is in places.js; the US capital is
//      the "Washington, DC" row in block 1, so block 3 has 99 rows. Where a capital is
//      split, moving or disputed, the row's comment says which city is used.
//   4. World: Telugu diaspora hubs that are not capitals.
//
// Built from general knowledge, not a downloaded dataset. Checked with a node script:
// every zone constructs in Intl.DateTimeFormat; every zone's January or July offset is
// within 3.5 hours of lon/15, with no exceptions needed; every zone is listed for the
// row's country in tzdata's zone.tab; the 92 rows named after their zone's city lie
// within 7 km of zone.tab's point for it (median 2 km; Kampala excepted, where zone.tab's
// own point is 18 km west of the centre); names are unique; and every latitude is within
// 66 deg of the equator, so the sun rises and sets on every day of the year.

export const PLACES_ABROAD = [
  // ---- 1. USA: 30 most populous cities, 2020 Census order ----
  ["New York", "USA", 40.7128, -74.0060, "usa", "America/New_York"],
  ["Los Angeles", "USA", 34.0522, -118.2437, "usa", "America/Los_Angeles"],
  ["Chicago", "USA", 41.8781, -87.6298, "usa", "America/Chicago"],
  ["Houston", "USA", 29.7604, -95.3698, "usa", "America/Chicago"],
  ["Phoenix", "USA", 33.4484, -112.0740, "usa", "America/Phoenix"], // Arizona keeps standard time all year
  ["Philadelphia", "USA", 39.9526, -75.1652, "usa", "America/New_York"],
  ["San Antonio", "USA", 29.4241, -98.4936, "usa", "America/Chicago"],
  ["San Diego", "USA", 32.7157, -117.1611, "usa", "America/Los_Angeles"],
  ["Dallas", "USA", 32.7767, -96.7970, "usa", "America/Chicago"],
  ["San Jose", "USA", 37.3382, -121.8863, "usa", "America/Los_Angeles"],
  ["Austin", "USA", 30.2672, -97.7431, "usa", "America/Chicago"],
  ["Jacksonville", "USA", 30.3322, -81.6557, "usa", "America/New_York"],
  ["Fort Worth", "USA", 32.7555, -97.3308, "usa", "America/Chicago"],
  ["Columbus", "USA", 39.9612, -82.9988, "usa", "America/New_York"],
  ["Indianapolis", "USA", 39.7684, -86.1581, "usa", "America/Indiana/Indianapolis"], // no daylight saving 1971-2005
  ["Charlotte", "USA", 35.2271, -80.8431, "usa", "America/New_York"],
  ["San Francisco", "USA", 37.7749, -122.4194, "usa", "America/Los_Angeles"],
  ["Seattle", "USA", 47.6062, -122.3321, "usa", "America/Los_Angeles"],
  ["Denver", "USA", 39.7392, -104.9903, "usa", "America/Denver"],
  ["Washington, DC", "USA", 38.9072, -77.0369, "usa", "America/New_York"], // also the US capital for block 3
  ["Nashville", "USA", 36.1627, -86.7816, "usa", "America/Chicago"],
  ["Oklahoma City", "USA", 35.4676, -97.5164, "usa", "America/Chicago"],
  ["El Paso", "USA", 31.7619, -106.4850, "usa", "America/Denver"], // Texas, but on Mountain Time
  ["Boston", "USA", 42.3601, -71.0589, "usa", "America/New_York"],
  ["Portland (Oregon)", "USA", 45.5152, -122.6784, "usa", "America/Los_Angeles"],
  ["Las Vegas", "USA", 36.1699, -115.1398, "usa", "America/Los_Angeles"],
  ["Detroit", "USA", 42.3314, -83.0458, "usa", "America/Detroit"],
  ["Memphis", "USA", 35.1495, -90.0490, "usa", "America/Chicago"],
  ["Louisville", "USA", 38.2527, -85.7585, "usa", "America/Kentucky/Louisville"],
  ["Baltimore", "USA", 39.2904, -76.6122, "usa", "America/New_York"],

  // ---- 2. USA: diaspora hubs outside the top 30 ----
  ["Atlanta", "USA", 33.7490, -84.3880, "usa", "America/New_York"],
  ["Raleigh", "USA", 35.7796, -78.6382, "usa", "America/New_York"],
  ["Edison (New Jersey)", "USA", 40.5187, -74.4121, "usa", "America/New_York"],
  ["Pittsburgh", "USA", 40.4406, -79.9959, "usa", "America/New_York"],
  ["Minneapolis", "USA", 44.9778, -93.2650, "usa", "America/Chicago"],
  ["Tampa", "USA", 27.9506, -82.4572, "usa", "America/New_York"],

  // ---- 3. World: capitals of the 100 most populous countries other than India ----
  ["Beijing", "China", 39.9042, 116.4074, "world", "Asia/Shanghai"],
  // (USA: "Washington, DC" is in block 1)
  ["Jakarta", "Indonesia", -6.1754, 106.8272, "world", "Asia/Jakarta"], // Nusantara is the designated future capital; the move is not complete
  ["Islamabad", "Pakistan", 33.6844, 73.0479, "world", "Asia/Karachi"],
  ["Abuja", "Nigeria", 9.0579, 7.4951, "world", "Africa/Lagos"],
  ["Brasília", "Brazil", -15.7939, -47.8828, "world", "America/Sao_Paulo"],
  ["Dhaka", "Bangladesh", 23.7639, 90.3889, "world", "Asia/Dhaka"],
  ["Moscow", "Russia", 55.7558, 37.6173, "world", "Europe/Moscow"],
  ["Addis Ababa", "Ethiopia", 9.0300, 38.7400, "world", "Africa/Addis_Ababa"],
  ["Mexico City", "Mexico", 19.4326, -99.1332, "world", "America/Mexico_City"],
  ["Tokyo", "Japan", 35.6895, 139.6917, "world", "Asia/Tokyo"],
  ["Cairo", "Egypt", 30.0444, 31.2357, "world", "Africa/Cairo"], // ministries are moving to the New Administrative Capital, ~45 km east
  ["Manila", "Philippines", 14.5995, 120.9842, "world", "Asia/Manila"],
  ["Kinshasa", "DR Congo", -4.3276, 15.3136, "world", "Africa/Kinshasa"],
  ["Hanoi", "Vietnam", 21.0285, 105.8542, "world", "Asia/Ho_Chi_Minh"],
  ["Tehran", "Iran", 35.6892, 51.3890, "world", "Asia/Tehran"],
  ["Ankara", "Türkiye", 39.9334, 32.8597, "world", "Europe/Istanbul"],
  ["Berlin", "Germany", 52.5200, 13.4050, "world", "Europe/Berlin"],
  ["Bangkok", "Thailand", 13.7563, 100.5018, "world", "Asia/Bangkok"],
  ["London", "UK", 51.5074, -0.1278, "world", "Europe/London"],
  ["Dodoma", "Tanzania", -6.1722, 35.7395, "world", "Africa/Dar_es_Salaam"], // capital since 1996; Dar es Salaam is the largest city
  ["Paris", "France", 48.8566, 2.3522, "world", "Europe/Paris"],
  ["Pretoria", "South Africa", -25.7461, 28.1881, "world", "Africa/Johannesburg"], // executive capital; Cape Town is legislative, Bloemfontein judicial
  ["Rome", "Italy", 41.9028, 12.4964, "world", "Europe/Rome"],
  ["Nairobi", "Kenya", -1.2921, 36.8219, "world", "Africa/Nairobi"],
  ["Naypyidaw", "Myanmar", 19.7475, 96.1150, "world", "Asia/Yangon"], // capital since 2006; Yangon is the largest city
  ["Bogotá", "Colombia", 4.6097, -74.0817, "world", "America/Bogota"],
  ["Seoul", "South Korea", 37.5665, 126.9780, "world", "Asia/Seoul"],
  ["Khartoum", "Sudan", 15.6000, 32.5300, "world", "Africa/Khartoum"], // the government has worked from Port Sudan during the war since 2023
  ["Kampala", "Uganda", 0.3136, 32.5811, "world", "Africa/Kampala"],
  ["Madrid", "Spain", 40.4168, -3.7038, "world", "Europe/Madrid"],
  ["Algiers", "Algeria", 36.7538, 3.0588, "world", "Africa/Algiers"],
  ["Baghdad", "Iraq", 33.3152, 44.3661, "world", "Asia/Baghdad"],
  ["Buenos Aires", "Argentina", -34.6037, -58.3816, "world", "America/Argentina/Buenos_Aires"],
  ["Kabul", "Afghanistan", 34.5553, 69.2075, "world", "Asia/Kabul"],
  ["Sanaa", "Yemen", 15.3694, 44.1910, "world", "Asia/Aden"], // constitutional capital; the recognised government sits in Aden
  ["Ottawa", "Canada", 45.4215, -75.6972, "world", "America/Toronto"],
  ["Warsaw", "Poland", 52.2297, 21.0122, "world", "Europe/Warsaw"],
  ["Rabat", "Morocco", 34.0209, -6.8416, "world", "Africa/Casablanca"], // UTC+1, back to UTC+0 during Ramadan
  ["Luanda", "Angola", -8.8383, 13.2344, "world", "Africa/Luanda"],
  ["Kyiv", "Ukraine", 50.4501, 30.5234, "world", "Europe/Kiev"], // old spelling on purpose: "Europe/Kyiv" (2022) throws in browsers with older tz data; same zone
  ["Tashkent", "Uzbekistan", 41.3111, 69.2797, "world", "Asia/Tashkent"],
  ["Kuala Lumpur", "Malaysia", 3.1390, 101.6869, "world", "Asia/Kuala_Lumpur"], // Putrajaya, 25 km south, is the administrative centre
  ["Maputo", "Mozambique", -25.9692, 32.5732, "world", "Africa/Maputo"],
  ["Accra", "Ghana", 5.5560, -0.1969, "world", "Africa/Accra"],
  ["Lima", "Peru", -12.0464, -77.0428, "world", "America/Lima"],
  ["Riyadh", "Saudi Arabia", 24.6877, 46.7219, "world", "Asia/Riyadh"],
  ["Antananarivo", "Madagascar", -18.8792, 47.5079, "world", "Indian/Antananarivo"],
  ["Yamoussoukro", "Côte d'Ivoire", 6.8206, -5.2767, "world", "Africa/Abidjan"], // official capital since 1983; most of the government is in Abidjan
  ["Kathmandu", "Nepal", 27.7172, 85.3240, "world", "Asia/Kathmandu"],
  ["Yaoundé", "Cameroon", 3.8480, 11.5021, "world", "Africa/Douala"],
  ["Caracas", "Venezuela", 10.4806, -66.9036, "world", "America/Caracas"],
  ["Niamey", "Niger", 13.5116, 2.1254, "world", "Africa/Niamey"],
  ["Canberra", "Australia", -35.2809, 149.1300, "world", "Australia/Sydney"],
  ["Pyongyang", "North Korea", 39.0392, 125.7625, "world", "Asia/Pyongyang"],
  ["Damascus", "Syria", 33.5138, 36.2765, "world", "Asia/Damascus"],
  ["Bamako", "Mali", 12.6392, -8.0029, "world", "Africa/Bamako"],
  ["Ouagadougou", "Burkina Faso", 12.3714, -1.5197, "world", "Africa/Ouagadougou"],
  ["Taipei", "Taiwan", 25.0478, 121.5319, "world", "Asia/Taipei"],
  ["Colombo", "Sri Lanka", 6.9271, 79.8612, "world", "Asia/Colombo"], // commercial capital; the legislative capital, Sri Jayawardenepura Kotte, is a suburb 8 km east
  ["Lilongwe", "Malawi", -13.9626, 33.7741, "world", "Africa/Blantyre"],
  ["Lusaka", "Zambia", -15.3875, 28.3228, "world", "Africa/Lusaka"],
  ["Astana", "Kazakhstan", 51.1694, 71.4491, "world", "Asia/Almaty"], // UTC+5 since 1 Mar 2024; a browser with older tz data shows UTC+6
  ["N'Djamena", "Chad", 12.1348, 15.0557, "world", "Africa/Ndjamena"],
  ["Santiago", "Chile", -33.4489, -70.6693, "world", "America/Santiago"],
  ["Bucharest", "Romania", 44.4268, 26.1025, "world", "Europe/Bucharest"],
  ["Mogadishu", "Somalia", 2.0469, 45.3182, "world", "Africa/Mogadishu"],
  ["Dakar", "Senegal", 14.6928, -17.4467, "world", "Africa/Dakar"],
  ["Guatemala City", "Guatemala", 14.6349, -90.5069, "world", "America/Guatemala"],
  ["Amsterdam", "Netherlands", 52.3676, 4.9041, "world", "Europe/Amsterdam"], // constitutional capital; the government sits in The Hague
  ["Quito", "Ecuador", -0.2202, -78.5125, "world", "America/Guayaquil"],
  ["Phnom Penh", "Cambodia", 11.5564, 104.9282, "world", "Asia/Phnom_Penh"],
  ["Harare", "Zimbabwe", -17.8252, 31.0335, "world", "Africa/Harare"],
  ["Conakry", "Guinea", 9.5370, -13.6773, "world", "Africa/Conakry"],
  ["Porto-Novo", "Benin", 6.4965, 2.6036, "world", "Africa/Porto-Novo"], // official capital; the government sits in Cotonou
  ["Kigali", "Rwanda", -1.9441, 30.0619, "world", "Africa/Kigali"],
  ["Gitega", "Burundi", -3.4271, 29.9246, "world", "Africa/Bujumbura"], // political capital since 2019; Bujumbura is the largest city
  ["La Paz", "Bolivia", -16.4897, -68.1193, "world", "America/La_Paz"], // seat of government; the constitutional capital is Sucre
  ["Tunis", "Tunisia", 36.8065, 10.1815, "world", "Africa/Tunis"],
  ["Juba", "South Sudan", 4.8594, 31.5713, "world", "Africa/Juba"],
  ["Port-au-Prince", "Haiti", 18.5435, -72.3388, "world", "America/Port-au-Prince"],
  ["Brussels", "Belgium", 50.8503, 4.3517, "world", "Europe/Brussels"],
  ["Amman", "Jordan", 31.9454, 35.9284, "world", "Asia/Amman"],
  ["Santo Domingo", "Dominican Republic", 18.4861, -69.9312, "world", "America/Santo_Domingo"],
  ["Abu Dhabi", "UAE", 24.4539, 54.3773, "world", "Asia/Dubai"],
  ["Havana", "Cuba", 23.1136, -82.3666, "world", "America/Havana"],
  ["Tegucigalpa", "Honduras", 14.0723, -87.1921, "world", "America/Tegucigalpa"],
  ["Prague", "Czechia", 50.0755, 14.4378, "world", "Europe/Prague"],
  ["Stockholm", "Sweden", 59.3293, 18.0686, "world", "Europe/Stockholm"],
  ["Dushanbe", "Tajikistan", 38.5598, 68.7870, "world", "Asia/Dushanbe"],
  ["Port Moresby", "Papua New Guinea", -9.4438, 147.1803, "world", "Pacific/Port_Moresby"],
  ["Lisbon", "Portugal", 38.7223, -9.1393, "world", "Europe/Lisbon"],
  ["Baku", "Azerbaijan", 40.4093, 49.8671, "world", "Asia/Baku"],
  ["Athens", "Greece", 37.9838, 23.7275, "world", "Europe/Athens"],
  // The last few countries (about 9-10 million people each) are within source noise of
  // the cut-off; the next two would be Sierra Leone and Laos.
  ["Budapest", "Hungary", 47.4979, 19.0402, "world", "Europe/Budapest"],
  ["Lomé", "Togo", 6.1375, 1.2123, "world", "Africa/Lome"],
  ["Jerusalem", "Israel", 31.7683, 35.2137, "world", "Asia/Jerusalem"], // seat of government; its status is disputed and most embassies are in Tel Aviv
  ["Vienna", "Austria", 48.2082, 16.3738, "world", "Europe/Vienna"],
  ["Minsk", "Belarus", 53.9006, 27.5590, "world", "Europe/Minsk"],
  ["Bern", "Switzerland", 46.9480, 7.4474, "world", "Europe/Zurich"], // the "federal city", seat of the Swiss government

  // ---- 4. World: diaspora hubs that are not capitals ----
  ["Toronto", "Canada", 43.6532, -79.3832, "world", "America/Toronto"],
  ["Vancouver", "Canada", 49.2827, -123.1207, "world", "America/Vancouver"],
  ["Sydney", "Australia", -33.8688, 151.2093, "world", "Australia/Sydney"],
  ["Melbourne", "Australia", -37.8136, 144.9631, "world", "Australia/Melbourne"],
  ["Auckland", "New Zealand", -36.8485, 174.7633, "world", "Pacific/Auckland"],
  ["Dubai", "UAE", 25.2631, 55.2972, "world", "Asia/Dubai"],
  // Telugu hubs added on review (not in the population-ranked list):
  ["Singapore", "Singapore", 1.3521, 103.8198, "world", "Asia/Singapore"],
  ["Kuwait City", "Kuwait", 29.3759, 47.9774, "world", "Asia/Kuwait"],
  ["Muscat", "Oman", 23.5880, 58.3829, "world", "Asia/Muscat"],
  ["Doha", "Qatar", 25.2854, 51.5310, "world", "Asia/Qatar"],
  ["Manama", "Bahrain", 26.2285, 50.5860, "world", "Asia/Bahrain"],
  ["Jeddah", "Saudi Arabia", 21.4858, 39.1925, "world", "Asia/Riyadh"],
];
