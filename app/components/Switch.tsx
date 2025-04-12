import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

// Figma Node: 2658:1357 (Switch Component)
export const Switch = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const options = [
    // Button 1: 2651:11819
    { label: "Collaborate", icon: "􀉬", figmaNodeId: "2651:11819" }, // Icon: 2651:11820, Label: 2651:11821
    // Button 2: 2651:11822
    { label: "Send Copy", icon: "􀈸", figmaNodeId: "2651:11822" }, // Icon: 2651:11823, Label: 2651:11824
  ];

  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.buttonBase,
            selectedIndex === index ? styles.selectedButton : styles.button,
          ]}
          onPress={() => setSelectedIndex(index)}
        >
          <Text
            style={[
              styles.textBase,
              selectedIndex === index ? styles.selectedText : styles.text,
            ]}
          >
            {option.icon}
          </Text>
          <Text
            style={[
              styles.textBase,
              selectedIndex === index ? styles.selectedText : styles.text,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Styles derived from Figma nodes:
// Container: 2658:1357 (layout_OIYBQG, fill_0QL83V, borderRadius, padding, gap)
// Button Base: Shared properties of Button 1 (2651:11819) and Button 2 (2651:11822) (layout_N8N13U)
// Selected Button: Button 1 (2651:11819) specific styles (fill_7TUGY1, stroke_MSK5E9, effect_NCFBW6, borderRadius)
// Button (Unselected): Button 2 (2651:11822) specific styles (borderRadius) - Minimal styling as per Figma
// Text Base: style_D8L58H
// Selected Text: Button 1 text styles (fill_I7OTR1)
// Text (Unselected): Button 2 text styles (fill_MOQPQ4)
const styles = StyleSheet.create({
  container: {
    // layout_6SJRTF
    flexDirection: "row",
    alignSelf: "stretch",
    gap: 4,
    padding: 4,
    borderRadius: 100, // borderRadius: 100px
    backgroundColor: "rgba(208, 208, 208, 0.5)", // From fill_1VXSIE (second value approximation)
    // effect_C1EF21 (boxShadow) omitted for simplicity
    marginVertical: 5, // Keep existing margin
  },
  buttonBase: {
    // layout_J72H5A
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
    paddingVertical: 9, // Calculated to approximate height: 36 with padding
    paddingHorizontal: 8,
    height: 36,
  },
  selectedButton: {
    // Derived from Button 1 (2651:11819)
    backgroundColor: "rgba(94, 94, 94, 0.18)", // From fill_Q9LOHA (second value)
    borderRadius: 20, // borderRadius: 20px
    // stroke_IRPERO (gradient) and effect_OUM1NZ (shadow) omitted
  },
  button: {
    // Derived from Button 2 (2651:11822)
    borderRadius: 100, // borderRadius: 100px
    backgroundColor: "transparent", // No specific background fill
  },
  textBase: {
    // style_5FA6YV
    fontFamily: "System", // Use System font as SF Pro might not be available
    fontSize: 15,
    fontWeight: "600", // Approx 590
    textAlign: "center",
  },
  selectedText: {
    // fill_2G2BWC
    color: "rgba(255, 255, 255, 0.96)",
  },
  text: {
    // fill_TNC26D
    color: "#545454", // Second value from fill_TNC26D
  },
});
