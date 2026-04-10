import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useScan } from "../../src/hooks/useScan";

/**
 * 📷 REAL Scan Screen
 */
export default function ScanScreen() {
  const router = useRouter();
  const { scan } = useScan();

  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<"off" | "on">("off");

  /**
   * 🔹 Handle Barcode Scan
   */
  const handleScan = async ({ data }: any) => {
    const res = await scan(data);

    if (res.success) {
      router.push("/(tabs)/analysis");
    }
  };

  /**
   * 🔹 Pick Image
   */
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      Alert.alert("Image selected (mock scan)");
      await scan("mock-barcode");
      router.push("/(tabs)/analysis");
    }
  };

  /**
   * 🔹 Permission Handling
   */
  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Camera permission required</Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-green-600 px-4 py-2 mt-4 rounded"
        >
          <Text className="text-white">Allow Camera</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* 🔹 Camera */}
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        enableTorch={flash === "on"}
        onBarcodeScanned={handleScan}
      />

      {/* 🔹 Overlay UI */}
      <View className="absolute top-0 left-0 right-0 bottom-0 justify-between">
        {/* Header */}
        <View className="flex-row justify-between px-5 py-5">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <Text className="text-white font-semibold text-lg">NutriScan</Text>

          <TouchableOpacity
            onPress={() => setFlash(flash === "on" ? "off" : "on")}
          >
            <Ionicons
              name={flash === "on" ? "flash" : "flash-off"}
              size={22}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {/* Bottom Controls */}
        <View className="flex-row justify-between items-center px-10 mb-10">
          {/* Gallery */}
          <TouchableOpacity onPress={pickImage} className="items-center">
            <View className="bg-black/50 p-4 rounded-full">
              <Ionicons name="image-outline" size={20} color="white" />
            </View>
            <Text className="text-white text-xs mt-2">UPLOAD</Text>
          </TouchableOpacity>

          {/* Scan Button */}
          <TouchableOpacity className="bg-white p-6 rounded-full">
            <MaterialIcons name="qr-code-scanner" size={28} color="#166534" />
          </TouchableOpacity>

          {/* Recent */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/history")}
            className="items-center"
          >
            <View className="bg-black/50 p-4 rounded-full">
              <Ionicons name="time-outline" size={20} color="white" />
            </View>
            <Text className="text-white text-xs mt-2">RECENT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
