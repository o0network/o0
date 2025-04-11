import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Platform, Text, ScrollView } from "react-native";
import {
  Switch,
  Card,
  Gallery,
  TextField,
  SearchField,
  SecureField,
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

export default function App() {
  const platformName =
    Platform.OS === "web"
      ? window.location.pathname.includes("tg")
        ? "Telegram"
        : "Web"
      : Platform.OS;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.platformText}>Running on: {platformName}</Text>
          <Switch />
          <Card />
          <Gallery />
          <TextField />
          <SearchField />
          <SecureField />
          <FigmaButton />
          <List />
          <Navigation />
          <Toggle />
          <Checkbox />
          <ValueLabel />
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
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
  },
  platformText: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: "center",
  },
});
