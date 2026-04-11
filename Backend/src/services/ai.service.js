const axios = require("axios");

// Updated to Gemini 1.5 Flash (supports both text and vision)
// Change the model name to the current 2026 stable version
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent"; /**
 * Helper to call Gemini API and handle JSON parsing
 */
async function callGeminiAPI(apiKey, contents) {
  try {
    const response = await axios.post(
      `${GEMINI_URL}?key=${apiKey}`,
      { contents },
      { headers: { "Content-Type": "application/json" } },
    );

    const candidates = response.data.candidates;
    if (
      candidates &&
      candidates[0] &&
      candidates[0].content &&
      candidates[0].content.parts &&
      candidates[0].content.parts[0].text
    ) {
      let rawText = candidates[0].content.parts[0].text;

      // CLEANER: Removes markdown code blocks like ```json ... ``` if present
      const cleanJson = rawText.replace(/```json|```/g, "").trim();

      return JSON.parse(cleanJson);
    }
    throw new Error("Empty or invalid response structure from Gemini");
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.error?.message || "AI Analysis failed",
    );
  }
}

/**
 * Analyzes an image via Cloudinary URL
 */
exports.analyzeImage = async (imageUrl) => {
  const apiKey = process.env.AI_API_KEY;

  // 1. Fetch image from Cloudinary and convert to Base64
  const imageResp = await axios.get(imageUrl, { responseType: "arraybuffer" });
  const base64Image = Buffer.from(imageResp.data, "binary").toString("base64");

  const prompt =
    "Analyze this food product image. Return a JSON object with exactly these fields: " +
    "product {name, subtitle, image}, " +
    "analysis {grade, recommendation, score, rating, ingredients, safeIngredients, avoidIngredients, alternatives}. " +
    "Only output valid JSON.";

  const contents = [
    {
      role: "user",
      parts: [
        { text: prompt },
        {
          inline_data: {
            mime_type: "image/jpeg",
            data: base64Image,
          },
        },
      ],
    },
  ];

  return await callGeminiAPI(apiKey, contents);
};

/**
 * Analyzes a product based on its barcode string
 */
exports.analyzeBarcode = async (barcode) => {
  const apiKey = process.env.AI_API_KEY;

  const prompt =
    `Analyze this food product barcode: ${barcode}. ` +
    `Return a JSON object with: product {name, subtitle, image}, ` +
    `analysis {grade, recommendation, score, rating, ingredients, safeIngredients, avoidIngredients, alternatives}. ` +
    `Only output valid JSON.`;

  const contents = [
    {
      role: "user",
      parts: [{ text: prompt }],
    },
  ];

  return await callGeminiAPI(apiKey, contents);
};
