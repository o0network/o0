import React from "react";
import { TextInput, StyleSheet, View, Text } from "react-native";

// Figma Node: 2658:1051 (TextField Component)
export const TextField = ({ placeholder = "Value", ...props }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder} // Uses the 'Value' text from Figma node 2601:3574 as default
        placeholderTextColor={styles.placeholderText.color} // Use color from style
        {...props}
      />
    </View>
  );
};

// Styles derived from Figma nodes:
// Container: 2658:1051 (fills_MGA790, effects_3TJ2XW, layout_OMFMMY, borderRadius)
// Input/Text Style: 2601:3574 (textStyle_N75DJP, fills_MOQPQ4 for placeholder)
const styles = StyleSheet.create({
  container: {
    // layout_OMFMMY
    flexDirection: "row", // mode: row
    alignSelf: "stretch", // alignSelf: stretch
    backgroundColor: "rgba(208, 208, 208, 0.5)", // fills_MGA790 (Approximation, taking first value)
    borderRadius: 12, // borderRadius: 12px
    // effects_3TJ2XW (boxShadow) omitted for simplicity
    // padding: 0px 20px - Applied to TextInput style for content padding
    height: 44, // Guessed height based on typical text field sizes and padding
    justifyContent: "center", // Center the TextInput vertically
  },
  input: {
    // textStyle_N75DJP
    flex: 1, // Take available space
    fontFamily: "SF Pro", // Note: Ensure font is available
    fontSize: 17,
    fontWeight: "500", // Approx 510
    color: "#FFFFFF", // Assuming input text color contrasts with placeholder, using white as default
    paddingHorizontal: 20, // layout_OMFMMY: padding: 0px 20px
    // No specific text color defined for input state in Figma, using white default.
  },
  placeholderText: {
    // Derived from 2601:3574 text properties
    color: "#545454", // fills_MOQPQ4 (Approximation, taking second value '#545454')
  },
});

export default TextField;
