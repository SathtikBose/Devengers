import { Stack } from "expo-router";

/**
 * Root Layout
 * Defines the top-level navigation stack
 * We keep it minimal because routing logic is handled in index.tsx
 */
export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Auth group */}
      <Stack.Screen name="(auth)" />

      {/* Main app (tabs) */}
      <Stack.Screen name="(tabs)" />

      {/* Settings (optional stack screen) */}
      <Stack.Screen name="settings" />
    </Stack>
  );
}
