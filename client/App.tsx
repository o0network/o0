import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
  MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import { useRef, useCallback, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text as RNText,
  TouchableOpacity,
  Animated,
  Image,
  Modal,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Nunito_600SemiBold, Nunito_700Bold } from "@expo-google-fonts/nunito";
import { DMMono_500Medium } from "@expo-google-fonts/dm-mono";
import { DynaPuff_700Bold } from "@expo-google-fonts/dynapuff";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  BottomSheetModalProvider,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { ModalContext } from "./contexts/ModalContext";
import PreferencesModal from "./modals/Preferences";
import ExploreScreen from "./screens/ExploreScreen";
import CreateScreen from "./screens/CreateScreen";
import AssetsScreen from "./screens/AssetsScreen";
import NetworkScreen from "./screens/NetworkScreen";
import { PlatformProvider, usePlatform } from "./utils/platform";
import { Background, WebIcons } from "./components";
import SafeAreaView, { useInsets } from "./components/SafeAreaView";
import { ScreenProvider, useScreen } from "./contexts/ScreenContext";
import CompassIcon from "./assets/emojis/compass.png";
import DvdIcon from "./assets/emojis/dvd.png";
import CoinIcon from "./assets/emojis/coin.png";
import GlobeIcon from "./assets/emojis/globe.png";

type TabParamList = {
  Explore: { address?: string };
  Create: undefined;
  Assets: { address?: string };
  Network: undefined;
};

const { width } = Dimensions.get("window");

const DEFAULT_ADDRESS = "/";

type TabBarItemProps = {
  label: string;
  isFocused: boolean;
  onPress: () => void;
  icon: any;
  bounceValue: Animated.Value;
  isLargeScreen?: boolean;
  isTelegram?: boolean;
};

const TabBarItem = ({
  label,
  isFocused,
  onPress,
  icon,
  bounceValue,
  isLargeScreen,
  isTelegram,
}: TabBarItemProps) => (
  <Animated.View style={{ transform: [{ translateX: bounceValue }] }}>
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      onPress={onPress}
      style={styles.touchableTabBase}
    >
      <Animated.View
        style={[
          styles.tabItemBase,
          isFocused ? styles.tabItemActive : styles.tabItemInactive,
          isTelegram && isFocused && styles.telegramTabItemActive,
          isTelegram && !isFocused && styles.telegramTabItemInactive,
        ]}
      >
        <Image
          source={icon}
          style={{
            width: 24,
            height: 24,
          }}
        />
        {(isFocused || isLargeScreen) && (
          <RNText style={styles.label}>{label}</RNText>
        )}
      </Animated.View>
    </TouchableOpacity>
  </Animated.View>
);

function CustomTabBar({
  state,
  descriptors,
  navigation,
}: MaterialTopTabBarProps) {
  const bounceValues = useRef(
    state.routes.map(() => new Animated.Value(0))
  ).current;
  const { isPlatform } = usePlatform();
  const { isLargeScreen } = useScreen();
  const isTelegram = isPlatform("telegram");
  const insets = useInsets();

  return (
    <View
      style={[
        styles.tabBarContainer,
        isTelegram &&
          /iPhone|iPad/i.test(navigator.userAgent) && {
            paddingVertical: 0,
            paddingHorizontal: 0,
          },
        isLargeScreen && styles.largeScreenTabBarContainer,
        isPlatform("web") && { top: 20 },
        isTelegram &&
          /iPhone|iPad/i.test(navigator.userAgent) && {
            top: insets.top - 38,
          },
        isTelegram && styles.telegramTabBarContainer,
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = route.name;
        const isFocused = state.index === index;

        let icon = CompassIcon;
        if (route.name === "Explore") icon = CompassIcon;
        if (route.name === "Create") icon = DvdIcon;
        if (route.name === "Assets") icon = CoinIcon;
        if (route.name === "Network") icon = GlobeIcon;

        const bounceValue = bounceValues[index];

        return (
          <TabBarItem
            key={route.key}
            label={label}
            isFocused={isFocused}
            icon={icon}
            bounceValue={bounceValue}
            isLargeScreen={isLargeScreen}
            isTelegram={isTelegram}
            onPress={() => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            }}
          />
        );
      })}
    </View>
  );
}

