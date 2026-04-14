const axios = require("axios");

function getApiKey() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    const error = new Error(
      "Missing Groq API key. Set GROQ_API_KEY in backend/.env.",
    );
    error.status = 500;
    throw error;
  }
  return apiKey;
}

const GROQ_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractJsonFromText(text) {
  if (!text) throw new Error("Empty response from Groq");

  const cleanedText = text.replace(/```json|```/gi, "").trim();

  try {
    return JSON.parse(cleanedText);
  } catch {
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in Groq response");
    return JSON.parse(jsonMatch[0]);
  }
}

function buildGroqError(error) {
  const apiMessage =
    error.response?.data?.error?.message ||
    error.message ||
    "AI analysis failed";
  const statusCode = error.response?.status;
  const wrappedError = new Error(apiMessage);
  wrappedError.status = statusCode ? 502 : 500;
  return wrappedError;
}

// ─── Core API call ───────────────────────────────────────────────────────────

async function callGroqAPI(messages) {
  const apiKey = getApiKey();

  try {
    const response = await axios.post(
      GROQ_URL,
      {
        model: GROQ_MODEL,
        messages,
        response_format: { type: "json_object" },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    const text = response.data?.choices?.[0]?.message?.content?.trim();

    if (!text) throw new Error("Empty or invalid response from Groq");

    return extractJsonFromText(text);
  } catch (error) {
    throw buildGroqError(error);
  }
}

// ─── Prompt builder ──────────────────────────────────────────────────────────

function buildUserContext(user) {
  if (!user) return "";
  const diet = user.diet ? `Diet: ${user.diet}. ` : "";
  const allergies = user.allergies?.length
    ? `Allergies: ${user.allergies.join(", ")}. `
    : "";
  if (!diet && !allergies) return "";
  return `\nConsider the user's dietary preferences: ${diet}${allergies} Tailor the recommendation, safeIngredients, avoidIngredients, and alternatives accordingly.`;
}

function buildFoodPrompt(imageUrl, user) {
  const userContext = buildUserContext(user);

  return `Analyze this food product image. Return a JSON object with exactly this structure:
{
  "product": {
    "name": "product name",
    "subtitle": "brand or description",
    "image": "${imageUrl}"
  },
  "analysis": {
    "grade": "A",
    "recommendation": "SAFE",
    "description": "Write a detailed 8-10 line paragraph about this food product. Cover what the product is, its main purpose, key ingredients and what they do, nutritional highlights, who it is suitable for, any health benefits or concerns, how it fits into a balanced diet, and an overall honest summary for the consumer to make an informed decision.",
    "score": 85,
    "rating": "Excellent",
    "nutrition": {
      "calories": "200 kcal",
      "protein": "10 g",
      "sugar": "5 g"
    },
    "ingredients": ["ingredient1", "ingredient2"],
    "safeIngredients": ["ingredient1"],
    "avoidIngredients": [
      { "name": "ingredient2", "reason": "reason here" }
    ],
    "alternatives": [
      { "name": "alternative1", "desc": "description" }
    ]
  }
}
Only output valid JSON, nothing else.${userContext}`;
}

// ─── Exports ─────────────────────────────────────────────────────────────────

exports.analyzeImage = async (imageUrl, user = null) => {
  const messages = [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: buildFoodPrompt(imageUrl, user),
        },
        {
          type: "image_url",
          image_url: { url: imageUrl }, // Cloudinary URL sent directly — no base64 conversion needed
        },
      ],
    },
  ];

  return callGroqAPI(messages);
};

exports.analyzeBarcode = async (barcode, user = null) => {
  const userContext = buildUserContext(user);

  const prompt =
    `Analyze this food product barcode: ${barcode}. ` +
    `Return a JSON object with: product {name, subtitle, image}, ` +
    `analysis {grade, recommendation, score, rating, description, nutrition, ingredients, safeIngredients, avoidIngredients, alternatives}. ` +
    `Only output valid JSON.${userContext}`;

  const messages = [
    {
      role: "user",
      content: prompt,
    },
  ];

  return callGroqAPI(messages);
};
