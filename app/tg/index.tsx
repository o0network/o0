import { registerRootComponent } from "expo";
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import App from "../App";
import WebApp from "@twa-dev/sdk";

const TelegramApp = () => {
  useEffect(() => {
    // Initialize Telegram Web App SDK
    try {
      WebApp.ready();
      WebApp.expand();
    } catch (e) {
      console.log("Telegram WebApp not available, running in standalone mode");
    }
  }, []);

  return (
    <View style={styles.container}>
      <App />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

registerRootComponent(TelegramApp);
