import { Tabs } from "expo-router";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { View } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        // 🔹 Tab Bar Styling
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },

        tabBarActiveTintColor: "#16A34A", // green-600
        tabBarInactiveTintColor: "#6B7280", // gray-500

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      {/* 🔹 Dashboard */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              className={`items-center justify-center ${
                focused ? "bg-green-100 px-3 py-1 rounded-xl" : ""
              }`}
            >
              <MaterialIcons name="dashboard" size={20} color={color} />
            </View>
          ),
        }}
      />

      {/* 🔹 Scan */}
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",
          tabBarIcon: ({ color }) => (
            <Ionicons name="qr-code-outline" size={20} color={color} />
          ),
        }}
      />

      {/* 🔹 Analysis */}
      <Tabs.Screen
        name="analysis"
        options={{
          title: "Analysis",
          tabBarIcon: ({ color }) => (
            <Ionicons name="analytics-outline" size={20} color={color} />
          ),
        }}
      />

      {/* 🔹 History */}
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="history" size={20} color={color} />
          ),
        }}
      />

      {/* 🔹 Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
