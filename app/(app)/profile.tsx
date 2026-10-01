import { router } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAuth } from "@/hooks/useAuth";

export default function ProfileScreen() {
  const { user, token, authLoading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/sign-in");
  };

  if (authLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#245bb2" />

        <Text style={styles.message}>Restoring session...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.eyebrow}>MY ACCOUNT</Text>

      <Text style={styles.title}>Profile</Text>

      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user?.name || user?.email || "S").charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.name}>{user?.name || "Student"}</Text>

        <Text style={styles.email}>{user?.email || "Email not available"}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user?.name || "Not available"}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email || "Not available"}</Text>

        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>{user?.role || "Student"}</Text>

        <Text style={styles.label}>Session</Text>
        <Text style={styles.value}>
          {token ? "Authenticated" : "Not authenticated"}
        </Text>
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    color: "#245bb2",
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#17324d",
  },
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    padding: 20,
    gap: 10,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#dbeafe",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#245bb2",
  },
  name: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "800",
    color: "#17324d",
  },
  email: {
    textAlign: "center",
    color: "#64748b",
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748b",
    marginTop: 6,
  },
  value: {
    fontSize: 16,
    color: "#17324d",
  },
  message: {
    color: "#64748b",
  },
  logoutButton: {
    backgroundColor: "#b91c1c",
    paddingVertical: 14,
    borderRadius: 10,
  },
  logoutText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});
