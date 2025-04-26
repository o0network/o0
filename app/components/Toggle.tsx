import { StyleSheet, TouchableOpacity, Animated } from "react-native";

type ToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

const Toggle = ({ value, onValueChange, disabled }: ToggleProps) => {
  const translateX = new Animated.Value(value ? 20 : 0);

  const handlePress = () => {
    if (!disabled) {
      const newValue = !value;
      onValueChange(newValue);
      Animated.timing(translateX, {
        toValue: newValue ? 20 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const trackColor = value ? "#32D74B" : "rgba(208, 208, 208, 0.5)";
  const knobTransform = { transform: [{ translateX }] };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={[
        styles.container,
        { backgroundColor: trackColor },
        disabled && styles.disabled,
      ]}
      disabled={disabled}
    >
      <Animated.View style={[styles.knob, knobTransform]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 51,
    height: 31,
    borderRadius: 74.5,
    padding: 2,
    justifyContent: "center",
  },
  knob: {
    width: 27,
    height: 27,
    borderRadius: 74.5,
    backgroundColor: "#FFFFFF",
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Toggle;
