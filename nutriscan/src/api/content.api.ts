import { apiClient } from "./client";
import { ENV } from "../config/env";

export type DailyQuoteResponse = {
  text: string;
  author: string;
  date: string;
};

const mockDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchDailyQuoteApi(): Promise<DailyQuoteResponse> {
  if (ENV.USE_MOCK) {
    await mockDelay(200);
    return {
      text: "Small steps toward better eating add up to a healthier you.",
      author: "NutriScan",
      date: new Date().toISOString().slice(0, 10),
    };
  }

  const { data } = await apiClient.get<DailyQuoteResponse>("/content/daily-quote");
  return data;
}
