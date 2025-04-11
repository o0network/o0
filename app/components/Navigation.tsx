import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    borderRadius: 100,
    backgroundColor: "rgba(128, 128, 128, 0.3)", // From Figma fill
    alignSelf: "stretch",
    gap: 16,
    // Add border/shadow/backdropFilter from Figma if possible/needed
  },
  iconButton: {
    // Adjust size based on icon touch target preference
    padding: 8, // Example padding
    borderRadius: 100, // Match outer container
  },
  icon: {
    fontSize: 17,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.96)",
    textAlign: "center",
    // SF Pro icons needed here
  },
});

interface NavigationItem {
  id: string | number;
  symbol: string; // Use string for SF symbols for now
  onPress: () => void;
}

interface NavigationProps {
  items: NavigationItem[];
}

export const Navigation: React.FC<NavigationProps> = ({ items }) => {
  return (
    <View style={styles.container}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.iconButton}
          onPress={item.onPress}
        >
          <Text style={styles.icon}>{item.symbol}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
