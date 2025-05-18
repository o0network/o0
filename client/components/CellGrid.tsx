import {
  View,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  Text,
} from "react-native";

interface CellGridProps {
  data: string[][];
  style?: StyleProp<ViewStyle>;
  onSelect?: (rowIndex: number, colIndex: number) => void;
  selectedCoords?: { row: number; col: number } | null;
  assetLabels?: {
    value: string;
    symbol: string;
    address: string;
  }[][];
}

export const CellGrid: React.FC<CellGridProps> = ({
  data,
  style,
  onSelect,
  selectedCoords,
  assetLabels,
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

            // Get label data if available
            const label = assetLabels?.[rowIndex]?.[colIndex];

            return (
              <TouchableOpacity
                key={cellId}
                style={[
                  styles.cellOuter,
                  // Make some cells larger based on their importance
                  label && label.value ?
                  {
                    flex: Math.max(1, parseFloat(label.value) / 100),
                  } : {}
                ]}
                onPress={
                  onSelect ? () => onSelect(rowIndex, colIndex) : undefined
                }
                activeOpacity={0.7}
              >
                <View style={[styles.cellInner, { backgroundColor: color }]}>
                  {label && (
                    <View style={styles.labelContainer}>
                      {label.symbol && (
                        <Text style={styles.symbolText}>{label.symbol}</Text>
                      )}
                      {label.value && (
                        <Text style={styles.valueText}>
                          {label.value && `$${label.value}`}
                        </Text>
                      )}
                    </View>
                  )}
                </View>
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
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    alignSelf: "stretch",
    padding: 2,
    gap: 2,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 2,
    minHeight: 50,
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
    borderRadius: 4,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCellBorder: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 4,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  labelContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  symbolText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  valueText: {
    color: "#FFFFFF",
    fontSize: 10,
    textAlign: "center",
  },
});

export default CellGrid;
