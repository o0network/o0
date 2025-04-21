// Import the runtime first for DOM components support
import "@expo/metro-runtime";
import "react-native-gesture-handler"; // Must be at the top of your entry file
import { registerRootComponent } from "expo";
import App from "./App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
