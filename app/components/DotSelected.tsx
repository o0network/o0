import React from "react";
import { View, StyleSheet } from "react-native";

// Figma Node: 2658:1083 (DotSelected Frame)

export const DotSelected = () => {
  return (
    // Container: 2658:1083 (layout_8XENC7, borderRadius)
    <View style={styles.container}>
      {/* Selection Ring: 2658:1085 (strokes_UZVZWS, layout_F08E0B, borderRadius) */}
      <View style={styles.selectionRing}>
        {/* Selection Fill: 2658:1084 (fills_CTWGZ7, layout_F08E0B, borderRadius) */}
        <View style={styles.selectionFill} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // layout_8XENC7 (fixed size)
    width: 24, // Match Dot size
    height: 24,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  selectionRing: {
    // layout_F08E0B applied via absolute positioning/sizing
    position: "absolute",
    width: 24, // Match container size
    height: 24,
    borderRadius: 100,
    borderWidth: 3, // strokes_UZVZWS: strokeWeight: 3px
    borderColor: "#FF4015", // strokes_UZVZWS: color
    justifyContent: "center",
    alignItems: "center",
  },
  selectionFill: {
    // layout_F08E0B applied via sizing
    width: 10, // Smaller inner dot size (guessed)
    height: 10,
    borderRadius: 100,
    backgroundColor: "#FF4015", // fills_CTWGZ7
  },
});
