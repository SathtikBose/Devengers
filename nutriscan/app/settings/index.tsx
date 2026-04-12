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
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useAppStore } from "../../src/store/useAppStore";
import { useAuth } from "../../src/hooks/useAuth";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useToast } from "../../src/hooks/useToast";
import { fetchProfileApi, patchProfileApi } from "../../src/api/user.api";
import { ENV } from "../../src/config/env";

const AVATAR_FALLBACK =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

/** Must match backend `diet` string values. */
const DIET_OPTIONS = [
  {
    key: "Balanced",
    label: "Normal / Balanced",
    line: "A standard, balanced diet with no specific restrictions.",
  },
  {
    key: "Vegetarian",
    label: "Vegetarian",
    line: "No meat or fish; eggs and dairy are still on the menu.",
  },
  {
    key: "Vegan",
    label: "Vegan",
    line: "Only plants—no meat, dairy, eggs, or honey.",
  },
  {
    key: "Keto",
    label: "Keto",
    line: "Very low carbs and higher fat so your body can run on ketones.",
  },
  {
    key: "Pescatarian",
    label: "Pescatarian",
    line: "Vegetarian diet that includes fish and other seafood.",
  },
] as const;

export default function SettingsScreen() {
  const router = useRouter();
  const { user, updateUser, token } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useAppStore();
  const { uploadAvatar } = useAuth();
  const toast = useToast();

  const [nameDraft, setNameDraft] = useState(user?.name || "");
  const [ageDraft, setAgeDraft] = useState(
    user?.age != null ? String(user.age) : "",
  );
  const [editingName, setEditingName] = useState(false);
  const [editingAge, setEditingAge] = useState(false);
  const [allergyInput, setAllergyInput] = useState("");
  const [imagePickerVisible, setImagePickerVisible] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [savingAge, setSavingAge] = useState(false);
  const [savingDiet, setSavingDiet] = useState<string | null>(null);
  const [allergyBusy, setAllergyBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!editingName) setNameDraft(user?.name || "");
  }, [user?.name, editingName]);

  useEffect(() => {
    if (!editingAge) setAgeDraft(user?.age != null ? String(user.age) : "");
  }, [user?.age, editingAge]);

  const refreshProfile = useCallback(async () => {
    if (!token || ENV.USE_MOCK) return;
    setRefreshing(true);
    try {
      const profile = await fetchProfileApi();
      updateUser(profile);
    } catch {
      toast.error({
        title: "Could not refresh",
        message: "Check your connection and try the refresh icon.",
      });
    } finally {
      setRefreshing(false);
    }
  }, [token, updateUser, toast]);

  useFocusEffect(
    useCallback(() => {
      refreshProfile();
    }, [refreshProfile]),
  );

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
      message: "Your profile photo has been saved.",
    });
  };

  const openCamera = async () => {
    setImagePickerVisible(false);
    const res = await ImagePicker.launchCameraAsync();
    if (!res.canceled) await syncAvatar(res.assets[0].uri);
  };

  const openGallery = async () => {
    setImagePickerVisible(false);
    const res = await ImagePicker.launchImageLibraryAsync();
    if (!res.canceled) await syncAvatar(res.assets[0].uri);
  };

  const saveName = async () => {
    const trimmed = nameDraft.trim();
    if (!trimmed) {
      toast.error({
        title: "Name required",
        message: "Enter a display name before saving.",
      });
      return;
    }
    if (savingName) return;
    setSavingName(true);
    try {
      if (ENV.USE_MOCK) {
        updateUser({ name: trimmed });
        setEditingName(false);
        Keyboard.dismiss();
        toast.success({ title: "Saved", message: "Your name was updated." });
        return;
      }
      const data = await patchProfileApi({ name: trimmed });
      updateUser(data);
      setEditingName(false);
      Keyboard.dismiss();
      toast.success({ title: "Saved", message: "Your name is synced." });
    } catch {
      toast.error({
        title: "Save failed",
        message: "We could not update your name. Try again.",
      });
    } finally {
      setSavingName(false);
    }
  };

  const saveAge = async () => {
    const raw = ageDraft.trim();
    const payload: { age: number | null } = { age: null };
    if (raw !== "") {
      const n = Number(raw);
      if (Number.isNaN(n) || n < 1 || n > 130) {
        toast.error({
          title: "Invalid age",
          message: "Enter a number between 1 and 130, or leave blank to clear.",
        });
        return;
      }
      payload.age = n;
    }
    if (savingAge) return;
    setSavingAge(true);
    try {
      if (ENV.USE_MOCK) {
        updateUser({ age: payload.age });
        setEditingAge(false);
        Keyboard.dismiss();
        toast.success({ title: "Saved", message: "Your age was updated." });
        return;
      }
      const data = await patchProfileApi({ age: payload.age });
      updateUser(data);
      setEditingAge(false);
      Keyboard.dismiss();
      toast.success({ title: "Saved", message: "Your age is synced." });
    } catch {
      toast.error({
        title: "Save failed",
        message: "We could not update your age. Try again.",
      });
    } finally {
      setSavingAge(false);
    }
  };

  const addAllergy = async () => {
    const next = allergyInput.trim();
    if (!next) return;
    if (user?.allergies?.some((a) => a.toLowerCase() === next.toLowerCase())) {
      toast.info({
        title: "Already listed",
        message: "That allergy is already on your profile.",
      });
      return;
    }
    const updated = [...(user?.allergies || []), next];
    setAllergyBusy(true);
    try {
      if (ENV.USE_MOCK) {
        updateUser({ allergies: updated });
        setAllergyInput("");
        toast.success({ title: "Added", message: "Allergy saved." });
        return;
      }
      const data = await patchProfileApi({ allergies: updated });
      updateUser(data);
      setAllergyInput("");
      toast.success({ title: "Added", message: "Synced to your account." });
    } catch {
      toast.error({
        title: "Could not add",
        message: "Try again in a moment.",
      });
    } finally {
      setAllergyBusy(false);
    }
  };

  const removeAllergy = async (item: string) => {
    const updated = user?.allergies?.filter((a) => a !== item) || [];
    setAllergyBusy(true);
    try {
      if (ENV.USE_MOCK) {
        updateUser({ allergies: updated });
        toast.success({ title: "Removed", message: `${item} removed.` });
        return;
      }
      const data = await patchProfileApi({ allergies: updated });
      updateUser(data);
      toast.success({ title: "Removed", message: "Synced to your account." });
    } catch {
      toast.error({
        title: "Could not remove",
        message: "Try again in a moment.",
      });
    } finally {
      setAllergyBusy(false);
    }
  };

  const selectDiet = async (diet: string) => {
    if (savingDiet) return;
    setSavingDiet(diet);
    try {
      if (ENV.USE_MOCK) {
        updateUser({ diet });
        toast.success({
          title: "Diet updated",
          message: `${diet} is now your preference.`,
        });
        return;
      }
      const data = await patchProfileApi({ diet });
      updateUser(data);
      toast.success({
        title: "Diet updated",
        message: "Saved to your NutriScan profile.",
      });
    } catch {
      toast.error({
        title: "Could not save",
        message: "Try selecting your diet again.",
      });
    } finally {
      setSavingDiet(null);
    }
  };

  const avatarUri =
    user?.avatar && String(user.avatar).trim() !== ""
      ? String(user.avatar)
      : AVATAR_FALLBACK;

  return (
    <SafeAreaView className="flex-1 bg-[#EEF3EC]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between px-5 py-4">
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="arrow-back" size={22} color="#166534" />
          </TouchableOpacity>

          <Text className="text-green-700 font-semibold text-lg">Settings</Text>

          <TouchableOpacity onPress={refreshProfile} disabled={refreshing}>
            {refreshing ? (
              <ActivityIndicator size="small" color="#166534" />
            ) : (
              <Ionicons name="refresh-outline" size={22} color="#166534" />
            )}
          </TouchableOpacity>
        </View>

        <Text className="px-5 text-gray-500 text-sm mb-2">
          Tap the pencil to edit. Changes save to your account.
        </Text>

        {/* Profile photo */}
        <View className="mx-5 bg-white rounded-3xl p-5 items-center">
          <TouchableOpacity onPress={() => setImagePickerVisible(true)}>
            <Image
              source={{ uri: avatarUri }}
              className="w-24 h-24 rounded-full bg-gray-100"
            />
            <View className="absolute bottom-0 right-0 bg-green-600 rounded-full p-2 border-2 border-white">
              <Ionicons name="camera" size={16} color="white" />
            </View>
          </TouchableOpacity>
          <Text className="text-gray-500 text-xs mt-3">Tap photo to change</Text>
        </View>

        {/* Name & age */}
        <View className="mx-5 mt-4 bg-white rounded-3xl p-5">
          <Text className="text-gray-400 text-xs font-semibold tracking-wide">
            YOUR DETAILS
          </Text>

          <View className="mt-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-500 text-sm">Name</Text>
              {!editingName ? (
                <TouchableOpacity
                  onPress={() => {
                    setNameDraft(user?.name || "");
                    setEditingName(true);
                  }}
                  hitSlop={8}
                  accessibilityLabel="Edit name"
                >
                  <Ionicons name="pencil" size={20} color="#166534" />
                </TouchableOpacity>
              ) : (
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    onPress={() => {
                      setEditingName(false);
                      setNameDraft(user?.name || "");
                      Keyboard.dismiss();
                    }}
                    hitSlop={8}
                  >
                    <Text className="text-gray-500 text-sm">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={saveName}
                    disabled={savingName}
                    hitSlop={8}
                    accessibilityLabel="Save name"
                  >
                    {savingName ? (
                      <ActivityIndicator size="small" color="#166534" />
                    ) : (
                      <Ionicons name="checkmark-circle" size={26} color="#166534" />
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
            {editingName ? (
              <TextInput
                value={nameDraft}
                onChangeText={setNameDraft}
                placeholder="Your display name"
                autoFocus
                className="mt-2 border border-green-200 bg-green-50/50 rounded-xl px-4 py-3 text-gray-900 text-base"
                returnKeyType="done"
                onSubmitEditing={saveName}
              />
            ) : (
              <Text className="text-gray-900 text-lg font-semibold mt-1">
                {user?.name || "—"}
              </Text>
            )}
          </View>

          <View className="border-t border-gray-100 mt-5 pt-5">
            <Text className="text-gray-500 text-sm">Email</Text>
            <Text className="text-gray-800 mt-1">{user?.email || "—"}</Text>
            <Text className="text-gray-400 text-xs mt-1">
              Email cannot be changed here.
            </Text>
          </View>

          <View className="border-t border-gray-100 mt-5 pt-5">
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-500 text-sm">Age</Text>
              {!editingAge ? (
                <TouchableOpacity
                  onPress={() => {
                    setAgeDraft(
                      user?.age != null ? String(user.age) : "",
                    );
                    setEditingAge(true);
                  }}
                  hitSlop={8}
                  accessibilityLabel="Edit age"
                >
                  <Ionicons name="pencil" size={20} color="#166534" />
                </TouchableOpacity>
              ) : (
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    onPress={() => {
                      setEditingAge(false);
                      setAgeDraft(
                        user?.age != null ? String(user.age) : "",
                      );
                      Keyboard.dismiss();
                    }}
                    hitSlop={8}
                  >
                    <Text className="text-gray-500 text-sm">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={saveAge}
                    disabled={savingAge}
                    hitSlop={8}
                    accessibilityLabel="Save age"
                  >
                    {savingAge ? (
                      <ActivityIndicator size="small" color="#166534" />
                    ) : (
                      <Ionicons name="checkmark-circle" size={26} color="#166534" />
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
            {editingAge ? (
              <TextInput
                value={ageDraft}
                onChangeText={setAgeDraft}
                placeholder="Years (optional)"
                keyboardType="number-pad"
                autoFocus
                className="mt-2 border border-green-200 bg-green-50/50 rounded-xl px-4 py-3 text-gray-900 text-base"
                returnKeyType="done"
                onSubmitEditing={saveAge}
              />
            ) : (
              <Text className="text-gray-900 text-lg font-semibold mt-1">
                {user?.age != null ? String(user.age) : "Not set"}
              </Text>
            )}
            <Text className="text-gray-400 text-xs mt-2">
              Clear the field when editing and save to remove your age.
            </Text>
          </View>
        </View>

        {/* Diet */}
        <Text className="px-5 mt-6 text-gray-400 text-xs font-semibold tracking-wide">
          DIET TYPE
        </Text>
        <Text className="px-5 mt-1 text-gray-500 text-sm">
          Pick one so scans and tips can match how you eat.
        </Text>

        <View className="mx-5 mt-3 gap-3">
          {DIET_OPTIONS.map((opt) => {
            const selected = user?.diet === opt.key;
            const busy = savingDiet === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                onPress={() => selectDiet(opt.key)}
                disabled={!!savingDiet}
                className={`rounded-2xl p-4 border-2 ${
                  selected
                    ? "bg-green-50 border-green-600"
                    : "bg-white border-gray-100"
                }`}
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-3">
                    <Text
                      className={`font-semibold text-base ${
                        selected ? "text-green-900" : "text-gray-900"
                      }`}
                    >
                      {opt.label}
                    </Text>
                    <Text className="text-gray-500 text-sm mt-1 leading-5">
                      {opt.line}
                    </Text>
                  </View>
                  {busy ? (
                    <ActivityIndicator size="small" color="#166534" />
                  ) : selected ? (
                    <Ionicons name="checkmark-circle" size={24} color="#166534" />
                  ) : (
                    <View className="w-6 h-6 rounded-full border-2 border-gray-300" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Allergies */}
        <Text className="px-5 mt-6 text-gray-400 text-xs font-semibold tracking-wide">
          ALLERGIES
        </Text>
        <Text className="px-5 mt-1 text-gray-500 text-sm">
          Add ingredients you must avoid; tap the ✕ on a chip to remove it.
        </Text>

        <View className="mx-5 mt-3 bg-white rounded-3xl p-5">
          <View className="flex-row flex-wrap gap-2 min-h-[28px]">
            {user?.allergies && user.allergies.length > 0 ? (
              user.allergies.map((item) => (
                <View
                  key={item}
                  className="flex-row items-center bg-amber-50 border border-amber-200 pl-3 pr-1 py-1.5 rounded-full"
                >
                  <Text className="text-amber-900 text-sm">{item}</Text>
                  <TouchableOpacity
                    onPress={() => removeAllergy(item)}
                    disabled={allergyBusy}
                    className="ml-1 p-1"
                    accessibilityLabel={`Remove allergy ${item}`}
                    hitSlop={6}
                  >
                    <Ionicons name="close-circle" size={22} color="#b45309" />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text className="text-gray-400 text-sm">No allergies listed yet.</Text>
            )}
          </View>

          <View className="flex-row mt-4 items-stretch">
            <TextInput
              value={allergyInput}
              onChangeText={setAllergyInput}
              placeholder="e.g. Peanuts, Shellfish"
              editable={!allergyBusy}
              className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-gray-900"
              onSubmitEditing={addAllergy}
              returnKeyType="done"
            />
            <TouchableOpacity
              onPress={addAllergy}
              disabled={allergyBusy || !allergyInput.trim()}
              className="ml-2 bg-green-600 rounded-xl px-5 justify-center opacity-100"
              style={{
                opacity: allergyBusy || !allergyInput.trim() ? 0.5 : 1,
              }}
            >
              <Text className="text-white font-semibold">Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App */}
        <View className="mx-5 mt-6 bg-white rounded-3xl p-5 flex-row justify-between items-center">
          <View>
            <Text className="text-gray-900 font-medium">Dark mode</Text>
            <Text className="text-gray-500 text-xs mt-0.5">
              Applies in supported screens.
            </Text>
          </View>
          <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
        </View>

        <View className="mx-5 mt-6 bg-white rounded-3xl p-4">
          <TouchableOpacity
            onPress={() => router.push("/settings/change-password")}
            className="flex-row justify-between items-center py-3"
          >
            <Text className="text-gray-800">Change password</Text>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
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
              Photo uploads to your NutriScan account.
            </Text>

            <TouchableOpacity
              onPress={openCamera}
              className="mt-5 rounded-2xl bg-[#E6EFE4] px-4 py-4"
            >
              <Text className="font-semibold text-gray-800">Use camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={openGallery}
              className="mt-3 rounded-2xl bg-[#E6EFE4] px-4 py-4"
            >
              <Text className="font-semibold text-gray-800">
                Choose from gallery
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
