import { useState } from "react";
import {
  loginApi,
  signupApi,
  updateProfileApi,
  changePasswordApi,
  requestPasswordResetCodeApi,
  verifyPasswordResetCodeApi,
  resetPasswordWithCodeApi,
} from "../api/auth.api";
import { useAuthStore } from "../store/useAuthStore";
import { ENV } from "../config/env";
import { mapApiUserToClient } from "../api/user.api";

/**
 * 🔐 Auth Hook
 */
export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const { login, updateUser } = useAuthStore();

  /**
   * 🔹 Login
   */
  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);

      const data = await loginApi({ email, password });

      if (!data || !data.user || !data.token) {
        console.error("❌ Login API returned invalid data:", data);
        return {
          success: false,
          message: "Invalid login response from server",
        };
      }

      login(mapApiUserToClient(data.user as Record<string, unknown>), data.token);

      return { success: true };
    } catch (error: any) {
      console.error("❌ Login error:", error);
      return {
        success: false,
        message:
          error?.response?.data?.message || error?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🔹 Signup
   */
  const handleSignup = async (
    name: string,
    email: string,
    password: string,
  ) => {
    try {
      setLoading(true);

      const data = await signupApi({ name, email, password });

      if (!data || !data.user || !data.token) {
        console.error("❌ Signup API returned invalid data:", data);
        return {
          success: false,
          message: "Invalid signup response from server",
        };
      }

      login(mapApiUserToClient(data.user as Record<string, unknown>), data.token);

      return { success: true };
    } catch (error: any) {
      console.error("❌ Signup error:", error);
      return {
        success: false,
        message:
          error?.response?.data?.message || error?.message || "Signup failed",
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🔹 Upload Avatar (IMPORTANT)
   */
  const uploadAvatar = async (imageUri: string) => {
    try {
      setLoading(true);

      // 🔸 MOCK MODE
      if (ENV.USE_MOCK) {
        await new Promise((res) => setTimeout(res, 800));

        // just update local store
        updateUser({ avatar: imageUri });

        return { success: true };
      }

      // 🔸 REAL API
      const formData = new FormData();

      formData.append("avatar", {
        uri: imageUri,
        name: "avatar.jpg",
        type: "image/jpeg",
      } as any);

      const data = await updateProfileApi(formData);

      updateUser(mapApiUserToClient(data as Record<string, unknown>));

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        message: "Upload failed",
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🔹 Change Password
   */
  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    try {
      setLoading(true);

      await changePasswordApi({ currentPassword, newPassword });

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

  /**
   * 🔹 Request Password Reset
   */
  const requestPasswordReset = async (email: string) => {
    try {
      setLoading(true);

      await requestPasswordResetCodeApi(email);

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        message:
          error?.response?.data?.message || "Failed to send verification code",
      };
    } finally {
      setLoading(false);
    }
  };

  const verifyPasswordResetCode = async (email: string, code: string) => {
    try {
      setLoading(true);

      await verifyPasswordResetCodeApi({ email, code });

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        message:
          error?.response?.data?.message || "Failed to verify code",
      };
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordWithCode = async (
    email: string,
    code: string,
    password: string,
    confirmPassword: string,
  ) => {
    try {
      setLoading(true);

      await resetPasswordWithCodeApi({
        email,
        code,
        password,
        confirmPassword,
      });

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        message:
          error?.response?.data?.message || "Failed to reset password",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    handleLogin,
    handleSignup,
    uploadAvatar,
    changePassword,
    requestPasswordReset,
    verifyPasswordResetCode,
    resetPasswordWithCode,
    loading,
  };
};
