import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { initDB } from "../db/schema";
import "./global.css";

export default function RootLayout() {
  useEffect(() => {
    initDB();
  }, []);
  return (
    <ActionSheetProvider>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor="#0a0a0a" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen name="(tabs)" options={{ animation: "none" }} />

          <Stack.Screen name="passwords" />
          <Stack.Screen name="notes" />
          <Stack.Screen name="text-note" />
          <Stack.Screen name="draw-note" />
          <Stack.Screen name="gallery" />
          <Stack.Screen name="documents" />
        </Stack>
      </SafeAreaProvider>
    </ActionSheetProvider>
  );
}
