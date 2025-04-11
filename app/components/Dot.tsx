import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const Dot = () => {
  return (
    <View style={styles.container}>
      <Text>Dot Component</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5, // Smaller padding
    borderWidth: 1,
    borderColor: "lightgray",
    marginVertical: 2,
    marginHorizontal: 2,
    borderRadius: 10, // Make it roundish
    width: 50,
    alignItems: "center",
  },
});
