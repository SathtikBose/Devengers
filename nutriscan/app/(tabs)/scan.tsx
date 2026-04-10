import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useScan } from "../../src/hooks/useScan";

/**
 * 📷 Scan Screen (Base64 Image Scan)
 */
export default function ScanScreen() {
  const router = useRouter();
  const { scanFromImage, loading } = useScan();

  /**
   * 📸 Take Photo → Convert → Send
   */
  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
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
        } else {
          Alert.alert("Error", res.message);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Camera failed");
    }
  };

  /**
   * 🖼️ Pick Image → Convert → Send
   */
  const pickImage = async () => {
    try {
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
        } else {
          Alert.alert("Error", res.message);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Gallery failed");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0F2E1D]">
      {/* 🔹 Header */}
      <View className="flex-row justify-between items-center px-5 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="white" />
        </TouchableOpacity>

        <Text className="text-white font-semibold text-lg">NutriScan</Text>

        <Ionicons name="information-circle-outline" size={22} color="white" />
      </View>

      {/* 🔹 Scanner Frame UI */}
      <View className="flex-1 justify-center items-center">
        <View className="w-72 h-72 border-2 border-green-400 rounded-3xl items-center justify-center">
          <View className="w-full h-[2px] bg-green-400" />
        </View>

        <Text className="text-white/80 mt-6 text-sm">
          Center the nutritional facts in the frame
        </Text>
      </View>

      {/* 🔹 Controls */}
      <View className="flex-row justify-between items-center px-10 mb-10">
        {/* Gallery */}
        <TouchableOpacity onPress={pickImage} className="items-center">
          <View className="bg-black/40 p-4 rounded-full">
            <Ionicons name="image-outline" size={22} color="white" />
          </View>
          <Text className="text-white text-xs mt-2">UPLOAD</Text>
        </TouchableOpacity>

        {/* Camera Button */}
        <TouchableOpacity
          onPress={takePhoto}
          disabled={loading}
          className="bg-white p-6 rounded-full"
        >
          <MaterialIcons name="qr-code-scanner" size={28} color="#166534" />
        </TouchableOpacity>

        {/* History */}
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/history")}
          className="items-center"
        >
          <View className="bg-black/40 p-4 rounded-full">
            <Ionicons name="time-outline" size={22} color="white" />
          </View>
          <Text className="text-white text-xs mt-2">RECENT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
