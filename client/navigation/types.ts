import { NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs";
import { CompositeNavigationProp } from "@react-navigation/native";

export type TabParamList = {
  Home: undefined;
  Create: undefined;
  Assets: undefined;
  Network: undefined;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<TabParamList>;
};

export type TabNavigationProp<T extends keyof TabParamList> =
  MaterialTopTabNavigationProp<TabParamList, T>;

export type RootStackNavigationProp<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>;

export type CombinedNavigationProp<T extends keyof TabParamList> =
  CompositeNavigationProp<
    MaterialTopTabNavigationProp<TabParamList, T>,
    NativeStackNavigationProp<RootStackParamList>
  >;
