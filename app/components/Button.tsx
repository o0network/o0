import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Renaming to avoid conflict with existing Button component
export const FigmaButton = () => {
  return (
    <View style={styles.container}>
      <Text>Button Component</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    marginVertical: 5,
  },
});
