import {
  DefaultTheme,
  NavigationContainer,
  LinkingOptions,
} from "@react-navigation/native";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
  MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import { useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Dimensions,
  Text as RNText,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Nunito_600SemiBold, Nunito_700Bold } from "@expo-google-fonts/nunito";
import { DMMono_500Medium } from "@expo-google-fonts/dm-mono";
import { DynaPuff_700Bold } from "@expo-google-fonts/dynapuff";
import { SafeAreaProvider } from "react-native-safe-area-context";

import ExploreScreen from "./screens/ExploreScreen";
import CreateScreen from "./screens/CreateScreen";
import AssetsScreen from "./screens/AssetsScreen";
import TweaksScreen from "./screens/TweaksScreen";
import { PlatformProvider } from "./utils/platform";
import { Background } from "./components";

type TabParamList = {
  Explore: { address?: string };
  Create: undefined;
  Assets: { address?: string };
  Network: undefined;
};

const { width } = Dimensions.get("window");

const DEFAULT_ADDRESS = "o0.network";

type TabBarItemProps = {
  label: string;
  isFocused: boolean;
  onPress: () => void;
  emoji: string;
  bounceValue: Animated.Value;
};

const TabBarItem = ({
  label,
  isFocused,
  onPress,
  emoji,
  bounceValue,
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
        ]}
      >
        <RNText
          style={[
            styles.icon,
            {
              color: isFocused
                ? styles.iconActive.color
                : styles.iconInactive.color,
            },
          ]}
        >
          {emoji}
        </RNText>
        {isFocused && <RNText style={styles.label}>{label}</RNText>}
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

  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = route.name;
        const isFocused = state.index === index;

        let emoji = "🧭";
        if (route.name === "Explore") emoji = "🧭";
        if (route.name === "Create") emoji = "🪩";
        if (route.name === "Assets") emoji = "🪙";
        if (route.name === "Network") emoji = "🌐";

        const bounceValue = bounceValues[index];

        return (
          <TabBarItem
            key={route.key}
            label={label}
            isFocused={isFocused}
            emoji={emoji}
            bounceValue={bounceValue}
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

  const Tab = createMaterialTopTabNavigator<TabParamList>({
    screens: {
      Explore: {
        screen: ExploreScreen,
        initialParams: { address: DEFAULT_ADDRESS },
      },
      Create: {
        screen: CreateScreen,
      },
      Assets: {
        screen: AssetsScreen,
        initialParams: { address: DEFAULT_ADDRESS },
      },
      Network: {
        screen: TweaksScreen,
      },
    },
  });
  const screenOptions: MaterialTopTabNavigationOptions = {
    swipeEnabled: true,
    lazy: true,
    lazyPreloadDistance: 0,
    tabBarItemStyle: { width: 100 },
    tabBarScrollEnabled: false,
    tabBarContentContainerStyle: styles.tabBarContentContainer,
    tabBarStyle: styles.tabBar,
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Background />
      <PlatformProvider>
        <View style={styles.container}>
          <StatusBar style="light" translucent backgroundColor="transparent" />
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
                linking={
                  Platform.OS === "web"
                    ? ({
                        prefixes: [],
                        config: {
                          screens: {
                            Explore: "explore/:address?",
                            Create: "create",
                            Assets: "assets/:address?",
                            Network: "network",
                          },
                        },
                      } as LinkingOptions<TabParamList>)
                    : undefined
                }
              >
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
                  <Tab.Screen name="Create" component={CreateScreen} />
                  <Tab.Screen
                    name="Assets"
                    component={AssetsScreen}
                    initialParams={{ address: DEFAULT_ADDRESS }}
                  />
                  <Tab.Screen name="Network" component={TweaksScreen} />
                </Tab.Navigator>
              </NavigationContainer>
            </SafeAreaView>
          </SafeAreaProvider>
        </View>
      </PlatformProvider>
    </GestureHandlerRootView>
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
    backgroundColor: "rgba(94, 94, 94, 0.18)",
    borderRadius: 20,
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
