import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";

interface DotProps {
  selected?: boolean;
  style?: ViewStyle;
}

export const Dot: React.FC<DotProps> = ({ selected = false, style }) => {
  return (
    <View style={[styles.container, selected && styles.selected, style]}>
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
