import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Figma Node: 2658:1074 (ValueLabel Component)

interface ValueLabelProps {
  value: string;
}

export const ValueLabel: React.FC<ValueLabelProps> = ({ value = "100%" }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: "rgba(60, 60, 67, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
  },
  text: {
    fontFamily: "System",
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
});
