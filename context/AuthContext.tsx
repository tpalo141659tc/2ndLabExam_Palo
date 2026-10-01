import { API_BASE_URL } from "@/constants/api";
import * as SecureStore from "expo-secure-store";
import { createContext, useEffect, useState, type ReactNode } from "react";
import { Platform } from "react-native";

export type User = {
  id?: string | number;
  name?: string;
  email?: string;
  role?: string;
};

type AuthContextValue = {
  token: string | null;
  user: User | null;
  authLoading: boolean;
  login: (accessToken: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

const TOKEN_KEY = "student_service_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const login = async (accessToken: string, userData: User) => {
    try {
      if (Platform.OS !== "web") {
        const available = await SecureStore.isAvailableAsync();

        if (!available) {
          throw new Error("Secure storage is not available on this device.");
        }

        await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
      }

      setToken(accessToken);
      setUser(userData);
    } catch (error) {
      console.error("Login storage error:", error);
      throw new Error("Unable to save the login session.");
    }
  };

  const logout = async () => {
    try {
      if (Platform.OS !== "web") {
        const available = await SecureStore.isAvailableAsync();

        if (available) {
          await SecureStore.deleteItemAsync(TOKEN_KEY);
        }
      }
    } catch (error) {
      console.error("Logout storage error:", error);
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  const restoreSession = async () => {
    setAuthLoading(true);

    try {
      // SecureStore is not supported on web.
      if (Platform.OS === "web") {
        return;
      }

      const available = await SecureStore.isAvailableAsync();

      if (!available) {
        return;
      }

      const savedToken = await SecureStore.getItemAsync(TOKEN_KEY);

      if (!savedToken) {
        return;
      }

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${savedToken}`,
          Accept: "application/json",
        },
      });

      if (response.status === 401) {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        setToken(null);
        setUser(null);
        return;
      }

      if (!response.ok) {
        throw new Error(`Profile request failed: ${response.status}`);
      }

      const data = await response.json();

      const profile: User = data.user ?? data.profile ?? data;

      setToken(savedToken);
      setUser(profile);
    } catch (error) {
      console.error("Session restoration error:", error);

      try {
        if (Platform.OS !== "web") {
          await SecureStore.deleteItemAsync(TOKEN_KEY);
        }
      } catch (storageError) {
        console.error("Unable to clear invalid session:", storageError);
      }

      setToken(null);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        authLoading,
        login,
        logout,
        restoreSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
