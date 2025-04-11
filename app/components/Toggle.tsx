import React from "react";
import { View, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Text } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: 56,
    height: 32,
    borderRadius: 100,
    paddingHorizontal: 2,
    justifyContent: "center",
    // Add shadow
  },
  containerOn: {
    backgroundColor: "#32D74B", // Green when ON
  },
  containerOff: {
    backgroundColor: "rgba(208, 208, 208, 0.5)", // Gray when OFF
  },
  knob: {
    width: 28, // Height - padding * 2
    height: 28,
    borderRadius: 100,
    backgroundColor: "#FFFFFF",
    // Add shadow
  },
});

interface ToggleProps {
  isOn: boolean;
  onToggle: (value: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ isOn, onToggle }) => {
  // Basic animation setup (can be refined)
  const position = React.useRef(new Animated.Value(isOn ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(position, {
      toValue: isOn ? 1 : 0,
      duration: 200, // Adjust speed
      useNativeDriver: false, // Set to true if only animating transform/opacity
    }).start();
  }, [isOn, position]);

  const translateX = position.interpolate({
    inputRange: [0, 1],
    outputRange: [
      0,
      styles.container.width -
        styles.knob.width -
        styles.container.paddingHorizontal * 2,
    ], // Calculate travel distance
  });

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onToggle(!isOn)}>
      <View
        style={[
          styles.container,
          isOn ? styles.containerOn : styles.containerOff,
        ]}
      >
        <Animated.View style={[styles.knob, { transform: [{ translateX }] }]} />
      </View>
    </TouchableOpacity>
  );
};

export default Toggle;
