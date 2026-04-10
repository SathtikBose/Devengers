import { useState } from "react";
import { loginApi, signupApi } from "../api/auth.api";
import { useAuthStore } from "../store/useAuthStore";

/**
 * 🔐 Auth Hook
 * Handles authentication logic (UI should NOT call API directly)
 */
export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);

  /**
   * 🔹 Handle Login
   * Calls API → stores user + token
   */
  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);

      const data = await loginApi({ email, password });

      // Expected response: { user, token }
      login(data.user, data.token);

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🔹 Handle Signup
   */
  const handleSignup = async (
    name: string,
    email: string,
    password: string,
  ) => {
    try {
      setLoading(true);

      const data = await signupApi({ name, email, password });

      // Auto login after signup (optional but standard UX)
      login(data.user, data.token);

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Signup failed",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    handleLogin,
    handleSignup,
    loading,
  };
};
