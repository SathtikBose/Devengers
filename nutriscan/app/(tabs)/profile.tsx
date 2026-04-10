import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../src/store/useAuthStore";

/**
 * 👤 Profile Screen
 * - Displays user info
 * - Handles logout
 */
export default function ProfileScreen() {
  const router = useRouter();

  const { user, logout } = useAuthStore();

  /**
   * 🔹 Logout Handler
   * Clears auth state and redirects
   */
  const handleLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#EEF3EC]">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🔹 Header */}
        <View className="flex-row justify-between items-center px-5 py-4">
          <Text className="text-xl font-bold text-green-700">NutriScan</Text>

          <Ionicons name="notifications-outline" size={20} color="#166534" />
        </View>

        {/* 🔹 Profile Card */}
        <View className="mx-5 bg-white rounded-3xl p-6 items-center">
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            }}
            className="w-24 h-24 rounded-full"
          />

          <Text className="text-xl font-bold mt-4 text-gray-800">
            {user?.name || "Guest User"}
          </Text>

          <View className="bg-green-100 px-3 py-1 rounded-full mt-2">
            <Text className="text-green-700 text-xs font-semibold">
              PREMIUM MEMBER
            </Text>
          </View>

          <Text className="text-gray-500 mt-2">
            {user?.email || "email@example.com"}
          </Text>

          {/* Meta Info */}
          <View className="flex-row gap-6 mt-4">
            <View className="flex-row items-center gap-1">
              <Feather name="calendar" size={14} color="#6B7280" />
              <Text className="text-gray-500 text-xs">Joined Jan 2024</Text>
            </View>

            <View className="flex-row items-center gap-1">
              <Ionicons name="location-outline" size={14} color="#6B7280" />
              <Text className="text-gray-500 text-xs">India</Text>
            </View>
          </View>
        </View>

        {/* 🔹 Preferences */}
        <Text className="px-5 mt-6 font-semibold text-gray-800">
          Health Profile & Preferences
        </Text>

        <View className="mx-5 mt-3 bg-white rounded-3xl p-5">
          {/* Allergies */}
          <Text className="text-gray-500 text-sm mb-2">ACTIVE ALLERGIES</Text>

          <View className="flex-row flex-wrap gap-2">
            {["Peanuts", "Shellfish", "Lactose"].map((item) => (
              <View key={item} className="bg-gray-100 px-3 py-1 rounded-full">
                <Text className="text-xs text-gray-700">{item}</Text>
              </View>
            ))}
          </View>

          {/* Diet */}
          <Text className="text-gray-500 text-sm mt-5 mb-2">
            DIETARY PATTERN
          </Text>

          <View className="bg-green-100 p-4 rounded-2xl">
            <Text className="font-semibold text-green-800">
              Plant-Based Flexitarian
            </Text>
            <Text className="text-gray-600 text-sm">
              Optimized for high protein
            </Text>
          </View>
        </View>

        {/* 🔹 Manage Account */}
        <Text className="px-5 mt-6 font-semibold text-gray-800">
          Manage Account
        </Text>

        <View className="mx-5 mt-3 bg-white rounded-3xl p-3">
          <MenuItem
            icon="time-outline"
            label="Scan history"
            sub="Review your scans"
            onPress={() => router.push("/(tabs)/history")}
          />

          <MenuItem
            icon="settings-outline"
            label="Settings"
            sub="App preferences"
            onPress={() => router.push("../settings")}
          />

          <MenuItem
            icon="log-out-outline"
            label="Logout"
            sub="Securely sign out"
            danger
            onPress={handleLogout}
          />
        </View>

        {/* 🔹 Motivation Card */}
        <View className="mx-5 mt-6 bg-green-600 rounded-3xl p-5">
          <Text className="text-white text-lg font-semibold">
            Healthy Choices Matter
          </Text>

          <Text className="text-white/90 mt-2 text-sm">
            You've avoided harmful additives. Keep scanning to maintain your
            streak!
          </Text>
        </View>

        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * 🔹 Menu Item Component
 */
function MenuItem({ icon, label, sub, onPress, danger }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between p-4"
    >
      <View className="flex-row items-center gap-3">
        <Ionicons
          name={icon}
          size={20}
          color={danger ? "#DC2626" : "#374151"}
        />

        <View>
          <Text
            className={`font-medium ${
              danger ? "text-red-600" : "text-gray-800"
            }`}
          >
            {label}
          </Text>
          <Text className="text-gray-500 text-xs">{sub}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
    </TouchableOpacity>
  );
}
