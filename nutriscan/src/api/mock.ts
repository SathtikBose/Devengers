/**
 * 🧪 Mock Data (for prototype/demo)
 */

export const mockLogin = async () => {
  return {
    user: {
      id: "1",
      name: "Elena Rodriguez",
      email: "elena.rodriguez@healthmail.com",
    },
    token: "mock-token-123",
  };
};

export const mockScan = async (barcode: string) => {
  return {
    product: {
      name: "Organic Greek Yogurt",
      subtitle: "Honey & Vanilla Bean Blend",
      image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707",
    },
    analysis: {
      grade: "A+",
      recommendation: "SAFE",
      description:
        "This product is an excellent source of protein and probiotics.",
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
  };
};
