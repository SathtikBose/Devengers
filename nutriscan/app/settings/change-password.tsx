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
import { useRouter } from "expo-router";
import { useState } from "react";
import { useAuth } from "../../src/hooks/useAuth";
import { useToast } from "../../src/hooks/useToast";

/**
 * 🔐 Change Password Screen
 * - Handles password update
 * - Uses hook (no direct API calls)
 */
export default function ChangePasswordScreen() {
  const router = useRouter();
  const { changePassword, loading } = useAuth();
  const toast = useToast();

  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");

  /**
   * 🔹 Submit handler
   */
  const handleSubmit = async () => {
    if (!current || !newPass || !confirm) {
      return toast.error({
        title: "Missing fields",
        message: "Please complete all password fields.",
      });
    }

    if (newPass !== confirm) {
      return toast.error({
        title: "Passwords do not match",
        message: "Enter the same new password in both fields.",
      });
    }

    if (newPass.length < 8) {
      return toast.error({
        title: "Password too short",
        message: "Use at least 8 characters for your new password.",
      });
    }

    const res = await changePassword(current, newPass);

    if (res.success) {
      toast.success({
        title: "Password updated",
        message: "Your account password has been changed successfully.",
      });
      router.back();
    } else {
      toast.error({
        title: "Update failed",
        message: res.message || "Unable to update password right now.",
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
        <View className="flex-row items-center px-5 py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#166534" />
          </TouchableOpacity>

          <Text className="flex-1 text-center text-gray-800 font-semibold text-lg">
            Change Password
          </Text>

          <Text className="text-green-700 font-semibold">NutriScan</Text>
        </View>

        <View className="flex-1 px-6 justify-center">
          {/* 🔹 Title */}
          <View className="items-center mb-6">
            <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center">
              <Feather name="lock" size={28} color="#166534" />
            </View>

            <Text className="text-2xl font-bold mt-4 text-gray-800">
              Secure Your Account
            </Text>

            <Text className="text-gray-500 text-center mt-2 px-4">
              Update your security credentials regularly to maintain privacy.
            </Text>
          </View>

          {/* 🔹 Form */}
          <View className="bg-white rounded-3xl p-5">
            {/* CURRENT PASSWORD */}
            <Label text="CURRENT PASSWORD" />
            <Input
              placeholder="Enter current password"
              value={current}
              onChangeText={setCurrent}
              secure
            />

            {/* NEW PASSWORD */}
            <Label text="NEW PASSWORD" />
            <Input
              value={newPass}
              onChangeText={setNewPass}
              secure
              placeholder="Enter new password"
            />

            {/* CONFIRM */}
            <Label text="CONFIRM NEW PASSWORD" />
            <Input
              value={confirm}
              onChangeText={setConfirm}
              secure
              placeholder="Enter new confirm password"
            />
          </View>

          {/* 🔹 Info */}
          <View className="bg-yellow-50 rounded-2xl p-4 mt-4">
            <Text className="font-semibold text-gray-800">
              Security Standard
            </Text>
            <Text className="text-gray-600 text-sm mt-1">
              Use at least 12 characters, symbols, and numbers.
            </Text>
          </View>

          {/* 🔹 Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className="bg-green-600 rounded-full py-4 mt-6 items-center"
          >
            <Text className="text-white font-semibold">
              {loading ? "Updating..." : "Update Password"}
            </Text>
          </TouchableOpacity>

          {/* 🔹 Forgot */}
          <TouchableOpacity
            onPress={() => router.push("/(auth)/forgot-password")}
            className="items-center mt-4"
          >
            <Text className="text-green-700 font-semibold">
              I forgot my password
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/**
 * 🔹 Label Component
 */
function Label({ text }: { text: string }) {
  return (
    <Text className="text-xs text-gray-400 mt-4 mb-2 tracking-widest">
      {text}
    </Text>
  );
}

/**
 * 🔹 Input Component
 */
function Input({ value, onChangeText, secure }: any) {
  return (
    <View className="bg-[#E6EFE4] rounded-full px-4 py-3 flex-row items-center">
      <Feather name="lock" size={18} color="#6B7280" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secure}
        className="ml-3 flex-1"
      />
    </View>
  );
}
