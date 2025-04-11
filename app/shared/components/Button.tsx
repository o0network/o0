import React from "react";
import { TouchableOpacity, Text, StyleSheet, Platform } from "react-native";

interface ButtonProps {
  title: string;
  onClick: () => void;
  style?: object;
}

export const Button: React.FC<ButtonProps> = ({ title, onClick, style }) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onClick}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2196F3",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
    ...Platform.select({
      web: {
        cursor: "pointer",
        userSelect: "none",
        outlineStyle: "none",
      },
    }),
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
