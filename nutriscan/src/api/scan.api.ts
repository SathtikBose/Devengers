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
