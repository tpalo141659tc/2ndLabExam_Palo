import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { API_BASE_URL } from "@/constants/api";
import { useAuth } from "@/hooks/useAuth";

type Student = {
  id: string | number;
  name?: string;
  email?: string;
  student_id?: string;
  course?: string;
  year_level?: string | number;
};

export default function StudentsScreen() {
  const { token } = useAuth();

  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      setError("");

      try {
        if (!token) {
          setError("You are not authenticated.");
          return;
        }

        if (API_BASE_URL === "REPLACE_WITH_EXAM_API") {
          setError("The exam API URL has not been provided yet.");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/students`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(
            `Unable to load students. Status: ${response.status}`,
          );
        }

        const data = await response.json();

        /*
         * TODO:
         * Confirm the exact response structure
         * with the instructor's API documentation.
         */

        const records = Array.isArray(data)
          ? data
          : data?.students || data?.data || [];

        setStudents(records);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to load students.";

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [token]);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return students;
    }

    return students.filter((student) => {
      const name = student.name?.toLowerCase() || "";
      const email = student.email?.toLowerCase() || "";
      const studentId = student.student_id?.toLowerCase() || "";

      return (
        name.includes(query) ||
        email.includes(query) ||
        studentId.includes(query)
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

        <Text style={styles.smallText}>
          The student API still needs to be connected.
        </Text>
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
          renderItem={({ item }) => (
            <Pressable
              style={styles.studentCard}
              onPress={() => router.push(`/student/${item.id}`)}
            >
              <Text style={styles.studentName}>
                {item.name || "Unnamed Student"}
              </Text>

              <Text style={styles.studentInfo}>
                {item.email || "No email available"}
              </Text>

              {item.student_id ? (
                <Text style={styles.studentInfo}>
                  Student ID: {item.student_id}
                </Text>
              ) : null}

              {item.course ? (
                <Text style={styles.studentInfo}>Course: {item.course}</Text>
              ) : null}

              <Text style={styles.viewDetails}>View Details →</Text>
            </Pressable>
          )}
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
  studentCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    padding: 16,
    gap: 5,
  },
  studentName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#17324d",
  },
  studentInfo: {
    fontSize: 14,
    color: "#64748b",
  },
  viewDetails: {
    marginTop: 8,
    color: "#245bb2",
    fontWeight: "700",
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
