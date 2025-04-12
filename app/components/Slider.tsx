import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Slider from "@react-native-community/slider"; // Import slider component

// Figma Node: 2658:1070 (Slider Component)

const styles = StyleSheet.create({
  container: {
    // layout_QFBC6K
    alignSelf: "stretch",
    padding: 1, // padding: 1px
    gap: 10, // Not directly applicable to slider component
    borderRadius: 100, // borderRadius: 100px
    backgroundColor: "rgba(208, 208, 208, 0.5)", // fill_1VXSIE (second value approx)
    marginVertical: 5,
    // effect_C1EF21 (shadow) omitted
    // Need height adjustment for the slider
    height: 40, // Example height
    justifyContent: "center",
  },
  // Note: The actual track and knob styling comes from the slider component props
  // We approximate based on Figma visuals
  trackStyle: {
    height: 8, // Guessed height for the track
    borderRadius: 100,
  },
  knobStyle: {
    // Knob Frame: 2658:1068
    width: 28, // Guessed size
    height: 28,
    borderRadius: 100, // borderRadius: 100px
    backgroundColor: "#FFFFFF", // Approximation based on stroke color
    borderWidth: 2, // stroke_760Y7G: strokeWeight: 2px
    borderColor: "#FFFFFF", // stroke_760Y7G
  },
});

export const SliderComponent = () => {
  const [value, setValue] = React.useState(0.5); // Default value example

  // Gradient Fill (2658:1067) is complex (Image Fill + Gradient)
  // We will use props for minimum/maximum track tint color
  const minimumTrackTintColor = "#FF4015"; // Approximated from gradientStops
  const maximumTrackTintColor = "rgba(0, 0, 0, 0.1)"; // Transparent-ish black

  return (
    <View style={styles.container}>
      <Slider
        style={{ width: "100%", height: "100%" }}
        value={value}
        onValueChange={setValue}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor={minimumTrackTintColor}
        maximumTrackTintColor={maximumTrackTintColor}
        thumbStyle={styles.knobStyle} // Apply knob styles via thumbStyle if supported
        trackStyle={styles.trackStyle} // Apply track styles via trackStyle if supported
        // Note: Direct styling of track/knob components might require a custom implementation or different library
      />
    </View>
  );
};

// Rename export to match usage if necessary, keeping SliderComponent for clarity
export { SliderComponent as Slider };
