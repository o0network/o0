import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

// Figma Node: 2658:1359 (Gallery Component)
export const Gallery = () => {
  // Sample data structure based on Figma items
  const items = [
    {
      id: "1",
      label: "One",
      selected: true,
      avatarNode: "2658:1055",
      textNode: "2601:3644",
      frameNode: "2601:3642",
      avatarFill: "rgba(0, 0, 0, 0.2)",
    }, // ItemSelected
    {
      id: "2",
      label: "Two",
      avatarNode: "2601:3653",
      textNode: "2601:3654",
      frameNode: "2601:3652",
      avatarFill: "rgba(0, 0, 0, 0.2)",
    }, // Item
    {
      id: "3",
      label: "Three",
      avatarNode: "2658:1053",
      textNode: "2601:3649",
      frameNode: "2601:3647",
      avatarFill: "rgba(0, 0, 0, 0.2)",
    }, // Item
    {
      id: "4",
      label: "Four",
      avatarNode: "2658:1058",
      textNode: "2658:1059",
      frameNode: "2658:1057",
      avatarFill: "rgba(0, 0, 0, 0.2)",
    }, // Item
    // _Contact (2601:3632) - Represents a contact with an image avatar
    // Actual image requires download for imageRef: 9e82c570f47dbdc66d043c851e6a77a10f9b0e3c
    {
      id: "5",
      label: "Matan Stauber",
      avatarNode: "2601:3633",
      textNode: "2601:3634",
      frameNode: "2601:3632",
      avatarFill: "rgba(0, 0, 0, 0.3)" /* Placeholder color */,
      isImageAvatar: true,
    },
  ];

  return (
    // Gallery Container (2658:1359, layout_PSXYF3)
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
      style={styles.galleryContainer} // Added for potential outer styling if needed
    >
      {items.map((item) => (
        // Item Frame (e.g., 2601:3642, layout_PHAKMS, borderRadius)
        <View
          key={item.id}
          style={[styles.itemFrame, item.selected && styles.itemFrameSelected]}
        >
          {/* Avatar (e.g., 2658:1055, layout_0X8POT, borderRadius) */}
          <View style={[styles.avatar, { backgroundColor: item.avatarFill }]}>
            {/* Placeholder for actual image if item.isImageAvatar is true */}
            {item.isImageAvatar && (
              <View style={styles.avatarImagePlaceholder} />
            )}
          </View>
          {/* Label (e.g., 2601:3644, textStyle_TF008X, fills_I7OTR1) */}
          <Text style={styles.labelText}>{item.label}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

// Styles derived from Figma nodes:
// Gallery Container: 2658:1359 (layout_PSXYF3 - used for contentContainerStyle gap)
// Item Frame: 2601:3642, 2601:3652, etc. (layout_PHAKMS, borderRadius)
// Item Frame Selected: 2601:3642 specific fills (fill_S4WBEV)
// Avatar: 2658:1055, 2601:3653, etc. (layout_0X8POT, borderRadius, fill_S03KCT)
// Avatar Image (Placeholder): 2601:3633 (using layout, borderRadius from node)
// Label Text: 2601:3644, 2601:3654, etc. (textStyle_TF008X, fills_I7OTR1)
const styles = StyleSheet.create({
  galleryContainer: {
    // Potentially add width if needed, Figma has fixed width 393 (dimensions: width: 393)
    // but horizontal scroll makes this less critical.
  },
  scrollContainer: {
    // layout_PSXYF3
    paddingHorizontal: 16, // Added padding for better spacing from screen edges
    gap: 16, // gap: 16px
    alignItems: "flex-start", // Align items to top
  },
  itemFrame: {
    // layout_PHAKMS
    flexDirection: "column", // mode: column
    alignItems: "center", // alignItems: center
    gap: 4, // gap: 4px
    padding: 8, // padding: 8px
    borderRadius: 16, // borderRadius: 16px
    width: 84, // dimensions: width: 84
    backgroundColor: "transparent", // Default, no specific fill for regular items
  },
  itemFrameSelected: {
    // fill_S4WBEV (Approximations)
    backgroundColor: "rgba(94, 94, 94, 0.18)", // Taking second value of fill_S4WBEV
    // Complex gradient fills omitted
  },
  avatar: {
    // layout_0X8POT: sizing: horizontal/vertical: fixed - applied via width/height
    width: 60, // Guessed size based on visual hierarchy within 84px width
    height: 60,
    borderRadius: 100, // borderRadius: 100px
    // backgroundColor is set dynamically
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImagePlaceholder: {
    // Style matching avatar dimensions, could overlay an icon or pattern
    width: "100%",
    height: "100%",
    borderRadius: 100, // Match avatar borderRadius
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Light placeholder overlay
  },
  labelText: {
    // textStyle_TF008X
    fontFamily: "SF Pro", // Note: Ensure font is available
    fontSize: 13,
    fontWeight: "500", // Approx 510
    color: "rgba(255, 255, 255, 0.96)", // fill_I7OTR1
    textAlign: "center", // textAlignHorizontal: CENTER
    // textAlignVertical: TOP handled by layout
  },
});
