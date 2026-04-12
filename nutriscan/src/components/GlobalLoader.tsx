import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { useLoadingStore } from "../store/useLoadingStore";

export function GlobalLoader() {
  const { loading, message } = useLoadingStore();
  if (!loading) return null;
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#166534" />
      <Text style={styles.text}>{message || "Processing..."}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.85)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  text: {
    marginTop: 18,
    color: "#166534",
    fontWeight: "bold",
    fontSize: 18,
  },
});
