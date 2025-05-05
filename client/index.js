// Import the runtime first for DOM components support
import "@expo/metro-runtime";
import "react-native-gesture-handler";
import { registerRootComponent } from "expo";
import App from "./App";
import { init } from "@telegram-apps/sdk";

// Initialize Telegram Mini App SDK if running in Telegram WebView
if (typeof window !== "undefined") {
  try {
    // This will automatically detect if the app is running inside Telegram
    // and initialize accordingly
    init();
    console.log("Telegram Mini App SDK initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Telegram Mini App SDK:", error);
  }
}

registerRootComponent(App);