export default function App() {
  const navigationRef = useRef(null);
  const [fontsLoaded, fontError] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
    DMMono_500Medium,
    DynaPuff_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  const { isPlatform } = usePlatform();
  const modalRef = useRef<BottomSheetModal>(null);
  const { isMinWidth600 } = useScreen();
  const [isClassicPreferencesVisible, setIsClassicPreferencesVisible] =
    useState(false);

  const openPreferences = useCallback(() => {
    if (isMinWidth600) {
      setIsClassicPreferencesVisible(true);
    } else {
      modalRef.current?.present();
    }
  }, [isMinWidth600, modalRef]);

  const handleClosePreferences = useCallback(() => {
    if (isMinWidth600) {
      setIsClassicPreferencesVisible(false);
    } else {
      modalRef.current?.dismiss();
    }
  }, [isMinWidth600, modalRef]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const Tab = createMaterialTopTabNavigator<TabParamList>();
  const screenOptions: MaterialTopTabNavigationOptions = {
    swipeEnabled: true,
    lazy: true,
    lazyPreloadDistance: 0,
    tabBarItemStyle: { width: 100 },
    tabBarScrollEnabled: false,
    tabBarContentContainerStyle: styles.tabBarContentContainer,
    tabBarStyle: styles.tabBar,
  };

  const MainTabs = () => (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={screenOptions}
      initialLayout={{ width }}
    >
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        initialParams={{ address: DEFAULT_ADDRESS }}
        options={{ swipeEnabled: false }}
      />
      <Tab.Screen
        name="Assets"
        component={AssetsScreen}
        initialParams={{ address: DEFAULT_ADDRESS }}
      />
      <Tab.Screen name="Create" component={CreateScreen} />
      <Tab.Screen name="Network" component={NetworkScreen} />
    </Tab.Navigator>
  );

  return (
    <PlatformProvider>
      <ScreenProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <ModalContext.Provider value={{ openPreferences }}>
              <Background />
              <WebIcons />
              <View style={styles.container}>
                <StatusBar
                  style="light"
                  translucent
                  backgroundColor="transparent"
                />
                <SafeAreaProvider>
                  <SafeAreaView style={styles.safeArea}>
                    <NavigationContainer
                      ref={navigationRef}
                      theme={{
                        ...DefaultTheme,
                        colors: {
                          ...DefaultTheme.colors,
                          background: "transparent",
                        },
                      }}
                      onReady={onLayoutRootView}
                      linking={{
                        prefixes: [],
                        config: {
                          screens: {
                            ...(isPlatform("web") ? { Home: "home" } : {}),
                            Explore: "explore/:address?",
                            Assets: "assets/:address?",
                            Create: "create",
                            Network: "network",
                          },
                        },
                      }}
                    >
                      <MainTabs />
                    </NavigationContainer>
                  </SafeAreaView>
                </SafeAreaProvider>
              </View>
              {isMinWidth600 ? (
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={isClassicPreferencesVisible}
                  onRequestClose={handleClosePreferences}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <PreferencesModal onClose={handleClosePreferences} />
                    </View>
                  </View>
                </Modal>
              ) : (
                <BottomSheetModal
                  ref={modalRef}
                  index={0}
                  snapPoints={["70%"]}
                  enablePanDownToClose={true}
                  backgroundStyle={{
                    backgroundColor: "rgba(30, 30, 30, 0.95)",
                  }}
                  handleIndicatorStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    width: 50,
                  }}
                  android_keyboardInputMode="adjustResize"
                  keyboardBehavior="extend"
                >
                  <PreferencesModal onClose={handleClosePreferences} />
                </BottomSheetModal>
              )}
            </ModalContext.Provider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </ScreenProvider>
    </PlatformProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  tabBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingVertical: 4,
    paddingHorizontal: 4,
    backgroundColor: "rgba(208, 208, 208, 0.5)",
    borderRadius: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 32,
    position: "absolute",
    zIndex: 10,
  },
  telegramTabBarContainer: {
    backgroundColor: "transparent",
    gap: 8,
  },
  largeScreenTabBarContainer: {
    gap: 16,
  },
  tabBar: {
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: "transparent",
  },
  tabBarContentContainer: {
    flex: 1,
  },
  touchableTabBase: {},
  tabItemBase: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    paddingVertical: 6,
  },
  tabItemActive: {
    backgroundColor: "rgba(94, 94, 94, 0.2)",
  },
  tabItemInactive: {
    paddingHorizontal: 8,
    gap: 3,
  },
  telegramTabItemActive: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  telegramTabItemInactive: {
    backgroundColor: "transparent",
  },
  icon: {
    fontSize: 24,
    fontWeight: "600",
  },
  iconActive: {
    color: "rgba(255, 255, 255, 0.96)",
  },
  iconInactive: {
    color: "#545454",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.96)",
    marginLeft: 4,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "rgba(30, 30, 30, 0.95)",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "70%",
    maxWidth: 600,
  },
});
