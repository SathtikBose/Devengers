import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>React Native Starter</Text>
          <Text style={styles.title}>Build your Devengers app from here.</Text>
          <Text style={styles.description}>
            This screen gives you a clean starting point for features, navigation,
            API calls, and reusable UI components.
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85}>
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.85}>
              <Text style={styles.secondaryButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Steps</Text>
          <View style={styles.itemCard}>
            <Text style={styles.itemTitle}>Create screens</Text>
            <Text style={styles.itemText}>
              Add new routes inside the `app` folder for authentication, dashboard,
              profile, or any other flow you need.
            </Text>
          </View>
          <View style={styles.itemCard}>
            <Text style={styles.itemTitle}>Connect your backend</Text>
            <Text style={styles.itemText}>
              Add API utilities, environment config, and state management when
              you are ready to fetch real data.
            </Text>
          </View>
          <View style={styles.itemCard}>
            <Text style={styles.itemTitle}>Reuse components</Text>
            <Text style={styles.itemText}>
              Move buttons, cards, inputs, and headers into a shared components
              folder as the app grows.
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#020617",
    gap: 24,
  },
  heroCard: {
    marginTop: 20,
    padding: 24,
    borderRadius: 24,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  eyebrow: {
    color: "#38bdf8",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  title: {
    color: "#f8fafc",
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 40,
    marginBottom: 12,
  },
  description: {
    color: "#cbd5e1",
    fontSize: 16,
    lineHeight: 24,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    flexWrap: "wrap",
  },
  primaryButton: {
    backgroundColor: "#38bdf8",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  primaryButtonText: {
    color: "#082f49",
    fontWeight: "700",
    fontSize: 15,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#334155",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: "#111827",
  },
  secondaryButtonText: {
    color: "#e2e8f0",
    fontWeight: "700",
    fontSize: 15,
  },
  section: {
    gap: 14,
  },
  sectionTitle: {
    color: "#f8fafc",
    fontSize: 22,
    fontWeight: "700",
  },
  itemCard: {
    padding: 18,
    borderRadius: 18,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  itemTitle: {
    color: "#f8fafc",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8,
  },
  itemText: {
    color: "#cbd5e1",
    fontSize: 15,
    lineHeight: 22,
  },
});
