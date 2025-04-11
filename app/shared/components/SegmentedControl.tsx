import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const SegmentedControl = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const options = [
    { label: "Collaborate", icon: "􀉬" }, // Figma: 2651:11821, 2651:11820
    { label: "Send Copy", icon: "􀈸" }, // Figma: 2651:11824, 2651:11823
  ];

  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.button,
            selectedIndex === index && styles.selectedButton,
          ]}
          onPress={() => setSelectedIndex(index)}
        >
          <Text
            style={[
              styles.icon,
              selectedIndex === index ? styles.selectedText : styles.text,
            ]}
          >
            {option.icon}
          </Text>
          <Text
            style={[
              styles.label,
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

// Styles based on Figma node 2601:3694 and children
const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // layout_IEFI02: mode: row
    backgroundColor: "rgba(208, 208, 208, 0.5)", // fill_XVKK30 - Approximation
    borderRadius: 100, // borderRadius: 100px
    padding: 4, // padding: 4px
    gap: 4, // gap: 4px
    alignSelf: "stretch", // alignSelf: stretch
    // effects: effect_0J2L3V - Complex inset shadows omitted
  },
  button: {
    flex: 1, // layout_JGY4MV: sizing: horizontal: fill
    flexDirection: "row", // layout_JGY4MV: mode: row
    justifyContent: "center", // justifyContent: center
    alignItems: "center", // alignItems: center
    paddingVertical: 9, // Approximate height 36 with padding 4 -> content height 28. Guessing padding.
    paddingHorizontal: 8, // padding: 0px 8px
    gap: 3, // gap: 3px
    borderRadius: 20, // borderRadius: 20px or 100px - Using 20px for consistency
  },
  selectedButton: {
    backgroundColor: "rgba(94, 94, 94, 0.18)", // fill_FZZWAF - Approximation
    // stroke_FRQELZ - Complex gradient stroke omitted
    // effects: effect_08LZNI - Box shadow omitted
  },
  icon: {
    // style_MC5977
    fontFamily: "SF Pro", // Note: Ensure font is available
    fontSize: 15,
    fontWeight: "500", // Approx 590
    // lineHeight: 1.333 em - Handled by RN
  },
  label: {
    // style_MC5977
    fontFamily: "SF Pro", // Note: Ensure font is available
    fontSize: 15,
    fontWeight: "500", // Approx 590
    // lineHeight: 1.333 em - Handled by RN
  },
  text: {
    color: "#545454", // fill_7VJUTL - Approximation
  },
  selectedText: {
    color: "rgba(255, 255, 255, 0.96)", // fill_EWMT4L
  },
});

export default SegmentedControl;
