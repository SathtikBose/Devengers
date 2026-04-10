import { Stack } from "expo-router";
import "@/global.css";

/**
 * ✅ Root Layout (Correct)
 * Expo Router auto-detects routes from folders
 */
export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
