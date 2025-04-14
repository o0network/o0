import React, { useState } from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

type NavigationTabProps = {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  isActive: boolean;
  onPress: () => void;
};

const NavigationTab: React.FC<NavigationTabProps> = ({
  iconName,
  label,
  isActive,
  onPress,
}) => {
  return (
    <Pressable style={styles.tabButton} onPress={onPress}>
      <View style={[styles.tabContent, { opacity: isActive ? 1 : 0.5 }]}>
        <Ionicons name={iconName} size={24} color="#fff" />
        <Text style={styles.tabLabel}>{label}</Text>
      </View>
    </Pressable>
  );
};

// Main Navigation Component
export const Navigation = () => {
  const [activeTab, setActiveTab] = useState("explore");

  const tabs = [
    { id: "explore", iconName: "compass-outline" as const, label: "Explore" },
    { id: "create", iconName: "bulb-outline" as const, label: "Create" },
    { id: "assets", iconName: "wallet-outline" as const, label: "Assets" },
    { id: "account", iconName: "person-outline" as const, label: "Account" },
  ];

  return (
    <View style={styles.container}>
      <BlurView intensity={30} tint="dark" style={styles.blurContainer}>
        <View style={styles.content}>
          {tabs.map((tab) => (
            <NavigationTab
              key={tab.id}
              iconName={tab.iconName}
              label={tab.label}
              isActive={activeTab === tab.id}
              onPress={() => {
                setActiveTab(tab.id);
                console.log(`Navigation: ${tab.label} pressed`);
              }}
            />
          ))}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 84,
    marginVertical: 16,
  },
  blurContainer: {
    flex: 1,
    overflow: "hidden",
    borderRadius: 24,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    paddingTop: 12,
    paddingBottom: 28,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 10,
    color: "#fff",
    marginTop: 4,
    fontWeight: "500",
  },
});
