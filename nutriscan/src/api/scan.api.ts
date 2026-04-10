import { apiClient } from "./client";
import { ENV } from "../config/env";
import { mockScan } from "./mock";

/**
 * 📦 Scan API (Mock + Real switch)
 */
export const scanProductApi = async (barcode: string) => {
  if (ENV.USE_MOCK) {
    return await mockScan(barcode);
  }

  const response = await apiClient.post("/scan", { barcode });
  return response.data;
};

/**
 * 📷 Send Image (Base64) to Backend
 */
export const scanImageApi = async (base64: string) => {
  console.log("📷 Scan Image API called - Mock mode:", ENV.USE_MOCK);

  try {
    if (ENV.USE_MOCK) {
      console.log("✅ Using mock scan data");
      return await mockScan("image-scan");
    }

    const response = await apiClient.post("/scan/image", {
      image: base64,
    });

    console.log("✅ Real API scan response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Scan API error:", error);
    throw error;
  }
};
