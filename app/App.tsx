import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Platform, Text, ScrollView } from "react-native";
import {
  Switch,
  Card,
  Gallery,
  TextField,
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

// Define dummy data/handlers for components needing props
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

  // State for Toggle and Checkbox example
  const [isToggleOn, setIsToggleOn] = React.useState(true);
  const [isChecked, setIsChecked] = React.useState(true);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.platformText}>Running on: {platformName}</Text>
          <Switch />
          <Card />
          <Gallery />
          <TextField placeholder="Text Field" />
          <TextField placeholder="Search" leftIconName="search" />
          <TextField placeholder="Password" secureTextEntry={true} />
          <FigmaButton />
          <List items={listItems} />
          <Navigation items={navItems} />
          <Toggle isOn={isToggleOn} onToggle={setIsToggleOn} />
          <Checkbox isChecked={isChecked} onToggle={setIsChecked} />
          <ValueLabel value="100%" />
          <Slider />
          <RoundSwitchers>
            <Dot />
            <DotSelected />
            <AddButton />
          </RoundSwitchers>
          <CellGrid />
        </View>
        <StatusBar style="auto" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
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
