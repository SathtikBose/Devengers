import { useState } from "react";
import { scanImageApi } from "../api/scan.api";
import { useScanStore } from "../store/useScanStore";

/**
 * 📷 Scan Hook (Image-based)
 */
export const useScan = () => {
  const [loading, setLoading] = useState(false);

  const setScanResult = useScanStore((state) => state.setScanResult);

  /**
   * 🔹 Scan from Image Base64
   */
  const scanFromImage = async (base64: string) => {
    try {
      setLoading(true);

      console.log("🔍 Scanning image...");
      const data = await scanImageApi(base64);

      console.log("📦 Scan result received:", data);

      if (!data || !data.product || !data.analysis) {
        console.error("❌ Invalid scan data:", data);
        return {
          success: false,
          message: "Invalid scan response",
        };
      }

      setScanResult(data);
      console.log("✅ Scan stored in store");

      return { success: true };
    } catch (error: any) {
      console.error("❌ Scan error:", error);
      return {
        success: false,
        message: "Scan failed: " + error?.message,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    scanFromImage,
    loading,
  };
};
