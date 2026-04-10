import { useState } from "react";
import { loginApi, signupApi, updateProfileApi } from "../api/auth.api";
import { useAuthStore } from "../store/useAuthStore";
import { ENV } from "../config/env";

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

      // update store with backend response
      updateUser(data.user);

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

      if (ENV.USE_MOCK) {
        await new Promise((res) => setTimeout(res, 800));

        if (currentPassword !== "123456") {
          return {
            success: false,
            message: "Incorrect current password",
          };
        }

        return { success: true };
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        message: "Failed to update password",
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
    loading,
  };
};
