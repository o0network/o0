import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

type BubbleBarItemProps = {
  icon: string;
  label: string;
  isActive: boolean;
  onPress: () => void;
};

const BubbleBarItem: React.FC<BubbleBarItemProps> = ({
  icon,
  label,
  isActive,
  onPress,
}) => {
  // Create an animated value for the bounce effect
  const bounceAnim = useRef(new Animated.Value(1)).current;

  // Animation for the bounce effect when the tab becomes active
  React.useEffect(() => {
    if (isActive) {
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isActive, bounceAnim]);

  return (
    <Pressable style={styles.tabItem} onPress={onPress}>
      <View style={[styles.tabContent, isActive && styles.activeTabContent]}>
        <Animated.Text
          style={[
            styles.tabIcon,
            isActive ? styles.activeTabIcon : styles.inactiveTabIcon,
            { transform: [{ scale: isActive ? bounceAnim : 1 }] },
          ]}
        >
          {icon}
        </Animated.Text>
        {isActive && (
          <Animated.Text
            style={[
              styles.tabLabel,
              {
                opacity: bounceAnim.interpolate({
                  inputRange: [1, 1.2],
                  outputRange: [1, 0.8],
                }),
              },
            ]}
          >
            {label}
          </Animated.Text>
        )}
      </View>
    </Pressable>
  );
};

type BubbleBarProps = {
  onTabChange?: (tabId: string) => void;
};

const BubbleBar: React.FC<BubbleBarProps> = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState("explore");
  const bubblePosition = useRef(new Animated.Value(0)).current;
  const bubbleScale = useRef(new Animated.Value(1)).current;

  const tabs = [
    { id: "explore", icon: "🧭", label: "Explore" },
    { id: "events", icon: "🪩", label: "Events" },
    { id: "wallet", icon: "🪙", label: "Wallet" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  const handleTabPress = (index: number, tabId: string) => {
    // Don't animate if already on the selected tab
    if (activeTab === tabId) return;

    // Bubble bounce animation
    Animated.sequence([
      Animated.timing(bubbleScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.parallel([
        Animated.spring(bubblePosition, {
          toValue: index,
          useNativeDriver: false,
          friction: 8,
          tension: 80,
          speed: 16,
          bounciness: 8, // Increase bounciness for more bounce
        }),
        Animated.spring(bubbleScale, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: false,
        }),
      ]),
    ]).start();

    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const tabWidth = Dimensions.get("window").width / tabs.length;
  const translateX = bubblePosition.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: [0, tabWidth, tabWidth * 2, tabWidth * 3],
  });

  return (
    <View style={styles.container}>
      <BlurView intensity={30} tint="dark" style={styles.blurContainer}>
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.1)", "rgba(208, 208, 208, 0.5)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientOverlay}
        />
        <View style={styles.barContainer}>
          <Animated.View
            style={[
              styles.bubbleIndicator,
              {
                width: tabWidth - 16,
                transform: [
                  { translateX },
                  { scaleX: bubbleScale },
                  { scaleY: bubbleScale },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={["rgba(255, 255, 255, 0.4)", "rgba(255, 255, 255, 0)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.bubbleGradient}
            />
          </Animated.View>
          {tabs.map((tab, index) => (
            <BubbleBarItem
              key={tab.id}
              icon={tab.icon}
              label={tab.label}
              isActive={activeTab === tab.id}
              onPress={() => handleTabPress(index, tab.id)}
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
    height: 64,
    marginVertical: 16,
    borderRadius: 100,
    overflow: "hidden",
  },
  blurContainer: {
    flex: 1,
    overflow: "hidden",
    borderRadius: 100,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
  },
  barContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 4,
    height: "100%",
    position: "relative",
  },
  bubbleIndicator: {
    position: "absolute",
    height: 36,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 20,
    marginHorizontal: 8,
    top: "50%",
    marginTop: -18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 0.5,
    borderColor: "rgba(255, 255, 255, 0.2)",
    overflow: "hidden",
  },
  bubbleGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    paddingHorizontal: 8,
    gap: 4,
  },
  activeTabContent: {
    opacity: 1,
  },
  tabIcon: {
    fontSize: 24,
    lineHeight: Platform.OS === "ios" ? 20 : 24,
  },
  activeTabIcon: {
    opacity: 1,
  },
  inactiveTabIcon: {
    opacity: 0.5,
  },
  tabLabel: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.96)",
    fontWeight: "600",
    marginLeft: 4,
  },
});

export default BubbleBar;
