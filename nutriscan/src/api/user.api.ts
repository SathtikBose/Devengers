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

/** Normalized user shape for the client store (matches auth + profile API). */
export type ClientUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  age?: number | null;
  allergies?: string[];
  diet?: string | null;
  createdAt?: string | null;
  healthProfile?: HealthProfile;
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

export function mapApiUserToClient(raw: Record<string, unknown>): ClientUser {
  const u = raw as {
    _id?: string;
    id?: string;
    name?: string;
    email?: string;
    avatar?: string | null;
    age?: number | null;
    allergies?: string[];
    diet?: string | null;
    createdAt?: string | null;
    healthProfile?: HealthProfile;
  };
  return {
    id: String(u._id ?? u.id ?? ""),
    name: u.name ?? "",
    email: u.email ?? "",
    avatar: u.avatar ?? undefined,
    age: u.age != null && !Number.isNaN(Number(u.age)) ? Number(u.age) : undefined,
    allergies: Array.isArray(u.allergies) ? u.allergies : [],
    diet: u.diet ?? undefined,
    createdAt: u.createdAt ? String(u.createdAt) : undefined,
    healthProfile: u.healthProfile,
  };
}

export async function fetchProfileApi(): Promise<ClientUser> {
  if (ENV.USE_MOCK) {
    await mockDelay(250);
    return {
      id: "1",
      name: "Elena Rodriguez",
      email: "elena.rodriguez@healthmail.com",
      avatar: undefined,
      age: 28,
      allergies: [],
      diet: null,
      createdAt: new Date().toISOString(),
    };
  }
  const { data } = await apiClient.get<Record<string, unknown>>("/user/profile");
  return mapApiUserToClient(data);
}

export async function patchProfileApi(payload: {
  name?: string;
  diet?: string | null;
  age?: number | null;
  allergies?: string[];
}): Promise<ClientUser> {
  if (ENV.USE_MOCK) {
    await mockDelay(200);
    return {
      id: "1",
      name: payload.name ?? "Elena Rodriguez",
      email: "elena.rodriguez@healthmail.com",
      allergies: payload.allergies ?? [],
      diet: payload.diet ?? null,
      age: payload.age === undefined ? 28 : payload.age,
      createdAt: new Date().toISOString(),
    };
  }
  const { data } = await apiClient.patch<Record<string, unknown>>(
    "/user/profile",
    payload,
  );
  return mapApiUserToClient(data);
}

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
