import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
  MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import {
  useRef,
  useCallback,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text as RNText,
  TouchableOpacity,
  Animated,
  Image,
} from "react-native";
import Modal from "react-native-modal";
import { BlurView } from "expo-blur";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Nunito_600SemiBold, Nunito_700Bold } from "@expo-google-fonts/nunito";
import { DMMono_500Medium } from "@expo-google-fonts/dm-mono";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  BottomSheetModalProvider,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { ModalContext } from "./contexts/ModalContext";
import { AuthProvider } from "./contexts/AuthContext";
import SettingsScreen from "./screens/SettingsScreen";
import ExploreScreen from "./screens/ExploreScreen";
import CreateScreen from "./screens/CreateScreen";
import LedgerScreen from "./screens/LedgerScreen";
import { PlatformProvider, usePlatform } from "./contexts/ScreenContext";
import { Background, WebIcons } from "./components";
import { useInsets } from "./components/SafeAreaView";
import { ScreenProvider, useScreen } from "./contexts/ScreenContext";
import CompassIcon from "./assets/emojis/compass.png";
import DvdIcon from "./assets/emojis/dvd.png";
import CoinIcon from "./assets/emojis/coin.png";
import GearIcon from "./assets/emojis/gear.png";

// All emoji images
import TalkIcon from "./assets/emojis/talk.png";
import ExternalLinkIcon from "./assets/emojis/external-link.png";
import RejectIcon from "./assets/emojis/reject.png";
import WorldIcon from "./assets/emojis/world.png";
import TopLeftArrowIcon from "./assets/emojis/top-left-arrow.png";
import UpwardsIcon from "./assets/emojis/upwards.png";
import RightArrowIcon from "./assets/emojis/right-arrow.png";
import MoneyWingsIcon from "./assets/emojis/money-wings.png";
import ProhibitedIcon from "./assets/emojis/prohibited.png";
import MoneyFaceIcon from "./assets/emojis/money-face.png";
import LeftArrowIcon from "./assets/emojis/left-arrow.png";
import GlobeIcon from "./assets/emojis/globe.png";
import DownwardsIcon from "./assets/emojis/downwards.png";
import CloudIcon from "./assets/emojis/cloud.png";
import ChainIcon from "./assets/emojis/chain.png";
import CrossMarkIcon from "./assets/emojis/cross-mark.png";
import CheckMarkIcon from "./assets/emojis/check-mark.png";
import CameraIcon from "./assets/emojis/camera.png";

// Glorious button assets
import GloriousButtonLeft from "./assets/gloriousButton/left.png";
import GloriousButtonCenter from "./assets/gloriousButton/center.png";
import GloriousButtonRight from "./assets/gloriousButton/right.png";

export type TabParamList = {
  Explore: { address?: string };
  Create: undefined;
  Ledger: { address?: string };
  Settings: undefined;
};

const { width } = Dimensions.get("window");

const DEFAULT_ADDRESS = undefined;

// Custom Modal Wrapper with Blur Effect
type BlurModalWrapperProps = {
  isVisible: boolean;
  onBackdropPress: () => void;
  children: ReactNode;
};

