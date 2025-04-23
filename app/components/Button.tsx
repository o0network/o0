import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Text } from "../App";

interface ButtonProps {
  title: string;
  icon?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

// Figma Node: 2658:1049 (Button Component)
export const Button: React.FC<ButtonProps> = ({
  title,
  icon,
  onPress,
  style,
}) => {
  // Icon: 2651:11773 (textStyle_5FA6YV, fills_2G2BWC)
  // Label: 2651:11774 (textStyle_5FA6YV
  // const icon = "😸"; // Removed hardcoded value
  // const label = "Button"; // Removed hardcoded value

  return (
    // Container: 2658:1049 (fills_Q9LOHA, strokes_IRPERO, effects_OUM1NZ, layout_1Y5HES, borderRadius)
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      {icon && <Text style={styles.iconStyle}>{icon}</Text>}
      <Text style={styles.textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // layout_1Y5HES
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    gap: 3,
    paddingVertical: 10, // Guessed padding for ~44px height
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: "rgba(94, 94, 94, 0.18)", // From fill_Q9LOHA (second value)
    // strokes_IRPERO (gradient) and effects_OUM1NZ (shadow) omitted
    minHeight: 44, // Estimate
    marginVertical: 5, // Keep existing margin
  },
  iconStyle: {
    // From Figma icon 2651:11773, textStyle_JSCQX0
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  textStyle: {
    // style_5FA6YV / style_T98XRF
    fontSize: 16, // Matches style_T98XRF
    fontWeight: "600", // Approx 590 / Matches style_T98XRF
    textAlign: "center",
  },
});

export default Button;
