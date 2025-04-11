import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const SecureField = () => {
  return (
    <View style={styles.container}>
      <Text>SecureField Component</Text>
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
