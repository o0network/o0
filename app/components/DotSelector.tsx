import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { AddButton } from "./AddButton";

// Figma Node: 2658:1356 (Dot Component)
// Also represents other Dot frames like 2658:1081, 2658:1082

interface DotProps {
  color?: string; // Allow specifying color based on Figma fills
  selected?: boolean;
}

const Dot: React.FC<DotProps> = ({
  color = "#000000" /* Default from 2658:1356 fill_850ZME */,
  selected = false,
}) => {
  if (selected) {
    return (
      <View style={styles.selectedContainer}>
        <View style={[styles.selectionRing, { borderColor: color }]}>
          <View style={[styles.selectionFill, { backgroundColor: color }]} />
        </View>
      </View>
    );
  }

  return <View style={[styles.container, { backgroundColor: color }]} />;
};

interface DotSelectorProps {
  options: Array<{
    color: string;
    selected?: boolean;
    onSelect?: () => void;
  }>;
  showAddButton?: boolean;
  onAddPress?: () => void;
}

export const DotSelector: React.FC<DotSelectorProps> = ({
  options,
  showAddButton = false,
  onAddPress,
}) => {
  return (
    <View style={styles.dotSelector}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.dotWrapper}
          onPress={option.onSelect}
          activeOpacity={0.7}
        >
          <Dot color={option.color} selected={option.selected} />
        </TouchableOpacity>
      ))}

      {showAddButton && (
        <TouchableOpacity
          style={styles.dotWrapper}
          onPress={onAddPress}
          activeOpacity={0.7}
        >
          <AddButton onPress={onAddPress} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    borderRadius: 100,
  },
  selectedContainer: {
    width: 24,
    height: 24,
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
  dotSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  dotWrapper: {
    padding: 3, // Add padding for better touch area
  },
});
