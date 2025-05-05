import "@expo/metro-runtime";
import "react-native-gesture-handler";
import { registerRootComponent } from "expo";
import { init } from "@telegram-apps/sdk";
import App from "./App";

// Initialize Telegram Mini App SDK
// This will work properly when running inside Telegram
console.log("Initializing Telegram Mini App...");
try {
  init();
  console.log("Telegram Mini App SDK initialized successfully");
} catch (error) {
  console.error("Failed to initialize Telegram Mini App SDK:", error);

  // If we're in development and running outside Telegram, show a message
  if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
    console.info(
      "⚠️ Running outside of Telegram. In production, this app should be launched from a Telegram bot."
    );

    // In development, we could mock the Telegram environment, but for simplicity
    // we'll just handle the initialization error and continue
    console.info(
      "💡 To properly test this app, create a Telegram bot and set up a Mini App that points to this web app."
    );
  }
}

// Register the root component as normal - the app will work the same,
// except with Telegram features when running inside Telegram
registerRootComponent(App);
