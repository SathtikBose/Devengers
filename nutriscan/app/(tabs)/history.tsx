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
import { useEffect, useState } from "react";
import { mockHistory } from "../../src/api/mock";
import { useScanStore } from "../../src/store/useScanStore";

/**
 * 📜 History Screen
 * - Uses mock API (or real later)
 * - Includes search + filters
 */
export default function HistoryScreen() {
  const [activeFilter, setActiveFilter] = useState("Today");
  const [scans, setScans] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const history = useScanStore((state) => state.history);

  /**
   * 🔹 Fetch history (mock or API)
   */
  useEffect(() => {
    const fetchData = async () => {
      const data = await mockHistory();
      setScans(data);
    };

    fetchData();
  }, []);

  /**
   * 🔹 Filtered Data
   */

  const filteredScans = history.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus = statusFilter ? item.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

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
            value={search}
            onChangeText={setSearch}
            className="ml-3 flex-1"
          />
        </View>

        {/* 🔹 Time Filters (UI only for now) */}
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
          <StatusChip
            label="SAFE"
            color="green"
            active={statusFilter === "SAFE"}
            onPress={() =>
              setStatusFilter(statusFilter === "SAFE" ? "" : "SAFE")
            }
          />
          <StatusChip
            label="MODERATE"
            color="yellow"
            active={statusFilter === "MODERATE"}
            onPress={() =>
              setStatusFilter(statusFilter === "MODERATE" ? "" : "MODERATE")
            }
          />
          <StatusChip
            label="AVOID"
            color="red"
            active={statusFilter === "AVOID"}
            onPress={() =>
              setStatusFilter(statusFilter === "AVOID" ? "" : "AVOID")
            }
          />
        </View>

        {/* 🔹 Section Title */}
        <Text className="px-5 mt-6 text-gray-400 text-xs tracking-widest">
          RECENT SCANS
        </Text>

        {/* 🔹 List */}
        <View className="px-5 mt-3 gap-4">
          {filteredScans.map((item) => (
            <ScanCard key={item.id} item={item} />
          ))}

          {filteredScans.length === 0 && (
            <Text className="text-center text-gray-400 mt-6">
              No results found
            </Text>
          )}
        </View>

        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * 🔹 Status Chip
 */
function StatusChip({ label, color, active, onPress }: any) {
  const bg =
    color === "green"
      ? active
        ? "bg-green-600"
        : "bg-green-100"
      : color === "yellow"
        ? active
          ? "bg-yellow-500"
          : "bg-yellow-100"
        : active
          ? "bg-red-600"
          : "bg-red-100";

  const text = active
    ? "text-white"
    : color === "green"
      ? "text-green-700"
      : color === "yellow"
        ? "text-yellow-700"
        : "text-red-700";

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full ${bg}`}
    >
      <Text className={`text-xs font-semibold ${text}`}>{label}</Text>
    </TouchableOpacity>
  );
}

/**
 * 🔹 Scan Card
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
