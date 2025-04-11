import React from "react";
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TextInputProps,
} from "react-native";
// Import an icon library if you have one, e.g., @expo/vector-icons
// import { Ionicons } from '@expo/vector-icons';

// Define Props type extending TextInputProps
interface TextFieldProps extends TextInputProps {
  placeholder?: string;
  leftIconName?: "search" | "mic" | string; // Allow specific icons or any string
  secureTextEntry?: boolean;
}

// Figma Node: 2658:1051 (TextField Component)
// Combined functionality for SearchField (2658:1061) and SecureField (2658:1052)
export const TextField: React.FC<TextFieldProps> = ({
  placeholder = "Value",
  leftIconName, // Optional icon name (e.g., 'search' or 'mic' from Figma)
  secureTextEntry = false, // Default to false
  ...props
}) => {
  // Placeholder logic for icon rendering
  const renderLeftIcon = () => {
    if (!leftIconName) return null;
    // Replace with actual icon component if using a library
    // Example with placeholder text icon:
    let iconSymbol = "?";
    if (leftIconName === 'search') iconSymbol = '􀊫'; // SF Symbol approximation
    if (leftIconName === 'mic') iconSymbol = '􀊱'; // SF Symbol approximation from Search Field Figma (2601:3598)
    return <Text style={styles.iconStyle}>{iconSymbol}</Text>;
  };

  return (
    <View style={styles.container}>
      {renderLeftIcon()}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={styles.placeholderText.color}
        secureTextEntry={secureTextEntry} // Pass secureTextEntry prop
        {...props}
      />
      {/* Add right icon for secure field toggle if needed */}
    </View>
  );
};

// Styles derived from Figma nodes:
// Container: 2658:1051 (fills_MGA790, effects_3TJ2XW, layout_OMFMMY, borderRadius)
// Input/Text Style: 2601:3574 (textStyle_N75DJP, fills_MOQPQ4 for placeholder)
// Added styles for icon
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "stretch",
    backgroundColor: "rgba(208, 208, 208, 0.5)",
    borderRadius: 12,
    height: 44,
    alignItems: "center", // Align items vertically
    paddingHorizontal: 8, // Adjusted padding for potential icon
    marginVertical: 5, // Added margin like other components
  },
  iconStyle: {
    // Basic styling for the placeholder icon text
    fontSize: 17, // Match input text size
    color: "#545454", // Match placeholder color
    marginHorizontal: 8, // Space around icon
  },
  input: {
    flex: 1,
    fontFamily: "SF Pro",
    fontSize: 17,
    fontWeight: "500",
    color: "#FFFFFF",
    paddingVertical: 10, // Ensure text fits vertically
  },
  placeholderText: {
    color: "#545454",
  },
});

// Removed default export as we use named export
