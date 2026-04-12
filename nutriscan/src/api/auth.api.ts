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
  console.log("📝 Login attempt:", { email: data.email, mock: ENV.USE_MOCK });

  try {
    if (ENV.USE_MOCK) {
      const mockData = await mockLogin();
      console.log("✅ Mock login successful:", mockData);
      return mockData;
    }

    const response = await apiClient.post("/auth/login", data);
    console.log("✅ Real API login successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Login API error:", error);
    throw error;
  }
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
        avatar: null,
        age: null,
        allergies: [],
        diet: null,
        createdAt: new Date().toISOString(),
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

/**
 * 🔑 Password Reset (Send Link)
 */
export const requestPasswordResetCodeApi = async (email: string) => {
  const response = await apiClient.post("/auth/forgot-password/send-code", {
    email,
  });
  return response.data;
};

export const verifyPasswordResetCodeApi = async (data: {
  email: string;
  code: string;
}) => {
  const response = await apiClient.post(
    "/auth/forgot-password/verify-code",
    data,
  );
  return response.data;
};

export const resetPasswordWithCodeApi = async (data: {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}) => {
  const response = await apiClient.post("/auth/forgot-password/reset", data);
  return response.data;
};

/**
 * 🔑 Change Password
 */
export const changePasswordApi = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await apiClient.post("/auth/change-password", data);
  return response.data;
};
