import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { useScan } from "../../src/hooks/useScan";

/**
 * 📷 Scan Screen
 * - Simulates barcode scan (input for now)
 * - Calls scan API via hook
 */
export default function ScanScreen() {
  const router = useRouter();
  const { scan, loading } = useScan();

  const [barcode, setBarcode] = useState("");
  const [mode, setMode] = useState<"product" | "barcode">("product");

  /**
   * 🔹 Handle Scan
   * Calls API and navigates to analysis
   */
  const handleScan = async () => {
    if (!barcode) return alert("Enter barcode");

    const res = await scan(barcode);

    if (res.success) {
      router.push("/(tabs)/analysis");
    } else {
      alert(res.message);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      {/* 🔹 Background Gradient */}
      <LinearGradient colors={["#1F3D2B", "#6B8F71"]} className="flex-1">
        {/* 🔹 Header */}
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="white" />
          </TouchableOpacity>

          <Text className="text-white font-semibold text-lg">NutriScan</Text>

          <View className="flex-row gap-4">
            <Ionicons name="flash-outline" size={20} color="white" />
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="white"
            />
          </View>
        </View>

        {/* 🔹 Scanner Frame (UI Only) */}
        <View className="flex-1 justify-center items-center">
          {/* Top Corners */}
          <View className="absolute top-32 left-10 w-16 h-16 border-t-4 border-l-4 border-green-400 rounded-tl-3xl" />
          <View className="absolute top-32 right-10 w-16 h-16 border-t-4 border-r-4 border-green-400 rounded-tr-3xl" />

          {/* Bottom Corners */}
          <View className="absolute bottom-40 left-10 w-16 h-16 border-b-4 border-l-4 border-green-400 rounded-bl-3xl" />
          <View className="absolute bottom-40 right-10 w-16 h-16 border-b-4 border-r-4 border-green-400 rounded-br-3xl" />

          {/* Scan Line */}
          <View className="w-3/4 h-[2px] bg-green-400" />
        </View>

        {/* 🔹 Mode Toggle */}
        <View className="items-center">
          <View className="flex-row bg-black/40 rounded-full p-1">
            <TouchableOpacity
              onPress={() => setMode("product")}
              className={`px-5 py-2 rounded-full ${
                mode === "product" ? "bg-white" : ""
              }`}
            >
              <Text
                className={`${mode === "product" ? "text-black" : "text-white"}`}
              >
                Product
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMode("barcode")}
              className={`px-5 py-2 rounded-full ${
                mode === "barcode" ? "bg-white" : ""
              }`}
            >
              <Text
                className={`${mode === "barcode" ? "text-black" : "text-white"}`}
              >
                Barcode
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 🔹 Input (Temporary Scanner Simulation) */}
        <View className="px-6 mt-4">
          <TextInput
            placeholder="Enter barcode..."
            placeholderTextColor="#ccc"
            value={barcode}
            onChangeText={setBarcode}
            className="bg-white/20 text-white px-4 py-3 rounded-xl"
          />
        </View>

        {/* 🔹 Controls */}
        <View className="flex-row justify-between items-center px-10 mt-6">
          {/* Upload */}
          <TouchableOpacity className="items-center">
            <View className="bg-black/40 p-4 rounded-full">
              <Ionicons name="image-outline" size={20} color="white" />
            </View>
            <Text className="text-white text-xs mt-2">UPLOAD</Text>
          </TouchableOpacity>

          {/* Scan Button */}
          <TouchableOpacity
            onPress={handleScan}
            disabled={loading}
            className="bg-white p-6 rounded-full"
          >
            <MaterialIcons name="qr-code-scanner" size={28} color="#166534" />
          </TouchableOpacity>

          {/* Recent */}
          <TouchableOpacity className="items-center">
            <View className="bg-black/40 p-4 rounded-full">
              <Ionicons name="time-outline" size={20} color="white" />
            </View>
            <Text className="text-white text-xs mt-2">RECENT</Text>
          </TouchableOpacity>
        </View>

        {/* 🔹 Hint */}
        <View className="items-center mt-6">
          <Text className="text-white/80 text-sm bg-black/30 px-4 py-2 rounded-full">
            Center the nutritional facts in the frame
          </Text>
        </View>

        {/* Bottom spacing */}
        <View className="h-10" />
      </LinearGradient>
    </SafeAreaView>
  );
}
