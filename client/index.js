// Import the runtime first for DOM components support
import "@expo/metro-runtime";
import "react-native-gesture-handler";
import { registerRootComponent } from "expo";
import App from "./App";

registerRootComponent(App);
