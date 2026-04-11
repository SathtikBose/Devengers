import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useAppStore } from "../../src/store/useAppStore";
import { useAuth } from "../../src/hooks/useAuth";
import { useState } from "react";
import { useRouter } from "expo-router";

/**
 * ⚙️ Settings Screen (FINAL)
 */
export default function SettingsScreen() {
  const router = useRouter();

  const { user, updateUser, logout } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useAppStore();
  const { uploadAvatar } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [allergyInput, setAllergyInput] = useState("");

  /**
   * 📸 Pick Image (Camera + Gallery)
   */
  const pickImage = async () => {
    Alert.alert("Select Image", "Choose option", [
      {
        text: "Camera",
        onPress: async () => {
          const res = await ImagePicker.launchCameraAsync();

          if (!res.canceled) {
            const uri = res.assets[0].uri;

            updateUser({ avatar: uri }); // instant UI
            await uploadAvatar(uri); // backend sync
          }
        },
      },
      {
        text: "Gallery",
        onPress: async () => {
          const res = await ImagePicker.launchImageLibraryAsync();

          if (!res.canceled) {
            const uri = res.assets[0].uri;

            updateUser({ avatar: uri });
            await uploadAvatar(uri);
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  /**
   * 💾 Save Name
   */
  const saveName = () => {
    updateUser({ name });
    Alert.alert("Success", "Name updated");
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
            <TouchableOpacity onPress={pickImage}>
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

              <View className="bg-green-100 px-2 py-1 rounded-full mt-1">
                <Text className="text-green-700 text-xs">PREMIUM MEMBER</Text>
              </View>
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
    </SafeAreaView>
  );
}
