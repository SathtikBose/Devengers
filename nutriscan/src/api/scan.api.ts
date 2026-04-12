import { apiClient } from "./client";
import { ENV } from "../config/env";
import { mockScan } from "./mock";

export type ScanDocument = {
  _id: string;
  type: string;
  barcode?: string;
  image?: string;
  result: {
    product?: any;
    analysis?: any;
  };
  createdAt: string;
};

const mockDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const scanProductApi = async (barcode: string) => {
  if (ENV.USE_MOCK) {
    const data = await mockScan(barcode);
    return {
      ...data,
      scan: data.scan ?? { _id: `mock-${Date.now()}` },
    };
  }

  const response = await apiClient.post(
    "/scan/barcode",
    { barcode },
    { timeout: 30000 },
  );
  return response.data;
};

export const scanImageApi = async (base64: string) => {
  if (ENV.USE_MOCK) {
    const data = await mockScan("image-scan");
    return {
      ...data,
      scan: data.scan ?? { _id: `mock-${Date.now()}` },
    };
  }

  const cleanBase64 = base64.includes(",") ? base64.split(",")[1] : base64;

  const response = await apiClient.post(
    "/scan/image",
    { image: cleanBase64 },
    { timeout: 60000 },
  );
  return response.data;
};

export async function fetchScanHistoryApi(): Promise<ScanDocument[]> {
  if (ENV.USE_MOCK) {
    await mockDelay(300);
    return [];
  }
  const { data } = await apiClient.get<ScanDocument[]>("/scan/history");
  return Array.isArray(data) ? data : [];
}

export async function fetchLatestScanApi(): Promise<ScanDocument | null> {
  if (ENV.USE_MOCK) {
    await mockDelay(200);
    return null;
  }
  try {
    const { data } = await apiClient.get<ScanDocument>("/scan/history/latest");
    return data;
  } catch (e: any) {
    if (e?.response?.status === 404) return null;
    throw e;
  }
}

export async function fetchScanByIdApi(
  id: string,
): Promise<ScanDocument | null> {
  if (ENV.USE_MOCK) {
    await mockDelay(200);
    return null;
  }
  try {
    const { data } = await apiClient.get<ScanDocument>(`/scan/history/${id}`);
    return data;
  } catch (e: any) {
    if (e?.response?.status === 404) return null;
    throw e;
  }
}
