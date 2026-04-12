const QUOTES = [
  { text: "Let food be thy medicine and medicine be thy food.", author: "Hippocrates" },
  { text: "The groundwork of all happiness is health.", author: "Leigh Hunt" },
  { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
  { text: "A healthy outside starts from the inside.", author: "Robert Urich" },
  { text: "Your diet is a bank account. Good food choices are good investments.", author: "Bethenny Frankel" },
  { text: "Small steps toward better eating add up to a healthier you.", author: "NutriScan" },
  { text: "Eat real food, mostly plants, not too much.", author: "Michael Pollan" },
  { text: "Hydration and whole foods are quiet superpowers.", author: "NutriScan" },
  { text: "Progress beats perfection when building new habits.", author: "NutriScan" },
  { text: "Read labels like you read the news—curiosity keeps you safe.", author: "NutriScan" },
  { text: "Nourish yourself today; your future self will thank you.", author: "NutriScan" },
  { text: "Balance is not a single meal—it’s the pattern of your week.", author: "NutriScan" },
];

function dayKey(d = new Date()) {
  return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
}

function pickIndexForDay(key) {
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return hash % QUOTES.length;
}

function getDailyQuote(date = new Date()) {
  const key = dayKey(date);
  const idx = pickIndexForDay(key);
  const { text, author } = QUOTES[idx];
  return {
    text,
    author,
    date: key,
  };
}

module.exports = {
  getDailyQuote,
  QUOTES,
};
