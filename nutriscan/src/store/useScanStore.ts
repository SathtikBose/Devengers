import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ScanItem = {
  id: string;
  name: string;
  brand: string;
  status: string;
  image: string;
  time: string;
};

type ScanState = {
  product: any;
  analysis: any;
  history: ScanItem[];

  setScanResult: (data: any) => void;
  addToHistory: (item: ScanItem) => void;
  clearHistory: () => void;
};

/**
 * 📦 Persistent Scan Store
 */
export const useScanStore = create<ScanState>()(
  persist(
    (set, get) => ({
      product: null,
      analysis: null,
      history: [],

      /**
       * 🔹 Save scan result + auto add to history
       */
      setScanResult: (data) => {
        console.log("💾 Setting scan result in store:", {
          productName: data.product?.name,
          analysisGrade: data.analysis?.grade,
          hasNutrition: !!data.analysis?.nutrition,
        });

        const newItem: ScanItem = {
          id: Date.now().toString(),
          name: data.product.name,
          brand: data.product.subtitle,
          status: data.analysis.recommendation,
          image: data.product.image,
          time: "Just now",
        };

        set({
          product: data.product,
          analysis: data.analysis,
          history: [newItem, ...get().history],
        });

        console.log("✅ Scan stored successfully");
      },

      /**
       * 🔹 Add manually (optional)
       */
      addToHistory: (item) =>
        set((state) => ({
          history: [item, ...state.history],
        })),

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "scan-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
