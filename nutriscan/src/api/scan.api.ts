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

  const response = await apiClient.post(
    "/scan/barcode",
    { barcode },
    { timeout: 30000 },
  );
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

    // ✅ Make sure base64 is clean (no data URI prefix)
    const cleanBase64 = base64.includes(",") ? base64.split(",")[1] : base64;

    console.log("📤 Sending base64 length:", cleanBase64.length);

    const response = await apiClient.post(
      "/scan/image",
      {
        image: cleanBase64,
      },
      {
        timeout: 60000,
      },
    );

    console.log("✅ Real API scan response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Scan API error:", {
      message: error?.message,
      code: error?.code,
      status: error?.response?.status,
      response: error?.response?.data,
    });
    throw error;
  }
};
