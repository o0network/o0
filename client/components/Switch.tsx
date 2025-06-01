import {
  StyleSheet,
  Pressable,
  Text,
  Image,
  ImageSourcePropType,
} from "react-native";
import { Inbound } from "./Frame";

type SwitchProps = {
  style?: any;
  children?: React.ReactNode;
};

const Switch = ({ style, children }: SwitchProps) => {
  return <Inbound style={[styles.container, style]}>{children}</Inbound>;
};

type TabProps = {
  label: string;
  img?: ImageSourcePropType;
  active: boolean;
  style?: any;
  onPress: () => void;
};

const Tab = ({ label, img, active, style, onPress }: TabProps) => {
  return (
    <Pressable
      style={[styles.tab, active && styles.tabActive, style]}
      onPress={onPress}
    >
      {img ? (
        <Image
          source={img}
          style={styles.iconBase}
          resizeMode="contain"
        />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    paddingHorizontal: 28,
    height: "100%",
    marginHorizontal: 0,
    gap: 8,
  },
  tabActive: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  iconBase: {
    width: 22,
    height: 22,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 38,
    margin: 1,
    borderRadius: 999,
    paddingHorizontal: 3,
    paddingVertical: 3,
    gap: 4,
  },
});

Switch.Tab = Tab;

export default Switch;
