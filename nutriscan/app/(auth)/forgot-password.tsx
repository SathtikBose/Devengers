import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/hooks/useAuth";
import { useToast } from "../../src/hooks/useToast";

type Step = 1 | 2 | 3;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const toast = useToast();
  const {
    requestPasswordReset,
    verifyPasswordResetCode,
    resetPasswordWithCode,
    loading,
  } = useAuth();

  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedCode = code.trim();

  const handleSendCode = async () => {
    if (!normalizedEmail) {
      return toast.error({
        title: "Email required",
        message: "Enter the email linked to your account.",
      });
    }

    const res = await requestPasswordReset(normalizedEmail);

    if (!res.success) {
      return toast.error({
        title: "Code not sent",
        message: res.message || "Failed to send verification code.",
      });
    }

    setStep(2);
    toast.success({
      title: "Code sent",
      message: "A 6-digit verification code has been sent to your email.",
    });
  };

  const handleVerifyCode = async () => {
    if (!normalizedEmail) {
      return toast.error({
        title: "Email required",
        message: "Enter your email before verifying the code.",
      });
    }

    if (normalizedCode.length !== 6) {
      return toast.error({
        title: "Invalid code",
        message: "Please enter the 6-digit verification code.",
      });
    }

    const res = await verifyPasswordResetCode(normalizedEmail, normalizedCode);

    if (!res.success) {
      return toast.error({
        title: "Verification failed",
        message: res.message || "The verification code could not be confirmed.",
      });
    }

    setStep(3);
    toast.success({
      title: "Code verified",
      message: "You can now create a new password.",
    });
  };

  const handleResetPassword = async () => {
    if (!normalizedEmail || normalizedCode.length !== 6) {
      return toast.error({
        title: "Verification required",
        message: "Enter your email and a valid 6-digit code first.",
      });
    }

    if (!password || !confirmPassword) {
      return toast.error({
        title: "Missing password",
        message: "Enter and confirm your new password.",
      });
    }

    if (password.length < 6) {
      return toast.error({
        title: "Password too short",
        message: "Your password must be at least 6 characters long.",
      });
    }

    if (password !== confirmPassword) {
      return toast.error({
        title: "Passwords do not match",
        message: "Enter the same password in both fields.",
      });
    }

    const res = await resetPasswordWithCode(
      normalizedEmail,
      normalizedCode,
      password,
      confirmPassword,
    );

    if (!res.success) {
      return toast.error({
        title: "Reset failed",
        message: res.message || "Failed to reset password.",
      });
    }

    toast.success({
      title: "Password updated",
      message: "You can now sign in with your new password.",
    });
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#EEF3EC]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-row items-center px-4 py-3">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color="#166534" />
            </TouchableOpacity>

            <Text className="flex-1 text-center text-green-700 font-semibold text-lg">
              NutriScan
            </Text>

            <View style={{ width: 22 }} />
          </View>

          <View className="flex-1 px-6 justify-center pb-8">
            <View className="items-center mb-8">
              <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center">
                <Feather name="shield" size={28} color="#166534" />
              </View>

              <Text className="text-2xl font-bold mt-4 text-gray-800">
                Reset your password
              </Text>

              <Text className="text-gray-500 text-center mt-2 px-4">
                Enter your email, verify the 6-digit code from your inbox, and
                then choose a new password.
              </Text>
            </View>

            <View className="bg-white rounded-3xl p-6 shadow-sm">
              <View className="flex-row items-center justify-between mb-6">
                {[1, 2, 3].map((item) => (
                  <View
                    key={item}
                    className={`h-2 flex-1 rounded-full mx-1 ${
                      step >= item ? "bg-green-600" : "bg-green-100"
                    }`}
                  />
                ))}
              </View>

              <Text className="text-xs text-gray-400 mb-2 tracking-widest">
                STEP {step} OF 3
              </Text>

              <Text className="text-xl font-bold text-gray-800 mb-2">
                {step === 1 && "Send verification code"}
                {step === 2 && "Enter verification code"}
                {step === 3 && "Create new password"}
              </Text>

              <Text className="text-gray-500 mb-5">
                {step === 1 &&
                  "We will send a 6-digit code to the email linked to your account."}
                {step === 2 &&
                  "Enter the code from your email to confirm it is really you."}
                {step === 3 &&
                  "Create and confirm your new password to finish resetting your account."}
              </Text>

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
                  autoCapitalize="none"
                  editable={step === 1}
                />
              </View>

              {step >= 2 ? (
                <>
                  <Text className="text-xs text-gray-400 mb-2 tracking-widest">
                    VERIFICATION CODE
                  </Text>

                  <View className="bg-[#E6EFE4] rounded-xl px-4 py-3 flex-row items-center mb-4">
                    <Feather name="hash" size={18} color="#6B7280" />
                    <TextInput
                      placeholder="6-digit code"
                      value={code}
                      onChangeText={(value) =>
                        setCode(value.replace(/[^0-9]/g, "").slice(0, 6))
                      }
                      className="ml-3 flex-1 text-gray-800"
                      keyboardType="number-pad"
                      editable={step === 2}
                    />
                  </View>
                </>
              ) : null}

              {step === 3 ? (
                <>
                  <Text className="text-xs text-gray-400 mb-2 tracking-widest">
                    NEW PASSWORD
                  </Text>

                  <View className="bg-[#E6EFE4] rounded-xl px-4 py-3 flex-row items-center mb-4">
                    <Feather name="lock" size={18} color="#6B7280" />
                    <TextInput
                      placeholder="Enter new password"
                      value={password}
                      onChangeText={setPassword}
                      className="ml-3 flex-1 text-gray-800"
                      secureTextEntry
                    />
                  </View>

                  <Text className="text-xs text-gray-400 mb-2 tracking-widest">
                    CONFIRM PASSWORD
                  </Text>

                  <View className="bg-[#E6EFE4] rounded-xl px-4 py-3 flex-row items-center mb-1">
                    <Feather name="check-circle" size={18} color="#6B7280" />
                    <TextInput
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      className="ml-3 flex-1 text-gray-800"
                      secureTextEntry
                    />
                  </View>

                  <Text className="text-xs text-gray-400 mt-2">
                    Password must be at least 6 characters.
                  </Text>
                </>
              ) : null}

              {step === 1 ? (
                <TouchableOpacity
                  onPress={handleSendCode}
                  disabled={loading}
                  className="bg-green-600 rounded-full py-4 mt-6 items-center"
                >
                  <Text className="text-white font-semibold text-base">
                    {loading ? "Sending..." : "Send Verification Code"}
                  </Text>
                </TouchableOpacity>
              ) : null}

              {step === 2 ? (
                <>
                  <TouchableOpacity
                    onPress={handleVerifyCode}
                    disabled={loading}
                    className="bg-green-600 rounded-full py-4 mt-6 items-center"
                  >
                    <Text className="text-white font-semibold text-base">
                      {loading ? "Verifying..." : "Verify Code"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleSendCode}
                    disabled={loading}
                    className="py-3 mt-3 items-center"
                  >
                    <Text className="text-green-700 font-semibold">
                      Resend code
                    </Text>
                  </TouchableOpacity>
                </>
              ) : null}

              {step === 3 ? (
                <TouchableOpacity
                  onPress={handleResetPassword}
                  disabled={loading}
                  className="bg-green-600 rounded-full py-4 mt-6 items-center"
                >
                  <Text className="text-white font-semibold text-base">
                    {loading ? "Updating..." : "Update Password"}
                  </Text>
                </TouchableOpacity>
              ) : null}

              <View className="h-[1px] bg-gray-200 my-6" />

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

            <View className="items-center mt-6">
              <Text className="text-gray-400 text-xs tracking-widest text-center">
                © 2024 NUTRISCAN LAB SYSTEMS • PRIVACY SECURED
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
