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
  RoundSwitchers,
  Dot,
  DotSelected,
  AddButton,
  CellGrid,
} from "./components";
import { BlurView } from "expo-blur";

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
    <View style={styles.outerContainer}>
      <ImageBackground
        source={require("./assets/images/background-gradient.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
          >
            <Text style={styles.platformText}>Running on: {platformName}</Text>
            <Switch />
            <Card />
            <Gallery />
            <Field placeholder="Text Field" />
            <Field placeholder="Search" leftIconName="search" />
            <Field placeholder="Password" secureTextEntry={true} />
            <FigmaButton />
            <List items={listItems} />
            <View style={styles.inlineRow}>
              <Toggle isOn={isToggleOn} onToggle={setIsToggleOn} />
              <Checkbox isChecked={isChecked} onToggle={setIsChecked} />
              <ValueLabel value="100%" />
            </View>
            <Slider />
            <RoundSwitchers>
              <Dot color="#000000" />
              <Dot color="#007AFF" />
              <Dot color="#34C759" />
              <DotSelected />
              <AddButton />
            </RoundSwitchers>
            <CellGrid />
          </ScrollView>
        </BlurView>
      </ImageBackground>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    width: "100%",
    maxWidth: 700,
  },
  contentContainer: {
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    paddingBottom: 50,
    gap: 15,
  },
  platformText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    color: "rgba(235, 235, 245, 0.6)",
  },
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    alignSelf: "stretch",
  },
});
