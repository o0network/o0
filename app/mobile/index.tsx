import React from "react";
import { registerRootComponent } from "expo";
import App from "../App";

// Mobile-specific initialization code can go here
// For example, setting up mobile-specific navigation, notifications, etc.

// Register the root component (App already has PlatformProvider)
registerRootComponent(App);
