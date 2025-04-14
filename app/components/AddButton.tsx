import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
});

export const AddButton = ({ onPress }: { onPress?: () => void }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Ionicons name="add" size={19} color="rgba(255, 255, 255, 0.96)" />
    </TouchableOpacity>
  );
};
