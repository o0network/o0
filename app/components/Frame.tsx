import React, { ReactNode } from "react";
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Dimensions,
  Platform,
} from "react-native";

interface FrameProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number; // Allow customizing intensity
  // Simplify tint options to common cross-platform values
  tint?: "light" | "dark" | "default";
}

const windowWidth = Dimensions.get("window").width;

export const Frame: React.FC<FrameProps> = ({ children, style }) => {
  return (
    // Use BlurView as the main container
    <View style={styles.contentContainer}>{children}</View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "95%",
    maxWidth: 500,
    borderRadius: 32, // Figma borderRadius
    overflow: "hidden", // Important to clip blur correctly
    alignSelf: "center",
    // Add semi-transparent gray background *in addition* to the tint
    // to achieve the desired gray glass look.
    // Adjust color and opacity as needed.
    backgroundColor: "rgba(100, 100, 100, 0.2)", // Example: semi-transparent gray
    // Border can be applied directly here if needed
    borderWidth: 1.4,
    borderColor: "rgba(255, 255, 255, 0.2)", // Subtle white border
    position: "relative", // Keep if needed for absolute children, might not be necessary
  },
  contentContainer: {
    // Apply Figma layout properties (padding, gap)
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 16,
    gap: 16,
    // Background color of content should be transparent
    // so the blur effect shows through.
    backgroundColor: "transparent",
  },
});

export default Frame;
