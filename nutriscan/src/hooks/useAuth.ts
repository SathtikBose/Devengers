import { useState } from "react";
import { loginApi, signupApi } from "../api/auth.api";
import { useAuthStore } from "../store/useAuthStore";
import { ENV } from "../config/env";
import { apiClient } from "../api/client";

/**
 * 🔐 Auth Hook
 * Handles all authentication-related logic
 * Keeps UI clean (no direct API calls in screens)
 */
export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);

  /**
   * 🔹 Handle Login
   * - Calls API (mock or real)
   * - Stores user + token in Zustand
   */
  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);

      const data = await loginApi({ email, password });

      // Expected: { user, token }
      login(data.user, data.token);

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        message: error?.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🔹 Handle Signup
   * - Creates user
   * - Auto-login after success
   */
  const handleSignup = async (
    name: string,
    email: string,
    password: string,
  ) => {
    try {
      setLoading(true);

      const data = await signupApi({ name, email, password });

      // Auto-login
      login(data.user, data.token);

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        message: error?.response?.data?.message || "Signup failed",
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🔹 Change Password
   * - Uses mock in development
   * - Uses API in production
   */
  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    try {
      setLoading(true);

      // 🔸 MOCK MODE
      if (ENV.USE_MOCK) {
        await new Promise((res) => setTimeout(res, 800));

        // Optional: simulate failure
        if (currentPassword !== "123456") {
          return {
            success: false,
            message: "Current password is incorrect",
          };
        }

        return { success: true };
      }

      // 🔸 REAL API
      await apiClient.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        message: error?.response?.data?.message || "Failed to update password",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    handleLogin,
    handleSignup,
    changePassword,
    loading,
  };
};
