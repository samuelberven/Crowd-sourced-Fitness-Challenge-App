import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { supabase } from "../src/config/supabaseClient";
import { ThemeProvider } from "../src/context/ThemeContext";
import { Provider } from "react-redux";
import store from "../src/redux/store";
import { RefreshProvider } from "../src/context/RefreshContext";

export default function RootLayout() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setIsAuthenticated(true);
        router.replace("/tabs"); // Redirect to tabs if logged in
      } else {
        setIsAuthenticated(false);
        router.replace("/landing"); // Redirect to landing if not logged in
      }
    };

    checkSession();
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <RefreshProvider>
          <Stack screenOptions={{ headerShown: false }}>
            {!isAuthenticated ? (
              <>
                <Stack.Screen name="landing" />
                <Stack.Screen name="login" />
                <Stack.Screen name="register" />
              </>
            ) : (
              <>
                <Stack.Screen name="tabs" />
                <Stack.Screen name="searchChallenges" />
                <Stack.Screen name="challengeDetails" />
              </>
            )}
          </Stack>
        </RefreshProvider>
      </ThemeProvider>
    </Provider>
  );
}
