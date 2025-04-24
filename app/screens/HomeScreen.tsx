import { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  SafeAreaView,
  Linking,
} from "react-native";
import { Background, Card, Frame, Inbound, Outbound } from "../components";
import { usePlatformContext } from "../utils/platform";
import VideoNote from "../components/VideoNote";
import { Text } from "../App";

const { width } = Dimensions.get("window");
const isTablet = width > 768;
const contentWidth = Math.min(width, isTablet ? 420 : 390);

const videoSourcePath = require("../assets/example.mp4");
const textsToShow = ["10%", "3000ETH", "100$"];

export default function HomeScreen() {
  const { platform } = usePlatformContext();

  return (
    <SafeAreaView style={styles.container}>
      <Outbound style={styles.frameStyle}>
        <View style={styles.content}>
          <VideoNote
            videoSource={videoSourcePath}
            texts={textsToShow}
            dom={{
              matchContents: true,
              scrollEnabled: false,
            }}
          />

          <Inbound style={styles.linkCard}>
            <Pressable
              onPress={() => Linking.openURL("https://research.allo.capital")}
            >
              <View style={styles.cardContent}>
                <View>
                  <Text style={styles.cardTitle}>Link to DAO:</Text>
                  <Text style={styles.cardSubtitle}>
                    https://research.allo.capital
                  </Text>
                </View>
                <Text style={styles.cardArrow}>↗</Text>
              </View>
            </Pressable>
          </Inbound>

          <Outbound style={styles.connectButton}>
            <Pressable>
              <Text style={styles.connectButtonText}>Connect Wallet</Text>
            </Pressable>
          </Outbound>
        </View>
      </Outbound>
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
  navigationContainer: {
    width: "100%",
    zIndex: 2,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 16,
    paddingBottom: 28,
    paddingHorizontal: 16,
    width: "100%",
    backgroundColor: "transparent",
  },
  linkCard: {
    width: contentWidth - 32,
    marginBottom: 24,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.23)",
    marginTop: -1,
  },
  cardArrow: {
    fontSize: 17,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.23)",
  },
  connectButton: {
    width: contentWidth - 32,
    borderRadius: 100,
    padding: 12,
    marginBottom: 32,
  },
  connectButtonText: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    fontFamily: "Nunito_700Bold",
  },
});
