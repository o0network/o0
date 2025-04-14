import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

// Figma Node: 2658:1049 (Button Component)
export const FigmaButton = () => {
  // Icon: 2651:11773 (textStyle_5FA6YV, fills_2G2BWC)
  // Label: 2651:11774 (textStyle_5FA6YV, fills_2G2BWC)
  const icon = "😸";
  const label = "Button";

  return (
    // Container: 2658:1049 (fills_Q9LOHA, strokes_IRPERO, effects_OUM1NZ, layout_1Y5HES, borderRadius)
    <TouchableOpacity style={styles.container}>
      <Text style={styles.textStyle}>{icon}</Text>
      <Text style={styles.textStyle}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // layout_1Y5HES
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    gap: 3,
    paddingVertical: 10, // Guessed padding for ~44px height
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: "rgba(94, 94, 94, 0.18)", // From fill_Q9LOHA (second value)
    // strokes_IRPERO (gradient) and effects_OUM1NZ (shadow) omitted
    minHeight: 44, // Estimate
    marginVertical: 5, // Keep existing margin
  },
  textStyle: {
    // style_5FA6YV
    fontFamily: "System",
    fontSize: 15,
    fontWeight: "600", // Approx 590
    color: "rgba(255, 255, 255, 0.96)", // fill_2G2BWC
    textAlign: "center",
  },
});
