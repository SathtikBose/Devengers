import { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useToastStore, type ToastItem } from "../store/useToastStore";

const toastStyles: Record<
  ToastItem["type"],
  {
    background: string;
    border: string;
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
  }
> = {
  success: {
    background: "#ecfdf5",
    border: "#bbf7d0",
    icon: "checkmark-circle",
    iconColor: "#15803d",
  },
  error: {
    background: "#fef2f2",
    border: "#fecaca",
    icon: "close-circle",
    iconColor: "#b91c1c",
  },
  info: {
    background: "#eff6ff",
    border: "#bfdbfe",
    icon: "information-circle",
    iconColor: "#1d4ed8",
  },
};

function ToastCard({ toast }: { toast: ToastItem }) {
  const dismissToast = useToastStore((state) => state.dismissToast);
  const translateY = useRef(new Animated.Value(-20)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();

    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -12,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => dismissToast(toast.id));
    }, 2800);

    return () => clearTimeout(timeout);
  }, [dismissToast, opacity, toast.id, translateY]);

  const style = toastStyles[toast.type];

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        opacity,
      }}
      className="mb-3"
    >
      <Pressable
        onPress={() => dismissToast(toast.id)}
        style={{
          backgroundColor: style.background,
          borderColor: style.border,
        }}
        className="rounded-2xl border px-4 py-3 shadow-sm"
      >
        <View className="flex-row items-start">
          <Ionicons
            name={style.icon}
            size={22}
            color={style.iconColor}
            style={{ marginTop: 1 }}
          />
          <View className="ml-3 flex-1">
            <Text className="text-sm font-semibold text-gray-900">
              {toast.title}
            </Text>
            {toast.message ? (
              <Text className="mt-1 text-sm leading-5 text-gray-600">
                {toast.message}
              </Text>
            ) : null}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export function ToastHost() {
  const toasts = useToastStore((state) => state.toasts);
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={{ top: insets.top + 8 }}
      className="absolute left-0 right-0 z-50 px-4"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} />
      ))}
    </View>
  );
}
