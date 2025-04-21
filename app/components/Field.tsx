import React, { useState } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Renaming to Field to match App.tsx usage
// Figma Nodes: TextField (2658:1051), SearchField (2658:1061), SecureField (2658:1052)

// Define Props type extending TextInputProps
interface FieldProps extends TextInputProps {
  placeholder?: string;
  leftIconName?: "search" | "mic" | string;
  secureTextEntry?: boolean;
  style?: any;
}

// Figma Node: 2658:1051 (TextField Component)
// Combined functionality for SearchField (2658:1061) and SecureField (2658:1052)
export const Field: React.FC<FieldProps> = ({
  placeholder = "Value", // Default from TextField (2601:3574)
  leftIconName,
  secureTextEntry = false,
  style,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const renderLeftIcon = () => {
    if (!leftIconName) return null;

    // Map to Ionicons names
    let iconName: keyof typeof Ionicons.glyphMap = "help-outline";
    if (leftIconName === "search") iconName = "search-outline";
    if (leftIconName === "mic") iconName = "mic-outline";

    return (
      <Ionicons
        name={iconName}
        size={17}
        color="rgba(235, 235, 245, 0.6)"
        style={styles.iconStyle}
      />
    );
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Choose base style based on type
  const isSearch = leftIconName === "search" || leftIconName === "mic";
  const baseContainerStyle = isSearch
    ? styles.searchContainer
    : styles.textContainer;

  // Focus state for better visual feedback
  const containerStyle = [
    styles.container,
    baseContainerStyle,
    isFocused && styles.focusedContainer,
    secureTextEntry && styles.passwordContainer,
    style,
  ];

  return (
    <View style={containerStyle}>
      {renderLeftIcon()}
      <TextInput
        style={styles.input}
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
        >
          <Ionicons
            name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
            size={17}
            color="rgba(235, 235, 245, 0.6)"
            style={styles.iconStyle}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

// Styles derived from Figma nodes:
// Container: 2658:1051 (fills_MGA790, effects_3TJ2XW, layout_OMFMMY, borderRadius)
// Input/Text Style: 2601:3574 (textStyle_N75DJP, fills_MOQPQ4 for placeholder)
// Added styles for icon
const styles = StyleSheet.create({
  // Base Container Styles
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "rgba(60, 60, 67, 0.18)", // Updated to match Figma
    borderRadius: 999,
    minHeight: 44, // Height from Figma
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  // Specific Container Styles
  textContainer: {
    paddingHorizontal: 16,
  },
  searchContainer: {
    paddingLeft: 8,
    paddingRight: 16,
  },
  passwordContainer: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  focusedContainer: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  // Input Styles
  input: {
    flex: 1,
    fontFamily: "System",
    fontSize: 17,
    fontWeight: "400",
    paddingVertical: 10,
    color: "#FFFFFF",
  },
  placeholderText: {
    color: "rgba(235, 235, 245, 0.6)",
  },
  iconStyle: {
    marginRight: 8,
  },
});

export default Field;
