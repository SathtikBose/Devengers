import { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useAuthStore } from "../../src/store/useAuthStore";
import {
  fetchHealthDashboardApi,
  type RecentScanItem,
} from "../../src/api/user.api";

const PLACEHOLDER_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/3075/3075977.png";

function formatScanTime(iso: string) {
  try {
    const d = new Date(iso);
    const now = new Date();
    const sameDay =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();
    const time = d.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
    if (sameDay) return `Today, ${time}`;
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      d.getDate() === yesterday.getDate() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getFullYear() === yesterday.getFullYear();
    if (isYesterday) return `Yesterday, ${time}`;
    return `${d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    })}, ${time}`;
  } catch {
    return "";
  }
}

function healthStatusBadgeClasses(status: string) {
  switch (status.toUpperCase()) {
    case "OPTIMAL":
      return { wrap: "bg-green-100", text: "text-green-700" };
    case "BALANCED":
      return { wrap: "bg-emerald-100", text: "text-emerald-800" };
    case "CAUTION":
      return { wrap: "bg-amber-100", text: "text-amber-800" };
    case "AT RISK":
      return { wrap: "bg-red-100", text: "text-red-700" };
    default:
      return { wrap: "bg-gray-100", text: "text-gray-700" };
  }
}

function scoreBarColorClass(score: number) {
  if (score >= 80) return "bg-green-600";
  if (score >= 50) return "bg-amber-500";
  return "bg-red-500";
}

function insightSurfaceClasses(score: number) {
  if (score >= 80) return { wrap: "bg-green-50", title: "text-green-700" };
  if (score >= 50) return { wrap: "bg-amber-50", title: "text-amber-800" };
  return { wrap: "bg-red-50", title: "text-red-700" };
}

function scanRecommendationColor(status: string): "green" | "yellow" | "red" {
  const s = status.toUpperCase();
  if (["SAFE", "GOOD", "EXCELLENT", "OPTIMAL"].includes(s)) return "green";
  if (["AVOID", "UNSAFE", "HIGH RISK", "DANGER"].includes(s)) return "red";
  return "yellow";
}

export default function DashboardScreen() {
  const router = useRouter();
  const { user, token, updateUser } = useAuthStore();
  const [recentScans, setRecentScans] = useState<RecentScanItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchHealthDashboardApi();
      updateUser({ healthProfile: data.healthProfile });
      setRecentScans(data.recentScans);
    } catch {
      // Keep existing cached healthProfile; avoid logout loops on network errors
    } finally {
      setLoading(false);
    }
  }, [token, updateUser]);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard]),
  );

  const hp = user?.healthProfile;
  const healthScore = hp?.score ?? 70;
  const healthStatus = hp?.status ?? "BALANCED";
  const insight = hp?.insight ?? "Start scanning products to build your health profile.";
  const badge = healthStatusBadgeClasses(healthStatus);
  const barTint = scoreBarColorClass(healthScore);
  const insightSkin = insightSurfaceClasses(healthScore);
  const userName = user?.name || "User";

  return (
    <SafeAreaView className="flex-1 bg-[#EEF3EC]">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🔹 HEADER */}
        <View className="flex-row justify-between items-center px-5 py-4">
          <Text className="text-xl font-bold text-green-700">NutriScan</Text>

          <TouchableOpacity className="bg-green-100 p-3 rounded-full">
            <Ionicons name="notifications-outline" size={20} color="#166534" />
          </TouchableOpacity>
        </View>

        {/* 🔹 GREETING */}
        <View className="px-5 mt-2">
          <Text className="text-gray-400 tracking-widest text-xs">
            DAILY BRIEFING
          </Text>

          <Text className="text-3xl font-bold mt-2 text-gray-800">
            Hello, {userName}
          </Text>
        </View>

        {/* 🔹 QUICK SCAN CARD */}
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/scan")}
          className="mx-5 mt-6 bg-green-600 rounded-[30px] p-6 shadow-lg"
          style={{
            elevation: 6,
          }}
        >
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
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-semibold text-gray-800">
              Health Status
            </Text>

            <View className={`px-3 py-1 rounded-full ${badge.wrap}`}>
              <Text className={`text-xs font-semibold ${badge.text}`}>
                {healthStatus}
              </Text>
            </View>
          </View>

          <View className="mt-4">
            <View className="flex-row justify-between">
              <Text className="text-gray-500 text-sm">Purity Score</Text>
              {loading ? (
                <ActivityIndicator size="small" color="#166534" />
              ) : (
                <Text className="text-gray-800 font-semibold">
                  {healthScore}%
                </Text>
              )}
            </View>

            <View className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <View
                className={`h-2 ${barTint}`}
                style={{ width: `${Math.min(100, Math.max(0, healthScore))}%` }}
              />
            </View>
          </View>

          <View className={`p-4 rounded-2xl mt-4 ${insightSkin.wrap}`}>
            <Text className={`font-semibold ${insightSkin.title}`}>
              Insight:
              <Text className="text-gray-600 font-normal"> {insight}</Text>
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

            <TouchableOpacity onPress={() => router.push("/(tabs)/scan")}>
              <Text className="text-green-700 font-semibold text-sm">
                SCAN MORE
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-5 mt-4 gap-4">
          {loading && recentScans.length === 0 ? (
            <View className="py-8 items-center">
              <ActivityIndicator size="large" color="#166534" />
            </View>
          ) : recentScans.length === 0 ? (
            <Text className="text-gray-500 text-center py-6 px-2">
              No scans yet. Each scan is treated as a food choice—harmful products
              lower your score; better products raise it.
            </Text>
          ) : (
            recentScans.map((item) => (
              <ScanItem
                key={item.id}
                title={item.title}
                time={formatScanTime(item.createdAt)}
                score={`${item.score} pts`}
                status={item.status}
                image={item.image?.trim() ? item.image : PLACEHOLDER_IMAGE}
                statusColor={scanRecommendationColor(item.status)}
              />
            ))
          )}
        </View>

        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}

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
  statusColor: "green" | "yellow" | "red";
}) {
  const palette =
    statusColor === "green"
      ? { wrap: "bg-green-100", text: "text-green-700" }
      : statusColor === "red"
        ? { wrap: "bg-red-100", text: "text-red-700" }
        : { wrap: "bg-yellow-100", text: "text-yellow-700" };

  return (
    <View className="bg-white p-4 rounded-2xl flex-row items-center justify-between shadow-sm">
      <View className="flex-row items-center gap-3">
        <Image source={{ uri: image }} className="w-12 h-12 rounded-full" />

        <View>
          <Text className="font-semibold text-gray-800">{title}</Text>
          <Text className="text-gray-400 text-xs">{time}</Text>
        </View>
      </View>

      <View className="items-end">
        <View className={`px-3 py-1 rounded-full ${palette.wrap}`}>
          <Text className={`text-xs font-semibold ${palette.text}`}>
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
