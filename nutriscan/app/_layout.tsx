import { Stack } from "expo-router";
import { View } from "react-native";
import { ToastHost } from "../src/components/ToastHost";
import "@/global.css";

/**
 * ✅ Root Layout (Correct)
 * Expo Router auto-detects routes from folders
 */
export default function RootLayout() {
  return (
    <View className="flex-1">
      <Stack screenOptions={{ headerShown: false }} />
      <ToastHost />
    </View>
  );
}
