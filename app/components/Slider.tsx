import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";

// Figma Node: 2658:1070 (Slider Component)

export const SliderComponent = () => {
  const [value, setValue] = useState(0.5);

  return (
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        value={value}
        onValueChange={setValue}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor="#FF375F"
        maximumTrackTintColor="rgba(60, 60, 67, 0.3)"
        thumbTintColor="#FFFFFF"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    width: "100%",
    paddingHorizontal: 2,
    marginVertical: 10,
  },
  slider: {
    width: "100%",
    height: 40,
  },
});

// Rename export to match usage
export { SliderComponent as Slider };
