import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const DotSelected = () => {
  return (
    <View style={styles.container}>
      <Text>DotSelected Component</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5, // Smaller padding
    borderWidth: 2, // Thicker border
    borderColor: "blue", // Different color for selected
    marginVertical: 2,
    marginHorizontal: 2,
    borderRadius: 10, // Make it roundish
    width: 60, // Slightly larger
    alignItems: "center",
  },
});
