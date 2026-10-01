import { Redirect, Stack, usePathname } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";

function RootNavigator() {
  const { token, authLoading } = useAuth();
  const pathname = usePathname();

  if (authLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const isSignIn = pathname === "/sign-in";
  const isStudentDetails = pathname.startsWith("/student/");

  if (!token && !isSignIn) {
    return <Redirect href="/sign-in" />;
  }

  if (token && isSignIn) {
    return <Redirect href="/(app)" />;
  }

  return (
    <Stack screenOptions={{ headerTintColor: "#17324d" }}>
      <Stack.Screen name="sign-in" options={{ title: "Sign In" }} />

      <Stack.Screen name="(app)" options={{ headerShown: false }} />

      <Stack.Screen
        name="student/[id]"
        options={{ title: "Student Details" }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
