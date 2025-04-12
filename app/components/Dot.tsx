import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";

// Figma Node: 2658:1356 (Dot Component)
// Also represents other Dot frames like 2658:1081, 2658:1082

interface DotProps {
  color?: string; // Allow specifying color based on Figma fills
}

export const Dot: React.FC<DotProps> = ({
  color = "#000000" /* Default from 2658:1356 fill_850ZME */,
}) => {
  return <View style={[styles.container, { backgroundColor: color }]} />;
};

const styles = StyleSheet.create({
  container: {
    // layout_8XENC7 (fixed size), borderRadius
    width: 24, // Inferred size from context
    height: 24,
    borderRadius: 100, // borderRadius: 100px
  },
  // REMOVED unused styles for selected state
});
