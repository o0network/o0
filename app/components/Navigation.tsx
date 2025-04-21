import React from "react";
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  Image,
  Platform,
} from "react-native";

// If you have these icons in assets, use require("../assets/safari.png") etc.
const icons = [
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
    key: "params",
    label: "Params",
    emoji: "⚙️",
  },
];
const routes = ["/", "/create", "/assets", "/params"];

const Navigation = ({
  activeRoute,
  onNavigate,
}: {
  activeRoute: string;
  onNavigate: (route: string) => void;
}) => {
  return (
    <View style={styles.navBar}>
      {icons.map((tab, i) => {
        const isActive = routes[i] === activeRoute;
        return (
          <Pressable
            key={tab.key}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onNavigate(routes[i])}
          >
            {tab.img ? (
              <Image
                source={tab.img}
                style={[
                  styles.iconBase /*, isActive && styles.iconActiveImage */,
                ]}
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
            {isActive && <Text style={styles.label}>{tab.label}</Text>}
          </Pressable>
        );
      })}
    </View>
  );
};

export default Navigation;

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
  label: {
    fontSize: 15,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.96)",
  },
});
