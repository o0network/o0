import {
  Pressable,
  StyleSheet,
  View,
  Text,
  Image,
  ImageSourcePropType,
} from "react-native";
import { usePlatformContext } from "../utils/platform";

type TabItem = {
  key: string;
  label: string;
  emoji: string;
  img?: ImageSourcePropType;
};

const icons: TabItem[] = [
  {
    key: "explore",
    label: "Explore",
    emoji: "🧭",
  },
  {
    key: "create",
    label: "Create",
    emoji: "🪩",
  },
  {
    key: "assets",
    label: "Assets",
    emoji: "🪙",
  },
  {
    key: "tweaks",
    label: "Tweaks",
    emoji: "🪩",
  },
];
const routes = ["/explore", "/create", "/assets", "/tweaks"];

export default function Navigation({
  activeRoute,
  onNavigate,
}: {
  activeRoute: string;
  onNavigate: (route: string) => void;
}) {
  const { platform } = usePlatformContext();

  const navBarStyle = [
    styles.navBar,
    platform === "telegram" && styles.navBarTelegram,
    platform === "web" && styles.navBarWeb,
  ];

  const showLabels = platform !== "telegram";

  return (
    <View style={navBarStyle}>
      {icons.map((tab, i) => {
        const isActive = routes[i] === activeRoute;
        return (
          <Pressable
            key={tab.key}
            style={[
              styles.tab,
              isActive && styles.tabActive,
              platform === "telegram" && styles.tabTelegram,
            ]}
            onPress={() => onNavigate(routes[i])}
          >
            {tab.img ? (
              <Image
                source={tab.img}
                style={[styles.iconBase, isActive && styles.iconActiveImage]}
                resizeMode="contain"
              />
            ) : (
              <Text
                style={[
                  styles.iconBase,
                  styles.icon,
                  isActive && styles.iconActive,
                ]}
              >
                {tab.emoji}
              </Text>
            )}
            {(isActive || platform === "web") && showLabels && (
              <Text style={styles.label}>{tab.label}</Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 32,
    padding: 4,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    gap: 32,
    alignSelf: "flex-start",
    minHeight: 44,
  },
  navBarTelegram: {
    gap: 16,
    padding: 2,
    borderRadius: 24,
  },
  navBarWeb: {
    gap: 8,
    justifyContent: "center",
    alignSelf: "stretch",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
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
  },
  tabTelegram: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  iconBase: {
    width: 36,
    height: 36,
  },
  icon: {
    fontSize: 28,
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
});
