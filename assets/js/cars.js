/* Carvantage stock.
   Add, edit or remove cars here. Every page reads from this list.
   status: "available" | "reserved" | "sold"
   photos: list of image paths (e.g. "assets/img/stock/ab12cde-1.jpg"). Leave [] for "photo coming soon".
   notes: honest condition notes. Each is {text, photo} where photo is the number of the photo that shows it (or null). */
window.CARS = [
  {
    id: "ford-fiesta-2014",
    make: "Ford", model: "Fiesta", trim: "1.25 Zetec 5dr", year: 2014,
    price: 3495, miles: 61200, fuel: "Petrol", gearbox: "Manual", body: "Hatchback",
    engine: "1.25 petrol, 82 PS", doors: 5, colour: "Panther Black", owners: 2, keys: 2,
    mot: "2027-03-14", tax: "£180 a year", status: "available",
    added: "2026-09-20",
    photos: [],
    summary: "A tidy first car with two keys and a full history. The cambelt isn't due on this engine (it's chain driven).",
    history: [
      { date: "2026-09", text: "Fresh MOT, no advisories" },
      { date: "2026-09", text: "Oil and filter service by us" },
      { date: "2025-03", text: "Service at 55,100 miles, Ford dealer (stamped)" },
      { date: "2024-03", text: "Service at 49,800 miles, Ford dealer (stamped)" },
      { date: "2023-02", text: "Front brake pads and discs, receipt in folder" }
    ],
    notes: [
      { text: "Light kerbing on the front passenger alloy", photo: 7 },
      { text: "Small stone chip on the bonnet, touched in", photo: 9 },
      { text: "Driver's seat bolster is slightly worn", photo: 12 }
    ],
    features: ["Bluetooth", "Air con", "Heated windscreen", "Alloy wheels", "Electric front windows", "Two keys", "Full service history"]
  },
  {
    id: "vw-polo-2015",
    make: "Volkswagen", model: "Polo", trim: "1.0 SE 5dr", year: 2015,
    price: 4250, miles: 48900, fuel: "Petrol", gearbox: "Manual", body: "Hatchback",
    engine: "1.0 petrol, 60 PS", doors: 5, colour: "Reflex Silver", owners: 1, keys: 2,
    mot: "2027-06-02", tax: "£20 a year", status: "available",
    added: "2026-09-24",
    photos: [],
    summary: "One owner from new with a VW dealer history. Cheap to tax, cheap to insure, and it's barely been used.",
    history: [
      { date: "2026-06", text: "MOT, one advisory: rear tyres wearing (since replaced)" },
      { date: "2026-06", text: "Two new rear tyres, Michelin" },
      { date: "2025-06", text: "Service at 44,000 miles, VW dealer" },
      { date: "2024-06", text: "Service at 38,500 miles, VW dealer" }
    ],
    notes: [
      { text: "Scuff on the rear bumper corner, about the size of a coin", photo: 8 },
      { text: "Faint scratch on the tailgate, only shows in sunlight", photo: 10 }
    ],
    features: ["DAB radio", "Bluetooth", "Air con", "Alloy wheels", "One owner", "Two keys", "Full VW history"]
  },
  {
    id: "vauxhall-astra-2013",
    make: "Vauxhall", model: "Astra", trim: "1.6 SRi 5dr", year: 2013,
    price: 2795, miles: 84300, fuel: "Petrol", gearbox: "Manual", body: "Hatchback",
    engine: "1.6 petrol, 115 PS", doors: 5, colour: "Sovereign Silver", owners: 3, keys: 1,
    mot: "2027-01-22", tax: "£200 a year", status: "available",
    added: "2026-09-10",
    photos: [],
    summary: "A roomy family hatch with a long MOT. Only one key, which we've priced in. Drives well, no warning lights.",
    history: [
      { date: "2026-01", text: "MOT, advisories: slight play in front lower arm (replaced by us), rear brake pads (replaced by us)" },
      { date: "2026-01", text: "Front lower arm and rear pads done, receipts in folder" },
      { date: "2024-04", text: "Service at 76,000 miles, independent garage" }
    ],
    notes: [
      { text: "Only one key. A second cut and coded key is roughly £120 from a locksmith", photo: null },
      { text: "Dent on the rear passenger door, no paint damage", photo: 6 },
      { text: "Front tyres have about 4mm left", photo: 11 }
    ],
    features: ["Cruise control", "Air con", "Alloy wheels", "Sports seats", "Long MOT"]
  },
  {
    id: "toyota-yaris-2012",
    make: "Toyota", model: "Yaris", trim: "1.33 TR 5dr", year: 2012,
    price: 3195, miles: 72600, fuel: "Petrol", gearbox: "Automatic", body: "Hatchback",
    engine: "1.33 petrol, CVT automatic", doors: 5, colour: "Deep Blue", owners: 2, keys: 2,
    mot: "2027-04-30", tax: "£35 a year", status: "reserved",
    added: "2026-09-02",
    photos: [],
    summary: "An automatic Yaris that's been looked after. Great for town driving and easy to park.",
    history: [
      { date: "2026-04", text: "MOT, no advisories" },
      { date: "2025-10", text: "Service at 70,000 miles, Toyota dealer" },
      { date: "2023-10", text: "Service at 62,500 miles, Toyota dealer" }
    ],
    notes: [
      { text: "Wear on the steering wheel leather", photo: 13 },
      { text: "Small crack in the rear light lens, MOT pass, shown clearly", photo: 9 }
    ],
    features: ["Automatic", "Reversing camera", "Bluetooth", "Air con", "Two keys"]
  },
  {
    id: "skoda-octavia-2014",
    make: "Skoda", model: "Octavia", trim: "1.6 TDI SE Estate", year: 2014,
    price: 3995, miles: 112400, fuel: "Diesel", gearbox: "Manual", body: "Estate",
    engine: "1.6 diesel, 105 PS", doors: 5, colour: "Candy White", owners: 2, keys: 2,
    mot: "2027-02-08", tax: "£20 a year", status: "available",
    added: "2026-09-27",
    photos: [],
    summary: "Huge boot, 60 mpg on a run, £20 tax. The miles are mostly motorway and the history backs that up.",
    history: [
      { date: "2026-02", text: "MOT, no advisories" },
      { date: "2025-11", text: "Cambelt and water pump at 108,000 miles, receipt in folder" },
      { date: "2025-11", text: "Service at 108,000 miles" },
      { date: "2024-09", text: "Service at 96,000 miles" }
    ],
    notes: [
      { text: "Stone chips on the front bumper, as you'd expect from motorway miles", photo: 5 },
      { text: "Boot carpet has marks from a dog crate", photo: 14 },
      { text: "Diesel: not ideal for lots of short trips because of the particulate filter. Ask us if unsure", photo: null }
    ],
    features: ["Cambelt done", "Roof rails", "Cruise control", "Parking sensors", "Bluetooth", "Two keys"]
  },
  {
    id: "nissan-qashqai-2012",
    make: "Nissan", model: "Qashqai", trim: "1.6 Acenta 5dr", year: 2012,
    price: 3650, miles: 89900, fuel: "Petrol", gearbox: "Manual", body: "SUV",
    engine: "1.6 petrol, 115 PS", doors: 5, colour: "Storm Grey", owners: 3, keys: 2,
    mot: "2026-12-11", tax: "£200 a year", status: "available",
    added: "2026-09-15",
    photos: [],
    summary: "High driving position and a big boot. The MOT runs out in December, so we'll put a fresh 12 months on it before you collect.",
    history: [
      { date: "2025-12", text: "MOT, advisory: slight corrosion on rear brake pipes" },
      { date: "2025-06", text: "Service at 86,000 miles" },
      { date: "2024-06", text: "Service at 79,000 miles" }
    ],
    notes: [
      { text: "Rear brake pipes will be checked at the fresh MOT and replaced if needed", photo: null },
      { text: "Scuffed rear bumper, shown", photo: 7 },
      { text: "Aircon needs a regas, we'll do it before sale", photo: null }
    ],
    features: ["Fresh MOT before sale", "Panoramic roof", "Bluetooth", "Air con", "Alloy wheels"]
  },
  {
    id: "honda-jazz-2011",
    make: "Honda", model: "Jazz", trim: "1.4 ES 5dr", year: 2011,
    price: 2995, miles: 67800, fuel: "Petrol", gearbox: "Manual", body: "Hatchback",
    engine: "1.4 petrol, 100 PS", doors: 5, colour: "Milano Red", owners: 2, keys: 2,
    mot: "2027-05-19", tax: "£160 a year", status: "sold",
    added: "2026-08-20",
    photos: [],
    summary: "Sold. We'll have more like this soon.",
    history: [], notes: [], features: []
  },
  {
    id: "peugeot-208-2013",
    make: "Peugeot", model: "208", trim: "1.2 Active 3dr", year: 2013,
    price: 2495, miles: 70100, fuel: "Petrol", gearbox: "Manual", body: "Hatchback",
    engine: "1.2 petrol, 82 PS", doors: 3, colour: "Bianca White", owners: 3, keys: 2,
    mot: "2026-11-30", tax: "£20 a year", status: "sold",
    added: "2026-08-12",
    photos: [],
    summary: "Sold.",
    history: [], notes: [], features: []
  },
  {
    id: "ford-cmax-2013",
    make: "Ford", model: "C-Max", trim: "1.6 Zetec 5dr", year: 2013,
    price: 3295, miles: 93500, fuel: "Petrol", gearbox: "Manual", body: "MPV",
    engine: "1.6 petrol, 105 PS", doors: 5, colour: "Moondust Silver", owners: 2, keys: 2,
    mot: "2027-07-03", tax: "£200 a year", status: "available",
    added: "2026-09-29",
    photos: [],
    summary: "Family-sized with sliding rear seats and a long MOT. Service history is mostly stamped, one gap in 2022.",
    history: [
      { date: "2026-07", text: "MOT, no advisories" },
      { date: "2026-03", text: "Service at 91,000 miles" },
      { date: "2023-05", text: "Service at 72,000 miles" },
      { date: "2021-05", text: "Service at 58,000 miles" }
    ],
    notes: [
      { text: "No service record for 2022", photo: null },
      { text: "Scratches on the rear bumper top from loading", photo: 8 },
      { text: "One alloy is kerbed", photo: 6 }
    ],
    features: ["Long MOT", "Sliding rear seats", "Bluetooth", "Air con", "Parking sensors", "Two keys"]
  }
];
