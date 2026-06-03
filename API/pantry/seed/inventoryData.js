// Seed pantry items for the demo user (usr_demo).
// Mirrors UI/src/data/mock/inventory.js exactly.

const DEMO_INVENTORY = [
  { name: "Basmati rice",        qty: 1.2, unit: "cup",   category: "Grain",    expires: "2026-09-12" },
  { name: "Chicken thighs",      qty: 400, unit: "g",     category: "Protein",  expires: "2026-05-21" },
  { name: "Yogurt",              qty: 0.5, unit: "cup",   category: "Dairy",    expires: "2026-05-26" },
  { name: "Onion",               qty: 5,   unit: "med",   category: "Produce",  expires: "2026-06-04" },
  { name: "Ghee",                qty: 8,   unit: "tbsp",  category: "Fat",      expires: "2026-12-01" },
  { name: "Garam masala",        qty: 4,   unit: "tsp",   category: "Spice",    expires: "2027-01-20" },
  { name: "Saffron",             qty: 0,   unit: "pinch", category: "Spice",    expires: "2027-06-10" },
  { name: "Mint leaves",         qty: 0.3, unit: "cup",   category: "Herb",     expires: "2026-05-22" },
  { name: "Coriander",           qty: 1,   unit: "cup",   category: "Herb",     expires: "2026-05-23" },
  { name: "Ginger-garlic paste", qty: 1,   unit: "tbsp",  category: "Aromatic", expires: "2026-06-12" },
  { name: "Green chili",         qty: 2,   unit: "",      category: "Produce",  expires: "2026-05-24" },
  { name: "Bay leaf",            qty: 6,   unit: "",      category: "Spice",    expires: "2027-03-01" },
  { name: "Olive oil",           qty: 12,  unit: "tbsp",  category: "Fat",      expires: "2026-12-30" },
  { name: "Eggs",                qty: 8,   unit: "",      category: "Protein",  expires: "2026-05-29" },
  { name: "Tomato",              qty: 4,   unit: "med",   category: "Produce",  expires: "2026-05-25" },
  { name: "Parmesan",            qty: 80,  unit: "g",     category: "Dairy",    expires: "2026-08-10" },
];

module.exports = { DEMO_INVENTORY };
