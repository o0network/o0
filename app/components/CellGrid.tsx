import { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";

/* Removed hardcoded gridData
const gridData = Array.from({ length: 10 }, (_, rowIndex) =>
  Array.from({ length: 12 }, (_, colIndex) => ({
    id: `${rowIndex}-${colIndex}`,
    color: `hsl(${(rowIndex * 36 + colIndex * 15) % 360}, 70%, 60%)`,
    selected: rowIndex === 5 && colIndex === 5,
  }))
);
*/

interface CellGridProps {
  data: string[][]; // 2D array of color strings
  style?: StyleProp<ViewStyle>;
  onSelect?: (rowIndex: number, colIndex: number) => void;
  selectedCoords?: { row: number; col: number } | null;
}

export const CellGrid: React.FC<CellGridProps> = ({
  data,
  style,
  onSelect,
  selectedCoords,
}) => {
  // const [selectedCell, setSelectedCell] = useState("5-5"); // Removed internal state

  return (
    <View style={[styles.container, style]}>
      {data.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.rowContainer}>
          {row.map((color, colIndex) => {
            const isSelected =
              selectedCoords?.row === rowIndex &&
              selectedCoords?.col === colIndex;
            const cellId = `${rowIndex}-${colIndex}`;

            return (
              <TouchableOpacity
                key={cellId}
                style={styles.cellOuter}
                onPress={
                  onSelect ? () => onSelect(rowIndex, colIndex) : undefined
                }
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.cellInner,
                    { backgroundColor: color },
                    // No border applied directly to inner view for simplicity
                  ]}
                />
                {isSelected && (
                  // Apply selection border using a separate absolute view
                  <View style={styles.selectedCellBorder} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    borderRadius: 2, // Match Figma GridSelect (2658:1353)
    backgroundColor: "#000000", // Match Figma GridSelect (fill_WWKJI0)
    alignSelf: "stretch",
    padding: 2, // Match Figma GridSelect
    gap: 2, // Match Figma Row gap
    // marginVertical: 5, // Removed default margin
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Changed from "stretch"
    gap: 2, // Match Figma Row gap
    // marginBottom: 2, // Use gap instead
  },
  cellOuter: {
    flex: 1, // Make cells take equal width
    aspectRatio: 1, // Make cells square
    alignItems: "center",
    justifyContent: "center",
    // width: 28, // Removed fixed width
    // height: 28, // Removed fixed height
  },
  cellInner: {
    width: "100%", // Fill outer touchable
    height: "100%",
    borderRadius: 2, // Match Figma Swatch
  },
  selectedCellBorder: {
    // Renamed from selectedCellInner
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 2,
    borderWidth: 3, // Adjust thickness as needed
    borderColor: "#FFFFFF", // Match Figma stroke_ZHJ5AH approx
  },
});

export default CellGrid;
