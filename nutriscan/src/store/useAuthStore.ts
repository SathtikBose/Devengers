import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * 👤 User Type
 */
type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  allergies?: string[];
  diet?: string;
};

/**
 * 🔐 Auth Store Type
 */
type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // 🔹 Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
};

/**
 * 🔐 Persistent Auth Store
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      /**
       * 🔹 Login
       * Stores user + token
       */
      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      /**
       * 🔹 Logout
       * Clears all auth data
       */
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      /**
       * 🔹 Update User Profile
       * Updates partial user fields (name, avatar, allergies, etc.)
       */
      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    {
      name: "auth-storage",

      storage: createJSONStorage(() => AsyncStorage),

      /**
       * 🔹 Persist only required fields
       */
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
