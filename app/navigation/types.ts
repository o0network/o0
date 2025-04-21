import { NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs";
import { CompositeNavigationProp } from "@react-navigation/native";

// Define the types for the tab navigator
export type TabParamList = {
  Home: undefined;
  Create: undefined;
  Assets: undefined;
  Params: undefined;
};

// Define the types for the stack navigator
export type RootStackParamList = {
  Main: NavigatorScreenParams<TabParamList>;
};

// Navigation props for screens within the tab navigator
export type TabNavigationProp<T extends keyof TabParamList> =
  MaterialTopTabNavigationProp<TabParamList, T>;

// Navigation props for screens within the stack navigator
export type RootStackNavigationProp<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>;

// Combined navigation prop for screens within the tab navigator that can also access the root stack
export type CombinedNavigationProp<T extends keyof TabParamList> =
  CompositeNavigationProp<
    MaterialTopTabNavigationProp<TabParamList, T>,
    NativeStackNavigationProp<RootStackParamList>
  >;
