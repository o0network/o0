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

export const Button: React.FC<ButtonProps> = ({ title, icon, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      {icon && <Text style={styles.iconStyle}>{icon}</Text>}
      <Text style={styles.textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    gap: 3,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: "rgba(94, 94, 94, 0.18)",
    minHeight: 44,
    marginVertical: 5,
  },
  iconStyle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  textStyle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default Button;
