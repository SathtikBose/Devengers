import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/hooks/useAuth";

/**
 * 🔐 Login Screen
 * - Handles user authentication
 * - Uses useAuth hook (no direct API calls)
 */
export default function LoginScreen() {
  const router = useRouter();
  const { handleLogin, loading } = useAuth();

  // 🔹 Local state for form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);

  /**
   * 🔹 Submit handler
   * Calls login hook and redirects on success
   */
  const onLogin = async () => {
    if (!email || !password) return;

    const res = await handleLogin(email, password);

    if (res.success) {
      router.replace("/(tabs)/dashboard");
    } else {
      alert(res.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#EEF3EC]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6">
          {/* 🔹 Logo + Title */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-green-700 rounded-full items-center justify-center">
              <Text className="text-white font-bold">NutriScan</Text>
            </View>

            <Text className="text-3xl font-bold mt-4 text-gray-800">
              NutriScan
            </Text>

            <Text className="text-gray-500 mt-2 text-center">
              Your intelligent nutritional companion
            </Text>
          </View>

          {/* 🔹 Card */}
          <View className="bg-white rounded-3xl p-6 shadow-sm">
            {/* EMAIL */}
            <Text className="text-xs text-gray-400 mb-2 tracking-widest">
              EMAIL ADDRESS
            </Text>

            <View className="bg-[#E6EFE4] rounded-xl px-4 py-3 flex-row items-center mb-4">
              <Feather name="mail" size={18} color="#6B7280" />
              <TextInput
                placeholder="name@example.com"
                value={email}
                onChangeText={setEmail}
                className="ml-3 flex-1 text-gray-800"
                keyboardType="email-address"
              />
            </View>

            {/* PASSWORD */}
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-xs text-gray-400 tracking-widest">
                PASSWORD
              </Text>

              <TouchableOpacity
                onPress={() => router.push("/(auth)/forgot-password")}
              >
                <Text className="text-green-700 text-xs font-semibold">
                  FORGOT?
                </Text>
              </TouchableOpacity>
            </View>

            <View className="bg-[#E6EFE4] rounded-xl px-4 py-3 flex-row items-center">
              <Feather name="lock" size={18} color="#6B7280" />

              <TextInput
                placeholder="••••••••"
                secureTextEntry={secure}
                value={password}
                onChangeText={setPassword}
                className="ml-3 flex-1 text-gray-800"
              />

              {/* Toggle visibility */}
              <TouchableOpacity onPress={() => setSecure(!secure)}>
                <Ionicons
                  name={secure ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            {/* 🔹 Login Button */}
            <TouchableOpacity
              onPress={onLogin}
              disabled={loading}
              className="bg-green-600 rounded-full py-4 mt-6 items-center"
            >
              <Text className="text-white font-semibold text-base">
                {loading ? "Logging in..." : "Login →"}
              </Text>
            </TouchableOpacity>

            {/* 🔍 Demo Hint */}
            <View className="bg-blue-50 p-3 rounded-lg mt-4 border border-blue-200">
              <Text className="text-blue-700 text-xs">
                <Text className="font-semibold">💡 Demo Mode:</Text> Login with
                any credentials.
              </Text>
            </View>

            {/* Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-[1px] bg-gray-200" />
              <Text className="mx-3 text-xs text-gray-400">
                OR CONTINUE WITH
              </Text>
              <View className="flex-1 h-[1px] bg-gray-200" />
            </View>

            {/* Social Buttons */}
            <View className="flex-row justify-between">
              <TouchableOpacity className="flex-1 bg-gray-100 py-3 rounded-xl items-center mr-2">
                <Text className="text-gray-700">Google</Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-1 bg-gray-100 py-3 rounded-xl items-center ml-2">
                <Text className="text-gray-700">Apple</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 🔹 Footer */}
          <View className="mt-6 items-center">
            <Text className="text-gray-500">
              New to NutriScan?{" "}
              <Text
                className="text-green-700 font-semibold"
                onPress={() => router.push("/(auth)/signup")}
              >
                Create an account
              </Text>
            </Text>

            <Text className="text-gray-400 text-xs mt-4 tracking-widest">
              PRECISION HEALTH TECHNOLOGY • 2024
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
