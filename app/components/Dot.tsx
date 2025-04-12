import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";

// Figma Node: 2658:1356 (Dot Component)
// Also represents other Dot frames like 2658:1081, 2658:1082

interface DotProps {
  selected?: boolean;
  style?: ViewStyle;
  color?: string; // Allow specifying color based on Figma fills
}

export const Dot: React.FC<DotProps> = ({
  selected = false,
  style,
  color = "#000000" /* Default from 2658:1356 fill_850ZME */,
}) => {
  return (
    <View
      style={[
        styles.container,
        selected && styles.selected,
        style,
        { backgroundColor: color },
      ]}
    >
      <Text>{selected ? "DotSelected Component" : "Dot Component"}</Text>
    </View>
  );
};

export const DotSelected: React.FC<Omit<DotProps, "selected">> = (props) => {
  return <Dot {...props} selected={true} />;
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    borderWidth: 1,
    borderColor: "lightgray",
    marginVertical: 2,
    marginHorizontal: 2,
    borderRadius: 10,
    width: 50,
    alignItems: "center",
  },
  selected: {
    borderWidth: 2,
    borderColor: "blue",
    width: 60,
  },
});
