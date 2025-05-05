import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  isTelegramWebApp,
  getTelegramTheme,
  getTelegramUser,
  setTelegramMainButton,
  hideTelegramMainButton,
  showTelegramPopup,
  hapticFeedback,
} from "../utils/telegramApp";

type TelegramStatus = {
  isInTelegram: boolean;
  theme: string;
  username?: string;
  firstName?: string;
};

export default function TelegramIntegration() {
  const [status, setStatus] = useState<TelegramStatus>({
    isInTelegram: false,
    theme: "unknown",
    username: undefined,
    firstName: undefined,
  });

  // Check for Telegram Mini App environment on component mount
  useEffect(() => {
    const isTelegram = isTelegramWebApp();

    if (isTelegram) {
      const user = getTelegramUser();
      const theme = getTelegramTheme();

      setStatus({
        isInTelegram: true,
        theme,
        username: user?.username,
        firstName: user?.first_name,
      });

      // Setup main button
      setTelegramMainButton("Show Popup", () => {
        showTelegramPopup("This is a Telegram popup!", "Hello from Mini App");
      });

      return () => {
        hideTelegramMainButton();
      };
    }
  }, []);

  // Handle button press with haptic feedback
  const handlePress = () => {
    hapticFeedback("impact");
    showTelegramPopup("Button pressed!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Telegram Mini App Status</Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Running in Telegram: {status.isInTelegram ? "Yes" : "No"}
        </Text>

        {status.isInTelegram && (
          <>
            <Text style={styles.statusText}>Theme: {status.theme}</Text>
            {status.firstName && (
              <Text style={styles.statusText}>
                First Name: {status.firstName}
              </Text>
            )}
            {status.username && (
              <Text style={styles.statusText}>
                Username: @{status.username}
              </Text>
            )}
          </>
        )}
      </View>

      {status.isInTelegram && (
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Test Haptic Feedback</Text>
        </TouchableOpacity>
      )}

      {!status.isInTelegram && (
        <Text style={styles.infoText}>
          This app is designed to work as a Telegram Mini App. Please open it
          inside the Telegram messenger.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  statusContainer: {
    width: "100%",
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#0088cc", // Telegram's blue color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});
