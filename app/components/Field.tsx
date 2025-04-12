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

// Renaming to Field to match App.tsx usage
// Figma Nodes: TextField (2658:1051), SearchField (2658:1061), SecureField (2658:1052)

// Define Props type extending TextInputProps
interface FieldProps extends TextInputProps {
  placeholder?: string;
  leftIconName?: "search" | "mic" | string;
  secureTextEntry?: boolean;
}

// Figma Node: 2658:1051 (TextField Component)
// Combined functionality for SearchField (2658:1061) and SecureField (2658:1052)
export const Field: React.FC<FieldProps> = ({
  placeholder = "Value", // Default from TextField (2601:3574)
  leftIconName,
  secureTextEntry = false,
  ...props
}) => {
  const renderLeftIcon = () => {
    if (!leftIconName) return null;
    let iconSymbol = "?";
    // Icons from Search Field (2601:3598 - Mic 􀊱)
    // Note: Figma shows Mic icon, but App.tsx uses 'search'. Using search symbol.
    if (leftIconName === "search") iconSymbol = "􀊫";
    if (leftIconName === "mic") iconSymbol = "􀊱";
    return <Text style={styles.iconStyle}>{iconSymbol}</Text>;
  };

  // Choose base style based on type (approximated)
  const isSearch = leftIconName === "search" || leftIconName === "mic";
  const baseContainerStyle = isSearch
    ? styles.searchContainer
    : styles.textContainer;
  const baseInputStyle = isSearch ? styles.searchInput : styles.textInput;

  return (
    <View style={[styles.container, baseContainerStyle]}>
      {renderLeftIcon()}
      <TextInput
        style={[styles.input, baseInputStyle]}
        placeholder={placeholder}
        placeholderTextColor={styles.placeholderText.color}
        secureTextEntry={secureTextEntry}
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
  // Base Container Styles (Common properties)
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "rgba(208, 208, 208, 0.5)", // fill_ZS8JUU (first value)
    // effect_C1EF21 (boxShadow) omitted
    marginVertical: 5, // Keep existing margin
    minHeight: 44, // Estimated common height
  },
  // Specific Container Styles
  textContainer: {
    // From TextField (2658:1051)
    borderRadius: 12,
    paddingHorizontal: 20, // layout_6WC31U
  },
  searchContainer: {
    // From Search Field (2658:1061)
    borderRadius: 12,
    paddingHorizontal: 8, // layout_95NVTL (adjust for icon)
    gap: 8, // layout_95NVTL
  },
  // Secure Field (2658:1052) uses borderRadius 16, slightly different layout
  // For simplicity, using textContainer style as base for secure field too.

  // Base Input Styles
  input: {
    flex: 1,
    fontFamily: "System",
    fontSize: 17, // style_P4SVCV
    fontWeight: "500", // style_P4SVCV (approx 510)
    paddingVertical: 10, // Ensure text fits vertically
    color: "#FFFFFF", // Default input color (assuming contrast)
  },
  // Specific Input Styles (if needed, often covered by container padding)
  textInput: {
    // For regular TextField
  },
  searchInput: {
    // For Search Field
  },
  // Secure Field Input (dots: style_C9W241)
  // Secure field specific input styling (like larger font for dots) is handled by `secureTextEntry` prop + system defaults.

  placeholderText: {
    // style_P4SVCV applied to placeholder, color from fills_TNC26D
    color: "#545454", // Second value
  },
  iconStyle: {
    // style_DW13PU for Mic icon
    fontSize: 17,
    fontWeight: "500", // Approx 510
    color: "#545454", // fills_TNC26D (second value)
    textAlign: "center",
    // Padding/margin adjusted by container gap/padding
  },
});

// Removed default export as we use named export
