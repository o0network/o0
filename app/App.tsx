import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Platform, Text } from "react-native";
import { Button } from "./shared/components";

export default function App() {
  const platformName =
    Platform.OS === "web"
      ? window.location.pathname.includes("tg")
        ? "Telegram"
        : "Web"
      : Platform.OS;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.platformText}>Running on: {platformName}</Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Press Me"
            onClick={() => console.log("Button pressed!")}
          />
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  platformText: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 20,
  },
});
