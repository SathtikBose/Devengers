import { Stack } from "expo-router";
import { View } from "react-native";
import { ToastHost } from "../src/components/ToastHost";
import { ErrorBoundary } from "../src/components/ErrorBoundary";
import { GlobalLoader } from "../src/components/GlobalLoader";
import "@/global.css";

/**
 * ✅ Root Layout (Correct)
 * Expo Router auto-detects routes from folders
 */
export default function RootLayout() {
  return (
    <ErrorBoundary>
      <View className="flex-1">
        <Stack screenOptions={{ headerShown: false }} />
        <ToastHost />
        <GlobalLoader />
      </View>
    </ErrorBoundary>
  );
}
