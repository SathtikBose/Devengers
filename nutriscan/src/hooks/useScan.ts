import { useState } from "react";
import { scanImageApi, scanProductApi } from "../api/scan.api";
import { useScanStore } from "../store/useScanStore";

export const useScan = () => {
  const [loading, setLoading] = useState(false);

  const setScanResult = useScanStore((state) => state.setScanResult);

  const scanFromImage = async (base64: string) => {
    try {
      setLoading(true);

      const data = await scanImageApi(base64);

      if (!data?.analysis) {
        return {
          success: false,
          message: "Invalid scan response",
        };
      }

      setScanResult({
        product: data.product || {},
        analysis: data.analysis,
      });

      return { success: true };
    } catch (error: any) {
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

      if (!data?.analysis) {
        return {
          success: false,
          message: "Invalid barcode scan response",
        };
      }

      setScanResult({
        product:
          data.product ||
          ({
            name: barcode,
            subtitle: "Barcode scan",
            image: "",
          } as any),
        analysis: data.analysis,
      });

      return { success: true };
    } catch (error: any) {
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
