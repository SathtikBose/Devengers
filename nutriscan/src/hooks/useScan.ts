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

      const data = await scanImageApi(base64);

      setScanResult(data);

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        message: "Scan failed",
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
