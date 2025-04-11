import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const AddButton = () => {
  return (
    <View style={styles.container}>
      <Text>AddButton</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    borderWidth: 1,
    borderColor: "green", // Different color
    marginVertical: 2,
    marginHorizontal: 2,
    borderRadius: 10,
    width: 70, // Different size
    alignItems: "center",
    justifyContent: "center", // Center text
  },
});
