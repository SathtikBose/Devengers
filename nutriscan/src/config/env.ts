/**
 * 🌐 Environment Config
 * Controls API vs Mock behavior
 */
export const ENV = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api",

  // 🔹 Toggle data source (set via ENV variable)
  USE_MOCK: process.env.EXPO_PUBLIC_USE_MOCK === "true", // ✅ controlled via .env
};

// 🔍 Debug log on app start
console.log("🌐 ENV CONFIG:", {
  API_URL: ENV.BASE_URL,
  USE_MOCK: ENV.USE_MOCK,
  MOCK_ENV_RAW: process.env.EXPO_PUBLIC_USE_MOCK,
});
