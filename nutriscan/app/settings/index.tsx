import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
  TextInput,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useAppStore } from "../../src/store/useAppStore";
import { useAuth } from "../../src/hooks/useAuth";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useToast } from "../../src/hooks/useToast";

/**
 * ⚙️ Settings Screen (FINAL)
 */
export default function SettingsScreen() {
  const router = useRouter();

  const { user, updateUser, logout } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useAppStore();
  const { uploadAvatar } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(user?.name || "");
  const [allergyInput, setAllergyInput] = useState("");
  const [imagePickerVisible, setImagePickerVisible] = useState(false);

  /**
   * 📸 Pick Image (Camera + Gallery)
   */
  const syncAvatar = async (uri: string) => {
    updateUser({ avatar: uri });

    const res = await uploadAvatar(uri);

    if (!res.success) {
      toast.error({
        title: "Upload failed",
        message: res.message || "We could not update your profile photo.",
      });
      return;
    }

    toast.success({
      title: "Photo updated",
      message: "Your profile photo has been updated.",
    });
  };

  const openCamera = async () => {
    setImagePickerVisible(false);
    const res = await ImagePicker.launchCameraAsync();

    if (!res.canceled) {
      await syncAvatar(res.assets[0].uri);
    }
  };

  const openGallery = async () => {
    setImagePickerVisible(false);
    const res = await ImagePicker.launchImageLibraryAsync();

    if (!res.canceled) {
      await syncAvatar(res.assets[0].uri);
    }
  };

  /**
   * 💾 Save Name
   */
  const saveName = () => {
    updateUser({ name });
    toast.success({
      title: "Profile updated",
      message: "Your display name has been updated.",
    });
  };

  /**
   * ➕ Add Allergy
   */
  const addAllergy = () => {
    if (!allergyInput.trim()) return;

    const updated = [...(user?.allergies || []), allergyInput];
    updateUser({ allergies: updated });
    setAllergyInput("");
  };

  /**
   * ❌ Remove Allergy
   */
  const removeAllergy = (item: string) => {
    const updated = user?.allergies?.filter((a) => a !== item);
    updateUser({ allergies: updated });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#EEF3EC]">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🔹 Header */}
        <View className="flex-row items-center justify-between px-5 py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#166534" />
          </TouchableOpacity>

          <Text className="text-green-700 font-semibold text-lg">Settings</Text>

          <Image
            source={{
              uri:
                user?.avatar ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            }}
            className="w-8 h-8 rounded-full"
          />
        </View>

        {/* 🔹 Account */}
        <View className="mx-5 bg-white rounded-3xl p-5 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => setImagePickerVisible(true)}>
              <Image
                source={{
                  uri:
                    user?.avatar ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                }}
                className="w-16 h-16 rounded-full"
              />
            </TouchableOpacity>

            <View>
              <TextInput
                value={name}
                onChangeText={setName}
                className="font-semibold text-gray-800"
              />
              <Text className="text-gray-500 text-sm">{user?.email}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={saveName}>
            <Ionicons name="checkmark" size={22} color="#166534" />
          </TouchableOpacity>
        </View>

        {/* 🔹 Preferences */}
        <Text className="px-5 mt-6 text-gray-400 text-xs">PREFERENCES</Text>

        <View className="mx-5 mt-2 bg-white rounded-3xl p-5">
          {/* Diet */}
          <Text className="text-gray-500 mb-2">Diet Type</Text>

          {["Vegetarian", "Vegan", "Keto"].map((diet) => (
            <TouchableOpacity
              key={diet}
              onPress={() => updateUser({ diet })}
              className={`p-3 rounded-xl mt-2 ${
                user?.diet === diet ? "bg-green-100" : "bg-gray-100"
              }`}
            >
              <Text>{diet}</Text>
            </TouchableOpacity>
          ))}

          {/* Allergies */}
          <Text className="text-gray-500 mt-4 mb-2">Allergies</Text>

          <View className="flex-row flex-wrap gap-2">
            {user?.allergies?.map((item: string) => (
              <TouchableOpacity
                key={item}
                onPress={() => removeAllergy(item)}
                className="bg-red-100 px-3 py-1 rounded-full"
              >
                <Text className="text-red-600 text-xs">{item} ✕</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Add Allergy */}
          <View className="flex-row mt-3">
            <TextInput
              value={allergyInput}
              onChangeText={setAllergyInput}
              placeholder="Add new allergy"
              className="flex-1 bg-gray-100 p-2 rounded"
            />
            <TouchableOpacity
              onPress={addAllergy}
              className="ml-2 bg-green-600 px-4 justify-center rounded"
            >
              <Text className="text-white">Add</Text>
            </TouchableOpacity>
          </View>

          {/* Notifications */}
          <View className="flex-row justify-between items-center mt-5">
            <Text>Push Notifications</Text>
            <Switch value={true} />
          </View>
        </View>

        {/* 🔹 App Settings */}
        <View className="mx-5 mt-6 bg-white rounded-3xl p-5 flex-row justify-between">
          <Text>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
        </View>

        {/* 🔹 Security */}
        <View className="mx-5 mt-6 bg-white rounded-3xl p-4">
          <TouchableOpacity
            onPress={() => router.push("/settings/change-password")}
            className="flex-row justify-between py-3"
          >
            <Text>Change Password</Text>
            <Ionicons name="chevron-forward" size={18} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={logout}
            className="flex-row justify-between py-3"
          >
            <Text className="text-red-600">Logout</Text>
            <Ionicons name="log-out-outline" size={18} color="red" />
          </TouchableOpacity>
        </View>

        {/* 🔹 Danger Zone */}
        <View className="mx-5 mt-6 bg-red-50 rounded-3xl p-5">
          <Text className="text-red-600 font-semibold">Danger Zone</Text>

          <Text className="text-red-400 text-sm mt-2">
            Once deleted, your account cannot be recovered.
          </Text>

          <TouchableOpacity className="bg-red-600 rounded-full py-4 mt-4 items-center">
            <Text className="text-white font-semibold">Delete Account</Text>
          </TouchableOpacity>
        </View>

        <View className="h-24" />
      </ScrollView>

      <Modal
        visible={imagePickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImagePickerVisible(false)}
      >
        <Pressable
          className="flex-1 justify-end bg-black/40"
          onPress={() => setImagePickerVisible(false)}
        >
          <Pressable className="rounded-t-3xl bg-white px-5 pb-8 pt-5">
            <Text className="text-lg font-semibold text-gray-900">
              Update profile photo
            </Text>
            <Text className="mt-1 text-sm text-gray-500">
              Choose where you want to pick your photo from.
            </Text>

            <TouchableOpacity
              onPress={openCamera}
              className="mt-5 rounded-2xl bg-[#E6EFE4] px-4 py-4"
            >
              <Text className="font-semibold text-gray-800">Use Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={openGallery}
              className="mt-3 rounded-2xl bg-[#E6EFE4] px-4 py-4"
            >
              <Text className="font-semibold text-gray-800">
                Choose from Gallery
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setImagePickerVisible(false)}
              className="mt-3 rounded-2xl bg-gray-100 px-4 py-4"
            >
              <Text className="font-semibold text-gray-600">Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
