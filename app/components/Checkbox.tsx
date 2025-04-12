import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

// Figma Node: 2658:1065 (Checkbox Component)

const styles = StyleSheet.create({
  container: {
    // Derived from layout_8XENC7 (fixed size), borderRadius
    width: 28, // Inferred size
    height: 28,
    borderRadius: 100, // borderRadius: 100px
    justifyContent: "center",
    alignItems: "center",
    // Border or background applied dynamically
  },
  unchecked: {
    borderWidth: 1, // Example border for unchecked
    borderColor: "rgba(255, 255, 255, 0.3)", // Example light border
  },
  checked: {
    backgroundColor: "#0A84FF", // fill_9OLTYY
  },
  checkmark: {
    // Text Node 2658:1064 (style_GHQP9V, fills_YBBY7M)
    fontFamily: "System",
    fontSize: 13,
    fontWeight: "600", // Approx 590
    color: "#FFFFFF", // fill_YBBY7M
    textAlign: "center",
  },
});

interface CheckboxProps {
  isChecked: boolean;
  onToggle: (value: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ isChecked, onToggle }) => {
  const checkSymbol = "􀆅"; // Text Node 2658:1064

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onToggle(!isChecked)}
      style={[styles.container, isChecked ? styles.checked : styles.unchecked]}
    >
      {isChecked && <Text style={styles.checkmark}>{checkSymbol}</Text>}
    </TouchableOpacity>
  );
};
