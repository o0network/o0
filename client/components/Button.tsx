import {
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
  Image,
  ImageSourcePropType,
  View,
} from "react-native";
import { Outbound } from "./Frame";
import Text from "./Text";

export type ButtonProps = {
  title?: string;
  iconPath?: ImageSourcePropType;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  iconPosition?: "left" | "right";
  round?: boolean;
};

export const Button = ({
  title,
  iconPath,
  onPress,
  style,
  textStyle,
  disabled,
  iconPosition = "left",
  round = false,
}: ButtonProps) => {
  // Handle round buttons differently
  if (round) {
    return (
      <View style={{ width: 40, height: 40 }}>
        <Outbound style={{ width: 40, height: 40, borderRadius: 20 }}>
          <TouchableOpacity
            style={[
              {
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
              },
              disabled && styles.disabled,
            ]}
            onPress={onPress}
            activeOpacity={0.7}
            disabled={disabled}
          >
            {iconPath && <Image style={styles.icon} source={iconPath} />}
          </TouchableOpacity>
        </Outbound>
      </View>
    );
  }

  // Regular button
  return (
    <Outbound>
      <TouchableOpacity
        style={[styles.container, disabled && styles.disabled, style]}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <View style={styles.contentContainer}>
          {iconPath && iconPosition === "left" && (
            <Image style={styles.icon} source={iconPath} />
          )}
          {title ? (
            <Text style={[styles.textStyle, textStyle]}>{title}</Text>
          ) : null}
          {iconPath && iconPosition === "right" && (
            <Image style={styles.icon} source={iconPath} />
          )}
        </View>
      </TouchableOpacity>
    </Outbound>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  disabled: {
    opacity: 0.5,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  textStyle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
});

export default Button;
