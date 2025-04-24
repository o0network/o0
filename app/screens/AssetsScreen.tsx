import React, { useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import {
  Background,
  Navigation,
  Toggle,
  List,
  CellGrid,
  Frame,
  Outbound,
  Inbound,
} from "../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../App";

const mockListData = [
  { id: "1", title: "Asset 1 - 0xabc...def", symbol: "🪙" },
  { id: "2", title: "Asset 2 - sth.eth", symbol: "🪙" },
  { id: "3", title: "Asset 3 - another.eth", symbol: "🪙" },
];

const mockCellData: string[][] = [
  ["#C5E021", "#B2DD2D", "#2DB27D"],
  ["#E5E419", "#27AD81", "#9FDA39"],
  ["#AADC32", "#77D153", "#FE5542"],
];

type ViewMode = "map" | "list";

export const AssetsScreen: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [activeRoute, setActiveRoute] = useState("/assets");
  const [selectedMapCell, setSelectedMapCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const isListMode = viewMode === "list";
  const handleToggleChange = (isOn: boolean) => {
    setViewMode(isOn ? "list" : "map");
  };

  const handleNavigate = (route: string) => {
    console.log("Navigating to:", route);
    setActiveRoute(route);
  };

  const renderContent = () => {
    if (viewMode === "list") {
      return <List items={mockListData} />;
    } else {
      return (
        <CellGrid
          data={mockCellData}
          selectedCoords={selectedMapCell}
          onSelect={(row, col) => setSelectedMapCell({ row, col })}
        />
      );
    }
  };

  return (
    <View style={styles.outerContainer}>
      <SafeAreaView style={styles.safeArea}>
        <Outbound style={styles.frameContainer}>
          <View style={styles.addressContainer}>
            <Text style={styles.addressLabel}>Address:</Text>
            <Text style={styles.addressValue}>
              0x2FF6a90161E0aBF3e374c7B577d62d1cfE631c5C
            </Text>
          </View>

          <Inbound style={styles.graphPlaceholder}>
            <Text style={styles.placeholderText}>Graph Placeholder</Text>
          </Inbound>

          <View style={styles.bubblesSection}>
            <Text style={styles.bubblesLabel}>Your bubbles:</Text>
            <Inbound style={styles.bubblesGridPlaceholder}>
              <Text style={styles.placeholderText}>Bubbles Grid</Text>
            </Inbound>
          </View>

          <View style={styles.divider} />

          <Inbound style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Map</Text>
            <Toggle isOn={isListMode} onToggle={handleToggleChange} />
            <Text style={styles.toggleLabel}>List</Text>
          </Inbound>

          <View style={styles.dynamicContentContainer}>{renderContent()}</View>
        </Outbound>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  safeArea: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  frameContainer: {},
  addressContainer: {
    gap: 2,
    paddingHorizontal: 4,
  },
  addressLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 17,
    fontWeight: "600",
  },
  addressValue: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 13,
    fontFamily: "DMMono_500Medium",
  },
  graphPlaceholder: {
    height: 110,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    alignSelf: "stretch",
  },
  bubblesSection: {
    gap: 4,
    paddingHorizontal: 4,
  },
  bubblesLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 17,
    fontWeight: "600",
  },
  bubblesGridPlaceholder: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 6,
    padding: 8,
    minHeight: 50,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  placeholderText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignSelf: "stretch",
    marginVertical: 4,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 8,
    alignSelf: "stretch",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 100,
  },
  toggleLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 15,
    fontWeight: "600",
  },
  dynamicContentContainer: {
    flex: 1,
    alignSelf: "stretch",
  },
});

export default AssetsScreen;
