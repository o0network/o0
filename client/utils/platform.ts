import { Platform } from "react-native";
import React, { createContext, useContext, ReactNode } from "react";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: any;
    };
  }
}

export type AppPlatform = "web" | "mobile" | "telegram";

export interface PlatformConfig {
  name: string;
  isNative: boolean;
  supportsBackButton: boolean;
  supportsDeepLinking: boolean;
}

export const detectPlatform = (): AppPlatform => {
  if (
    typeof window !== "undefined" &&
    window.Telegram &&
    window.Telegram.WebApp
  ) {
    return "telegram";
  }

  if (Platform.OS === "web") {
    return "web";
  }

  return "mobile";
};

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

export const isPlatform = (platform: AppPlatform): boolean => {
  return detectPlatform() === platform;
};

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

export const usePlatform = () => {
  return {
    platform: detectPlatform(),
    platformName: getPlatformName(),
    config: getPlatformConfig(),
    isPlatform,
  };
};

export const usePlatformContext = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error(
      "usePlatformContext must be used within a PlatformProvider"
    );
  }
  return context;
};

export type PlatformType = "ios" | "android" | "web" | "telegram" | "unknown";

const isTelegram = (): boolean => {
  return (
    typeof window !== "undefined" && window.Telegram && window.Telegram.WebApp
  );
};

export const getPlatformType = (): PlatformType => {
  if (isTelegram()) {
    return "telegram";
  }
  switch (Platform.OS) {
    case "ios":
      return "ios";
    case "android":
      return "android";
    case "web":
      return "web";
    default:
      return "unknown";
  }
};

export const currentPlatform: PlatformType = getPlatformType();
