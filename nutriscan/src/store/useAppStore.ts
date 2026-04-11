import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * 🌐 App State Type
 */
type AppState = {
  isDarkMode: boolean;
  isLoading: boolean;

  // 🔹 Actions
  toggleDarkMode: () => void;
  setLoading: (value: boolean) => void;
  resetAppState: () => void;
};

/**
 * 🌐 Global App Store (Persistent)
 */
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      isLoading: false,

      /**
       * 🌙 Toggle Dark Mode
       */
      toggleDarkMode: () =>
        set((state) => ({
          isDarkMode: !state.isDarkMode,
        })),

      /**
       * ⏳ Global Loading State
       */
      setLoading: (value) =>
        set({
          isLoading: value,
        }),

      /**
       * 🔄 Reset App State (useful for logout or debug)
       */
      resetAppState: () =>
        set({
          isDarkMode: false,
          isLoading: false,
        }),
    }),
    {
      name: "app-storage",

      storage: createJSONStorage(() => AsyncStorage),

      /**
       * 🔹 Persist only necessary fields
       */
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
      }),
    },
  ),
);
