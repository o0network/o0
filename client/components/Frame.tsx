import { ReactNode } from "react";
import { StyleSheet, StyleProp, ViewStyle, View } from "react-native";
import { BlurView } from "expo-blur";
import Svg, { Rect, Defs, LinearGradient, Stop } from "react-native-svg";

type FrameProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  tint?: "light" | "dark" | "default";
  borderRadius?: number;
};

export const Frame = ({
  children,
  style,
  intensity = 100,
  tint = "default",
  borderRadius = 32,
}: FrameProps) => {
  const frameStyles = [styles.container, { borderRadius }, style];

  return (
    <View style={frameStyles}>
      <BlurView
        intensity={intensity}
        tint={tint}
        style={[
          StyleSheet.absoluteFillObject,
          { borderRadius: borderRadius - 1 },
        ]}
      />
      {children}
    </View>
  );
};

export const Outbound = ({
  children,
  ...props
}: Omit<FrameProps, "outbound">) => {
  return (
    <Frame {...props} tint="light" intensity={30}>
      {children}
    </Frame>
  );
};

export const Inbound = ({
  children,
  borderRadius = 32,
  ...props
}: Omit<FrameProps, "inbound">) => {
  return (
    <Frame {...props} tint="dark" intensity={10}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient
            id="gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0" stopColor="white" stopOpacity="0.7" />
            <Stop offset="0.4" stopColor="white" stopOpacity="0.1" />
            <Stop offset="0.6" stopColor="white" stopOpacity="0.1" />
            <Stop offset="1" stopColor="white" stopOpacity="0.7" />
          </LinearGradient>
        </Defs>
        <Rect
          x="0.5"
          y="0.5"
          width="calc(100% - 1px)"
          height="calc(100% - 1px)"
          rx={borderRadius}
          stroke="url(#gradient)"
          strokeWidth="1"
          fill="transparent"
        />
      </Svg>
      {children}
    </Frame>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});

export default Frame;
