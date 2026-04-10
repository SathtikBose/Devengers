import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useScanStore } from "../../src/store/useScanStore";
import { demoAnalysis } from "../../src/data/demoAnalysis";

/**
 * 📊 Analysis Screen
 * - Displays scanned product result
 * - Reads data from Zustand store
 */
export default function AnalysisScreen() {
  const { product, analysis } = useScanStore();

  const displayProduct = product || demoAnalysis.product;
  const displayAnalysis = analysis || demoAnalysis.analysis;

  return (
    <SafeAreaView className="flex-1 bg-[#EEF3EC]">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🔹 Header */}
        <View className="flex-row justify-between items-center px-5 py-4">
          <Text className="text-xl font-bold text-gray-800">NutriScan</Text>
        </View>

        {/* 🔹 Product Info */}
        <View className="mx-5 bg-white rounded-3xl p-5">
          <Text className="text-xs text-green-600 font-semibold">
            CURRENT SCAN
          </Text>

          <Text className="text-2xl font-bold mt-2 text-gray-800">
            {displayProduct.name}
          </Text>

          <Text className="text-gray-500 mt-1">{product.subtitle}</Text>

          {/* Grade */}
          <View className="flex-row items-center mt-3 gap-2">
            <View className="bg-green-500 px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-semibold">
                {analysis.grade}
              </Text>
            </View>

            <Text className="text-gray-500 text-sm">Verified Non-GMO</Text>
          </View>
        </View>

        {/* 🔹 Product Image */}
        <Image
          source={{ uri: product.image }}
          className="mx-5 mt-4 h-60 rounded-3xl"
          resizeMode="cover"
        />

        {/* 🔹 Recommendation */}
        <View className="mx-5 mt-4 bg-green-100 rounded-2xl p-4 border-l-4 border-green-600">
          <Text className="text-green-800 font-semibold">
            NutriScan Recommendation: {analysis.recommendation}
          </Text>

          <Text className="text-gray-600 mt-2">{analysis.description}</Text>
        </View>

        {/* 🔹 Score */}
        <View className="mx-5 mt-4 bg-white rounded-3xl p-6 items-center">
          <Text className="text-xs text-gray-400">OVERALL HEALTH SCORE</Text>

          <Text className="text-4xl font-bold mt-4">
            {displayAnalysis.score}
          </Text>

          <Text className="text-gray-500 mt-2">{analysis.rating}</Text>
        </View>

        {/* 🔹 Nutrition */}
        <View className="mx-5 mt-4 gap-3">
          <NutritionItem label="Calories" value="150 kcal" />
          <NutritionItem label="Protein" value="12 g" />
          <NutritionItem label="Sugar" value="8 g" />
        </View>

        {/* 🔹 Ingredients */}
        <View className="mx-5 mt-6 bg-white rounded-3xl p-5">
          <Text className="text-lg font-semibold">Ingredients List</Text>

          <View className="flex-row flex-wrap gap-2 mt-3">
            {analysis.ingredients?.map((item: string, i: number) => (
              <View key={i} className="bg-green-100 px-3 py-1 rounded-full">
                <Text className="text-green-700 text-xs">{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 🔹 Alternatives */}
        <View className="mx-5 mt-6">
          <Text className="text-lg font-semibold">Healthier Alternatives</Text>

          {analysis.alternatives?.map((alt: any, i: number) => (
            <View
              key={i}
              className="bg-white p-4 rounded-2xl mt-3 flex-row justify-between items-center"
            >
              <View>
                <Text className="font-semibold text-gray-800">{alt.name}</Text>
                <Text className="text-gray-500 text-sm">{alt.desc}</Text>
              </View>

              <TouchableOpacity className="bg-green-600 px-4 py-2 rounded-full">
                <Text className="text-white text-sm">Swap</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * 🔹 Nutrition Row Component
 */
function NutritionItem({ label, value }: { label: string; value: string }) {
  return (
    <View className="bg-white p-4 rounded-2xl flex-row justify-between">
      <Text className="text-gray-600">{label}</Text>
      <Text className="font-semibold">{value}</Text>
    </View>
  );
}
