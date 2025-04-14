import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  Platform,
} from "react-native";

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  trackColor?: { false: string; true: string };
  thumbColor?: string;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  trackColor = { false: "rgba(120, 120, 128, 0.16)", true: "#34C759" },
  thumbColor = "#FFFFFF",
  disabled = false,
}) => {
  const thumbPosition = value ? 22 : 0;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => !disabled && onValueChange(!value)}
      style={[
        styles.container,
        { backgroundColor: value ? trackColor.true : trackColor.false },
        disabled && styles.disabled,
      ]}
      disabled={disabled}
    >
      <View
        style={[
          styles.thumb,
          { backgroundColor: thumbColor },
          { transform: [{ translateX: thumbPosition }] },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 51,
    height: 31,
    borderRadius: 16,
    padding: 4,
    justifyContent: "center",
  },
  thumb: {
    width: 25,
    height: 25,
    borderRadius: 13,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
  },
  disabled: {
    opacity: 0.4,
  },
});
