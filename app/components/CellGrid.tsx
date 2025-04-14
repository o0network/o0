import { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

const gridData = Array.from({ length: 10 }, (_, rowIndex) =>
  Array.from({ length: 12 }, (_, colIndex) => ({
    id: `${rowIndex}-${colIndex}`,
    color: `hsl(${(rowIndex * 36 + colIndex * 15) % 360}, 70%, 60%)`,
    selected: rowIndex === 5 && colIndex === 5,
  }))
);

export const CellGrid = () => {
  const [selectedCell, setSelectedCell] = useState("5-5");

  return (
    <View style={styles.container}>
      {gridData.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.rowContainer}>
          {row.map((cell) => (
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
              {selectedCell === cell.id && (
                <View style={styles.selectedCellInner} />
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
    flexDirection: "column",
    borderRadius: 16,
    backgroundColor: "#000000",
    alignSelf: "stretch",
    padding: 5,
    marginVertical: 5,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 2,
  },
  cellOuter: {
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
  },
  cellInner: {
    width: 24,
    height: 24,
  },
  selectedCellInner: {
    position: "absolute",
    width: 28,
    height: 28,
    borderRadius: 2,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
});
