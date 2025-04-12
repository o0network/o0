import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Platform,
  Text,
  ScrollView,
  ImageBackground,
} from "react-native";
import {
  Switch,
  Card,
  Gallery,
  Field,
  FigmaButton,
  List,
  Navigation,
  Toggle,
  Checkbox,
  ValueLabel,
  Slider,
  Dot,
  DotSelected,
} from "./components";

const listItems = [
  { id: 1, title: "Copy", symbol: "􀉁" },
  { id: 2, title: "Print", symbol: "􀎚" },
  { id: 3, title: "Duplicate", symbol: "􀐇" },
];

const navItems = [
  { id: "explore", symbol: "􀉈", onPress: () => console.log("Nav: Explore") },
  { id: "create", symbol: "􀉁", onPress: () => console.log("Nav: Create") },
  {
    id: "portfolio",
    symbol: "􀈑",
    onPress: () => console.log("Nav: Portfolio"),
  },
];

export default function App() {
  const platformName =
    Platform.OS === "web"
      ? window.location.pathname.includes("tg")
        ? "Telegram"
        : "Web"
      : Platform.OS;

  const [isToggleOn, setIsToggleOn] = React.useState(true);
  const [isChecked, setIsChecked] = React.useState(true);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ImageBackground
        source={require("./assets/images/background-gradient.png")}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.platformText}>Running on: {platformName}</Text>
          <Switch />
          <Card />
          <Gallery />
          <Field placeholder="Text Field" />
          <Field placeholder="Search" leftIconName="search" />
          <Field placeholder="Password" secureTextEntry={true} />
          <FigmaButton />
          <List items={listItems} />
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Navigation items={navItems} />
            <Toggle isOn={isToggleOn} onToggle={setIsToggleOn} />
            <ValueLabel value="100%" />
          </View>
          <Checkbox isChecked={isChecked} onToggle={setIsChecked} />
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Dot />
            <Dot />
          </View>
          <Slider />
        </View>
        <StatusBar style="auto" />
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    resizeMode: "cover",
    backgroundColor: "#1c1c1e",
  },
  content: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    gap: 10,
  },
  platformText: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: "center",
    color: "#8e8e93",
  },
});
