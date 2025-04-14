import React from "react";
import { registerRootComponent } from "expo";
import App from "../App";

// Declare the Telegram WebApp type
declare global {
  interface Window {
    Telegram?: {
      WebApp?: any;
    };
  }
}

// Initialize Telegram WebApp SDK
const initTelegramMiniApp = () => {
  if (
    typeof window !== "undefined" &&
    window.Telegram &&
    window.Telegram.WebApp
  ) {
    // Initialize Telegram Mini App
    const WebApp = window.Telegram.WebApp;

    // Expand to viewport width
    WebApp.expand();

    // Set up Telegram Mini App theme
    document.documentElement.classList.add("tg-theme");
    document.documentElement.style.setProperty(
      "--tg-theme-bg-color",
      WebApp.backgroundColor
    );
    document.documentElement.style.setProperty(
      "--tg-theme-text-color",
      WebApp.textColor
    );
    document.documentElement.style.setProperty(
      "--tg-theme-hint-color",
      WebApp.secondaryBgColor || "#999999"
    );
    document.documentElement.style.setProperty(
      "--tg-theme-link-color",
      WebApp.linkColor || "#2678b6"
    );
    document.documentElement.style.setProperty(
      "--tg-theme-button-color",
      WebApp.buttonColor || "#2678b6"
    );
    document.documentElement.style.setProperty(
      "--tg-theme-button-text-color",
      WebApp.buttonTextColor || "#ffffff"
    );

    // Tell Telegram WebApp we are ready
    WebApp.ready();
  }
};

// Initialize Telegram Mini App when the app loads
if (typeof window !== "undefined") {
  window.addEventListener("load", initTelegramMiniApp);
}

// Register the root component (App already has PlatformProvider)
registerRootComponent(App);
