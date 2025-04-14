import React from "react";
import { StyleSheet, View } from "react-native";
import { AddButton } from "./AddButton";

export type RoundButtonVariant = "dot" | "selected" | "add";

interface RoundButtonProps {
  variant?: RoundButtonVariant;
  color?: string;
  onPress?: () => void;
}

export const RoundButton: React.FC<RoundButtonProps> = ({
  variant = "dot",
  color = "#000000",
  onPress,
}) => {
  // For "add" variant, just return the AddButton component
  if (variant === "add") {
    return <AddButton onPress={onPress} />;
  }

  // Determine background color based on variant
  let backgroundColor = color;
  if (variant === "selected") {
    backgroundColor = "transparent"; // No background for selected variant
  }

  // For "selected" variant, render a dot with selection ring
  if (variant === "selected") {
    return (
      <View style={styles.container}>
        <View style={[styles.selectionRing, { borderColor: color }]}>
          <View style={[styles.selectionFill, { backgroundColor: color }]} />
        </View>
      </View>
    );
  }

  // For regular "dot" variant
  return <View style={[styles.container, { backgroundColor }]} />;
};

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  selectionRing: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#FF4015",
    justifyContent: "center",
    alignItems: "center",
  },
  selectionFill: {
    width: 10,
    height: 10,
    borderRadius: 100,
    backgroundColor: "#FF4015",
  },
});
