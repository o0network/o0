import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Figma Node: 2658:1078 (RoundSwitchers Frame)

// Define props type
interface RoundSwitchersProps {
  children: React.ReactNode;
}

// Container for Dot, DotSelected, AddButton
export const RoundSwitchers: React.FC<RoundSwitchersProps> = ({ children }) => {
  return (
    // Container: 2658:1078 (layout_EDFZ4A)
    <View style={styles.container}>{children}</View>
  );
};

const styles = StyleSheet.create({
  container: {
    // layout_EDFZ4A
    flexDirection: "row",
    justifyContent: "space-between", // justifyContent: space-between
    alignSelf: "stretch", // alignSelf: stretch
    alignItems: "center", // Added for vertical alignment
    marginVertical: 5, // Keep existing margin
    paddingHorizontal: 10, // Added padding for visual spacing
    minHeight: 30, // Estimated height based on children (dots/button)
  },
  // Removed title and itemsContainer styles as the container itself handles layout
});
