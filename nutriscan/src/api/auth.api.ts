import { apiClient } from "./client";

/**
 * 🔐 Auth API
 */

export const loginApi = async (data: { email: string; password: string }) => {
  const response = await apiClient.post("/auth/login", data);
  return response.data;
};

export const signupApi = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await apiClient.post("/auth/signup", data);
  return response.data;
};
