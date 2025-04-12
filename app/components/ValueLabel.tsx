import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Figma Node: 2658:1074 (ValueLabel Component)

const styles = StyleSheet.create({
  container: {
    // layout_IKDLGD
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10, // Gap not typically used in RN View like this
    borderRadius: 100,
    backgroundColor: "rgba(208, 208, 208, 0.5)", // fill_1VXSIE (second value approx)
    alignSelf: "flex-start",
    minWidth: 104, // dimensions: width: 104
    alignItems: "center",
    justifyContent: "center", // Added for text centering
    marginVertical: 5, // Keep existing margin
    // effect_R8VLI0 (shadow) omitted
  },
  text: {
    // Text Node 2658:1072 (style_5FA6YV, fills_2G2BWC)
    fontFamily: "System",
    fontSize: 15,
    fontWeight: "600", // Approx 590
    color: "rgba(255, 255, 255, 0.96)", // fill_2G2BWC
    textAlign: "center",
  },
});

interface ValueLabelProps {
  value: string;
}

export const ValueLabel: React.FC<ValueLabelProps> = ({ value }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{value}</Text>
    </View>
  );
};
