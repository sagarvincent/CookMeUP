export const CUISINES = [
  { id: "indian",        label: "Indian",         region: "South Asia" },
  { id: "italian",       label: "Italian",         region: "Mediterranean" },
  { id: "mediterranean", label: "Mediterranean",   region: "Levant" },
  { id: "japanese",      label: "Japanese",        region: "East Asia" },
  { id: "mexican",       label: "Mexican",         region: "Americas" },
  { id: "thai",          label: "Thai",            region: "Southeast Asia" },
  { id: "french",        label: "French",          region: "Europe" },
  { id: "american",      label: "American",        region: "Americas" },
];

export const COURSES = ["Main", "Side", "Salad", "Soup", "Breakfast", "Dessert", "Snack"];
export const DIETS   = ["Veg", "Non-Veg", "Vegan", "Gluten-free"];

export const DIET_TARGETS = {
  kcal: 2100, protein: 110, carbs: 240, fat: 75, fiber: 30,
};

export const ASSISTANT_LINES = [
  { from: "asst", text: "Got it — Hyderabadi chicken biryani for 4. I'll watch your pans and pace the dum for you. Inventory check passed except saffron (1 pinch short — using turmeric milk as substitute)." },
  { from: "asst", text: "Whisk the yogurt cold so it doesn't split when it hits the chicken. Press the marinade in with your fingers — don't be gentle." },
  { from: "asst", text: "Onions: keep them moving once they go from translucent to gold. The turn from gold → mahogany happens in about 90 seconds." },
  { from: "asst", text: "I'm hearing oil at a healthy crackle — bay should hit it now. Don't let cardamom blacken." },
  { from: "asst", text: "Boil the rice in plenty of salted water. Pull it at the 'al dente bite' — about 70%. If you press a grain it should still resist." },
  { from: "asst", text: "Layering: heaviest marinade at the base, rice spread loose. Don't pack. Tuck the birista down into the layers, not just on top." },
  { from: "asst", text: "Foil seal first, then the lid. We want NO steam escape. Listen for the hiss to settle — that's your cue to drop the heat." },
  { from: "asst", text: "Rest is sacred. If you lift the lid the steam collapses and the bottom layer gets gummy. Set a timer and walk away." },
  { from: "asst", text: "Plate from the bottom up — turn the pot if you have to. The crispy chicken at the base is the prize." },
];
