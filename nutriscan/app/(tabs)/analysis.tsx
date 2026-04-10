import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useScanStore } from "../../src/store/useScanStore";
import { demoAnalysis } from "../../src/data/demoAnalysis";

/**
 * 🎨 Score Color
 */
const getScoreColor = (score: number = 0) => {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
};

export default function AnalysisScreen() {
  const { product, analysis } = useScanStore();

  /**
   * ✅ SAFE FALLBACK (CRITICAL)
   */
  const displayProduct = product || demoAnalysis.product;
  const displayAnalysis = analysis || demoAnalysis.analysis;

  /**
   * ✅ SAFE EXTRACTION
   */
  const safeIngredients = displayAnalysis.safeIngredients || [];
  const avoidIngredients = displayAnalysis.avoidIngredients || [];
  const alternatives = displayAnalysis.alternatives || [];
  const nutrition = displayAnalysis.nutrition || {};

  const scoreColor = getScoreColor(displayAnalysis.score || 0);

  return (
    <SafeAreaView className="flex-1 bg-[#EEF3EC]">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🔹 Header */}
        <View className="px-5 py-4">
          <Text className="text-xl font-bold text-gray-800">NutriScan</Text>
        </View>

        {/* 🔹 Product Info */}
        <View className="mx-5 bg-white rounded-3xl p-5">
          <Text className="text-xs text-green-600 font-semibold">
            CURRENT SCAN
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

        {/* 🔹 Image */}
        <Image
          source={{
            uri: displayProduct?.image || "https://via.placeholder.com/300",
          }}
          className="mx-5 mt-4 h-60 rounded-3xl"
          resizeMode="cover"
        />

        {/* 🔹 Recommendation */}
        <View className="mx-5 mt-4 bg-green-100 rounded-2xl p-4 border-l-4 border-green-600">
          <Text className="text-green-800 font-semibold">
            NutriScan Recommendation: {displayAnalysis?.recommendation || "N/A"}
          </Text>

          <Text className="text-gray-600 mt-2">
            {displayAnalysis?.description || "No description available"}
          </Text>
        </View>

        {/* 🔹 Score */}
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
                  {displayAnalysis?.score || 0}
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

        {/* 🔹 Nutrition */}
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

        {/* 🔹 Ingredients */}
        <View className="mx-5 mt-6 bg-white rounded-3xl p-5">
          <Text className="text-lg font-semibold">Ingredients List</Text>

          {/* SAFE */}
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

          {/* AVOID */}
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

        {/* 🔹 Alternatives */}
        <View className="mx-5 mt-6">
          <Text className="text-lg font-semibold">Healthier Alternatives</Text>

          {alternatives.length > 0 ? (
            alternatives.map((alt: any, i: number) => (
              <View
                key={i}
                className="bg-white p-4 rounded-2xl mt-3 flex-row justify-between items-center"
              >
                <View>
                  <Text className="font-semibold">{alt?.name || ""}</Text>
                  <Text className="text-gray-500 text-sm">
                    {alt?.desc || ""}
                  </Text>
                </View>

                <TouchableOpacity className="bg-green-600 px-4 py-2 rounded-full">
                  <Text className="text-white text-sm">Swap</Text>
                </TouchableOpacity>
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

/**
 * 🔹 Nutrition Item
 */
import { View as RNView } from "react-native";

function NutritionItem({ label, value }: any) {
  // Extract numeric value for bar (e.g., "210 kcal" -> 210)
  let num = 0;
  if (typeof value === "string") {
    const match = value.match(/([\d.]+)/);
    if (match) num = parseFloat(match[1]);
  } else if (typeof value === "number") {
    num = value;
  }

  // Set max for each nutrient for bar scaling
  let max = 100;
  if (label.toLowerCase().includes("calorie")) max = 400;
  if (label.toLowerCase().includes("protein")) max = 30;
  if (label.toLowerCase().includes("sugar")) max = 40;
  const percent = Math.min(100, Math.round((num / max) * 100));

  // Bar color by nutrient
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
      <RNView
        style={{
          height: 8,
          backgroundColor: "#e5e7eb",
          borderRadius: 8,
          marginTop: 8,
          overflow: "hidden",
        }}
      >
        <RNView
          style={{
            width: `${percent}%`,
            height: 8,
            backgroundColor: barColor,
            borderRadius: 8,
          }}
        />
      </RNView>
    </View>
  );
}
