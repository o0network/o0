import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

// Figma Node: 2658:1353 (CellGrid Component)

// Generate dummy grid data (10 rows x 12 columns)
const gridData = Array.from({ length: 10 }, (_, rowIndex) =>
  Array.from({ length: 12 }, (_, colIndex) => ({
    id: `${rowIndex}-${colIndex}`,
    // Placeholder color, real implementation would fetch from Figma fills
    color: `hsl(${(rowIndex * 36 + colIndex * 15) % 360}, 70%, 60%)`,
    // Example selected cell
    selected: rowIndex === 5 && colIndex === 5,
  }))
);

export const CellGrid = () => {
  const [selectedCell, setSelectedCell] = React.useState("5-5"); // Example state

  return (
    // Container: 2658:1353 (layout_FH8CCG, borderRadius, fills_850ZME)
    <View style={styles.container}>
      {gridData.map((row, rowIndex) => (
        // Row Frame: e.g., 2658:1222 (layout_R3I39Q)
        <View key={rowIndex} style={styles.rowContainer}>
          {row.map((cell) => (
            // Swatch Rectangle: e.g., 2658:1223 (layout_8XENC7)
            <TouchableOpacity
              key={cell.id}
              style={styles.cellOuter}
              onPress={() => setSelectedCell(cell.id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.cellInner,
                  { backgroundColor: cell.color },
                  selectedCell === cell.id && styles.selectedCellInner,
                ]}
              />
              {/* Selected state indicator (stroke_FBWR44) */}
              {selectedCell === cell.id && (
                <View style={styles.selectedIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // layout_FH8CCG
    flexDirection: "column",
    // Dimensions not directly applied, using stretch
    borderRadius: 16,
    backgroundColor: "#000000", // fills_850ZME
    alignSelf: "stretch",
    padding: 5, // Added padding for visual spacing
    marginVertical: 5,
  },
  rowContainer: {
    // layout_R3I39Q
    flexDirection: "row",
    justifyContent: "space-around", // Distribute cells evenly
    marginBottom: 2, // Add vertical spacing between rows
  },
  cellOuter: {
    // Added for touchable area and centering inner cell
    alignItems: "center",
    justifyContent: "center",
    // Size calculation (approx based on 339 width / 12 columns)
    width: 28,
    height: 28,
  },
  cellInner: {
    // Swatch styling
    width: 24, // Slightly smaller than outer for spacing/selection indicator
    height: 24,
    // backgroundColor applied dynamically
  },
  selectedCellInner: {
    // Style for the selected cell itself (uses background color)
  },
  selectedIndicator: {
    // stroke_FBWR44 approximation
    position: "absolute",
    width: 28, // Match outer cell size
    height: 28,
    borderRadius: 2, // Slight rounding for the indicator
    borderWidth: 3, // Adjusted from 4px for visual balance
    borderColor: "#FFFFFF",
  },
});
