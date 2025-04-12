import React from "react";
import { View, Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(208, 208, 208, 0.5)", // Combined background/fill
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12, // Adjust for proper height
    justifyContent: "center",
    alignSelf: "stretch",
    minHeight: 44, // Estimate
  },
  text: {
    fontSize: 17,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.23)", // Placeholder text color
    // Adjust color if it should display actual value
  },
});

interface TextFieldDisplayProps {
  value: string;
}

const TextFieldDisplay: React.FC<TextFieldDisplayProps> = ({ value }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{value}</Text>
    </View>
  );
};

export default TextFieldDisplay;
