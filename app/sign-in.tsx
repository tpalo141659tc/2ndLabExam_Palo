import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { API_BASE_URL } from "@/constants/api";
import { useAuth } from "@/hooks/useAuth";

export default function SignInScreen() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      if (API_BASE_URL === "REPLACE_WITH_EXAM_API") {
        throw new Error("The exam API URL has not been provided yet.");
      }

      /*
       * TODO:
       * The exact login payload and response fields must come
       * from the instructor&apos;s API documentation.
       *
       * Do not guess these fields.
       */

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Login failed. Please check your credentials.",
        );
      }

      /*
       * TODO:
       * Replace these fields with the exact response fields
       * from the instructor's API documentation.
       */

      const accessToken =
        data?.accessToken || data?.access_token || data?.token;

      const userData = data?.user || data?.profile;

      if (!accessToken) {
        throw new Error("The API response did not contain an access token.");
      }

      await login(accessToken, userData || { email: cleanEmail });

      router.replace("/(app)");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong during login.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <Text style={styles.eyebrow}>CCE106 • PRACTICAL EXAMINATION</Text>

        <Text style={styles.title}>Student Service Portal</Text>

        <Text style={styles.subtitle}>Sign in to access student services.</Text>

        <Text style={styles.label}>Email</Text>

        <TextInput
          style={styles.input}
          accessibilityLabel="Email"
          placeholder="student@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Password</Text>

        <TextInput
          style={styles.input}
          accessibilityLabel="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.feedback}>
          {loading && (
            <ActivityIndicator
              color="#245bb2"
              accessibilityLabel="Signing in"
            />
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        <Pressable
          accessibilityRole="button"
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Signing in…" : "Login"}
          </Text>
        </Pressable>

        <Text style={styles.note}>
          Login will work after the instructor&apos;s API details are added.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 10,
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
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#17324d",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
  feedback: {
    minHeight: 40,
    justifyContent: "center",
    gap: 8,
  },
  error: {
    color: "#b91c1c",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#245bb2",
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
  note: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    marginTop: 8,
  },
});
