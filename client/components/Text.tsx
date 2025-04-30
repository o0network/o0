import { Text as RNText, Platform } from "react-native";

export default function Text(props: React.ComponentProps<typeof RNText>) {
  const { style, ...rest } = props;

  // Combine styles with non-selectable properties
  const combinedStyles = [
    {
      fontFamily: "Nunito_600SemiBold",
      color: "#FFFFFF",
    },
    // Add web-specific style for preventing selection
    Platform.OS === "web" ? { userSelect: "none" as "none" } : {},
    style,
  ];

  return <RNText selectable={false} style={combinedStyles} {...rest} />;
}
