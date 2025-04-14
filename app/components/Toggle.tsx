import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { Text } from "react-native";

// Figma Node: 2658:1062 (Toggle Component)

const styles = StyleSheet.create({
  container: {
    // layout_WNV36K
    width: 51,
    height: 31,
    borderRadius: 100,
    paddingVertical: 2,
    paddingHorizontal: 2,
    justifyContent: "center",
    // fill_T5SSKU applied dynamically
    // effect_K03GM1 (shadow) omitted
  },
  trackOn: {
    backgroundColor: "#34C759", // fill_T5SSKU (first value)
  },
  trackOff: {
    backgroundColor: "rgba(60, 60, 67, 0.3)", // fill_T5SSKU (second value)
  },
  knob: {
    // Knob Frame: 2651:11793
    width: 27, // Approx based on container padding/size
    height: 27,
    borderRadius: 13.5,
    backgroundColor: "#FFFFFF", // fill_YBBY7M
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
    // effect_45TZYL (shadow) omitted
  },
});

interface ToggleProps {
  isOn: boolean;
  onToggle: (value: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ isOn, onToggle }) => {
  const position = React.useRef(new Animated.Value(isOn ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(position, {
      toValue: isOn ? 1 : 0,
      duration: 150,
      easing: Easing.elastic(0.5),
      useNativeDriver: false, // Use false for layout properties like left
    }).start();
  }, [isOn, position]);

  const knobLeft = position.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onToggle(!isOn)}
      style={[styles.container, isOn ? styles.trackOn : styles.trackOff]}
    >
      <Animated.View
        style={[styles.knob, { position: "absolute", left: knobLeft }]}
      />
    </TouchableOpacity>
  );
};

export default Toggle;
