import { Text as RNText, TextProps } from "react-native";
import { PropsWithChildren } from "react";

const defaultStyle = {
  fontFamily: "Nunito_600SemiBold",
};

type Props = PropsWithChildren<TextProps>;

export default function Text({ style, children, ...rest }: Props) {
  return (
    <RNText style={[defaultStyle, style]} {...rest}>
      {children}
    </RNText>
  );
}
