import { ReactNode } from "react";
import { View } from "react-native";
import { usePlatform } from "../contexts/ScreenContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { viewport } from "@telegram-apps/sdk";

type Props = {
  children: ReactNode;
  style?: any;
};

export const useInsets = () => {
  const { isPlatform } = usePlatform();
  return isPlatform("telegram") ||
    isPlatform("tg_ios") ||
    isPlatform("tg_android")
    ? viewport.safeAreaInsets()
    : useSafeAreaInsets();
};

const SafeAreaView = ({ children, style }: Props) => {
  const insets = useInsets();
  return (
    <View
      style={[
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          flex: 1,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default SafeAreaView;
