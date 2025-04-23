import React from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";
import { Frame } from "../components";
import { Text } from "../App";

export default function CreateScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Frame style={styles.frameStyle}>
        <View style={styles.inner}>
          <Text style={styles.text}>Create Screen</Text>
        </View>
      </Frame>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  frameStyle: {},
  inner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 20,
  },
  text: {
    fontSize: 24,
    color: "#fff",
  },
});
