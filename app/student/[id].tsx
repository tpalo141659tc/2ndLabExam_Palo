import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { API_BASE_URL } from "@/constants/api";

type Student = {
  id?: string | number;
  name?: string | null;
  username?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  address?: {
    street?: string;
    suite?: string;
    city?: string;
    zipcode?: string;
  } | null;
  company?: {
    name?: string;
  } | null;
};

export default function StudentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStudent = async () => {
      if (!id) {
        setError("Student ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/users/${id}`);

        if (!response.ok) {
          throw new Error(`Unable to load student. Status: ${response.status}`);
        }

        const data = await response.json();

        if (!data || !data.id) {
          setStudent(null);
          return;
        }

        setStudent(data);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Something went wrong while loading the student.";

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading student details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!student) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>Student not found</Text>
        <Text style={styles.emptyText}>
          No student information is available for this ID.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{student.name || "Name not available"}</Text>

        <Text style={styles.subtitle}>Student ID: {String(student.id)}</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>
            {student.username || "Not available"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{student.email || "Not available"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{student.phone || "Not available"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Website</Text>
          <Text style={styles.value}>{student.website || "Not available"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Address</Text>

          <Text style={styles.value}>
            {student.address?.street || "Not available"}
          </Text>

          {student.address?.suite ? (
            <Text style={styles.value}>{student.address.suite}</Text>
          ) : null}

          <Text style={styles.value}>
            {student.address?.city || "Not available"}
          </Text>

          <Text style={styles.value}>
            {student.address?.zipcode || "Not available"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Company</Text>
          <Text style={styles.value}>
            {student.company?.name || "Not available"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f7fa",
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 22,
    gap: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#17324d",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 12,
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 12,
    marginTop: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748b",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#17324d",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 10,
    color: "#64748b",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#b91c1c",
    marginBottom: 8,
  },
  errorText: {
    color: "#64748b",
    textAlign: "center",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#17324d",
    marginBottom: 8,
  },
  emptyText: {
    color: "#64748b",
    textAlign: "center",
  },
});
