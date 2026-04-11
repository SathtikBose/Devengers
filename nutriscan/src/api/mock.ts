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
    name: "Super Demo Nutrition Bar",
    subtitle: "All-in-One Health Snack",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    analysis: {
      grade: "A",
      recommendation: "SAFE",
      description:
        "A complete demo product with all nutrition facts, safe and avoid ingredients, and healthy alternatives. Perfect for testing all UI elements!",
      score: 95,
      rating: "Excellent",
      nutrition: {
        calories: "210 kcal",
        protein: "15 g",
        sugar: "5 g",
        fat: "7 g",
        fiber: "6 g",
      },
      ingredients: [
        "Whey Protein Isolate",
        "Almonds",
        "Oats",
        "Honey",
        "Dark Chocolate",
        "Sunflower Oil",
        "Natural Flavors",
        "Sea Salt",
        "Soy Lecithin",
      ],
      safeIngredients: [
        "Whey Protein Isolate",
        "Almonds",
        "Oats",
        "Honey",
        "Dark Chocolate",
      ],
      avoidIngredients: [
        {
          name: "Soy Lecithin",
          reason: "Allergen",
          note: "May cause reactions in soy-sensitive individuals",
        },
        {
          name: "Sunflower Oil",
          reason: "Processed Oil",
          note: "High in omega-6, best in moderation",
        },
      ],
      alternatives: [
        {
          name: "Homemade Nut & Seed Bar",
          desc: "No additives, customizable ingredients",
        },
        {
          name: "Greek Yogurt with Berries",
          desc: "High protein, natural sweetness",
        },
        {
          name: "Fruit & Nut Trail Mix",
          desc: "Whole foods, no added sugar",
        },
      ],
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
