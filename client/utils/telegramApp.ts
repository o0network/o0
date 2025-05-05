import { isTMA } from "@telegram-apps/sdk";

// Simple type definitions for window.Telegram
// These will be automatically created when the SDK initializes
type TelegramTheme = "light" | "dark";

/**
 * Returns true if the app is running inside Telegram WebView
 */
export const isTelegramWebApp = (): boolean => {
  if (typeof window === "undefined") return false;

  // Check if we're running inside Telegram
  const isInTelegram = isTMA();

  // Add some helpful debug information for developers
  if (process.env.NODE_ENV === "development" && !isInTelegram) {
    console.log(
      "Not running inside Telegram WebView. Telegram-specific features will be disabled."
    );
    console.log("URL hash:", window.location.hash);

    // If there's no hash data, suggest possible fixes
    if (!window.location.hash) {
      console.log(
        "No URL hash found. When running in Telegram, the hash should contain:"
      );
      console.log("- tgWebAppData: Contains user data and authentication");
      console.log(
        "- tgWebAppVersion: The current version of the Telegram Mini Apps"
      );
      console.log("- tgWebAppPlatform: Telegram application identifier");
      console.log("- tgWebAppThemeParams: Theme parameters");
    }
  }

  return isInTelegram;
};

/**
 * Gets the current Telegram theme
 */
export const getTelegramTheme = (): TelegramTheme => {
  if (!isTelegramWebApp()) return "light";

  // Access through the window.Telegram global object
  const colorScheme = window.Telegram?.WebApp?.colorScheme;
  return colorScheme === "dark" ? "dark" : "light";
};

/**
 * Gets the Telegram user if available
 */
export const getTelegramUser = () => {
  if (!isTelegramWebApp()) return null;

  return window.Telegram?.WebApp?.initDataUnsafe?.user || null;
};

/**
 * Sets the main button in Telegram UI
 */
export const setTelegramMainButton = (
  text: string,
  onClick: () => void,
  color?: string,
  textColor?: string
) => {
  if (!isTelegramWebApp()) return;

  const mainButton = window.Telegram?.WebApp?.MainButton;
  if (!mainButton) return;

  mainButton.setText(text);

  if (color) {
    mainButton.setBackgroundColor(color);
  }

  if (textColor) {
    mainButton.setTextColor(textColor);
  }

  mainButton.onClick(onClick);
  mainButton.show();
};

/**
 * Hides the main button in Telegram UI
 */
export const hideTelegramMainButton = () => {
  if (!isTelegramWebApp()) return;

  const mainButton = window.Telegram?.WebApp?.MainButton;
  if (mainButton) {
    mainButton.hide();
  }
};

/**
 * Displays a native popup in Telegram
 */
export const showTelegramPopup = (
  message: string,
  title?: string,
  buttons?: Array<{
    text: string;
    id: string;
    type?: "default" | "ok" | "close" | "cancel" | "destructive";
  }>
) => {
  if (!isTelegramWebApp()) return Promise.resolve({ button_id: "" });

  const webApp = window.Telegram?.WebApp;
  if (!webApp?.showPopup) return Promise.resolve({ button_id: "" });

  return webApp.showPopup({
    message,
    title,
    buttons: buttons || [{ text: "OK", id: "ok", type: "ok" }],
  });
};

/**
 * Enables haptic feedback in Telegram
 */
export const hapticFeedback = (
  style: "impact" | "notification" | "selection" = "impact"
) => {
  if (!isTelegramWebApp()) return;

  const haptic = window.Telegram?.WebApp?.HapticFeedback;
  if (!haptic) return;

  if (style === "impact") {
    haptic.impactOccurred("medium");
  } else if (style === "notification") {
    haptic.notificationOccurred("success");
  } else if (style === "selection") {
    haptic.selectionChanged();
  }
};

/**
 * Closes the mini app
 */
export const closeMiniApp = () => {
  if (!isTelegramWebApp()) return;

  window.Telegram?.WebApp?.close();
};
