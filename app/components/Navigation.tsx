import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

// Figma Node: 2651:12854 (Navigation Component)

const styles = StyleSheet.create({
  container: {
    // layout_7FECXV
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    gap: 16,
    padding: 12,
    borderRadius: 100, // borderRadius: 100px
    backgroundColor: "rgba(128, 128, 128, 0.3)", // From fill_BM5NKS
    marginVertical: 5, // Keep existing margin
    // strokes_IBCZHQ (gradient) and effects_AOD5D3 (shadow/blur) omitted
  },
  iconButton: {
    // Style applied to Frame nodes like 'explore' (2651:11786)
    padding: 8, // Example padding for touch target
    borderRadius: 100, // Match container rounding
  },
  icon: {
    // style_WYQ5G7
    fontFamily: "System",
    fontSize: 17,
    fontWeight: "500", // Approx 510
    color: "rgba(255, 255, 255, 0.96)", // fill_2G2BWC
    textAlign: "center",
  },
});

interface NavigationItem {
  id: string | number;
  symbol: string;
  onPress: () => void;
}

interface NavigationProps {
  items: NavigationItem[];
}

export const Navigation: React.FC<NavigationProps> = ({ items }) => {
  return (
    <View style={styles.container}>
      {items.map((item) => (
        // Frame: e.g., explore (2651:11786), create (2651:11788)
        <TouchableOpacity
          key={item.id}
          style={styles.iconButton}
          onPress={item.onPress}
        >
          {/* Symbol Text: e.g., 2651:11787 */}
          <Text style={styles.icon}>{item.symbol}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
