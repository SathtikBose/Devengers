import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../src/store/useAuthStore";

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  // 🔹 Default health score (can be enhanced with user health data from API)
  const healthScore = 88;
  const userName = user?.name || "User";

  return (
    <SafeAreaView className="flex-1 bg-[#EEF3EC]">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🔹 HEADER */}
        <View className="flex-row justify-between items-center px-5 py-4">
          <Text className="text-xl font-bold text-green-700">NutriScan</Text>

          {/* Notification Icon */}
          <TouchableOpacity className="bg-green-100 p-3 rounded-full">
            <Ionicons name="notifications-outline" size={20} color="#166534" />
          </TouchableOpacity>
        </View>

        {/* 🔹 GREETING */}
        <View className="px-5 mt-2">
          <Text className="text-gray-400 tracking-widest text-xs">
            DAILY BRIEFING
          </Text>

          {/* Dynamic username from auth store */}
          <Text className="text-3xl font-bold mt-2 text-gray-800">
            Hello, {userName}
          </Text>
        </View>

        {/* 🔹 QUICK SCAN CARD */}
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/scan")}
          className="mx-5 mt-6 bg-green-600 rounded-[30px] p-6 shadow-lg"
          style={{
            elevation: 6, // Android shadow
          }}
        >
          {/* QR Icon */}
          <MaterialIcons name="qr-code-scanner" size={28} color="white" />

          <Text className="text-white text-2xl font-semibold mt-4">
            Quick Scan
          </Text>

          <Text className="text-green-100 mt-4 font-medium">
            START SCANNING →
          </Text>
        </TouchableOpacity>

        {/* 🔹 HEALTH STATUS CARD */}
        <View className="mx-5 mt-6 bg-white rounded-3xl p-5 shadow-sm">
          {/* Header */}
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-semibold text-gray-800">
              Health Status
            </Text>

            {/* Status Badge */}
            <View className="bg-green-100 px-3 py-1 rounded-full">
              <Text className="text-green-700 text-xs font-semibold">
                OPTIMAL
              </Text>
            </View>
          </View>

          {/* Purity Score */}
          <View className="mt-4">
            <View className="flex-row justify-between">
              <Text className="text-gray-500 text-sm">Purity Score</Text>
              <Text className="text-gray-800 font-semibold">
                {healthScore}%
              </Text>
            </View>

            {/* Progress Bar */}
            <View className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <View
                className="h-2 bg-green-600"
                style={{ width: `${healthScore}%` }}
              />
            </View>
          </View>

          {/* Insight Box */}
          <View className="bg-green-50 p-4 rounded-2xl mt-4">
            <Text className="text-green-700 font-semibold">
              Insight:
              <Text className="text-gray-600 font-normal">
                {" "}
                Your additive intake is 15% lower than last week. Keep it up!
              </Text>
            </Text>
          </View>
        </View>

        {/* 🔹 RECENT SCANS */}
        <View className="px-5 mt-8">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-gray-400 text-xs tracking-widest">
                ACTIVITY
              </Text>
              <Text className="text-xl font-bold text-gray-800 mt-1">
                Recent Scans
              </Text>
            </View>

            <TouchableOpacity>
              <Text className="text-green-700 font-semibold text-sm">
                VIEW ALL
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 🔹 LIST ITEMS */}
        <View className="px-5 mt-4 gap-4">
          {/* ITEM 1 */}
          <ScanItem
            title="Organic Whole Milk"
            time="Today, 10:24 AM"
            score="94 pts"
            status="SAFE"
            image="https://cdn-icons-png.flaticon.com/512/1046/1046784.png"
            statusColor="green"
          />

          {/* ITEM 2 */}
          <ScanItem
            title="Almond Honey Bar"
            time="Yesterday, 4:15 PM"
            score="62 pts"
            status="CAUTION"
            image="https://cdn-icons-png.flaticon.com/512/2515/2515183.png"
            statusColor="yellow"
          />

          {/* ITEM 3 */}
          <ScanItem
            title="Greek Style Yogurt"
            time="Nov 22, 12:30 PM"
            score="89 pts"
            status="SAFE"
            image="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
            statusColor="green"
          />
        </View>

        {/* Bottom spacing */}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * 🔹 Reusable Scan Item Component
 * Displays scanned product info with status & score
 */
function ScanItem({
  title,
  time,
  score,
  status,
  image,
  statusColor,
}: {
  title: string;
  time: string;
  score: string;
  status: string;
  image: string;
  statusColor: "green" | "yellow";
}) {
  return (
    <View className="bg-white p-4 rounded-2xl flex-row items-center justify-between shadow-sm">
      {/* Left Section */}
      <View className="flex-row items-center gap-3">
        <Image source={{ uri: image }} className="w-12 h-12 rounded-full" />

        <View>
          <Text className="font-semibold text-gray-800">{title}</Text>
          <Text className="text-gray-400 text-xs">{time}</Text>
        </View>
      </View>

      {/* Right Section */}
      <View className="items-end">
        <View
          className={`px-3 py-1 rounded-full ${
            statusColor === "green" ? "bg-green-100" : "bg-yellow-100"
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              statusColor === "green" ? "text-green-700" : "text-yellow-700"
            }`}
          >
            {status}
          </Text>
        </View>

        <Text className="text-gray-800 font-semibold mt-1 text-sm">
          {score}
        </Text>
      </View>
    </View>
  );
}
