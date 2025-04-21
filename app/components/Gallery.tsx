import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

interface GalleryItemProps {
  id: string;
  name: string;
  avatar?: string;
}

interface GalleryProps {
  items: GalleryItemProps[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}

export const Gallery: React.FC<GalleryProps> = ({
  items,
  selectedId,
  onSelect,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
      style={styles.galleryContainer}
    >
      {items.map((item) => {
        const isSelected = item.id === selectedId;
        return (
          <View
            key={item.id}
            style={[styles.itemFrame, isSelected && styles.itemFrameSelected]}
            onTouchEnd={onSelect ? () => onSelect(item.id) : undefined}
          >
            <View
              style={[styles.avatar, { backgroundColor: "rgba(0, 0, 0, 0.2)" }]}
            >
              {item.avatar && (
                <Text style={styles.avatarText}>{item.avatar}</Text>
              )}
            </View>
            <Text style={styles.labelText}>{item.name}</Text>
          </View>
        );
      })}
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
    backgroundColor: "rgba(94, 94, 94, 0.18)",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImagePlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  avatarText: {
    fontSize: 30,
    color: "rgba(255, 255, 255, 0.96)",
  },
  labelText: {
    fontFamily: "System",
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.96)",
    textAlign: "center",
  },
});

export default Gallery;
