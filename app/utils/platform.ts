import { Platform } from "react-native";
import React, { createContext, useContext, ReactNode } from "react";

// Extend the Window interface to include Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp?: any;
    };
  }
}

// Define the available platforms
export type AppPlatform = "web" | "mobile" | "telegram";

// Platform-specific configuration types
export interface PlatformConfig {
  name: string;
  isNative: boolean;
  supportsBackButton: boolean;
  supportsDeepLinking: boolean;
}

// Detect the current platform
export const detectPlatform = (): AppPlatform => {
  // Check if running in Telegram WebApp environment
  if (
    typeof window !== "undefined" &&
    window.Telegram &&
    window.Telegram.WebApp
  ) {
    return "telegram";
  }

  // Check if running on web but not in Telegram
  if (Platform.OS === "web") {
    return "web";
  }

  // Default to mobile (iOS, Android)
  return "mobile";
};

// Get platform display name
export const getPlatformName = (): string => {
  const platform = detectPlatform();

  switch (platform) {
    case "telegram":
      return "Telegram Mini App";
    case "web":
      return "Web Browser";
    case "mobile":
      return Platform.OS === "ios" ? "iOS App" : "Android App";
    default:
      return "Unknown Platform";
  }
};

// Get platform-specific configuration
export const getPlatformConfig = (): PlatformConfig => {
  const platform = detectPlatform();

  switch (platform) {
    case "telegram":
      return {
        name: getPlatformName(),
        isNative: false,
        supportsBackButton:
          typeof window !== "undefined" &&
          window.Telegram &&
          window.Telegram.WebApp
            ? true
            : false,
        supportsDeepLinking: false,
      };
    case "web":
      return {
        name: getPlatformName(),
        isNative: false,
        supportsBackButton: true,
        supportsDeepLinking: true,
      };
    case "mobile":
      return {
        name: getPlatformName(),
        isNative: true,
        supportsBackButton: true,
        supportsDeepLinking: true,
      };
  }
};

// Check if the current platform is a specific platform
export const isPlatform = (platform: AppPlatform): boolean => {
  return detectPlatform() === platform;
};

// Create a type for our platform context
export interface PlatformContextType {
  platform: AppPlatform;
  platformName: string;
  config: PlatformConfig;
  isPlatform: (platform: AppPlatform) => boolean;
}

// Create the platform context
export const PlatformContext = createContext<PlatformContextType>({
  platform: detectPlatform(),
  platformName: getPlatformName(),
  config: getPlatformConfig(),
  isPlatform,
});

// Provider component for platform context
export const PlatformProvider = ({ children }: { children: ReactNode }) => {
  const platformValue: PlatformContextType = {
    platform: detectPlatform(),
    platformName: getPlatformName(),
    config: getPlatformConfig(),
    isPlatform,
  };

  return React.createElement(
    PlatformContext.Provider,
    { value: platformValue },
    children
  );
};

// Custom hook to use the platform
export const usePlatform = () => {
  return {
    platform: detectPlatform(),
    platformName: getPlatformName(),
    config: getPlatformConfig(),
    isPlatform,
  };
};

// Custom hook to use the platform context
export const usePlatformContext = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error(
      "usePlatformContext must be used within a PlatformProvider"
    );
  }
  return context;
};
