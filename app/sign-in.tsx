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

import { useAuth } from "@/hooks/useAuth";

const LOGIN_API_URL =
  "https://c365d45f-857a-4cf0-933b-fcf721c7770e.mock.pstmn.io/login";

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
      const response = await fetch(LOGIN_API_URL, {
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

      const accessToken = data?.accessToken;
      const userData = data?.user;

      if (!accessToken) {
        throw new Error("The login response did not contain an access token.");
      }

      await login(
        accessToken,
        userData || {
          email: cleanEmail,
        },
      );

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
          Enter your exam account credentials to sign in.
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
    backgroundColor: "#f3f6fa",
  },

  card: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    padding: 24,
    borderRadius: 16,
    backgroundColor: "#ffffff",
  },

  eyebrow: {
    color: "#245bb2",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 12,
  },

  title: {
    color: "#17324d",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },

  subtitle: {
    color: "#536579",
    fontSize: 16,
    marginBottom: 24,
  },

  label: {
    color: "#17324d",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#ffffff",
  },

  feedback: {
    minHeight: 40,
    justifyContent: "center",
  },

  error: {
    color: "#dc2626",
    fontSize: 14,
  },

  button: {
    backgroundColor: "#245bb2",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  note: {
    color: "#536579",
    textAlign: "center",
    marginTop: 18,
    fontSize: 13,
  },
});
