import React, { ReactNode, useState } from "react";
import { Platform, StyleSheet, StyleProp, ViewStyle, View } from "react-native";
import { BlurView } from "expo-blur";
import Svg, { Rect, Defs, LinearGradient, Stop } from "react-native-svg";

type FrameProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  tint?: "light" | "dark" | "default";
  borderRadius?: number;
  solidBorder?: boolean;
};

export const Frame = ({
  children,
  style,
  intensity = 100,
  solidBorder = false,
  tint = "default",
  borderRadius = 12,
}: FrameProps) => {
  const frameStyles = [
    styles.container,
    { borderRadius },
    style,
    solidBorder && { borderWidth: 1, borderColor: "#eeeeeeaa" },
  ];

  const tintColorFallback =
    tint === "light"
      ? "rgba(255,255,255,0.1)"
      : tint === "dark"
      ? "rgba(0,0,0,0.1)"
      : "rgba(255,255,255,0.1)";
  const blurRadius = intensity;

  return (
    <View style={frameStyles}>
      {Platform.OS === "web" ? (
        <div
          style={{
            ...StyleSheet.absoluteFillObject,
            background: tintColorFallback,
            backdropFilter: `blur(${blurRadius}px)`,
            WebkitBackdropFilter: `blur(${blurRadius}px)`,
            borderRadius: borderRadius,
            zIndex: -1,
            ...(tint === "dark" && {
              boxShadow: "inset 0px 2px 6px rgba(0,0,0,0.3)",
            }),
          }}
        />
      ) : (
        <BlurView
          intensity={intensity}
          tint={tint}
          style={[
            StyleSheet.absoluteFillObject,
            { borderRadius: borderRadius },
          ]}
        />
      )}
      {children}
    </View>
  );
};

export const Outbound = ({
  children,
  borderRadius = 32,
  ...props
}: Omit<FrameProps, "outbound">) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const handleLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions({ width, height });
  };

  const showBorder = dimensions.width > 120 && dimensions.height > 120;

  return (
    <Frame {...props} solidBorder={!showBorder} borderRadius={borderRadius}>
      <View style={StyleSheet.absoluteFill} onLayout={handleLayout}>
        {showBorder && (
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
              rx={borderRadius - 1}
              stroke="url(#gradient)"
              strokeWidth="1"
              fill="transparent"
            />
          </Svg>
        )}
      </View>
      {children}
    </Frame>
  );
};

export const Inbound = ({
  children,
  ...props
}: Omit<FrameProps, "inbound">) => {
  return (
    <Frame {...props} tint="dark" intensity={25}>
      {children}
    </Frame>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Frame;
