import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Figma Node: 2658:1065 (Checkbox Component)

interface CheckboxProps {
  isChecked: boolean;
  onToggle: (value: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ isChecked, onToggle }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onToggle(!isChecked)}
      style={[styles.container, isChecked ? styles.checked : styles.unchecked]}
    >
      {isChecked && <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  unchecked: {
    borderWidth: 1.5,
    borderColor: "rgba(235, 235, 245, 0.3)",
  },
  checked: {
    backgroundColor: "#0A84FF",
  },
});
