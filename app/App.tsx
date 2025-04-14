import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from "react-native";
import {
  Switch,
  Card,
  Field,
  FigmaButton,
  List,
  Toggle,
  Checkbox,
  ValueLabel,
  Slider,
  CellGrid,
  DotSelector,
} from "./components";
import Background from "./components/Background";
import BubbleBar from "./components/BubbleBar";

import { PlatformProvider, usePlatformContext } from "./utils/platform";
const listItems = [
  { id: 1, title: "Copy", iconName: "copy-outline" },
  { id: 2, title: "Print", iconName: "print-outline" },
  { id: 3, title: "Duplicate", iconName: "documents-outline" },
];

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
const isTablet = deviceWidth > 768;
const contentWidth = Math.min(deviceWidth, isTablet ? 420 : 390);

// Main App content component
function AppContent() {
  const [isToggleOn, setIsToggleOn] = useState(true);
  const [isChecked, setIsChecked] = useState(true);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [selectedDotIndex, setSelectedDotIndex] = useState(3);
  const { platformName } = usePlatformContext();

  const dotOptions = [
    {
      color: "#000000",
      selected: selectedDotIndex === 0,
      onSelect: () => setSelectedDotIndex(0),
    },
    {
      color: "#007AFF",
      selected: selectedDotIndex === 1,
      onSelect: () => setSelectedDotIndex(1),
    },
    {
      color: "#34C759",
      selected: selectedDotIndex === 2,
      onSelect: () => setSelectedDotIndex(2),
    },
    {
      color: "#FF4015",
      selected: selectedDotIndex === 3,
      onSelect: () => setSelectedDotIndex(3),
    },
  ];

  return (
    <View style={styles.outerContainer}>
      <View style={styles.backgroundWrapper}>
        <Background />
      </View>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentWrapper}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.platformText}>Running on: {platformName}</Text>

            <View style={styles.topButtonRow}>
              <FigmaButton />
              <FigmaButton />
            </View>

            <Card />

            <View style={styles.cardSection}>
              <DotSelector
                options={dotOptions}
                showAddButton={true}
                onAddPress={() => console.log("Add button pressed")}
              />
            </View>

            <View style={styles.fieldSection}>
              <Field placeholder="Value" />
              <Field placeholder="Search" leftIconName="search" />
              <Field placeholder="Password" secureTextEntry={true} />
            </View>

            <FigmaButton />

            <List items={listItems} />

            <BubbleBar
              onTabChange={(tabId) => console.log(`Tab changed to: ${tabId}`)}
            />

            <View style={styles.controlsSection}>
              <Toggle isOn={isToggleOn} onToggle={setIsToggleOn} />
              <Checkbox isChecked={isChecked} onToggle={setIsChecked} />
              <Switch
                value={isSwitchOn}
                onValueChange={setIsSwitchOn}
                trackColor={{ false: "#767577", true: "#0A84FF" }}
                thumbColor="#FFFFFF"
              />
              <ValueLabel value="100%" />
            </View>

            <Slider />

            <CellGrid />
          </ScrollView>
        </View>
      </SafeAreaView>
      <StatusBar style="light" />
    </View>
  );
}

// Root component that wraps the AppContent with PlatformProvider
export default function App() {
  return (
    <PlatformProvider>
      <AppContent />
    </PlatformProvider>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Darker background to make particles more visible
  },
  backgroundWrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  safeArea: {
    flex: 1,
    zIndex: 1,
  },
  contentWrapper: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  scrollContent: {
    width: contentWidth,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 12,
    alignItems: "center",
  },
  platformText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
    color: "rgba(235, 235, 245, 0.6)",
  },
  topButtonRow: {
    flexDirection: "row",
    width: "100%",
    gap: 8,
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardSection: {
    width: "100%",
    marginVertical: 8,
  },
  fieldSection: {
    width: "100%",
    gap: 8,
    marginVertical: 4,
  },
  controlsSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 12,
    gap: 20,
  },
  noiseContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});
