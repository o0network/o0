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
import Text from "./Text";

export const GloriousButton = ({
  title,
  iconPath,
  onPress,
  style,
  textStyle,
}: {
  title: string;
  iconPath?: ImageSourcePropType;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}) => {
  return (
    <TouchableOpacity
      style={[styles.touchable, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.buttonLayout}>
        <View style={styles.capLeft}>
          <Image
            source={require("../assets/gloriousButton/left.png")}
            style={styles.capImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.center}>
          <Image
            source={require("../assets/gloriousButton/center.png")}
            style={styles.centerImage}
            resizeMode="stretch"
          />
          <View style={styles.textContainer}>
            {iconPath && <Image style={styles.icon} source={iconPath} />}
            <Text style={[styles.textStyle, textStyle]}>{title}</Text>
          </View>
        </View>

        <View style={styles.capRight}>
          <Image
            source={require("../assets/gloriousButton/right.png")}
            style={styles.capImage}
            resizeMode="cover"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const PILL_HEIGHT = 54;
const CAP_RADIUS = PILL_HEIGHT / 2;

const styles = StyleSheet.create({
  touchable: {
    height: PILL_HEIGHT,
    width: "100%",
  },
  buttonLayout: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
    position: "relative",
  },
  capLeft: {
    width: CAP_RADIUS,
    height: "100%",
    marginRight: -5,
    zIndex: 1,
  },
  capRight: {
    marginLeft: -5,
    width: CAP_RADIUS,
    height: "100%",
    zIndex: 1,
  },
  center: {
    flex: 1,
    height: "100%",
    zIndex: 0,
    position: "relative",
  },
  capImage: {
    width: "100%",
    height: "100%",
  },
  centerImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  textContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    zIndex: 2,
  },
  icon: {
    width: 24,
    height: 24,
  },
  textStyle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    color: "#FFFFFF",
  },
});

export default GloriousButton;
