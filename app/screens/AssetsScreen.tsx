import React, { useState } from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import {
  Background,
  Navigation,
  Toggle,
  List,
  CellGrid,
  Frame,
} from "../components";
import { SafeAreaView } from "react-native-safe-area-context";

// Placeholder data - replace with actual data fetching/management
const mockListData = [
  { id: "1", title: "Asset 1 - 0xabc...def", symbol: "🪙" }, // Use props expected by List
  { id: "2", title: "Asset 2 - sth.eth", symbol: "🪙" },
  { id: "3", title: "Asset 3 - another.eth", symbol: "🪙" },
];

// CellGrid expects a 2D array of color strings
const mockCellData: string[][] = [
  // Simplified based on Figma, using color strings
  ["#C5E021", "#B2DD2D", "#2DB27D"],
  ["#E5E419", "#27AD81", "#9FDA39"],
  ["#AADC32", "#77D153", "#FE5542"],
];

type ViewMode = "map" | "list";

export const AssetsScreen: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [activeRoute, setActiveRoute] = useState("/assets"); // Placeholder for nav state
  const [selectedMapCell, setSelectedMapCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  // Adapt to ToggleProps: Map 'map'/'list' to boolean for the simple Toggle
  const isListMode = viewMode === "list";
  const handleToggleChange = (isOn: boolean) => {
    setViewMode(isOn ? "list" : "map");
  };

  // Placeholder navigation handler
  const handleNavigate = (route: string) => {
    console.log("Navigating to:", route);
    setActiveRoute(route);
    // Implement actual navigation logic here (e.g., using react-navigation)
  };

  const renderContent = () => {
    if (viewMode === "list") {
      // Pass items directly to List component
      return <List items={mockListData} />;
    } else {
      // Pass color string array and selection state to CellGrid
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
      <Background />
      <SafeAreaView style={styles.safeArea}>
        <Frame style={styles.frameContainer}>
          <Navigation activeRoute={activeRoute} onNavigate={handleNavigate} />
          <View style={styles.addressContainer}>
            <Text style={styles.addressLabel}>Address:</Text>
            <Text style={styles.addressValue}>
              0x2FF6a90161E0aBF3e374c7B577d62d1cfE631c5C
            </Text>
          </View>

          <View style={styles.graphPlaceholder}>
            <Text style={styles.placeholderText}>Graph Placeholder</Text>
          </View>

          <View style={styles.bubblesSection}>
            <Text style={styles.bubblesLabel}>Your bubbles:</Text>
            <View style={styles.bubblesGridPlaceholder}>
              <Text style={styles.placeholderText}>Bubbles Grid</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Map</Text>
            <Toggle isOn={isListMode} onToggle={handleToggleChange} />
            <Text style={styles.toggleLabel}>List</Text>
          </View>

          <View style={styles.dynamicContentContainer}>{renderContent()}</View>
        </Frame>
      </SafeAreaView>
    </View>
  );
};

// TODO: Refine styles based on Figma details (fills, strokes, layout props, text styles)
const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    position: "relative", // For Background
    justifyContent: "center", // Center Frame vertically
    alignItems: "center", // Center Frame horizontally
  },
  safeArea: {
    flex: 1,
    width: "100%", // Ensure SafeArea takes width
    justifyContent: "center",
    alignItems: "center",
  },
  frameContainer: {
    // Frame controls its own width/maxWidth/styling
    // No need for flex: 1 here, let it size based on content or internal style
    // maxHeight: '90%', // Optional: constrain height
  },
  addressContainer: {
    gap: 2,
    paddingHorizontal: 4,
  },
  addressLabel: {
    color: "rgba(255, 255, 255, 0.7)", // Softer white
    fontSize: 17,
    fontWeight: "500",
  },
  addressValue: {
    color: "rgba(255, 255, 255, 0.9)", // Brighter white
    fontSize: 12,
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace", // Use monospace
  },
  graphPlaceholder: {
    height: 110, // Approximation from Figma data
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Placeholder background
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    alignSelf: "stretch",
  },
  bubblesSection: {
    gap: 4, // Increased gap
    paddingHorizontal: 4, // Added padding
  },
  bubblesLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 17,
    fontWeight: "500",
  },
  bubblesGridPlaceholder: {
    backgroundColor: "rgba(0, 0, 0, 0.3)", // from 2727:23054
    borderRadius: 6, // from 2727:23054
    padding: 8, // Increased padding
    minHeight: 50, // Placeholder height
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  placeholderText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 14,
  },
  divider: {
    height: 1, // Thinner divider
    backgroundColor: "rgba(255, 255, 255, 0.2)", // from stroke_JPEI2U
    alignSelf: "stretch",
    marginVertical: 4, // Added vertical margin
  },
  toggleContainer: {
    // Style for the temporary Toggle setup
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 8,
    alignSelf: "stretch",
    backgroundColor: "rgba(0, 0, 0, 0.1)", // Slight background for contrast
    borderRadius: 100, // Match Figma segmented control shape
  },
  toggleLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 15,
    fontWeight: "500",
  },
  dynamicContentContainer: {
    flex: 1, // Allow this container to expand
    alignSelf: "stretch",
    // Add padding if needed around List/CellGrid
  },
  // Removed listItem style as List component handles its own rendering
});

export default AssetsScreen;
