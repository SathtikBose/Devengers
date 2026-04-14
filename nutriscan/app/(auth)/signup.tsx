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
import { useToast } from "../../src/hooks/useToast";

/**
 * 🧾 Signup Screen
 * - Creates new user account
 * - Uses useAuth hook
 * - Validates passwords
 */
export default function SignupScreen() {
  const router = useRouter();
  const { handleSignup, loading } = useAuth();
  const toast = useToast();

  // 🔹 Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [secure1, setSecure1] = useState(true);
  const [secure2, setSecure2] = useState(true);

  /**
   * 🔹 Handle Signup
   */
  const onSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      return toast.error({
        title: "Missing fields",
        message: "Please fill in all the required account details.",
      });
    }

    if (password !== confirmPassword) {
      return toast.error({
        title: "Passwords do not match",
        message: "Enter the same password in both fields.",
      });
    }

    const res = await handleSignup(name, email, password);

    if (res.success) {
      router.replace("/(tabs)/dashboard");
    } else {
      toast.error({
        title: "Signup failed",
        message: res.message || "We could not create your account right now.",
      });
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
          {/* 🔹 Title Section */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center">
              <Feather name="user-plus" size={28} color="#166534" />
            </View>

            <Text className="text-2xl font-bold mt-4 text-gray-800">
              Join the Lab
            </Text>

            <Text className="text-gray-500 text-center mt-2">
              Start your journey toward clinical precision in nutrition.
            </Text>
          </View>

          {/* 🔹 Form */}
          <View className="space-y-4">
            {/* FULL NAME */}
            <Text className="text-xs text-gray-400 tracking-widest">
              FULL NAME
            </Text>

            <View className="bg-[#E6EFE4] rounded-full px-4 py-3 flex-row items-center">
              <Feather name="user" size={18} color="#6B7280" />
              <TextInput
                placeholder="Dr. Julian Reed"
                value={name}
                onChangeText={setName}
                className="ml-3 flex-1 text-gray-800"
              />
            </View>

            {/* EMAIL */}
            <Text className="text-xs text-gray-400 tracking-widest">
              EMAIL ADDRESS
            </Text>

            <View className="bg-[#E6EFE4] rounded-full px-4 py-3 flex-row items-center">
              <Feather name="mail" size={18} color="#6B7280" />
              <TextInput
                placeholder="Enter email"
                value={email}
                onChangeText={setEmail}
                className="ml-3 flex-1 text-gray-800"
                keyboardType="email-address"
              />
            </View>

            {/* PASSWORD */}
            <Text className="text-xs text-gray-400 tracking-widest">
              PASSWORD
            </Text>

            <View className="bg-[#E6EFE4] rounded-full px-4 py-3 flex-row items-center">
              <Feather name="lock" size={18} color="#6B7280" />
              <TextInput
                placeholder="Enter password"
                secureTextEntry={secure1}
                value={password}
                onChangeText={setPassword}
                className="ml-3 flex-1 text-gray-800"
              />

              <TouchableOpacity onPress={() => setSecure1(!secure1)}>
                <Ionicons
                  name={secure1 ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            {/* CONFIRM PASSWORD */}
            <Text className="text-xs text-gray-400 tracking-widest">
              CONFIRM PASSWORD
            </Text>

            <View className="bg-[#E6EFE4] rounded-full px-4 py-3 flex-row items-center">
              <Feather name="shield" size={18} color="#6B7280" />
              <TextInput
                placeholder="Enter password"
                secureTextEntry={secure2}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                className="ml-3 flex-1 text-gray-800"
              />

              <TouchableOpacity onPress={() => setSecure2(!secure2)}>
                <Ionicons
                  name={secure2 ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            {/* 🔹 Submit Button */}
            <TouchableOpacity
              onPress={onSignup}
              disabled={loading}
              className="bg-green-600 rounded-full py-4 mt-6 items-center"
            >
              <Text className="text-white font-semibold text-base">
                {loading ? "Creating..." : "Create Account →"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 🔹 Footer */}
          <View className="items-center mt-6">
            <Text className="text-gray-500">
              Already a member?{" "}
              <Text
                className="text-green-700 font-semibold"
                onPress={() => router.push("/(auth)/login")}
              >
                Sign In
              </Text>
            </Text>

            <Text className="text-gray-400 text-xs text-center mt-4">
              By creating an account, you agree to our Terms of Service and
              Privacy Policy. Data encryption is active.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
