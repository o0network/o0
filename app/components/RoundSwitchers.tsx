import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Define props type
interface RoundSwitchersProps {
  children: React.ReactNode;
}

// Container for Dot, DotSelected, AddButton
export const RoundSwitchers: React.FC<RoundSwitchersProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>RoundSwitchers Container</Text>
      <View style={styles.itemsContainer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderWidth: 1,
    borderColor: "lightblue", // Different border for container
    marginVertical: 5,
    alignSelf: "stretch",
    alignItems: "center", // Center title
  },
  title: {
    color: "#ccc",
    marginBottom: 5,
  },
  itemsContainer: {
    // Style for children layout
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
});
