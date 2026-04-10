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
import { useState } from "react";

/**
 * ⚙️ Fully Functional Settings Screen
 */
export default function SettingsScreen() {
  const { user, updateUser } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useAppStore();

  const [name, setName] = useState(user?.name || "");
  const [allergyInput, setAllergyInput] = useState("");

  /**
   * 📸 Pick Image
   */
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      updateUser({ avatar: result.assets[0].uri });
    }
  };

  /**
   * ➕ Add Allergy
   */
  const addAllergy = () => {
    if (!allergyInput) return;

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
      <ScrollView>
        {/* 🔹 Profile */}
        <View className="items-center mt-6">
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={{
                uri:
                  user?.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
              }}
              className="w-24 h-24 rounded-full"
            />
          </TouchableOpacity>

          <TextInput
            value={name}
            onChangeText={setName}
            onBlur={() => updateUser({ name })}
            className="text-xl font-bold mt-4 text-center"
          />

          <Text className="text-gray-500">{user?.email}</Text>
        </View>

        {/* 🔹 Diet Type */}
        <View className="mx-5 mt-6 bg-white p-5 rounded-2xl">
          <Text className="mb-2">Diet Type</Text>

          {["Vegetarian", "Vegan", "Keto"].map((diet) => (
            <TouchableOpacity
              key={diet}
              onPress={() => updateUser({ diet })}
              className={`p-3 rounded-lg mt-2 ${
                user?.diet === diet ? "bg-green-200" : "bg-gray-100"
              }`}
            >
              <Text>{diet}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 🔹 Allergies */}
        <View className="mx-5 mt-6 bg-white p-5 rounded-2xl">
          <Text>Add Allergy</Text>

          <View className="flex-row mt-2">
            <TextInput
              value={allergyInput}
              onChangeText={setAllergyInput}
              className="flex-1 bg-gray-100 p-2 rounded"
            />
            <TouchableOpacity
              onPress={addAllergy}
              className="ml-2 bg-green-600 px-4 justify-center rounded"
            >
              <Text className="text-white">Add</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap mt-3 gap-2">
            {user?.allergies?.map((item: string) => (
              <TouchableOpacity
                key={item}
                onPress={() => removeAllergy(item)}
                className="bg-red-100 px-3 py-1 rounded-full"
              >
                <Text>{item} ✕</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 🔹 Dark Mode */}
        <View className="mx-5 mt-6 bg-white p-5 rounded-2xl flex-row justify-between">
          <Text>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
