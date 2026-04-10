/**
 * 🧪 Mock Dataset (10 Products)
 */

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const mockLogin = async () => {
  await delay(500);

  return {
    user: {
      id: "1",
      name: "Elena Rodriguez",
      email: "elena.rodriguez@healthmail.com",
    },
    token: "mock-token-123",
  };
};

/**
 * 🔟 Product Dataset
 */
const products = [
  {
    name: "Organic Greek Yogurt",
    subtitle: "Honey & Vanilla Bean Blend",
    image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707",
    analysis: {
      grade: "A+",
      recommendation: "SAFE",
      description:
        "Excellent source of protein and probiotics. Natural sugar from honey.",
      score: 82,
      rating: "Excellent",
      ingredients: ["Cultured Milk", "Honey", "Vanilla Bean", "Live Cultures"],
      alternatives: [
        {
          name: "Plain Grass-Fed Greek Yogurt",
          desc: "Grass-fed milk, active cultures",
        },
        {
          name: "Organic Icelandic Skyr",
          desc: "High protein, low sugar",
        },
      ],
    },
  },
  {
    name: "Whole Grain O's",
    subtitle: "Morning Crunch Cereal",
    image: "https://images.unsplash.com/photo-1604908176997-43198a3c7a1c",
    analysis: {
      grade: "B",
      recommendation: "MODERATE",
      description:
        "Contains whole grains but added sugars are relatively high.",
      score: 65,
      rating: "Good",
      ingredients: ["Whole Grain Oats", "Sugar", "Corn Syrup"],
      alternatives: [
        {
          name: "Low Sugar Granola",
          desc: "Oats, nuts, honey",
        },
      ],
    },
  },
  {
    name: "Energy Drink X",
    subtitle: "High Caffeine Boost",
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505",
    analysis: {
      grade: "D",
      recommendation: "AVOID",
      description: "High sugar and artificial additives increase health risks.",
      score: 40,
      rating: "Poor",
      ingredients: ["Sugar", "Caffeine", "Artificial Dye"],
      alternatives: [
        {
          name: "Green Tea",
          desc: "Natural caffeine",
        },
      ],
    },
  },
  {
    name: "Almond Milk",
    subtitle: "Unsweetened",
    image: "https://images.unsplash.com/photo-1604908177522-3eeb7a64de2c",
    analysis: {
      grade: "A",
      recommendation: "SAFE",
      description: "Low calorie and dairy-free.",
      score: 85,
      rating: "Excellent",
      ingredients: ["Almonds", "Water", "Salt"],
      alternatives: [],
    },
  },
  {
    name: "Protein Bar",
    subtitle: "Chocolate Peanut",
    image: "https://images.unsplash.com/photo-1576402187878-974f70c890a5",
    analysis: {
      grade: "B+",
      recommendation: "MODERATE",
      description: "High protein but contains processed sugars.",
      score: 70,
      rating: "Good",
      ingredients: ["Protein Blend", "Sugar", "Peanuts"],
      alternatives: [],
    },
  },
  {
    name: "Instant Noodles",
    subtitle: "Spicy Flavor",
    image: "https://images.unsplash.com/photo-1604908177012-33c8c9a5d2c2",
    analysis: {
      grade: "C",
      recommendation: "AVOID",
      description: "High sodium and preservatives.",
      score: 50,
      rating: "Average",
      ingredients: ["Refined Flour", "Salt", "MSG"],
      alternatives: [],
    },
  },
  {
    name: "Fruit Juice",
    subtitle: "Orange Blend",
    image: "https://images.unsplash.com/photo-1582719478185-8d6a4b2dfcc3",
    analysis: {
      grade: "B",
      recommendation: "MODERATE",
      description: "Natural but high in sugar.",
      score: 68,
      rating: "Good",
      ingredients: ["Orange Juice", "Sugar"],
      alternatives: [],
    },
  },
  {
    name: "Dark Chocolate",
    subtitle: "70% Cocoa",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e17b",
    analysis: {
      grade: "A",
      recommendation: "SAFE",
      description: "Rich in antioxidants.",
      score: 88,
      rating: "Excellent",
      ingredients: ["Cocoa", "Sugar"],
      alternatives: [],
    },
  },
  {
    name: "Ice Cream",
    subtitle: "Vanilla Classic",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
    analysis: {
      grade: "C",
      recommendation: "MODERATE",
      description: "High sugar and fat content.",
      score: 55,
      rating: "Average",
      ingredients: ["Milk", "Sugar", "Cream"],
      alternatives: [],
    },
  },
  {
    name: "Peanut Butter",
    subtitle: "Natural Spread",
    image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707",
    analysis: {
      grade: "A",
      recommendation: "SAFE",
      description: "Healthy fats and protein.",
      score: 90,
      rating: "Excellent",
      ingredients: ["Peanuts"],
      alternatives: [],
    },
  },
];

/**
 * 🔹 Scan Mock (random product)
 */
export const mockScan = async (barcode: string) => {
  await delay(800);

  const random = products[Math.floor(Math.random() * products.length)];

  return {
    product: {
      name: random.name,
      subtitle: random.subtitle,
      image: random.image,
    },
    analysis: random.analysis,
  };
};

/**
 * 🔹 History Mock
 */
export const mockHistory = async () => {
  await delay(500);

  return products.map((p, i) => ({
    id: i + 1,
    name: p.name,
    brand: p.subtitle,
    status: p.analysis.recommendation,
    note: "",
    time: "Recently",
    image: p.image,
  }));
};
