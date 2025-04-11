import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Assuming you have an icon component or library
// import Icon from 'react-native-vector-icons/Ionicons'; // Example

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(208, 208, 208, 0.5)", // Combined background/fill
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 8, // Adjust for proper height
    alignSelf: "stretch",
    minHeight: 44, // Estimate
    gap: 8,
    // Add boxShadow/effects if needed
  },
  text: {
    flex: 1,
    fontSize: 17,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.23)", // Placeholder text color
  },
  micButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: 'transparent', // Or a subtle background if needed
  },
  micIcon: {
    fontSize: 17,
    color: "rgba(255, 255, 255, 0.23)",
    // Use appropriate icon symbol
  },
});

interface SearchFieldDisplayProps {
  placeholder: string;
}

const SearchFieldDisplay: React.FC<SearchFieldDisplayProps> = ({
  placeholder,
}) => {
  const micSymbol = "􀊱"; // Mic symbol

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{placeholder}</Text>
      <View style={styles.micButton}>
        {/* Replace with actual Icon component if available */}
        <Text style={styles.micIcon}>{micSymbol}</Text>
      </View>
    </View>
  );
};

export default SearchFieldDisplay;
