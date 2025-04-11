import React from "react";
import { View, Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: "rgba(208, 208, 208, 0.5)", // Adjusted background
    alignSelf: "flex-start", // Don't stretch
    minWidth: 104, // From Figma
    alignItems: "center",
    // Add shadow
  },
  text: {
    fontSize: 15,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.96)",
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
