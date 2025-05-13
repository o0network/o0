import { Platform } from "react-native";
import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { isTMA } from "@telegram-apps/sdk";

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

// Define a function to safely check if Telegram WebApp is available
const isTelegramAvailable = (): boolean => {
  if (typeof window === "undefined") return false;
  console.log("isTMA", isTMA());
  return isTMA();
};

export const detectPlatform = (): AppPlatform => {
  if (isTelegramAvailable()) {
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
        supportsBackButton: isTelegramAvailable(),
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
  isTelegramReady: boolean;
}

// Create the platform context
export const PlatformContext = createContext<PlatformContextType>({
  platform: detectPlatform(),
  platformName: getPlatformName(),
  config: getPlatformConfig(),
  isPlatform,
  isTelegramReady: false,
});

// Provider component for platform context - using JSX for React 19 compatibility
export const PlatformProvider = ({ children }: { children: ReactNode }) => {
  const [isTelegramReady, setIsTelegramReady] = useState(false);

  useEffect(() => {
    // Wait for Telegram WebApp to become available
    if (typeof window !== "undefined") {
      const checkTelegram = () => {
        if (window.Telegram) {
          setIsTelegramReady(true);
        } else if (isTelegramAvailable()) {
          setTimeout(checkTelegram, 50);
        }
      };

      checkTelegram();
    }
  }, []);

  const contextValue = {
    platform: detectPlatform(),
    platformName: getPlatformName(),
    config: getPlatformConfig(),
    isPlatform,
    isTelegramReady,
  };

  return (
    <PlatformContext.Provider value={contextValue}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  return context;
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
  return isTelegramAvailable();
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
