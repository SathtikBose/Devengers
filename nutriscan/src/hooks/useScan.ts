import { useState } from "react";
import { scanProductApi } from "../api/scan.api";
import { useScanStore } from "../store/useScanStore";

/**
 * 📦 Scan Hook
 * - Handles scan logic
 * - Stores result + history via Zustand
 */
export const useScan = () => {
  const [loading, setLoading] = useState(false);

  const setScanResult = useScanStore((state) => state.setScanResult);

  /**
   * 🔹 Scan Product
   * - Calls API (mock or real)
   * - Saves to global store (product + history)
   */
  const scan = async (barcode: string) => {
    try {
      setLoading(true);

      const data = await scanProductApi(barcode);

      // 🔹 This automatically updates:
      // product + analysis + history (from store logic)
      setScanResult(data);

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        message: error?.response?.data?.message || "Scan failed",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    scan,
    loading,
  };
};
