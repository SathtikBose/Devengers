import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { useToast } from "../../src/hooks/useToast";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { fetchScanHistoryApi, type ScanDocument } from "../../src/api/scan.api";
import { useScanStore } from "../../src/store/useScanStore";
import {
  formatScanTime,
  normalizeHistoryStatus,
  scanMatchesTimeFilter,
} from "../../src/utils/scanDisplay";

const PLACEHOLDER_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/3075/3075977.png";

type HistoryRow = {
  id: string;
  name: string;
  brand: string;
  status: string;
  image: string;
  createdAt: string;
};

function mapScanToRow(scan: ScanDocument): HistoryRow {
  const product = scan.result?.product || {};
  const analysis = scan.result?.analysis || {};
  const raw = String(analysis.recommendation || "UNKNOWN").toUpperCase();
  return {
    id: String(scan._id),
    name: product.name || scan.barcode || "Scanned product",
    brand: product.subtitle || scan.type?.toUpperCase() || "",
    status: normalizeHistoryStatus(raw),
    image: (product.image || scan.image || "").trim() || PLACEHOLDER_IMAGE,
    createdAt: scan.createdAt,
  };
}

export default function HistoryScreen() {
  const router = useRouter();
  const setPendingAnalysisScanId = useScanStore(
    (s) => s.setPendingAnalysisScanId,
  );
  const toast = useToast();

  const [activeFilter, setActiveFilter] = useState<
    "Today" | "This Week" | "All"
  >("All");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [rows, setRows] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const scans = await fetchScanHistoryApi();
      setRows(scans.map(mapScanToRow));
    } catch (e: any) {
      setRows([]);
      if (e?.response?.status !== 404) {
        toast.error({
          title: "Failed to load history",
          message: "An error occurred while fetching your scan history.",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory]),
  );

  const filteredScans = rows.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter ? item.status === statusFilter : true;

    const matchesTime = scanMatchesTimeFilter(item.createdAt, activeFilter);

    return matchesSearch && matchesStatus && matchesTime;
  });

  const openScan = (id: string) => {
    setPendingAnalysisScanId(id);
    router.push("/(tabs)/analysis");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#EEF3EC]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between px-5 py-4">
          <Text className="text-xl font-bold text-green-700">Scan History</Text>
        </View>

        <View className="mx-5 bg-[#E6EFE4] rounded-full px-4 py-3 flex-row items-center">
          <Ionicons name="search-outline" size={18} color="#6B7280" />
          <TextInput
            placeholder="Search your scans..."
            value={search}
            onChangeText={setSearch}
            className="ml-3 flex-1"
          />
        </View>

        <View className="flex-row gap-3 px-5 mt-4">
          {(["Today", "This Week", "All"] as const).map((item) => (
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

        <View className="flex-row gap-3 px-5 mt-4 flex-wrap">
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

        <Text className="px-5 mt-6 text-gray-400 text-xs tracking-widest">
          ALL SCANS
        </Text>

        <View className="px-5 mt-3 gap-4">
          {loading ? (
            <View className="py-12 items-center">
              <ActivityIndicator size="large" color="#166534" />
            </View>
          ) : filteredScans.length === 0 ? (
            <View className="items-center py-10 px-4">
              <Text className="text-gray-500 text-center">
                {rows.length === 0
                  ? "You have no scans yet. Start by scanning a product."
                  : "No scans match your filters."}
              </Text>
              {rows.length === 0 ? (
                <TouchableOpacity
                  onPress={() => router.push("/(tabs)/scan")}
                  className="bg-green-600 mt-6 px-8 py-4 rounded-2xl"
                >
                  <Text className="text-white font-semibold">Scan now</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : (
            filteredScans.map((item) => (
              <ScanCard
                key={item.id}
                item={item}
                onPress={() => openScan(item.id)}
              />
            ))
          )}
        </View>

        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatusChip({
  label,
  color,
  active,
  onPress,
}: {
  label: string;
  color: string;
  active: boolean;
  onPress: () => void;
}) {
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

function ScanCard({
  item,
  onPress,
}: {
  item: HistoryRow;
  onPress: () => void;
}) {
  const getStatusStyle = () => {
    switch (item.status) {
      case "SAFE":
        return "bg-green-100 text-green-700";
      case "MODERATE":
        return "bg-yellow-100 text-yellow-700";
      case "AVOID":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white p-4 rounded-2xl flex-row items-center justify-between active:opacity-90"
    >
      <View className="flex-row items-center gap-3 flex-1">
        <Image source={{ uri: item.image }} className="w-14 h-14 rounded-xl" />

        <View className="flex-1">
          <Text className="font-semibold text-gray-800">{item.name}</Text>
          <Text className="text-gray-500 text-sm">{item.brand}</Text>

          <View className="flex-row items-center gap-2 mt-1">
            <View className={`px-2 py-1 rounded-full ${getStatusStyle()}`}>
              <Text className="text-xs font-semibold">{item.status}</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="items-end ml-2">
        <Text className="text-gray-400 text-xs mb-2">
          {formatScanTime(item.createdAt)}
        </Text>
        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
}
