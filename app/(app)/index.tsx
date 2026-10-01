import { useAuth } from "@/hooks/useAuth";
import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function DashboardScreen() {
  const { token, user } = useAuth();

  const displayName = user?.name || user?.email || "Student";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.eyebrow}>STUDENT SERVICE PORTAL</Text>

      <Text style={styles.title}>Welcome, {displayName}</Text>

      <Text style={styles.subtitle}>Your student services in one place.</Text>

      <View style={styles.card}>
        <Text style={styles.heading}>Quick Actions</Text>

        <Link href="/(app)/students" asChild>
          <Pressable accessibilityRole="button" style={styles.button}>
            <Text style={styles.buttonText}>View Students</Text>
          </Pressable>
        </Link>

        <Link href="/(app)/profile" asChild>
          <Pressable accessibilityRole="button" style={styles.button}>
            <Text style={styles.buttonText}>My Profile</Text>
          </Pressable>
        </Link>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Session Status</Text>

        <Text style={styles.subtitle}>
          {token ? "Authenticated" : "Not Available"}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Account</Text>

        <Text style={styles.info}>Name: {user?.name || "Not available"}</Text>

        <Text style={styles.info}>Email: {user?.email || "Not available"}</Text>

        <Text style={styles.info}>Role: {user?.role || "Student"}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 16,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#245bb2",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#17324d",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    lineHeight: 23,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  heading: {
    fontSize: 19,
    fontWeight: "700",
    color: "#17324d",
  },
  button: {
    backgroundColor: "#245bb2",
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "700",
  },
  info: {
    fontSize: 15,
    color: "#475569",
  },
});
