import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useScan } from "../../src/hooks/useScan";

/**
 * 📷 Multi Input Scan Screen
 * - Camera (Base64)
 * - Gallery (Base64)
 * - Barcode Input
 */
export default function ScanScreen() {
  const router = useRouter();
  const { scanFromImage } = useScan();

  const [barcode, setBarcode] = useState("");

  /**
   * 📸 Capture Image → Base64
   */
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      const base64 = result.assets[0].base64;

      if (!base64) {
        return Alert.alert("Error", "Failed to capture image");
      }

      const res = await scanFromImage(base64);

      if (res.success) {
        router.push("/(tabs)/analysis");
      }
    }
  };

  /**
   * 🖼️ Pick from Gallery
   */
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      const base64 = result.assets[0].base64;

      if (!base64) {
        return Alert.alert("Error", "Failed to read image");
      }

      const res = await scanFromImage(base64);

      if (res.success) {
        router.push("/(tabs)/analysis");
      }
    }
  };

  /**
   * ⌨️ Manual Barcode Submit
   */
  const handleBarcodeSubmit = async () => {
    if (!barcode.trim()) {
      return Alert.alert("Enter barcode");
    }

    // 🔹 reuse same API (or create barcode API later)
    const res = await scanFromImage(barcode);

    if (res.success) {
      router.push("/(tabs)/analysis");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#EEF3EC] px-5">
      {/* 🔹 Header */}
      <View className="flex-row justify-between items-center py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#166534" />
        </TouchableOpacity>

        <Text className="text-green-700 font-semibold text-lg">
          Scan Product
        </Text>

        <View />
      </View>

      {/* 🔹 Instruction */}
      <Text className="text-gray-500 text-center mt-4">
        Choose how you want to scan ingredients
      </Text>

      {/* 🔹 Camera Button */}
      <TouchableOpacity
        onPress={takePhoto}
        className="bg-green-600 mt-8 p-6 rounded-2xl items-center"
      >
        <Ionicons name="camera" size={26} color="white" />
        <Text className="text-white mt-2 font-semibold">
          Capture Ingredients
        </Text>
      </TouchableOpacity>

      {/* 🔹 Gallery */}
      <TouchableOpacity
        onPress={pickImage}
        className="bg-white mt-4 p-6 rounded-2xl items-center border border-gray-200"
      >
        <Ionicons name="image-outline" size={24} color="#166534" />
        <Text className="text-gray-700 mt-2 font-medium">
          Upload from Gallery
        </Text>
      </TouchableOpacity>

      {/* 🔹 Barcode Input */}
      <View className="bg-white mt-6 p-5 rounded-2xl border border-gray-200">
        <Text className="text-gray-500 mb-2">Enter Barcode Manually</Text>

        <View className="flex-row items-center">
          <TextInput
            value={barcode}
            onChangeText={setBarcode}
            placeholder="Enter barcode"
            className="flex-1 bg-gray-100 p-3 rounded-lg"
          />

          <TouchableOpacity
            onPress={handleBarcodeSubmit}
            className="ml-2 bg-green-600 px-4 py-3 rounded-lg"
          >
            <MaterialIcons name="send" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔹 Recent */}
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/history")}
        className="bg-white mt-6 p-5 rounded-2xl flex-row items-center justify-between border border-gray-200"
      >
        <View className="flex-row items-center gap-3">
          <Ionicons name="time-outline" size={22} color="#166534" />
          <Text className="text-gray-700 font-medium">View Recent Scans</Text>
        </View>

        <Ionicons name="chevron-forward" size={18} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
