import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  SafeAreaView,
  Linking,
} from "react-native";
import { Background, Card, Frame } from "../components";
import { usePlatformContext } from "../utils/platform";
import VideoNote from "../components/VideoNote";

const { width } = Dimensions.get("window");
const isTablet = width > 768;
const contentWidth = Math.min(width, isTablet ? 420 : 390);

// Define the video source path relative to this file
const videoSourcePath = require("../assets/example.mp4");
// Define the texts to display below the video
const textsToShow = ["10%", "3000ETH", "100$"];

export default function HomeScreen() {
  const { platform } = usePlatformContext();

  return (
    <SafeAreaView style={styles.container}>
      <Frame style={styles.frameStyle}>
        <View style={styles.content}>
          <VideoNote
            videoSource={videoSourcePath}
            texts={textsToShow}
            dom={{
              matchContents: true,
              scrollEnabled: false,
            }}
          />

          <Card
            style={styles.linkCard}
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
          </Card>
          <Pressable style={styles.connectButton}>
            <Text style={styles.connectButtonText}>Connect Wallet</Text>
          </Pressable>
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
    backgroundColor: "rgba(214, 214, 214, 0.45)",
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
    fontWeight: "500",
    color: "#FFFFFF",
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
    backgroundColor: "rgba(128, 128, 128, 0.3)",
    borderRadius: 100,
    padding: 12,
    borderWidth: 1.4,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 32,
  },
  connectButtonText: {
    fontSize: 24,
    fontWeight: "800",
    color: "rgba(255, 255, 255, 0.96)",
    textAlign: "center",
  },
});
