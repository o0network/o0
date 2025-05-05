module.exports = () => {
  // Check if we're building the Telegram variant
  const isTelegram = process.env.EXPO_PUBLIC_APP_VARIANT === "telegram";

  // Common config for all variants
  const commonConfig = {
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro",
    },
  };

  // Regular app config
  if (!isTelegram) {
    return {
      name: "App",
      slug: "app",
      ...commonConfig,
      entryPoint: "./index.js",
    };
  }

  // Telegram-specific config
  return {
    name: "App Telegram",
    slug: "app-telegram",
    ...commonConfig,
    entryPoint: "./index.telegram.tsx",
  };
};
