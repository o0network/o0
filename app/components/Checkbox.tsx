import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: 28, // Approximate size
    height: 28,
    borderRadius: 14, // Make it circular
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)", // Border for unchecked state
  },
  containerChecked: {
    backgroundColor: "#0A84FF", // Blue when checked (adjust color if needed)
    borderColor: "#0A84FF",
  },
  checkmark: {
    fontSize: 13, // Adjust size as needed
    fontWeight: "bold", // SF Pro Bold
    color: "#FFFFFF",
  },
});

interface CheckboxProps {
  isChecked: boolean;
  onToggle: (value: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ isChecked, onToggle }) => {
  const checkSymbol = "􀆅"; // Checkmark symbol

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => onToggle(!isChecked)}>
      <View style={[styles.container, isChecked && styles.containerChecked]}>
        {isChecked && <Text style={styles.checkmark}>{checkSymbol}</Text>}
      </View>
    </TouchableOpacity>
  );
};
