import { apiClient } from "./client";
import { ENV } from "../config/env";

export type HealthProfile = {
  score: number;
  status: string;
  insight: string;
  averageProductScore?: number;
  healthyScanCount?: number;
  harmfulScanCount?: number;
  totalScans?: number;
  trend?: number;
  lastUpdated?: string;
};

export type RecentScanItem = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  score: number;
  status: string;
  createdAt: string;
};

export type HealthDashboardResponse = {
  healthProfile: HealthProfile;
  recentScans: RecentScanItem[];
};

const mockDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Refreshes health score from the user’s scan history and returns dashboard payload.
 */
export async function fetchHealthDashboardApi(): Promise<HealthDashboardResponse> {
  if (ENV.USE_MOCK) {
    await mockDelay(400);
    return {
      healthProfile: {
        score: 82,
        status: "OPTIMAL",
        insight:
          "Mock mode: use the real backend to compute your score from actual scans.",
        averageProductScore: 82,
        healthyScanCount: 0,
        harmfulScanCount: 0,
        totalScans: 0,
        trend: 0,
      },
      recentScans: [],
    };
  }

  const { data } = await apiClient.get<HealthDashboardResponse>("/user/dashboard");
  return data;
}
