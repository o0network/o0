import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Figma Node: 2658:1065 (Checkbox Component)

type CheckboxProps = {
  isChecked: boolean;
  onToggle: (value: boolean) => void;
  disabled?: boolean;
};

const Checkbox = ({ isChecked, onToggle, disabled }: CheckboxProps) => {
  const checkboxStyle = [
    styles.container,
    isChecked ? styles.checked : styles.unchecked,
    disabled && styles.disabled,
  ];

  return (
    <TouchableOpacity
      style={checkboxStyle}
      onPress={() => onToggle(!isChecked)}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {isChecked && <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  unchecked: {
    borderColor: "rgba(235, 235, 245, 0.3)",
    backgroundColor: "transparent",
  },
  checked: {
    backgroundColor: "#32D74B",
    borderColor: "#32D74B",
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Checkbox;
