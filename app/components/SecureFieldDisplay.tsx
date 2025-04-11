import React from "react";
import { View, Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(208, 208, 208, 0.5)", // Combined background/fill
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 10, // Adjust for proper height
    justifyContent: "center",
    alignSelf: "stretch",
    minHeight: 44, // Estimate
    // Add boxShadow/effects if needed
  },
  dotsContainer: {
    // Figma shows vertical alignment adjustment, might need tweaking
    paddingBottom: 6,
  },
  dots: {
    fontSize: 38, // Large font size for dots
    lineHeight: 38 * 0.58, // Adjust line height based on Figma (approx 0.578)
    color: "rgba(255, 255, 255, 0.23)", // Text color
    fontWeight: "500",
  },
});

interface SecureFieldDisplayProps {
  dotCount?: number;
}

const SecureFieldDisplay: React.FC<SecureFieldDisplayProps> = ({
  dotCount = 6,
}) => {
  const dots = "•".repeat(dotCount);

  return (
    <View style={styles.container}>
      <View style={styles.dotsContainer}>
        <Text style={styles.dots}>{dots}</Text>
      </View>
    </View>
  );
};

export default SecureFieldDisplay;
