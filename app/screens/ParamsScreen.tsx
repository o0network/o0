import { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  Platform,
} from "react-native";
import { Button } from "../components";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type ParamsScreenNavigationProp = NativeStackNavigationProp<
  Record<string, undefined>,
  "Params"
>;

export default function ParamsScreen() {
  const navigation = useNavigation<ParamsScreenNavigationProp>();

  return (
    <Button
      title="View Components"
      icon="✨"
      onPress={() => navigation.navigate("Components")}
    />
  );
}
