import React from "react";
import { registerRootComponent } from "expo";
import App from "../App";

// Web-specific initialization code can go here
// For example, setting up web-specific analytics, or web-only features

// Register the root component (App already has PlatformProvider)
registerRootComponent(App);
