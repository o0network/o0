import React, { useState } from "react";
import {
  Linking,
  TouchableOpacity,
  Image,
  StyleSheet,
  View,
  Text,
  Pressable,
  GestureResponderEvent,
} from "react-native";
import { usePlatform, useScreen } from "../contexts/ScreenContext";
import TelegramIcon from "../assets/telegram.svg";

type PopoverLinkProps = {
  url: string;
  text: string;
};

const PopoverLink: React.FC<PopoverLinkProps> = ({ url, text }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Pressable
      onPress={() => Linking.openURL(url)}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={[styles.popoverLink, isHovered && styles.popoverLinkHovered]}
    >
      <Text style={styles.popoverLinkText}>{text}</Text>
    </Pressable>
  );
};

export const WebIcons: React.FC = () => {
  const { isLargeScreen } = useScreen();
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [isMoreButtonHovered, setIsMoreButtonHovered] = useState(false);

  const togglePopover = () => {
    setIsPopoverVisible(!isPopoverVisible);
  };

  if (!isLargeScreen) {
    return null;
  }

  return (
    <View
      style={[StyleSheet.absoluteFill, { zIndex: 3 }]}
      pointerEvents="box-none"
    >
      {isPopoverVisible && (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setIsPopoverVisible(false)}
        />
      )}

      <TouchableOpacity
        style={styles.topLeft}
        onPress={() => Linking.openURL("https://t.me/o0netbot")}
      >
        <TelegramIcon width={40} height={40} />
      </TouchableOpacity>

      <Pressable
        style={({ pressed }) => [
          styles.topRightPosition,
          styles.moreButtonBase,
          isMoreButtonHovered && styles.moreButtonHovered,
          isPopoverVisible && styles.moreButtonActive,
        ]}
        onPress={togglePopover}
        onHoverIn={() => setIsMoreButtonHovered(true)}
        onHoverOut={() => setIsMoreButtonHovered(false)}
        onStartShouldSetResponder={() => true}
        onTouchEnd={(e: GestureResponderEvent) => e.stopPropagation()}
      >
        {isPopoverVisible ? (
          <Image
            source={require("../assets/emojis/cross-mark.png")}
            style={styles.iconSize}
          />
        ) : (
          <Image
            source={require("../assets/more.png")}
            style={styles.iconSize}
          />
        )}
      </Pressable>

      {isPopoverVisible && (
        <View
          style={styles.popover}
          onStartShouldSetResponder={() => true}
          onTouchEnd={(e: GestureResponderEvent) => e.stopPropagation()}
        >
          <PopoverLink
            url="https://o0.network/privacy.pdf"
            text="Privacy Policy"
          />
          <PopoverLink
            url="https://o0.network/graypaper.pdf"
            text="Graypaper"
          />
          <PopoverLink url="https://github.com/o0network/o0" text="GitHub" />
          <PopoverLink url="https://x.com/o0netbot" text="X" />
        </View>
      )}

      <TouchableOpacity
        style={styles.bottomLeft}
        onPress={() => Linking.openURL("https://o0.network/a")}
      >
        <Image
          source={require("../assets/app-store.png")}
          style={styles.iconSizeLarge}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bottomRight}
        onPress={() => Linking.openURL("https://o0.network/g")}
      >
        <Image
          source={require("../assets/google-play.png")}
          style={styles.iconSizeLarge}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  iconSize: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  iconSizeLarge: {
    width: 64,
    height: 64,
    resizeMode: "contain",
  },
  topLeft: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  topRightPosition: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1001,
  },
  moreButtonBase: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  moreButtonHovered: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  moreButtonActive: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  bottomLeft: {
    position: "absolute",
    bottom: 20,
    left: 20,
    width: 64,
    height: 64,
    zIndex: 10,
  },
  bottomRight: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 64,
    height: 64,
    zIndex: 10,
  },
  popover: {
    position: "absolute",
    top: 70,
    right: 20,
    display: "flex",
    flexDirection: "column",
    gap: 4,
    padding: 12,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 12,
    zIndex: 1000,
    minWidth: 160,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  popoverHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  closeButton: {
    color: "#FFFFFF",
    fontSize: 16,
    paddingVertical: 4,
    cursor: "pointer",
  },
  popoverLink: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginVertical: 2,
  },
  popoverLinkHovered: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  popoverLinkText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default WebIcons;
