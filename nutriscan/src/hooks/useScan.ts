import { useState } from "react";
import { scanImageApi, scanProductApi } from "../api/scan.api";
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
      console.error("❌ Scan error:", {
        message: error?.message,
        code: error?.code,
        status: error?.response?.status,
        response: error?.response?.data,
      });
      return {
        success: false,
        message:
          error?.response?.data?.message || "Scan failed: " + error?.message,
      };
    } finally {
      setLoading(false);
    }
  };

  const scanFromBarcode = async (barcode: string) => {
    try {
      setLoading(true);

      const data = await scanProductApi(barcode);

      if (!data || !data.analysis) {
        return {
          success: false,
          message: "Invalid barcode scan response",
        };
      }

      setScanResult({
        product: data.product || {
          name: barcode,
          subtitle: "Barcode scan",
          image: "",
        },
        analysis: data.analysis,
      });

      return { success: true };
    } catch (error: any) {
      console.error("❌ Barcode scan error:", {
        message: error?.message,
        code: error?.code,
        status: error?.response?.status,
        response: error?.response?.data,
      });
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          "Barcode scan failed: " + error?.message,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    scanFromImage,
    scanFromBarcode,
    loading,
  };
};
