import React, { Children, useState } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  TextInputProps,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type FieldProps = TextInputProps & {
  placeholder?: string;
  secureTextEntry?: boolean;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

export const Field: React.FC<FieldProps> = ({
  placeholder,
  secureTextEntry = false,
  style,
  inputStyle,
  children,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const containerStyle = [isFocused && styles.focusedContainer, style];

  const finalInputStyle = [styles.input, inputStyle];

  return (
    <View style={containerStyle}>
      <TextInput
        style={finalInputStyle}
        placeholder={placeholder}
        placeholderTextColor={styles.placeholderText.color}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {secureTextEntry && (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          activeOpacity={0.7}
          style={styles.eyeIconContainer}
        >
          <Ionicons
            name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
            size={24}
            color={styles.iconStyle.color}
          />
        </TouchableOpacity>
      )}
      <View style={styles.childrenContainer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  focusedContainer: {
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  input: {
    flex: 1,
    borderRadius: 999,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Nunito_600SemiBold",
    color: "#FFFFFF",
    paddingVertical: 10,
  },
  placeholderText: {
    color: "rgba(255, 255, 255, 0.23)",
  },
  iconStyle: {
    color: "rgba(235, 235, 245, 0.6)",
  },
  eyeIconContainer: {
    marginLeft: 10,
  },
  childrenContainer: {
    marginLeft: 8,
  },
});

export default Field;
