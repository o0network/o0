import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

// Figma Node: 2658:1355 (AddButton Component)

const styles = StyleSheet.create({
  container: {
    // layout_8XENC7 (fixed size), borderRadius
    width: 24, // Match Dot size
    height: 24,
    borderRadius: 100,
    backgroundColor: "rgba(94, 94, 94, 0.13)", // From fill_DBM9LX (second value approx)
    justifyContent: "center",
    alignItems: "center",
  },
  symbol: {
    // Text Node 2658:1087 (style_VFH8EI, fills_2G2BWC)
    fontFamily: "System",
    fontSize: 19,
    fontWeight: "500", // Approx 510
    color: "rgba(255, 255, 255, 0.96)", // fill_2G2BWC
    textAlign: "center",
    // Letter spacing ignored
  },
});

export const AddButton = () => {
  const symbol = "􀅼"; // Text Node 2658:1087

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7}>
      <Text style={styles.symbol}>{symbol}</Text>
    </TouchableOpacity>
  );
};
