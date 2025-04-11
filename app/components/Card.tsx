import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Figma Node: 2658:1358 (Card Component)
export const Card = () => {
  // Placeholder for Image (2651:11827 -> 2651:11829 with Image fill)
  // Actual image requires download step for imageRef: 879a2f145bf432143094e0ba9803b961f880315f
  const renderImagePlaceholder = () => (
    <View style={styles.imageOuterFrame}>
      <View style={styles.imagePlaceholder} />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Image Placeholder (2651:11827) */}
      {renderImagePlaceholder()}

      {/* Title and Subtitle Container (2601:3679) */}
      <View style={styles.titleSubtitleContainer}>
        {/* Title (2601:3680) */}
        <Text style={styles.title}>People can make changes</Text>
        {/* Subtitle (2601:3681) */}
        <Text style={styles.subtitle}>
          Sharing as Jay Moon (email@apple.com)
        </Text>
      </View>

      {/* Trailing Accessories Container (2651:11830) */}
      <View style={styles.trailingAccessoriesContainer}>
        {/* Disclosure Icon (2651:11831) */}
        <Text style={styles.disclosureIcon}>􀆊</Text>
      </View>

      {/* Grabber - Seems misplaced or incorrectly styled in Figma data, rendering icon directly */}
      {/* Grabber Frame (2651:11833) -> Grabber Icon (2651:11834) */}
      {/* <View style={styles.grabberContainer}> */}
      {/* <Text style={styles.grabberIcon}>􀌇</Text> */}
      {/* </View> */}
      {/* Note: Grabber is omitted for now as its positioning within the card layout (row) is unclear from the Figma structure provided */}
    </View>
  );
};

// Styles derived from Figma nodes:
// Container: 2658:1358 (fill_YEE267, layout_F2UC2U, borderRadius)
// ImageOuterFrame: 2651:11827 (layout_V5LEGS, fills_J165XF, borderRadius)
// ImagePlaceholder: 2651:11829 (layout_NG546I, borderRadius) - Placeholder style
// TitleSubtitleContainer: 2601:3679 (layout_CT5PLQ)
// Title: 2601:3680 (textStyle_N75DJP, fills_E61BAD, layout_ENXG5B)
// Subtitle: 2601:3681 (textStyle_VHP1XN, fills_MOQPQ4, layout_ENXG5B)
// TrailingAccessoriesContainer: 2651:11830 (layout_NF3BF0)
// DisclosureIcon: 2651:11831 (textStyle_8AQLLD, fills_MOQPQ4)
// GrabberIcon: 2651:11834 (textStyle_MAFO7L, fills_MOQPQ4) - Omitted
const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // layout_F2UC2U: mode: row
    backgroundColor: "rgba(214, 214, 214, 0.45)", // fill_YEE267 (Approximation)
    borderRadius: 16, // borderRadius: 16px
    paddingLeft: 20, // padding: 0px 8px 0px 20px
    paddingRight: 8,
    paddingVertical: 4, // Guessed vertical padding for visual balance
    alignItems: "center", // alignItems: center
    alignSelf: "stretch", // alignSelf: stretch
    gap: 8, // gap: 8px
    minHeight: 50, // Guessed min height based on content
  },
  imageOuterFrame: {
    // 2651:11827
    justifyContent: "center", // layout_V5LEGS: justifyContent: center
    alignItems: "center", // layout_V5LEGS: alignItems: center
    height: 36, // dimensions: height: 36
    width: 36, // dimensions: width: 36 (from inner node 2651:11829)
    backgroundColor: "#0A84FF", // fills_J165XF
    borderRadius: 100, // borderRadius: 100px
  },
  imagePlaceholder: {
    // 2651:11829 - Placeholder styling
    width: 36, // dimensions: width: 36
    height: 36, // dimensions: height: 36
    borderRadius: 500, // borderRadius: 500px
    backgroundColor: "rgba(0,0,0,0.1)", // Placeholder color
  },
  titleSubtitleContainer: {
    // 2601:3679
    flex: 1, // To take remaining space
    flexDirection: "column", // layout_CT5PLQ: mode: column
    justifyContent: "center", // justifyContent: center
    gap: -1, // gap: '-1px'
  },
  title: {
    // 2601:3680, style_N75DJP
    fontFamily: "SF Pro",
    fontSize: 17,
    fontWeight: "500", // Approx 510
    color: "#FFFFFF", // fill_E61BAD
    // layout_ENXG5B applied via container
  },
  subtitle: {
    // 2601:3681, style_VHP1XN
    fontFamily: "SF Pro",
    fontSize: 13,
    fontWeight: "500", // Approx 510
    color: "#545454", // fill_MOQPQ4 (Approximation, using second value)
    // layout_ENXG5B applied via container
  },
  trailingAccessoriesContainer: {
    // 2651:11830
    justifyContent: "center", // layout_NF3BF0: justifyContent: center
    alignItems: "center", // layout_NF3BF0: alignItems: center
    paddingHorizontal: 16.5, // padding: 0px 16.5px
    height: 44, // dimensions: height: 44
  },
  disclosureIcon: {
    // 2651:11831, style_8AQLLD
    fontFamily: "SF Pro",
    fontSize: 17,
    fontWeight: "500", // Approx 510
    color: "#545454", // fill_MOQPQ4 (Approximation, using second value)
  },
  // Grabber styles omitted
});
