import { registerRootComponent } from "expo";
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import App from "../App";

const MobileApp = () => (
  <SafeAreaView style={styles.container}>
    <App />
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

registerRootComponent(MobileApp);
