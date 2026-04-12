const axios = require("axios");

function getApiKey() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;

  if (!apiKey) {
    const error = new Error(
      "Missing Gemini API key. Set GEMINI_API_KEY or AI_API_KEY in backend/.env.",
    );
    error.status = 500;
    throw error;
  }

  return apiKey;
}

function getGeminiModel() {
  return process.env.GEMINI_MODEL || "gemini-2.5-flash";
}

function getGeminiUrl() {
  return (
    process.env.GEMINI_API_URL ||
    process.env.GEMINI_VISION_URL ||
    `https://generativelanguage.googleapis.com/v1beta/models/${getGeminiModel()}:generateContent`
  );
}

function extractJsonFromText(text) {
  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  const cleanedText = text.replace(/```json|```/gi, "").trim();

  try {
    return JSON.parse(cleanedText);
  } catch (parseError) {
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("No JSON found in Gemini response");
    }

    return JSON.parse(jsonMatch[0]);
  }
}

function buildGeminiError(error) {
  const apiMessage =
    error.response?.data?.error?.message ||
    error.message ||
    "AI analysis failed";
  const statusCode = error.response?.status;
  const wrappedError = new Error(apiMessage);

  wrappedError.status = statusCode ? 502 : 500;

  if (statusCode === 403 && /reported as leaked/i.test(apiMessage)) {
    wrappedError.message =
      "Gemini rejected the configured API key because it was reported as leaked. Create a new key in Google AI Studio and update backend/.env.";
  }

  if (statusCode === 404) {
    wrappedError.message =
      `Gemini model "${getGeminiModel()}" is unavailable for generateContent. ` +
      "Use a supported model such as gemini-2.5-flash.";
  }

  return wrappedError;
}

async function callGeminiAPI(apiKey, contents) {
  try {
    const response = await axios.post(
      getGeminiUrl(),
      {
        contents,
        generationConfig: {
          responseMimeType: "application/json",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
      },
    );

    const text = response.data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join("\n")
      .trim();

    if (!text) {
      throw new Error("Empty or invalid response structure from Gemini");
    }

    return extractJsonFromText(text);
  } catch (error) {
    throw buildGeminiError(error);
  }
}

exports.analyzeImage = async (imageUrl, user = null) => {
  const apiKey = getApiKey();
  const imageResp = await axios.get(imageUrl, {
    responseType: "arraybuffer",
  });
  const base64Image = Buffer.from(imageResp.data).toString("base64");
  const contentType = imageResp.headers["content-type"] || "image/jpeg";

  const prompt = `Analyze this food product image. Return a JSON object with exactly this structure:
{
  "product": {
    "name": "product name",
    "subtitle": "brand or description",
    "image": "${imageUrl}"
  },
  "analysis": {
    "grade": "A",
    "recommendation": "SAFE",
    "description": "brief description",
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
Only output valid JSON, nothing else.`;

  let userContext = "";
  if (user) {
    const diet = user.diet ? `Diet: ${user.diet}. ` : "";
    const allergies = user.allergies?.length
      ? `Allergies: ${user.allergies.join(", ")}. `
      : "";
    if (diet || allergies) {
      userContext = `\nPlease consider the user's specific dietary preferences: ${diet}${allergies} Tailor the recommendation, safeIngredients, avoidIngredients, and alternatives taking these preferences into account.`;
    }
  }

  const contents = [
    {
      role: "user",
      parts: [
        { text: prompt + userContext },
        {
          inlineData: {
            mimeType: contentType,
            data: base64Image,
          },
        },
      ],
    },
  ];

  return callGeminiAPI(apiKey, contents);
};

exports.analyzeBarcode = async (barcode, user = null) => {
  const apiKey = getApiKey();
  let prompt =
    `Analyze this food product barcode: ${barcode}. ` +
    `Return a JSON object with: product {name, subtitle, image}, ` +
    `analysis {grade, recommendation, score, rating, ingredients, safeIngredients, avoidIngredients, alternatives}. ` +
    `Only output valid JSON.`;

  if (user) {
    const diet = user.diet ? `Diet: ${user.diet}. ` : "";
    const allergies = user.allergies?.length
      ? `Allergies: ${user.allergies.join(", ")}. `
      : "";
    if (diet || allergies) {
      prompt += `\nPlease consider the user's specific dietary preferences: ${diet}${allergies} Tailor the recommendation, safeIngredients, avoidIngredients, and alternatives taking these preferences into account.`;
    }
  }

  const contents = [
    {
      role: "user",
      parts: [{ text: prompt }],
    },
  ];

  return callGeminiAPI(apiKey, contents);
};
