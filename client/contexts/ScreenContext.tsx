import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from "react";
import { Dimensions } from "react-native";
import { LaunchParams, isTMA, retrieveLaunchParams } from "@telegram-apps/sdk";

type AppPlatform =
  | "ios"
  | "android"
  | "web"
  | "telegram"
  | "tg_ios"
  | "tg_android"
  | "tg_macos"
  | "tg_desktop"
  | "tg_web"
  | "unknown";

type PlatformContextType = {
  platform: AppPlatform;
  platformName: string;
  isPlatform: (platform: AppPlatform) => boolean;
  isTelegramReady: boolean;
  launchParams: LaunchParams | null;
};

const PlatformContext = createContext<PlatformContextType>({
  platform: "unknown",
  platformName: "Unknown Platform",
  isPlatform: () => false,
  isTelegramReady: false,
  launchParams: null,
});

const getPlatformType = (launchParams: LaunchParams | null): AppPlatform => {
  if (launchParams?.tgWebAppPlatform) {
    switch (launchParams.tgWebAppPlatform) {
      case "ios":
        return "tg_ios";
      case "android":
        return "tg_android";
      case "macos":
        return "tg_macos";
      case "tdesktop":
        return "tg_desktop";
      case "web":
        return "tg_web";
      default:
        return "telegram";
    }
  }
  if (
    typeof window !== "undefined" &&
    /iPhone|iPad|iPod/.test(navigator.userAgent)
  ) {
    return "ios";
  }
  if (typeof window !== "undefined" && /Android/.test(navigator.userAgent)) {
    return "android";
  }
  if (typeof window !== "undefined") {
    return "web";
  }
  return "unknown";
};

const getPlatformName = (platform: AppPlatform): string => {
  switch (platform) {
    case "tg_ios":
      return "Telegram iOS";
    case "tg_android":
      return "Telegram Android";
    case "tg_macos":
      return "Telegram macOS";
    case "tg_desktop":
      return "Telegram Desktop";
    case "tg_web":
      return "Telegram Web";
    case "telegram":
      return "Telegram Mini App";
    case "ios":
      return "iOS App";
    case "android":
      return "Android App";
    case "web":
      return "Web Browser";
    default:
      return "Unknown Platform";
  }
};

export const PlatformProvider = ({ children }: { children: ReactNode }) => {
  const [launchParams, setLaunchParams] = useState<LaunchParams | null>(null);
  const [isTelegramReady, setIsTelegramReady] = useState(false);

  useEffect(() => {
    try {
      setLaunchParams(retrieveLaunchParams());
    } catch (e) {
      setLaunchParams(null);
    }
    if (typeof window !== "undefined") {
      if (window.Telegram) setIsTelegramReady(true);
      else if (isTMA()) setTimeout(() => setIsTelegramReady(true), 100);
    }
  }, []);

  const platform = getPlatformType(launchParams);
  const platformName = getPlatformName(platform);
  const isPlatform = (p: AppPlatform) => platform === p;

  return (
    <PlatformContext.Provider
      value={{
        platform,
        platformName,
        isPlatform,
        isTelegramReady,
        launchParams,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => useContext(PlatformContext);

type ScreenContextType = {
  isLargeScreen: boolean;
};

const ScreenContext = createContext<ScreenContextType>({
  isLargeScreen: false,
});

export const ScreenProvider = ({ children }: { children: ReactNode }) => {
  const [isLargeScreen, setIsLargeScreen] = useState(() => {
    if (typeof window !== "undefined") {
      // For web, use window.innerWidth
      return window.innerWidth >= 600;
    }
    // For native, use Dimensions
    return Dimensions.get("window").width >= 600;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Web platform - use window resize event
      const handleResize = () => {
        const newIsLargeScreen = window.innerWidth >= 600;
        setIsLargeScreen(newIsLargeScreen);
      };

      window.addEventListener("resize", handleResize);

      // Call once to set initial value
      handleResize();

      return () => window.removeEventListener("resize", handleResize);
    } else {
      // Native platform - use Dimensions change event
      const onChange = ({
        window,
      }: {
        window: { width: number; height: number };
      }) => {
        const newIsLargeScreen = window.width >= 600;
        setIsLargeScreen(newIsLargeScreen);
      };

      const subscription = Dimensions.addEventListener("change", onChange);
      return () => subscription?.remove();
    }
  }, []);

  return (
    <ScreenContext.Provider value={{ isLargeScreen }}>
      {children}
    </ScreenContext.Provider>
  );
};

export const useScreen = () => {
  const context = useContext(ScreenContext);
  return context;
};

declare global {
  interface Window {
    Telegram?: any;
  }
}
