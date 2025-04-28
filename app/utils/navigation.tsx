import React from "react";
import { Linking, Platform } from "react-native";
import { detectPlatform, AppPlatform } from "./platform";

export type NavigationType = "stack" | "tab";

export interface NavigationConfig {
  type: NavigationType;
  headerVisible: boolean;
  animationsEnabled: boolean;
  gesturesEnabled: boolean;
  tabBarPosition: "bottom" | "top";
}

const navigationConfigs: Record<AppPlatform, NavigationConfig> = {
  mobile: {
    type: "stack",
    headerVisible: true,
    animationsEnabled: true,
    gesturesEnabled: true,
    tabBarPosition: "bottom",
  },
  web: {
    type: "stack",
    headerVisible: true,
    animationsEnabled: true,
    gesturesEnabled: false,
    tabBarPosition: "top",
  },
  telegram: {
    type: "stack",
    headerVisible: false,
    animationsEnabled: true,
    gesturesEnabled: false,
    tabBarPosition: "bottom",
  },
};

export const getNavigationConfig = (): NavigationConfig => {
  const platform = detectPlatform();
  return navigationConfigs[platform];
};

export const handleBackNavigation = (): boolean => {
  const platform = detectPlatform();

  switch (platform) {
    case "telegram":
      if (
        window.Telegram &&
        window.Telegram.WebApp &&
        window.Telegram.WebApp.BackButton
      ) {
        if (window.Telegram.WebApp.BackButton.isVisible) {
          // Let Telegram handle the back action
          return false;
        }
      }
      return true;

    case "web":
      // Use browser history if available
      if (
        typeof window !== "undefined" &&
        window.history &&
        window.history.length > 1
      ) {
        window.history.back();
        return false;
      }
      return true;

    case "mobile":
      return true;
  }
};

export const openExternalUrl = (url: string): void => {
  const platform = detectPlatform();

  switch (platform) {
    case "telegram":
      if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.openLink(url);
      } else {
        window.open(url, "_blank");
      }
      break;

    case "web":
      window.open(url, "_blank");
      break;

    case "mobile":
      Linking.openURL(url);
      break;
  }
};

export const useAppNavigation = () => {
  const config = getNavigationConfig();

  return {
    config,
    goBack: handleBackNavigation,
    openUrl: openExternalUrl,
  };
};
