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

const styles = StyleSheet.create({
  galleryContainer: {
    alignSelf: "stretch",
  },
  scrollContainer: {
    paddingHorizontal: 16,
    gap: 16,
    alignItems: "flex-start",
  },
  itemFrame: {
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
