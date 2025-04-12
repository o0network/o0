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
      frameNode: "2601:3642", // ItemSelected Frame
      avatarFill: "rgba(0, 0, 0, 0.2)", // fill_5TFAY2
    },
    {
      id: "2",
      label: "Two",
      avatarNode: "2601:3653",
      textNode: "2601:3654",
      frameNode: "2601:3652", // Item Frame
      avatarFill: "rgba(0, 0, 0, 0.2)", // fill_5TFAY2
    },
    {
      id: "3",
      label: "Three",
      avatarNode: "2658:1053",
      textNode: "2601:3649",
      frameNode: "2601:3647", // Item Frame
      avatarFill: "rgba(0, 0, 0, 0.2)", // fill_5TFAY2
    },
    {
      id: "4",
      label: "Four",
      avatarNode: "2658:1058",
      textNode: "2658:1059",
      frameNode: "2658:1057", // Item Frame
      avatarFill: "rgba(0, 0, 0, 0.2)", // fill_5TFAY2
    },
    // _Contact (2601:3632) - Represents a contact with an image avatar
    // Actual image requires download for imageRef: 9e82c570f47dbdc66d043c851e6a77a10f9b0e3c
    {
      id: "5",
      label: "Matan Stauber",
      avatarNode: "2601:3633",
      textNode: "2601:3634",
      frameNode: "2601:3632",
      avatarFill: "rgba(0, 0, 0, 0.3)" /* fill_ITSHHC - Placeholder color */,
      isImageAvatar: true,
    },
  ];

  return (
    // Gallery Container (2658:1359, layout_3D2ZI6)
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
      style={styles.galleryContainer}
    >
      {items.map((item) => (
        // Item Frame (e.g., 2601:3642 - ItemSelected, layout_1KFL52, borderRadius)
        <View
          key={item.id}
          style={[styles.itemFrame, item.selected && styles.itemFrameSelected]}
        >
          {/* Avatar (e.g., 2658:1055, borderRadius, fill_5TFAY2) */}
          <View style={[styles.avatar, { backgroundColor: item.avatarFill }]}>
            {item.isImageAvatar && (
              // Placeholder for image fill (fill_ITSHHC)
              <View style={styles.avatarImagePlaceholder} />
            )}
          </View>
          {/* Label (e.g., 2601:3644, textStyle_7SOT5O, fills_2G2BWC) */}
          <Text style={styles.labelText}>{item.label}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

// Styles derived from Figma nodes:
// Gallery Container: 2658:1359 (layout_3D2ZI6)
// Item Frame: e.g., 2601:3652 (layout_1KFL52, borderRadius)
// Item Frame Selected: 2601:3642 (fill_HHLOQ5)
// Avatar: e.g., 2658:1055 (fill_5TFAY2, borderRadius, fixed size inferred)
// Avatar Image Placeholder: 2601:3633 (fill_ITSHHC - image ref)
// Label Text: e.g., 2601:3644 (textStyle_7SOT5O, fills_2G2BWC)
const styles = StyleSheet.create({
  galleryContainer: {
    alignSelf: "stretch", // Take full width
  },
  scrollContainer: {
    // layout_3D2ZI6
    paddingHorizontal: 16,
    gap: 16,
    alignItems: "flex-start",
  },
  itemFrame: {
    // layout_1KFL52
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    padding: 8,
    borderRadius: 16,
    width: 84,
    backgroundColor: "transparent",
  },
  itemFrameSelected: {
    // fill_HHLOQ5 (Approximation)
    backgroundColor: "rgba(94, 94, 94, 0.18)", // Taking second value
    // Complex gradient fills omitted
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 100,
    // fill_5TFAY2 applied dynamically
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImagePlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Placeholder for image fill_ITSHHC
  },
  labelText: {
    // textStyle_7SOT5O
    fontFamily: "System",
    fontSize: 13,
    fontWeight: "500", // Approx 510
    color: "rgba(255, 255, 255, 0.96)", // fill_2G2BWC
    textAlign: "center",
  },
});
