import { apiClient } from "./client";
import { ENV } from "../config/env";
import { mockLogin } from "./mock";

/**
 * 🔐 Auth API Layer
 * Supports mock + real API
 */

/**
 * 🔹 Login API
 */
export const loginApi = async (data: { email: string; password: string }) => {
  if (ENV.USE_MOCK) {
    return await mockLogin();
  }

  const response = await apiClient.post("/auth/login", data);
  return response.data;
};

/**
 * 🔹 Signup API
 */
export const signupApi = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  if (ENV.USE_MOCK) {
    // Simulate signup + auto login
    return {
      user: {
        id: "1",
        name: data.name,
        email: data.email,
      },
      token: "mock-token-123",
    };
  }

  const response = await apiClient.post("/auth/signup", data);
  return response.data;
};

/**
 * 📸 Upload Profile Image
 */
export const updateProfileApi = async (formData: FormData) => {
  const response = await apiClient.put("/user/update-profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
