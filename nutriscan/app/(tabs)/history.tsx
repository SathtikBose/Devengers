import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

/**
 * 📜 History Screen
 * - Displays previous scans
 * - Includes filters + search
 */
export default function HistoryScreen() {
  const [activeFilter, setActiveFilter] = useState("Today");

  // 🔹 Mock Data (replace with API later)
  const scans = [
    {
      id: 1,
      name: "Organic Greek Yogurt",
      brand: "Nature's Best Dairy",
      status: "SAFE",
      note: "",
      time: "2h ago",
      image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
    },
    {
      id: 2,
      name: "Whole Grain O's",
      brand: "Morning Crunch Co.",
      status: "MODERATE",
      note: "High Sugar",
      time: "5h ago",
      image: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
    },
    {
      id: 3,
      name: "Hyper-Focus Energy",
      brand: "Volt Beverages",
      status: "AVOID",
      note: "Artificial Dye",
      time: "Yesterday",
      image: "https://cdn-icons-png.flaticon.com/512/2965/2965567.png",
    },
    {
      id: 4,
      name: "Unsweetened Almond",
      brand: "Pure Plant Co.",
      status: "SAFE",
      note: "",
      time: "Yesterday",
      image: "https://cdn-icons-png.flaticon.com/512/1046/1046750.png",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#EEF3EC]">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🔹 Header */}
        <View className="flex-row items-center justify-between px-5 py-4">
          <Text className="text-xl font-bold text-green-700">Scan History</Text>

          <View className="w-10 h-10 bg-gray-300 rounded-full items-center justify-center">
            <Text>👤</Text>
          </View>
        </View>

        {/* 🔹 Search */}
        <View className="mx-5 bg-[#E6EFE4] rounded-full px-4 py-3 flex-row items-center">
          <Ionicons name="search-outline" size={18} color="#6B7280" />
          <TextInput
            placeholder="Search your scans..."
            className="ml-3 flex-1"
          />
        </View>

        {/* 🔹 Time Filters */}
        <View className="flex-row gap-3 px-5 mt-4">
          {["Today", "This Week", "All"].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setActiveFilter(item)}
              className={`px-4 py-2 rounded-full ${
                activeFilter === item ? "bg-green-600" : "bg-gray-200"
              }`}
            >
              <Text
                className={`text-sm ${
                  activeFilter === item ? "text-white" : "text-gray-600"
                }`}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 🔹 Status Filters */}
        <View className="flex-row gap-3 px-5 mt-4">
          <StatusChip label="SAFE" color="green" />
          <StatusChip label="MODERATE" color="yellow" />
          <StatusChip label="AVOID" color="red" />
        </View>

        {/* 🔹 Section Title */}
        <Text className="px-5 mt-6 text-gray-400 text-xs tracking-widest">
          RECENT SCANS
        </Text>

        {/* 🔹 List */}
        <View className="px-5 mt-3 gap-4">
          {scans.map((item) => (
            <ScanCard key={item.id} item={item} />
          ))}
        </View>

        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * 🔹 Status Chip Component
 */
function StatusChip({
  label,
  color,
}: {
  label: string;
  color: "green" | "yellow" | "red";
}) {
  const bg =
    color === "green"
      ? "bg-green-100"
      : color === "yellow"
        ? "bg-yellow-100"
        : "bg-red-100";

  const text =
    color === "green"
      ? "text-green-700"
      : color === "yellow"
        ? "text-yellow-700"
        : "text-red-700";

  return (
    <View className={`px-4 py-2 rounded-full ${bg}`}>
      <Text className={`text-xs font-semibold ${text}`}>{label}</Text>
    </View>
  );
}

/**
 * 🔹 Scan Card Component
 */
function ScanCard({ item }: any) {
  const getStatusStyle = () => {
    switch (item.status) {
      case "SAFE":
        return "bg-green-100 text-green-700";
      case "MODERATE":
        return "bg-yellow-100 text-yellow-700";
      case "AVOID":
        return "bg-red-100 text-red-700";
      default:
        return "";
    }
  };

  return (
    <TouchableOpacity className="bg-white p-4 rounded-2xl flex-row items-center justify-between">
      {/* Left */}
      <View className="flex-row items-center gap-3">
        <Image source={{ uri: item.image }} className="w-14 h-14 rounded-xl" />

        <View>
          <Text className="font-semibold text-gray-800">{item.name}</Text>
          <Text className="text-gray-500 text-sm">{item.brand}</Text>

          <View className="flex-row items-center gap-2 mt-1">
            <View className={`px-2 py-1 rounded-full ${getStatusStyle()}`}>
              <Text className="text-xs font-semibold">{item.status}</Text>
            </View>

            {item.note ? (
              <Text className="text-xs text-gray-500">{item.note}</Text>
            ) : null}
          </View>
        </View>
      </View>

      {/* Right */}
      <View className="items-end">
        <Text className="text-gray-400 text-xs mb-2">{item.time}</Text>
        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
}
