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
const USER_KEY = "student_service_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const login = async (accessToken: string, userData: User) => {
    try {
      if (Platform.OS === "web") {
        // Web testing: save the session in browser storage.
        localStorage.setItem(TOKEN_KEY, accessToken);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      } else {
        // Native: use SecureStore for secure token storage.
        const available = await SecureStore.isAvailableAsync();

        if (!available) {
          throw new Error("Secure storage is not available on this device.");
        }

        await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
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
      if (Platform.OS === "web") {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      } else {
        const available = await SecureStore.isAvailableAsync();

        if (available) {
          await SecureStore.deleteItemAsync(TOKEN_KEY);
          await SecureStore.deleteItemAsync(USER_KEY);
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
      let savedToken: string | null = null;
      let savedUser: User | null = null;

      if (Platform.OS === "web") {
        // Restore session from browser storage.
        savedToken = localStorage.getItem(TOKEN_KEY);

        const savedUserText = localStorage.getItem(USER_KEY);

        if (savedUserText) {
          try {
            savedUser = JSON.parse(savedUserText);
          } catch {
            savedUser = null;
          }
        }
      } else {
        // Restore session from SecureStore.
        const available = await SecureStore.isAvailableAsync();

        if (!available) {
          setToken(null);
          setUser(null);
          return;
        }

        savedToken = await SecureStore.getItemAsync(TOKEN_KEY);

        const savedUserText = await SecureStore.getItemAsync(USER_KEY);

        if (savedUserText) {
          try {
            savedUser = JSON.parse(savedUserText);
          } catch {
            savedUser = null;
          }
        }
      }

      if (!savedToken) {
        setToken(null);
        setUser(null);
        return;
      }

      setToken(savedToken);
      setUser(savedUser);
    } catch (error) {
      console.error("Session restoration error:", error);
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
