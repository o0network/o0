import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from "@react-navigation/material-top-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RouteProp, ParamListBase } from "@react-navigation/native";
import React, { useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Dimensions,
  Image,
  Text as RNText,
  TouchableOpacity,
  Animated,
  TextStyle,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Nunito_600SemiBold, Nunito_700Bold } from "@expo-google-fonts/nunito";
import { DMMono_500Medium } from "@expo-google-fonts/dm-mono";
import { DynaPuff_700Bold } from "@expo-google-fonts/dynapuff";

// Import screens
import HomeScreen from "./screens/HomeScreen";
import CreateScreen from "./screens/CreateScreen";
import AssetsScreen from "./screens/AssetsScreen";
import ParamsScreen from "./screens/ParamsScreen";
import ComponentsScreen from "./screens/ComponentsScreen";
// Import components
import { PlatformProvider } from "./utils/platform";
import { Background } from "./components";

// Define ParamList for type safety
type HomeTabParamList = {
  Explore: undefined;
  Create: undefined;
  Assets: undefined;
  Params: undefined;
};

const Tab = createMaterialTopTabNavigator<HomeTabParamList>();
const Stack = createNativeStackNavigator();
const { width } = Dimensions.get("window");

// --- Custom Tab Bar Component ---
function CustomTabBar({
  state,
  descriptors,
  navigation,
  position,
}: MaterialTopTabBarProps) {
  // Refs for bounce animation, one Animated.Value per tab
  const bounceValues = useRef(
    state.routes.map(() => new Animated.Value(0))
  ).current;

  const onTabPress = (
    route: RouteProp<ParamListBase, string>,
    index: number,
    isFocused: boolean
  ) => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused) {
      Animated.sequence([
        Animated.timing(bounceValues[index], {
          toValue: 16,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(bounceValues[index], {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = route.name;

        const isFocused = state.index === index;

        // Determine emoji based on route name (same logic as before)
        let emoji = "🧭";
        if (route.name === "Explore") emoji = "🧭";
        if (route.name === "Create") emoji = "🪩";
        if (route.name === "Assets") emoji = "🪙";
        if (route.name === "Params") emoji = "⚙️";

        const bounceValue = bounceValues[index];

        return (
          <Animated.View // Outer view for bounce transform
            key={route.key}
            style={{ transform: [{ translateX: bounceValue }] }}
          >
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={() => onTabPress(route, index, isFocused)}
              // Add onLongPress if needed, similar structure
              style={styles.touchableTabBase} // Base touchable area style
            >
              <Animated.View // Inner view for scaling and styling
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
      })}
    </View>
  );
}
// --- End Custom Tab Bar Component ---

function HomeTabs() {
  return (
    <View style={styles.homeTabsContainer}>
      <Tab.Navigator
        initialLayout={{ width: Dimensions.get("window").width }}
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          swipeEnabled: false,
        }}
      >
        <Tab.Screen name="Explore" component={HomeScreen} />
        <Tab.Screen name="Create" component={CreateScreen} />
        <Tab.Screen name="Assets" component={AssetsScreen} />
        <Tab.Screen name="Params" component={ParamsScreen} />
      </Tab.Navigator>
    </View>
  );
}

// Set default text style globally with a custom Text component
export const Text = (props: React.ComponentProps<typeof RNText>) => {
  const { style, ...rest } = props;
  return (
    <RNText
      style={[{ fontFamily: "Nunito_600SemiBold", color: "#FFFFFF" }, style]}
      {...rest}
    />
  );
};

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
    DMMono_500Medium,
    DynaPuff_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned)
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PlatformProvider>
        <View style={styles.container}>
          <Background />
          <SafeAreaView style={styles.safeArea}>
            <NavigationContainer
              theme={{
                ...DefaultTheme,
                colors: {
                  ...DefaultTheme.colors,
                  background: "transparent",
                },
              }}
              onReady={onLayoutRootView}
            >
              <Stack.Navigator
                screenOptions={{
                  headerShown: false,
                  contentStyle: {
                    backgroundColor: "transparent",
                  },
                }}
              >
                <Stack.Screen
                  name="Main"
                  component={HomeTabs}
                  options={{
                    contentStyle: {
                      backgroundColor: "transparent",
                    },
                  }}
                />
                <Stack.Screen
                  name="Components"
                  component={ComponentsScreen}
                  options={{
                    headerShown: true,
                    headerStyle: { backgroundColor: "#333" },
                    headerTintColor: "#fff",
                    title: "UI Components",
                    contentStyle: {
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                    },
                  }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaView>
          <StatusBar style="light" />
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
