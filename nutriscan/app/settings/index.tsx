import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useAppStore } from "../../src/store/useAppStore";

/**
 * ⚙️ Settings Screen
 * - App preferences
 * - Dark mode toggle
 * - Logout & danger zone
 */
export default function SettingsScreen() {
  const router = useRouter();

  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useAppStore();

  /**
   * 🔹 Logout handler
   */
  const handleLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#EEF3EC]">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🔹 Header */}
        <View className="flex-row items-center px-5 py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#166534" />
          </TouchableOpacity>

          <Text className="flex-1 text-center text-green-700 font-semibold text-lg">
            Settings
          </Text>

          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            }}
            className="w-8 h-8 rounded-full"
          />
        </View>

        {/* 🔹 Account */}
        <Text className="px-5 mt-4 text-gray-400 text-xs">ACCOUNT</Text>

        <View className="mx-5 mt-2 bg-white rounded-3xl p-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
              }}
              className="w-12 h-12 rounded-full"
            />

            <View>
              <Text className="font-semibold text-gray-800">
                {user?.name || "User"}
              </Text>
              <Text className="text-gray-500 text-sm">
                {user?.email || "email@example.com"}
              </Text>

              <View className="bg-green-100 px-2 py-1 rounded-full mt-1">
                <Text className="text-green-700 text-xs font-semibold">
                  PRO MEMBER
                </Text>
              </View>
            </View>
          </View>

          <Feather name="edit" size={18} color="#166534" />
        </View>

        {/* 🔹 Preferences */}
        <Text className="px-5 mt-6 text-gray-400 text-xs">PREFERENCES</Text>

        <View className="mx-5 mt-2 bg-white rounded-3xl p-5">
          {/* Diet */}
          <Text className="text-gray-500 mb-2">Diet Type</Text>
          <View className="bg-gray-100 p-3 rounded-full flex-row justify-between">
            <Text>Vegetarian</Text>
            <Ionicons name="chevron-down" size={16} />
          </View>

          {/* Allergies */}
          <Text className="text-gray-500 mt-4 mb-2">Allergies</Text>
          <View className="flex-row flex-wrap gap-2">
            {["Peanuts", "Shellfish"].map((item) => (
              <View key={item} className="bg-red-100 px-3 py-1 rounded-full">
                <Text className="text-red-600 text-xs">{item} ✕</Text>
              </View>
            ))}
            <TouchableOpacity className="bg-gray-100 px-3 py-1 rounded-full">
              <Text className="text-gray-600 text-xs">+ Add New</Text>
            </TouchableOpacity>
          </View>

          {/* Notifications */}
          <View className="flex-row justify-between items-center mt-5">
            <View>
              <Text className="font-medium text-gray-800">
                Push Notifications
              </Text>
              <Text className="text-gray-500 text-xs">
                Alerts for harmful ingredients
              </Text>
            </View>

            <Switch value={true} />
          </View>
        </View>

        {/* 🔹 App Settings */}
        <Text className="px-5 mt-6 text-gray-400 text-xs">APP SETTINGS</Text>

        <View className="mx-5 mt-2 bg-white rounded-3xl p-4">
          {/* Dark Mode */}
          <View className="flex-row justify-between items-center p-2">
            <View className="flex-row items-center gap-2">
              <Ionicons name="moon-outline" size={18} />
              <Text>Dark Mode</Text>
            </View>

            <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
          </View>

          {/* Language */}
          <View className="flex-row justify-between items-center p-2">
            <View className="flex-row items-center gap-2">
              <Ionicons name="globe-outline" size={18} />
              <Text>Language</Text>
            </View>

            <Text className="text-green-700">English (US)</Text>
          </View>
        </View>

        {/* 🔹 Security */}
        <Text className="px-5 mt-6 text-gray-400 text-xs">SECURITY</Text>

        <View className="mx-5 mt-2 bg-white rounded-3xl p-3">
          <MenuItem
            icon="lock-closed-outline"
            label="Change Password"
            onPress={() => {}}
          />

          <MenuItem
            icon="log-out-outline"
            label="Logout"
            danger
            onPress={handleLogout}
          />
        </View>

        {/* 🔹 Danger Zone */}
        <View className="mx-5 mt-6 bg-red-50 rounded-3xl p-5">
          <Text className="text-red-600 font-semibold">Danger Zone</Text>

          <Text className="text-gray-600 mt-2 text-sm">
            Once you delete your account, there is no going back.
          </Text>

          <TouchableOpacity className="bg-red-600 rounded-full py-4 mt-4 items-center">
            <Text className="text-white font-semibold">Delete Account</Text>
          </TouchableOpacity>
        </View>

        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * 🔹 Menu Item
 */
function MenuItem({ icon, label, onPress, danger }: any) {
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
        <Text className={`${danger ? "text-red-600" : "text-gray-800"}`}>
          {label}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
    </TouchableOpacity>
  );
}
