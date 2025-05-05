import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
  MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import { useRef, useCallback, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Dimensions,
  Text as RNText,
  TouchableOpacity,
  Animated,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Nunito_600SemiBold, Nunito_700Bold } from "@expo-google-fonts/nunito";
import { DMMono_500Medium } from "@expo-google-fonts/dm-mono";
import { DynaPuff_700Bold } from "@expo-google-fonts/dynapuff";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ComponentsScreen from "./screens/ComponentsScreen";
import TelegramIntegration from "./components/TelegramIntegration";

import ExploreScreen from "./screens/ExploreScreen";
import CreateScreen from "./screens/CreateScreen";
import AssetsScreen from "./screens/AssetsScreen";
import NetworkScreen from "./screens/NetworkScreen";
import { PlatformProvider, usePlatform } from "./utils/platform";
import { Background, WebIcons } from "./components";
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

type RootStackParamList = {
  Main: undefined;
  Components: undefined;
};

const { width } = Dimensions.get("window");

const DEFAULT_ADDRESS = "o0.network";

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
        {(isFocused || isLargeScreen) && !isTelegram && (
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
  const [isLargeScreen, setIsLargeScreen] = useState(width > 512);

  const isWeb = isPlatform("web");
  const isTelegram = isPlatform("telegram");

  return (
    <View
      style={[
        styles.tabBarContainer,
        isWeb && styles.webTabBarContainer,
        isTelegram && styles.telegramTabBarContainer,
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

  const Stack = createNativeStackNavigator<RootStackParamList>();

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

  const { isPlatform } = usePlatform();
  const isTelegram = isPlatform("telegram");

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <PlatformProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={styles.container}>
            <StatusBar
              style="light"
              translucent
              backgroundColor="transparent"
            />
            <Background />
            <WebIcons />

            {isTelegram && <TelegramIntegration />}

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
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Main" path="/" component={MainTabs} />
                <Stack.Screen
                  name="Components"
                  component={ComponentsScreen}
                  options={{ animation: "slide_from_bottom" }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </View>
        </GestureHandlerRootView>
      </PlatformProvider>
    </SafeAreaProvider>
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
  homeTabsContainer: {
    width: "100%",
    backgroundColor: "transparent",
    marginTop: 10,
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
  },
  webTabBarContainer: {
    marginTop: 20,
  },
  telegramTabBarContainer: {
    backgroundColor: "rgba(20, 20, 20, 0.8)",
    gap: 24,
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
    height: 36,
  },
  tabItemActive: {
    backgroundColor: "rgba(94, 94, 94, 0.2)",
    borderRadius: 999,
    paddingHorizontal: 8,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.96)",
  },
});
