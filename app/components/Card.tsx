import React, { ReactNode } from "react";
import { View, StyleSheet, ViewStyle, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../App";

interface CardProps {
  children?: ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

// Figma Node: Approximated from user design references
const Card = ({ children, style, onPress }: CardProps) => {
  // If children are provided, render with custom content
  if (children) {
    return <View style={[styles.container, style]}>{children}</View>;
  }

  // Default card with avatar and text content
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <View style={styles.contentWrapper}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={22} color="#FFFFFF" />
        </View>
        <View style={styles.textContent}>
          <Text style={styles.title}>People can make changes</Text>
          <Text style={styles.subtitle}>Sharing as Jay Moon</Text>
        </View>
        <View style={styles.actionIcon}>
          <Ionicons name="menu" size={22} color="rgba(235, 235, 245, 0.6)" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "rgba(60, 60, 67, 0.3)",
    borderRadius: 16,
    overflow: "hidden",
    marginVertical: 8,
  },
  contentWrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(130, 180, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  textContent: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(235, 235, 245, 0.6)",
    fontWeight: "500",
  },
  actionIcon: {
    padding: 4,
  },
});