const BlurModalWrapper = ({ isVisible, onBackdropPress, children }: BlurModalWrapperProps) => {
  const { isPlatform } = usePlatform();
  const isWeb = isPlatform("web");

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
      backdropOpacity={0}
      animationIn="fadeIn"
      animationOut="fadeOut"
      style={styles.modal}
    >
      {isWeb ? (
        // Web: Use div with backdrop-filter
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 0,
          }}
        />
      ) : (
        // Mobile: Use BlurView
        <BlurView
          intensity={80}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      )}

      <View style={styles.modalContainer}>
        {children}
      </View>
    </Modal>
  );
};

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
}: TabBarItemProps) => {
  const { isPlatform } = usePlatform();
  const isTelegramIOS = isPlatform("tg_ios");

  return (
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
            isTelegramIOS && { paddingHorizontal: 0 },
            isFocused ? styles.tabItemActive : styles.tabItemInactive,
            isTelegram && isFocused && styles.telegramTabItemActive,
            isTelegramIOS && isFocused && { backgroundColor: "transparent" },
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
          {(isFocused || isLargeScreen) && !isTelegramIOS && (
            <RNText style={styles.label}>{label}</RNText>
          )}
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

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
  const isTelegramIOS = isPlatform("tg_ios");
  const insets = useInsets();

  const TabBarContainer = ({
    children,
    style,
  }: {
    children: ReactNode;
    style?: any;
  }) => {
    if (isTelegramIOS) {
      return (
        <View style={[style, { overflow: "hidden", borderRadius: 100 }]}>
          <div
            style={{
              ...StyleSheet.absoluteFillObject,
              position: "absolute",
              background: "rgba(255,255,255,0.2)",
              backdropFilter: `blur(100px)`,
              WebkitBackdropFilter: `blur(100px)`,
              borderRadius: 100,
              zIndex: -1,
            }}
          />
          {children}
        </View>
      );
    }
    return <View style={style}>{children}</View>;
  };

  return (
    <TabBarContainer
      style={[
        styles.tabBarContainer,
        isPlatform("web") && { top: 20 },
        isTelegram && styles.telegramTabBarContainer,
        isTelegramIOS && {
          height: 31,
          gap: "auto",
          background: "rgba(255, 255, 255, 0.1)",
          shadowColor: "transparent",
          justifyContent: "space-between",
          width: 180,
          top: insets.top - 32,
        },
        isLargeScreen && styles.largeScreenTabBarContainer,
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = route.name;
        const isFocused = state.index === index;

        let icon = CompassIcon;
        if (route.name === "Explore") icon = CompassIcon;
        if (route.name === "Create") icon = DvdIcon;
        if (route.name === "Ledger") icon = CoinIcon;
        if (route.name === "Settings") icon = GearIcon;

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
    </TabBarContainer>
  );
}

const AppContent = () => {
  const { isPlatform } = usePlatform();
  const modalRef = useRef<BottomSheetModal>(null);
  const walletConnectModalRef = useRef<BottomSheetModal>(null);
  const { isLargeScreen } = useScreen();
  const [isPreferencesVisible, setIsPreferencesVisible] = useState(false);
  const [isWalletConnectVisible, setIsWalletConnectVisible] = useState(false);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const openPreferences = useCallback(() => {
    if (isLargeScreen) {
      setIsPreferencesVisible(true);
    } else {
      modalRef.current?.present();
    }
  }, [isLargeScreen]);

  const openWalletConnect = useCallback(() => {
    if (isLargeScreen) {
      setIsWalletConnectVisible(true);
    } else {
      walletConnectModalRef.current?.present();
    }
  }, [isLargeScreen]);

  const handleClosePreferences = useCallback(() => {
    if (isLargeScreen) {
      setIsPreferencesVisible(false);
    } else {
      modalRef.current?.dismiss();
    }
  }, [isLargeScreen]);

  const handleCloseWalletConnect = useCallback(() => {
    if (isLargeScreen) {
      setIsWalletConnectVisible(false);
    } else {
      walletConnectModalRef.current?.dismiss();
    }
  }, [isLargeScreen]);

  const swipeEnabled =
    isPlatform("android") ||
    isPlatform("ios") ||
    isPlatform("tg_ios") ||
    isPlatform("tg_android");

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
      screenListeners={{
        state: (e) => {
          const index = e.data.state?.index;
          if (index !== undefined && index !== currentTabIndex) {
            setCurrentTabIndex(index);

            if (isPreferencesVisible) {
              setIsPreferencesVisible(false);
            }
            if (isWalletConnectVisible) {
              setIsWalletConnectVisible(false);
            }
            if (modalRef.current) {
              modalRef.current.dismiss();
            }
            if (walletConnectModalRef.current) {
              walletConnectModalRef.current.dismiss();
            }
          }
        },
      }}
    >
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        initialParams={{ address: DEFAULT_ADDRESS }}
        options={{ swipeEnabled: false }}
      />
      <Tab.Screen
        name="Ledger"
        component={LedgerScreen}
        initialParams={{ address: DEFAULT_ADDRESS }}
        options={{ swipeEnabled: swipeEnabled }}
      />
      <Tab.Screen
        name="Create"
        component={CreateScreen}
        options={{ swipeEnabled: swipeEnabled }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ swipeEnabled: swipeEnabled }}
      />
    </Tab.Navigator>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ModalContext.Provider
          value={{
            openPreferences,
            openWalletConnect,
            closePreferences: handleClosePreferences,
            closeWalletConnect: handleCloseWalletConnect,
          }}
        >
          <AuthProvider>
            <Background />
            <WebIcons />
            <View style={styles.container}>
              <StatusBar
                style="light"
                translucent
                backgroundColor="transparent"
              />
              <SafeAreaProvider>
                <NavigationContainer
                  theme={{
                    ...DefaultTheme,
                    colors: {
                      ...DefaultTheme.colors,
                      background: "transparent",
                    },
                  }}
                  linking={{
                    prefixes: [],
                    config: {
                      initialRouteName: "Explore",
                      screens: {
                        Explore: {
                          path: "explore/:address?",
                          parse: {
                            address: (address: string) => address,
                          },
                        },
                        Ledger: {
                          path: "ledger/:address?",
                          parse: {
                            address: (address: string) => address,
                          },
                        },
                        Create: "create",
                        Settings: "settings",
                      },
                    },
                  }}
                >
                  <MainTabs />
                </NavigationContainer>
              </SafeAreaProvider>
            </View>

            {/* Preferences Modal */}
            {isLargeScreen ? (
              <BlurModalWrapper
                isVisible={isPreferencesVisible}
                onBackdropPress={handleClosePreferences}
              >
                <SettingsScreen />
              </BlurModalWrapper>
            ) : (
              <BottomSheetModal
                ref={modalRef}
                index={0}
                snapPoints={["80%"]}
                enablePanDownToClose={true}
                backgroundStyle={{
                  backgroundColor: "transparent",
                }}
                handleIndicatorStyle={{
                  display: "none",
                }}
                android_keyboardInputMode="adjustResize"
                keyboardBehavior="extend"
              >
                <SettingsScreen />
              </BottomSheetModal>
            )}

            {/* Wallet Connect Modal */}
            {/* DEBUG: Rendering wallet connect modal */}
            {isLargeScreen ? (
              <BlurModalWrapper
                isVisible={isWalletConnectVisible}
                onBackdropPress={handleCloseWalletConnect}
              >
                <View style={{ flex: 1, backgroundColor: "red" }}>
                </View>
              </BlurModalWrapper>
            ) : (
              <BottomSheetModal
                ref={walletConnectModalRef}
                index={0}
                snapPoints={["80%"]}
                enablePanDownToClose={true}
                backgroundStyle={{
                  backgroundColor: "transparent",
                }}
                handleIndicatorStyle={{
                  display: "none",
                }}
                android_keyboardInputMode="adjustResize"
                keyboardBehavior="extend"
              >
                <View style={{ flex: 1, backgroundColor: "red" }}>
                </View>
              </BottomSheetModal>
            )}
          </AuthProvider>
        </ModalContext.Provider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default function App() {
  const navigationRef = useRef(null);
  const [fontsLoaded, fontError] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
    DMMono_500Medium,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Preload all images
  useEffect(() => {
    const emojiImages = [
      CompassIcon, DvdIcon, CoinIcon, GearIcon,
      TalkIcon, ExternalLinkIcon, RejectIcon, WorldIcon,
      TopLeftArrowIcon, UpwardsIcon, RightArrowIcon, MoneyWingsIcon,
      ProhibitedIcon, MoneyFaceIcon, LeftArrowIcon, GlobeIcon,
      DownwardsIcon, CloudIcon, ChainIcon, CrossMarkIcon,
      CheckMarkIcon, CameraIcon
    ];

    const gloriousButtonImages = [
      GloriousButtonLeft, GloriousButtonCenter, GloriousButtonRight
    ];

    preloadImages([...emojiImages, ...gloriousButtonImages]);
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <PlatformProvider>
      <ScreenProvider>
        <AppContent />
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
    paddingHorizontal: 12,
    backgroundColor: "transparent",
    marginVertical: 6,
    height: 30,
    gap: 8,
  },
  largeScreenTabBarContainer: {
    gap: 16,
  },
  tabBar: {
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: "transparent",
    paddingHorizontal: 4,
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
    paddingHorizontal: 12,
  },
  tabItemActive: {
    backgroundColor: "rgba(94, 94, 94, 0.2)",
  },
  tabItemInactive: {
    gap: 3,
  },
  telegramTabItemActive: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
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
  },
  modal: {
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  modalContainer: {
    maxWidth: "95%",
    maxHeight: "90%",
    minWidth: 400,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
});

// Utility function to preload images
const preloadImages = async (imageUrls: any[]) => {
  try {
    const preloadPromises = imageUrls.map((img) => Image.prefetch(Image.resolveAssetSource(img).uri));
    await Promise.all(preloadPromises);
    console.log('All images preloaded successfully');
  } catch (error) {
    console.error('Error preloading images:', error);
  }
};
