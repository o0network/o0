import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const DotSelected = () => {
  return (
    <View style={styles.container}>
      <Text>DotSelected</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    borderWidth: 2,
    borderColor: "blue",
    marginVertical: 2,
    marginHorizontal: 2,
    borderRadius: 10,
    width: 60,
    alignItems: "center",
    justifyContent: "center", // Center text
  },
});
