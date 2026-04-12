import { useCallback, useState, type ComponentProps } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useAuthStore } from "../../src/store/useAuthStore";
import { fetchProfileApi } from "../../src/api/user.api";
import {
  fetchDailyQuoteApi,
  type DailyQuoteResponse,
} from "../../src/api/content.api";
import { ENV } from "../../src/config/env";

const AVATAR_FALLBACK =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

function formatJoined(iso?: string | null) {
  if (!iso) return "Member";
  try {
    const d = new Date(iso);
    return `Joined ${d.toLocaleDateString(undefined, {
      month: "short",
      year: "numeric",
    })}`;
  } catch {
    return "Member";
  }
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, updateUser, token } = useAuthStore();
  const [syncing, setSyncing] = useState(false);
  const [quote, setQuote] = useState<DailyQuoteResponse | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(true);

  const loadRemote = useCallback(async () => {
    if (!token && !ENV.USE_MOCK) return;

    setSyncing(true);
    setQuoteLoading(true);
    try {
      const [profile, q] = await Promise.all([
        fetchProfileApi(),
        fetchDailyQuoteApi(),
      ]);
      updateUser(profile);
      setQuote(q);
    } catch {
      try {
        setQuote(await fetchDailyQuoteApi());
      } catch {
        setQuote(null);
      }
    } finally {
      setSyncing(false);
      setQuoteLoading(false);
    }
  }, [token, updateUser]);

  useFocusEffect(
    useCallback(() => {
      loadRemote();
    }, [loadRemote]),
  );

  const handleLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  const avatarUri =
    user?.avatar && String(user.avatar).trim() !== ""
      ? String(user.avatar)
      : AVATAR_FALLBACK;

  return (
    <SafeAreaView className="flex-1 bg-[#EEF3EC]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between items-center px-5 py-4">
          <Text className="text-xl font-bold text-green-700">NutriScan</Text>
          {syncing ? (
            <ActivityIndicator size="small" color="#166534" />
          ) : (
            <View className="w-6" />
          )}
        </View>

        <View className="mx-5 bg-white rounded-3xl p-6 items-center">
          <Image
            source={{ uri: avatarUri }}
            className="w-24 h-24 rounded-full bg-gray-100"
          />

          <Text className="text-xl font-bold mt-4 text-gray-800">
            {user?.name || "Guest"}
          </Text>

          <Text className="text-gray-500 mt-2 text-center px-2">
            {user?.email || "—"}
          </Text>

          <View className="flex-row items-center gap-2 mt-4">
            <Feather name="calendar" size={14} color="#6B7280" />
            <Text className="text-gray-500 text-xs">
              {formatJoined(user?.createdAt)}
            </Text>
          </View>
        </View>

        <Text className="px-5 mt-6 font-semibold text-gray-800">
          Manage account
        </Text>

        <View className="mx-5 mt-3 bg-white rounded-3xl p-5">
          <Text className="text-gray-400 text-xs tracking-wide">AGE</Text>
          <Text className="text-gray-800 font-medium mt-1">
            {user?.age != null && !Number.isNaN(Number(user.age))
              ? String(user.age)
              : "Not set"}
          </Text>

          <Text className="text-gray-400 text-xs tracking-wide mt-5">
            ACTIVE ALLERGIES
          </Text>
          <View className="flex-row flex-wrap gap-2 mt-2">
            {user?.allergies && user.allergies.length > 0 ? (
              user.allergies.map((item) => (
                <View
                  key={item}
                  className="bg-amber-50 border border-amber-200 px-3 py-1 rounded-full"
                >
                  <Text className="text-xs text-amber-900">{item}</Text>
                </View>
              ))
            ) : (
              <Text className="text-gray-500 text-sm">None recorded</Text>
            )}
          </View>

          <Text className="text-gray-400 text-xs tracking-wide mt-5">
            DIETARY PATTERN
          </Text>
          <View className="bg-green-50 border border-green-100 p-4 rounded-2xl mt-2">
            <Text className="font-semibold text-green-900">
              {user?.diet?.trim() ? user.diet : "Not set"}
            </Text>
            <Text className="text-gray-500 text-xs mt-1">
              Edit in Settings to sync with your account.
            </Text>
          </View>

          <View className="border-t border-gray-100 mt-5 pt-2">
            <MenuItem
              icon="settings-outline"
              label="Settings"
              sub="App & account preferences"
              onPress={() => router.push("/settings")}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          className="mx-5 mt-4 bg-white rounded-2xl p-4 flex-row items-center justify-center border border-red-200"
        >
          <Ionicons name="log-out-outline" size={20} color="#DC2626" />
          <Text className="text-red-600 font-semibold ml-2">Log out</Text>
        </TouchableOpacity>

        <View className="mx-5 mt-5 bg-green-700 rounded-2xl p-4">
          <Text className="text-green-100 text-xs font-semibold tracking-wide">
            DAILY QUOTE
          </Text>
          {quoteLoading ? (
            <ActivityIndicator
              className="mt-3"
              color="#bbf7d0"
              size="small"
            />
          ) : (
            <>
              <Text className="text-white text-base mt-2 leading-6">
                {quote?.text ||
                  "Nourish yourself today—your future self will thank you."}
              </Text>
              {quote?.author ? (
                <Text className="text-green-200 text-xs mt-3">— {quote.author}</Text>
              ) : null}
            </>
          )}
        </View>

        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({
  icon,
  label,
  sub,
  onPress,
}: {
  icon: ComponentProps<typeof Ionicons>["name"];
  label: string;
  sub: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between py-4"
    >
      <View className="flex-row items-center gap-3">
        <Ionicons name={icon} size={20} color="#374151" />
        <View>
          <Text className="font-medium text-gray-800">{label}</Text>
          <Text className="text-gray-500 text-xs">{sub}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
    </TouchableOpacity>
  );
}
