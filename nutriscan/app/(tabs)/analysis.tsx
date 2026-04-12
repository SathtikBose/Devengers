import { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useScanStore } from "../../src/store/useScanStore";
import {
  fetchLatestScanApi,
  fetchScanByIdApi,
} from "../../src/api/scan.api";

const PLACEHOLDER_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/3075/3075977.png";

const getScoreColor = (score: number = 0) => {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
};

function recommendationPanelStyle(recommendation: string) {
  const r = (recommendation || "").toUpperCase();
  if (/(SAFE|GOOD|EXCELLENT|OPTIMAL)/.test(r)) {
    return {
      wrap: "bg-green-100 border-green-600",
      title: "text-green-800",
    };
  }
  if (/(AVOID|UNSAFE|DANGER|HIGH)/.test(r)) {
    return {
      wrap: "bg-red-100 border-red-600",
      title: "text-red-800",
    };
  }
  return {
    wrap: "bg-amber-100 border-amber-600",
    title: "text-amber-900",
  };
}

function hasAnalysisContent(analysis: any) {
  if (!analysis || typeof analysis !== "object") return false;
  return (
    analysis.score != null ||
    !!analysis.recommendation ||
    !!analysis.description ||
    !!analysis.grade
  );
}

export default function AnalysisScreen() {
  const router = useRouter();
  const product = useScanStore((s) => s.product);
  const analysis = useScanStore((s) => s.analysis);
  const applyFetchedScan = useScanStore((s) => s.applyFetchedScan);
  const setPendingAnalysisScanId = useScanStore(
    (s) => s.setPendingAnalysisScanId,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      (async () => {
        setLoading(true);
        setError(null);

        const pending = useScanStore.getState().pendingAnalysisScanId;

        try {
          if (pending) {
            const doc = await fetchScanByIdApi(pending);
            if (cancelled) return;
            setPendingAnalysisScanId(null);
            if (doc) {
              applyFetchedScan(doc);
            } else {
              setError("That scan could not be loaded.");
            }
          } else {
            const latest = await fetchLatestScanApi();
            if (cancelled) return;
            if (latest) {
              applyFetchedScan(latest);
            }
          }
        } catch (e: any) {
          if (!cancelled) {
            setError(e?.message || "Could not refresh analysis.");
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [applyFetchedScan, setPendingAnalysisScanId]),
  );

  const displayProduct = product;
  const displayAnalysis = analysis;

  const hasData =
    displayProduct &&
    hasAnalysisContent(displayAnalysis);

  const safeIngredients = displayAnalysis?.safeIngredients || [];
  const avoidIngredients = displayAnalysis?.avoidIngredients || [];
  const alternatives = displayAnalysis?.alternatives || [];
  const nutrition = displayAnalysis?.nutrition || {};

  const scoreColor = getScoreColor(displayAnalysis?.score || 0);
  const recStyle = recommendationPanelStyle(
    displayAnalysis?.recommendation || "",
  );

  if (loading && !hasData) {
    return (
      <SafeAreaView className="flex-1 bg-[#EEF3EC] items-center justify-center">
        <ActivityIndicator size="large" color="#166534" />
        <Text className="text-gray-500 mt-4">Loading analysis…</Text>
      </SafeAreaView>
    );
  }

  if (!hasData) {
    return (
      <SafeAreaView className="flex-1 bg-[#EEF3EC] px-6 justify-center">
        <Text className="text-2xl font-bold text-gray-800 text-center">
          No scan yet
        </Text>
        <Text className="text-gray-500 text-center mt-3">
          Scan a product to see nutrition details here. Your last scan stays on
          this tab until you scan something new.
        </Text>
        {error ? (
          <Text className="text-red-600 text-center mt-4 text-sm">{error}</Text>
        ) : null}
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/scan")}
          className="bg-green-600 mt-8 py-4 rounded-2xl items-center"
        >
          <Text className="text-white font-semibold text-lg">Scan now</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#EEF3EC]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 py-4">
          <Text className="text-xl font-bold text-gray-800">NutriScan</Text>
        </View>

        {error ? (
          <Text className="text-amber-700 text-center text-sm px-5 mb-2">
            {error}
          </Text>
        ) : null}

        <View className="mx-5 bg-white rounded-3xl p-5">
          <Text className="text-xs text-green-600 font-semibold">
            PRODUCT
          </Text>

          <Text className="text-2xl font-bold mt-2 text-gray-800">
            {displayProduct?.name || "Unknown Product"}
          </Text>

          <Text className="text-gray-500 mt-1">
            {displayProduct?.subtitle || ""}
          </Text>

          <View className="flex-row items-center mt-3 gap-2">
            <View className="bg-green-500 px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-semibold">
                {displayAnalysis?.grade || "N/A"}
              </Text>
            </View>

            <Text className="text-gray-500 text-sm">Verified Non-GMO</Text>
          </View>
        </View>

        <Image
          source={{
            uri: displayProduct?.image?.trim()
              ? displayProduct.image
              : PLACEHOLDER_IMAGE,
          }}
          className="mx-5 mt-4 h-60 rounded-3xl"
          resizeMode="cover"
        />

        <View
          className={`mx-5 mt-4 rounded-2xl p-4 border-l-4 ${recStyle.wrap}`}
        >
          <Text className={`font-semibold ${recStyle.title}`}>
            NutriScan Recommendation:{" "}
            {displayAnalysis?.recommendation || "N/A"}
          </Text>

          <Text className="text-gray-600 mt-2">
            {displayAnalysis?.description || "No description available"}
          </Text>
        </View>

        <View className="mx-5 mt-4 bg-white rounded-3xl p-6 items-center">
          <Text className="text-xs text-gray-400">OVERALL HEALTH SCORE</Text>

          <View className="items-center mt-6">
            <View
              className="w-32 h-32 rounded-full items-center justify-center"
              style={{ backgroundColor: scoreColor + "20" }}
            >
              <View
                className="w-28 h-28 rounded-full items-center justify-center border-4"
                style={{ borderColor: scoreColor }}
              >
                <Text
                  className="text-4xl font-bold"
                  style={{ color: scoreColor }}
                >
                  {displayAnalysis?.score ?? 0}
                </Text>
              </View>
            </View>
          </View>

          <Text
            className="text-lg font-semibold mt-4"
            style={{ color: scoreColor }}
          >
            {displayAnalysis?.rating || "Unknown"}
          </Text>
        </View>

        <View className="mx-5 mt-4 gap-3">
          {nutrition.calories && (
            <NutritionItem label="Calories" value={nutrition.calories} />
          )}
          {nutrition.protein && (
            <NutritionItem label="Protein" value={nutrition.protein} />
          )}
          {nutrition.sugar && (
            <NutritionItem label="Sugar" value={nutrition.sugar} />
          )}
        </View>

        <View className="mx-5 mt-6 bg-white rounded-3xl p-5">
          <Text className="text-lg font-semibold">Ingredients List</Text>

          {safeIngredients.length > 0 && (
            <View className="mt-4">
              <Text className="text-xs text-green-700 font-semibold">
                SAFE & BENEFICIAL
              </Text>

              <View className="flex-row flex-wrap gap-2 mt-2">
                {safeIngredients.map((item: string, i: number) => (
                  <View key={i} className="bg-green-100 px-3 py-1 rounded-full">
                    <Text className="text-green-700 text-xs">{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {avoidIngredients.length > 0 && (
            <View className="mt-4">
              <Text className="text-xs text-red-700 font-semibold">
                AVOID / LIMIT
              </Text>

              {avoidIngredients.map((item: any, i: number) => (
                <View key={i} className="bg-red-50 p-3 rounded-lg mt-2">
                  <Text className="text-red-700 font-semibold">
                    {item?.name || "Unknown"}
                  </Text>
                  <Text className="text-red-500 text-xs">
                    {item?.reason || ""}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View className="mx-5 mt-6">
          <Text className="text-lg font-semibold">Healthier Alternatives</Text>

          {alternatives.length > 0 ? (
            alternatives.map((alt: any, i: number) => (
              <View
                key={i}
                className="bg-white p-4 rounded-2xl mt-3 flex-row justify-between items-center"
              >
                <View>
                  <Text className="font-semibold text-wrap ">{alt?.name || ""}</Text>
                  <Text className="text-gray-500 text-sm">
                    {alt?.desc || ""}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text className="text-gray-400 mt-2">
              No alternatives available
            </Text>
          )}
        </View>

        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}

function NutritionItem({ label, value }: { label: string; value: string }) {
  let num = 0;
  if (typeof value === "string") {
    const match = value.match(/([\d.]+)/);
    if (match) num = parseFloat(match[1]);
  } else if (typeof value === "number") {
    num = value;
  }

  let max = 100;
  if (label.toLowerCase().includes("calorie")) max = 400;
  if (label.toLowerCase().includes("protein")) max = 30;
  if (label.toLowerCase().includes("sugar")) max = 40;
  const percent = Math.min(100, Math.round((num / max) * 100));

  let barColor = "#10b981";
  if (label.toLowerCase().includes("sugar")) barColor = "#ef4444";
  if (label.toLowerCase().includes("protein")) barColor = "#3b82f6";
  if (label.toLowerCase().includes("calorie")) barColor = "#f59e0b";

  return (
    <View className="bg-white p-4 rounded-2xl mb-2">
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-600">{label}</Text>
        <Text className="font-semibold">{value}</Text>
      </View>
      <View
        style={{
          height: 8,
          backgroundColor: "#e5e7eb",
          borderRadius: 8,
          marginTop: 8,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${percent}%`,
            height: 8,
            backgroundColor: barColor,
            borderRadius: 8,
          }}
        />
      </View>
    </View>
  );
}
