const axios = require("axios");

// Gemini Vision API endpoint for image analysis
const GEMINI_VISION_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent";
// Gemini text endpoint for barcode (text) analysis
const GEMINI_TEXT_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

// Helper to call Gemini API
async function callGeminiAPI(url, apiKey, contents) {
  const response = await axios.post(
    `${url}?key=${apiKey}`,
    { contents },
    { headers: { "Content-Type": "application/json" } },
  );
  // Gemini returns candidates[0].content.parts[0].text
  const candidates = response.data.candidates;
  if (
    candidates &&
    candidates[0] &&
    candidates[0].content &&
    candidates[0].content.parts &&
    candidates[0].content.parts[0].text
  ) {
    return JSON.parse(candidates[0].content.parts[0].text);
  }
  throw new Error("Invalid Gemini API response");
}

exports.analyzeImage = async (imageUrl) => {
  const apiKey = process.env.AI_API_KEY;
  // Gemini expects base64 image, so fetch and convert
  const imageResp = await axios.get(imageUrl, { responseType: "arraybuffer" });
  const base64Image = Buffer.from(imageResp.data, "binary").toString("base64");
  const prompt =
    "Analyze this food product image. Return a JSON object with: product {name, subtitle, image}, analysis {grade, recommendation, score, rating, ingredients, safeIngredients, avoidIngredients, alternatives}. Only output valid JSON.";
  const contents = [
    {
      role: "user",
      parts: [
        { text: prompt },
        { inlineData: { mimeType: "image/jpeg", data: base64Image } },
      ],
    },
  ];
  return await callGeminiAPI(GEMINI_VISION_URL, apiKey, contents);
};

exports.analyzeBarcode = async (barcode) => {
  const apiKey = process.env.AI_API_KEY;
  const prompt = `Analyze this food product barcode: ${barcode}. Return a JSON object with: product {name, subtitle, image}, analysis {grade, recommendation, score, rating, ingredients, safeIngredients, avoidIngredients, alternatives}. Only output valid JSON.`;
  const contents = [{ role: "user", parts: [{ text: prompt }] }];
  return await callGeminiAPI(GEMINI_TEXT_URL, apiKey, contents);
};
