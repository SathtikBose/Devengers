import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/hooks/useAuth";

/**
 * 🔑 Forgot Password Screen
 * - Collects email
 * - Sends reset request to backend
 */
export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { requestPasswordReset, loading } = useAuth();

  const [email, setEmail] = useState("");

  /**
   * 🔹 Handle Reset
   * Calls backend API to send password reset link
   */
  const handleReset = async () => {
    if (!email.trim()) {
      return Alert.alert("Error", "Please enter your email");
    }

    const res = await requestPasswordReset(email);

    if (res.success) {
      Alert.alert("Success", "Password reset link sent to your email", [
        {
          text: "OK",
          onPress: () => router.push("/(auth)/login"),
        },
      ]);
    } else {
      Alert.alert("Error", res.message || "Failed to send reset link");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#EEF3EC]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        {/* 🔹 Header */}
        <View className="flex-row items-center px-4 py-3">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#166534" />
          </TouchableOpacity>

          <Text className="flex-1 text-center text-green-700 font-semibold text-lg">
            NutriScan
          </Text>

          <View style={{ width: 22 }} />
        </View>

        <View className="flex-1 px-6 justify-center">
          {/* 🔹 Icon + Title */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center">
              <Feather name="unlock" size={28} color="#166534" />
            </View>

            <Text className="text-2xl font-bold mt-4 text-gray-800">
              Recover access
            </Text>

            <Text className="text-gray-500 text-center mt-2 px-4">
              Enter your registered email and we'll send you instructions to
              reset your password.
            </Text>
          </View>

          {/* 🔹 Card */}
          <View className="bg-white rounded-3xl p-6 shadow-sm">
            {/* EMAIL */}
            <Text className="text-xs text-gray-400 mb-2 tracking-widest">
              EMAIL ADDRESS
            </Text>

            <View className="bg-[#E6EFE4] rounded-xl px-4 py-3 flex-row items-center">
              <Feather name="mail" size={18} color="#6B7280" />
              <TextInput
                placeholder="name@example.com"
                value={email}
                onChangeText={setEmail}
                className="ml-3 flex-1 text-gray-800"
                keyboardType="email-address"
              />
            </View>

            {/* 🔹 Button */}
            <TouchableOpacity
              onPress={handleReset}
              disabled={loading}
              className="bg-green-600 rounded-full py-4 mt-6 items-center"
            >
              <Text className="text-white font-semibold text-base">
                {loading ? "Sending..." : "Send Reset Link →"}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="h-[1px] bg-gray-200 my-6" />

            {/* Footer inside card */}
            <View className="items-center">
              <Text className="text-gray-500">
                Remembered it?{" "}
                <Text
                  className="text-green-700 font-semibold"
                  onPress={() => router.push("/(auth)/login")}
                >
                  Sign in instead
                </Text>
              </Text>
            </View>
          </View>

          {/* 🔹 Bottom Footer */}
          <View className="items-center mt-6">
            <Text className="text-gray-400 text-xs tracking-widest text-center">
              © 2024 NUTRISCAN LAB SYSTEMS • PRIVACY SECURED
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
