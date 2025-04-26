import {
  View,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Text } from "../components";
import ButtonSvg from "../assets/Button.svg";

type ButtonProps = {
  title: string;
  glorious?: boolean;
  icon?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export const Button: React.FC<ButtonProps> = ({
  title,
  icon,
  onPress,
  style,
  glorious,
  textStyle,
}) => {
  const containerStyles: StyleProp<ViewStyle>[] = [styles.container];
  const textStyles: StyleProp<TextStyle>[] = [styles.textStyle];

  if (glorious) {
    containerStyles.push(styles.gloriousContainer);
    textStyles.push(styles.gloriousTextStyle);
  } else {
    containerStyles.push(styles.defaultContainer);
  }
  containerStyles.push(style);
  textStyles.push(textStyle);

  return (
    <TouchableOpacity
      style={containerStyles}
      onPress={onPress}
      activeOpacity={glorious ? 0.8 : 0.2}
    >
      {glorious && (
        <View style={styles.svgContainer}>
          <ButtonSvg width="100%" height="100%" />
        </View>
      )}
      <View style={styles.contentContainer}>
        {icon && <Text style={styles.iconStyle}>{icon}</Text>}
        <Text style={textStyles}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
    paddingVertical: 10,
    paddingHorizontal: 24,
    minHeight: 44,
    marginVertical: 5,
    position: "relative",
    overflow: "hidden",
  },
  defaultContainer: {
    borderRadius: 20,
    backgroundColor: "rgba(94, 94, 94, 0.18)",
  },
  gloriousContainer: {
    borderRadius: 35,
    minHeight: 54,
  },
  svgContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
    zIndex: 1,
  },
  iconStyle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#FFFFFF",
    zIndex: 1,
  },
  textStyle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#FFFFFF",
    zIndex: 1,
  },
  gloriousTextStyle: {
    fontSize: 18,
    fontWeight: "700",
  },
});

export default Button;
