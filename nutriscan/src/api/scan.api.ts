import { apiClient } from "./client";

/**
 * 📦 Scan API
 */

export const scanProductApi = async (barcode: string) => {
  const response = await apiClient.post("/scan", {
    barcode,
  });

  return response.data;
};
