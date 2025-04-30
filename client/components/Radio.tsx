import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Assuming Ionicons for the checkmark

type RadioProps = {
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
};

const Radio = ({ isSelected, onSelect, disabled }: RadioProps) => {
  const radioStyle = [
    styles.container,
    isSelected ? styles.selected : styles.unselected,
    disabled && styles.disabled,
    // Gradient stroke stroke_NU63VS omitted for simplicity
  ];

  return (
    <TouchableOpacity
      style={radioStyle}
      onPress={onSelect}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {isSelected && <View style={styles.innerDot} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 24, // Approximate size based on typical radio buttons
    height: 24, // Approximate size
    borderRadius: 100, // From Figma borderRadius
    borderWidth: 1.5, // Approximate border width
    justifyContent: "center",
    alignItems: "center",
    // sizing: fixed from layout_YTYP74
  },
  unselected: {
    borderColor: "rgba(235, 235, 245, 0.6)", // A standard unselected color
    backgroundColor: "transparent",
  },
  selected: {
    borderColor: "#32D74B", // From Figma fill_049WCG
    backgroundColor: "#32D74B", // From Figma fill_049WCG
  },
  innerDot: {
    width: 10, // Size of the inner dot when selected
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF", // From Figma fill_J8KZGE (color of checkmark)
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Radio;
