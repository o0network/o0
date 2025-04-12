import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Figma Node: 2658:1358 (Card Component)
export const Card = () => {
  // Placeholder for Image (2651:11827 -> 2651:11829 with Image fill)
  // Actual image requires download step for imageRef: 879a2f145bf432143094e0ba9803b961f880315f
  const renderImagePlaceholder = () => (
    // Image Frame: 2651:11827 (layout_F9UZUD, borderRadius)
    <View style={styles.imageContainer}>
      {/* App Icons Frame: 2651:11829 (layout_IU4PP1, borderRadius) */}
      <View style={styles.appIconPlaceholder} />
    </View>
  );

  const renderDisclosure = () => (
    // Trailing Accessories Frame: 2651:11830 (layout_SEFN8S)
    <View style={styles.trailingAccessoryContainer}>
      {/* Disclosure Text: 2651:11831 (textStyle_DW13PU, fills_TNC26D) */}
      <Text style={styles.disclosureText}>􀆊</Text>
    </View>
  );

  return (
    // Card Container: 2658:1358 (fills_1X17O9, layout_9ALHDS, borderRadius)
    <View style={styles.container}>
      {renderImagePlaceholder()}
      {/* Title and Subtitle Frame: 2601:3679 (layout_WM5VKG) */}
      <View style={styles.textContainer}>
        {/* Title Text: 2601:3680 (textStyle_P4SVCV, fills_YBBY7M) */}
        <Text style={styles.titleText}>People can make changes</Text>
        {/* Subtitle Text: 2601:3681 (textStyle_RFQRI1, fills_TNC26D) */}
        <Text style={styles.subtitleText}>
          Sharing as Jay Moon (email@apple.com)
        </Text>
      </View>
      {renderDisclosure()}
      {/* Grabber (2651:11833) omitted for simplicity */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // layout_9ALHDS
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    gap: 8,
    paddingLeft: 20,
    paddingRight: 8, // Adjusted from 8px 0px 20px
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.08)", // From fill_1X17O9 (second value)
    minHeight: 50, // Estimated height
    marginVertical: 5, // Keep existing margin
  },
  imageContainer: {
    // layout_F9UZUD
    justifyContent: "center",
    alignItems: "center",
    width: 36, // From dimensions
    height: 36, // From dimensions
    borderRadius: 100,
    backgroundColor: "#0A84FF", // From fill_9OLTYY
  },
  appIconPlaceholder: {
    // layout_IU4PP1
    width: 36, // Match container
    height: 36,
    borderRadius: 500, // Effectively circular
    // fill_PNH6DX (Image Fill) needs actual image
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Placeholder tint
  },
  textContainer: {
    // layout_WM5VKG
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    gap: -1, // Negative gap can be tricky, using 0
  },
  titleText: {
    // style_P4SVCV
    fontFamily: "System",
    fontSize: 17,
    fontWeight: "500", // Approx 510
    color: "#FFFFFF", // fill_YBBY7M
  },
  subtitleText: {
    // style_RFQRI1
    fontFamily: "System",
    fontSize: 13,
    fontWeight: "500", // Approx 510
    color: "#545454", // fill_TNC26D (second value)
  },
  trailingAccessoryContainer: {
    // layout_SEFN8S
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16.5, // padding: 0px 16.5px
    height: 44, // From dimensions
  },
  disclosureText: {
    // style_DW13PU
    fontFamily: "System",
    fontSize: 17,
    fontWeight: "500", // Approx 510
    color: "#545454", // fill_TNC26D (second value)
    textAlign: "center",
  },
});
