/**
 * 🌐 Environment Config
 * Controls API vs Mock behavior
 */
export const ENV = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL,

  // 🔹 Toggle data source (set via ENV variable)
  USE_MOCK: process.env.EXPO_PUBLIC_USE_MOCK === "true", // ✅ Only use mock if explicitly set to "true"
};
