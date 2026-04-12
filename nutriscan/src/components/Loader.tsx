import { View, ActivityIndicator, Text } from "react-native";

export function Loader({ message = "Loading..." }: { message?: string }) {
  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(255,255,255,0.7)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
      }}
    >
      <ActivityIndicator size="large" color="#166534" />
      <Text style={{ marginTop: 16, color: "#166534", fontWeight: "bold" }}>
        {message}
      </Text>
    </View>
  );
}
import { StyleSheet } from "react-native";
