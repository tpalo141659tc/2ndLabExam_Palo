import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import StudentCard, { type Student } from "@/components/StudentCard";
import { API_BASE_URL } from "@/constants/api";

export default function StudentsScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_BASE_URL}/users`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Unable to load students. Status: ${response.status}`,
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("The student API returned an invalid response.");
        }

        setStudents(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to load students.";

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return students;
    }

    return students.filter((student) => {
      const name = student.name?.toLowerCase() || "";
      const email = student.email?.toLowerCase() || "";
      const username = student.username?.toLowerCase() || "";

      return (
        name.includes(query) ||
        email.includes(query) ||
        username.includes(query)
      );
    });
  }, [students, search]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#245bb2" />

        <Text style={styles.message}>Loading students...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>

        <Text style={styles.smallText}>Please try again later.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Students</Text>

      <Text style={styles.subtitle}>Search and view student records.</Text>

      <TextInput
        style={styles.search}
        placeholder="Search student..."
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
      />

      {filteredStudents.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No students found</Text>

          <Text style={styles.smallText}>
            There are no student records matching your search.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <StudentCard student={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#17324d",
  },
  subtitle: {
    fontSize: 15,
    color: "#64748b",
    marginTop: 4,
    marginBottom: 16,
  },
  search: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  list: {
    gap: 12,
    paddingBottom: 20,
  },
  message: {
    color: "#64748b",
  },
  error: {
    color: "#b91c1c",
    textAlign: "center",
    fontWeight: "600",
  },
  smallText: {
    color: "#64748b",
    textAlign: "center",
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#17324d",
  },
});
