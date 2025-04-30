import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  StyleProp,
  ViewStyle,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

// Props for individual item (remains mostly the same)
interface BubbleBarItemProps {
  icon: string;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const BubbleBarItem: React.FC<BubbleBarItemProps> = ({
  icon,
  label,
  isActive,
  onPress,
}) => {
  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
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
    } else {
      // Reset scale if not active
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
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

// Define the structure for items passed as props
export interface BubbleBarTabItem {
  label: string;
  icon: string;
  // Add id if needed for external state management
}

// Updated props for the main BubbleBar component
interface BubbleBarProps {
  items: BubbleBarTabItem[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  style?: StyleProp<ViewStyle>;
}

const BubbleBar: React.FC<BubbleBarProps> = ({
  items,
  selectedIndex,
  onSelectIndex,
  style,
}) => {
  // const [activeTab, setActiveTab] = useState("explore"); // Removed internal state
  const bubblePosition = useRef(new Animated.Value(selectedIndex)).current;
  const bubbleScale = useRef(new Animated.Value(1)).current;

  /* Removed hardcoded tabs
  const tabs = [
    { id: "explore", icon: "🧭", label: "Explore" },
    { id: "events", icon: "🪩", label: "Events" },
    { id: "wallet", icon: "🪙", label: "Wallet" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];
  */

  // Animate bubble when selectedIndex changes
  useEffect(() => {
    // Using getCurrentValue() instead of __getValue()
    let currentPosition = selectedIndex;
    // Store previous value in a ref or state if needed

    // Only animate if the index actually changed
    if (currentPosition !== selectedIndex) {
      Animated.sequence([
        Animated.timing(bubbleScale, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.parallel([
          Animated.spring(bubblePosition, {
            toValue: selectedIndex,
            useNativeDriver: false,
            friction: 8,
            tension: 80,
            speed: 16,
            bounciness: 8,
          }),
          Animated.spring(bubbleScale, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: false,
          }),
        ]),
      ]).start();
    }
  }, [selectedIndex, bubblePosition, bubbleScale]);

  const handleTabPress = (index: number) => {
    // Don't do anything if already on the selected tab
    if (selectedIndex === index) return;

    // Call the external callback to update the state
    onSelectIndex(index);

    // Animation is handled by the useEffect hook watching selectedIndex
  };

  const numTabs = items.length;
  const windowWidth = Dimensions.get("window").width;
  // Adjust container width or use a fixed width for more predictable layout
  const containerWidth = Math.min(windowWidth * 0.9, 400); // Example: 90% of screen, max 400
  const tabWidth = (containerWidth - 8) / numTabs; // Adjusted for padding

  const inputRange = items.map((_, i) => i);
  const outputRange = items.map((_, i) => i * tabWidth);

  const translateX = bubblePosition.interpolate({
    inputRange: inputRange,
    outputRange: outputRange,
    extrapolate: "clamp", // Prevent extrapolation beyond defined range
  });

  return (
    <View style={[styles.container, { width: containerWidth }, style]}>
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
                width: tabWidth - 16, // Adjust bubble width based on dynamic tabWidth
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
          {items.map((tab, index) => (
            <BubbleBarItem
              key={index} // Use index as key if items don't have unique IDs
              icon={tab.icon}
              label={tab.label}
              isActive={selectedIndex === index}
              onPress={() => handleTabPress(index)}
            />
          ))}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // width: "100%", // Width is now calculated dynamically
    height: 44, // Match Figma Segmented Control height
    // marginVertical: 16, // Removed default margin
    borderRadius: 100,
    overflow: "hidden",
    alignSelf: "center", // Keep it centered
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
    justifyContent: "space-between", // Items will be spaced within the container
    alignItems: "center",
    paddingHorizontal: 4, // Keep padding
    paddingVertical: 4,
    height: "100%",
    position: "relative",
  },
  bubbleIndicator: {
    position: "absolute",
    height: 36,
    backgroundColor: "rgba(94, 94, 94, 0.18)", // Figma Button fill
    borderRadius: 20,
    marginHorizontal: 8, // Bubble is centered within its space
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
    flex: 1, // Each item takes equal space
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
    gap: 3, // Match Figma button gap
  },
  activeTabContent: {
    opacity: 1,
  },
  tabIcon: {
    fontSize: 18, // Match Figma button icon size
    fontWeight: "600", // Match Figma button font weight
    lineHeight: Platform.OS === "ios" ? 20 : 24,
  },
  activeTabIcon: {
    color: "rgba(255, 255, 255, 0.96)", // Figma Active Button Text
  },
  inactiveTabIcon: {
    color: "#545454", // Figma Inactive Button Text
  },
  tabLabel: {
    fontSize: 15, // Match Figma Button Label
    fontWeight: "600", // Match Figma Button Label
    color: "rgba(255, 255, 255, 0.96)", // Figma Active Button Text
  },
});

export default BubbleBar;
