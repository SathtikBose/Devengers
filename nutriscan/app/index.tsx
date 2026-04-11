import { Redirect } from "expo-router";
import { useAuthStore } from "../src/store/useAuthStore";

/**
 * Entry نقطة of the app
 * Decides whether user goes to:
 * - Auth flow
 * - Main app (tabs)
 */
export default function Index() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // 🔹 If logged in → go to dashboard
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  // 🔹 If not logged in → go to login
  return <Redirect href="/(auth)/login" />;
}
