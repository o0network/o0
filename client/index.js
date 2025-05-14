// Import the runtime first for DOM components support
import "@expo/metro-runtime";
import "react-native-gesture-handler";
import { registerRootComponent } from "expo";
import {
  init,
  swipeBehavior,
  viewport,
  closingBehavior,
  settingsButton,
} from "@telegram-apps/sdk";
import App from "./App";
import { postEvent, on } from "@telegram-apps/bridge";
// import eruda from "eruda";
// eruda.init();

try {
  init({ postEvent, on });


  if (swipeBehavior.mount.isAvailable()) {
    swipeBehavior.mount();
    if (swipeBehavior.disableVertical.isAvailable()) {
      swipeBehavior.disableVertical();
      console.log(swipeBehavior.isVerticalEnabled());
    }
  }

  postEvent("web_app_toggle_orientation_lock", { locked: true });

  closingBehavior.mount();
  closingBehavior.enableConfirmation();

  settingsButton.mount();
  settingsButton.show();

  viewport
    .mount()
    .then(() => {
      viewport.expand();
      viewport.requestFullscreen();
    })
    .catch((err) => {
      console.error("Error mounting Telegram viewport:", err);
    });
} catch (err) {
  console.error("Error initializing Telegram features:", err);
}


registerRootComponent(App);
