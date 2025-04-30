import {
  View,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";

interface CellGridProps {
  data: string[][];
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
                <View style={[styles.cellInner, { backgroundColor: color }]} />
                {isSelected && <View style={styles.selectedCellBorder} />}
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
    borderRadius: 2,
    backgroundColor: "#000000",
    alignSelf: "stretch",
    padding: 2,
    gap: 2,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 2,
  },
  cellOuter: {
    flex: 1,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cellInner: {
    width: "100%",
    height: "100%",
    borderRadius: 2,
  },
  selectedCellBorder: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 2,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
});

export default CellGrid;
