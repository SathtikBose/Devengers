import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // 🔹 Actions
  login: (user: User, token: string) => void;
  logout: () => void;
};

/**
 * 🔐 Persistent Auth Store
 * - Stores token + user in AsyncStorage
 * - Restores session on app restart
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      /**
       * Login Action
       * Saves user + token and marks authenticated
       */
      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      /**
       * Logout Action
       * Clears persisted session
       */
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage", // key in AsyncStorage

      /**
       * Storage engine
       */
      storage: createJSONStorage(() => AsyncStorage),

      /**
       * Persist only required fields
       */
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
