import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from "react";
import { Dimensions } from "react-native";

type ScreenContextType = {
  isLargeScreen: boolean;
  isMinWidth600: boolean;
};

const ScreenContext = createContext<ScreenContextType>({
  isLargeScreen: false,
  isMinWidth600: false,
});

export const ScreenProvider = ({ children }: { children: ReactNode }) => {
  const [isLargeScreen, setIsLargeScreen] = useState(
    Dimensions.get("window").width > 512
  );
  const [isMinWidth600, setIsMinWidth600] = useState(
    Dimensions.get("window").width >= 600
  );

  useEffect(() => {
    const onChange = ({
      window,
    }: {
      window: { width: number; height: number };
    }) => {
      setIsLargeScreen(window.width > 512);
      setIsMinWidth600(window.width >= 600);
    };

    const subscription = Dimensions.addEventListener("change", onChange);

    return () => subscription?.remove();
  }, []);

  return (
    <ScreenContext.Provider value={{ isLargeScreen, isMinWidth600 }}>
      {children}
    </ScreenContext.Provider>
  );
};

export const useScreen = () => {
  const context = useContext(ScreenContext);
  return context;
};
