import {
  View,
  StyleSheet,
  Pressable,
  Text,
  Image,
  ImageSourcePropType,
} from "react-native";

export type TabItemType = {
  key: string;
  label: string;
  emoji: string;
  img?: ImageSourcePropType;
};

type SwitchProps = {
  style?: any;
  children?: React.ReactNode;
};

const Switch = ({ style, children }: SwitchProps) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

type TabProps = {
  tab: TabItemType;
  active: boolean;
  showLabels?: boolean;
  isPlatformWeb?: boolean;
  style?: any;
  onPress: () => void;
};

const Tab = ({
  tab,
  active,
  showLabels = true,
  isPlatformWeb = false,
  style,
  onPress,
}: TabProps) => {
  return (
    <Pressable
      key={tab.key}
      style={[styles.tab, active && styles.tabActive, style]}
      onPress={onPress}
    >
      {tab.img ? (
        <Image
          source={tab.img}
          style={[styles.iconBase, active && styles.iconActiveImage]}
          resizeMode="contain"
        />
      ) : (
        <Text
          style={[styles.iconBase, styles.icon, active && styles.iconActive]}
        >
          {tab.emoji}
        </Text>
      )}
      {(active || isPlatformWeb) && showLabels && (
        <Text style={styles.label}>{tab.label}</Text>
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
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginHorizontal: 0,
    gap: 8,
  },
  tabActive: {
    backgroundColor: "rgba(94, 94, 94, 0.18)",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    borderRadius: 999,
  },
  iconBase: {
    width: 24,
    height: 24,
  },
  icon: {
    fontSize: 20,
    textAlign: "center",
    textAlignVertical: "center",
    color: "rgba(84, 84, 84, 1)",
  },
  iconActive: {
    color: "rgba(255, 255, 255, 0.96)",
  },
  iconActiveImage: {
    opacity: 1,
    tintColor: "rgba(255, 255, 255, 0.96)",
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.96)",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(208, 208, 208, 0.5)",
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 4,
    gap: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumb: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
  },
  disabled: {
    opacity: 0.4,
  },
});

Switch.Tab = Tab;

export default Switch;
