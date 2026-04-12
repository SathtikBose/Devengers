/**
 * 🧪 Debug Helper for Login Testing
 * Test mock mode and API endpoints
 */

import { ENV } from "../config/env";
import { mockLogin } from "./mock";
import { loginApi } from "./auth.api";

/**
 * 🔍 Test Mock Login
 */
export const testMockLogin = async () => {
  // console.log("🧪 Testing Mock Login...");
  // console.log("ENV.USE_MOCK:", ENV.USE_MOCK);

  try {
    const result = await mockLogin();
    // console.log("✅ Mock login result:", result);
    return result;
  } catch (error) {
    // console.error("❌ Mock login error:", error);
    throw error;
  }
};

/**
 * 🔍 Test Login API
 */
export const testLoginApi = async () => {
  // console.log("🧪 Testing Login API...");

  try {
    const result = await loginApi({
      email: "test@example.com",
      password: "password123",
    });
    // console.log("✅ Login API result:", result);
    return result;
  } catch (error) {
    // console.error("❌ Login API error:", error);
    throw error;
  }
};

/**
 * 🔍 Full Environment Check
 */
export const debugEnvironment = () => {
  // console.log("\n📊 === ENVIRONMENT DEBUG ===");
  // console.log("USE_MOCK:", ENV.USE_MOCK);
  // console.log("BASE_URL:", ENV.BASE_URL);
  // console.log("API_URL env var:", process.env.EXPO_PUBLIC_API_URL);
  // console.log("USE_MOCK env var:", process.env.EXPO_PUBLIC_USE_MOCK);
  // console.log("📊 === END DEBUG ===\n");
};
