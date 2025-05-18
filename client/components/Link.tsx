import { ReactNode } from "react";
import { Linking, TouchableOpacity, Text, ViewStyle } from "react-native";
import { openLink } from "@telegram-apps/sdk";
import { usePlatform } from "../contexts/ScreenContext";

export default function Link({
  href,
  children,
  style,
  external = false,
}: {
  href: string;
  children: ReactNode;
  style?: ViewStyle;
  external?: boolean;
}) {
  const { isPlatform } = usePlatform();
  const isTelegram = isPlatform("telegram");
  const handlePress = () => {
    if (external) {
      Linking.openURL(href);
      return;
    }

    if (isTelegram) {
      openLink(href);
      return;
    }

    Linking.openURL(href);
  };

  return (
    <TouchableOpacity
      style={style}
      onPress={handlePress}
      accessibilityRole="link"
    >
      {typeof children === "string" ? <Text>{children}</Text> : children}
    </TouchableOpacity>
  );
}
