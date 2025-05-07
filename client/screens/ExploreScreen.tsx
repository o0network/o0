import {
  View,
  StyleSheet,
  Linking,
  Image,
  Platform,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { Text, GloriousButton, Button } from "../components";
import VideoNote from "../components/VideoNote";
import { ApiService } from "../data/api";
import StorageService from "../data/storage";

const BASE_URL =
  Platform.OS === "web" ? window.location.origin : "https://o0.network";
const EXPLORE_PATH = "/explore";

type ExploreScreenProps = {
  initialAddress?: string | null;
};

export default function ExploreScreen({ initialAddress }: ExploreScreenProps) {
  const [currentVideoId, setCurrentVideoId] = useState<string>("1");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const allVideos = ApiService.getAllVideos();
  const hasVideos = allVideos.length > 0;
  const currentVideo = hasVideos
    ? ApiService.getVideoByAddress(currentVideoId) || allVideos[0]
    : null;
  const currentIndex = hasVideos
    ? allVideos.findIndex((video) => video.address === currentVideoId)
    : -1;

  const isLastVideo = currentIndex === allVideos.length - 1;
  const isFirstVideo = currentIndex === 0;

  useEffect(() => {
    async function loadWalletStatus() {
      const connected = await StorageService.isWalletConnected();
      setIsWalletConnected(connected);
    }

    loadWalletStatus();
  }, []);

  useEffect(() => {
    if (initialAddress) {
      setIsLoading(true);
      const video = ApiService.getVideoByAddress(initialAddress);
      if (video) {
        setCurrentVideoId(video.address);
      }
      setIsLoading(false);
    } else {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, [initialAddress]);

  useEffect(() => {
    if (Platform.OS === "web" && currentVideo && currentVideo.address) {
      window.history.replaceState(
        {},
        "",
        `${EXPLORE_PATH}/${currentVideo.address}`
      );
    }
  }, [currentVideoId, currentVideo]);

  useEffect(() => {
    if (Platform.OS === "web" && !initialAddress) {
      const path = window.location.pathname;

      if (path.startsWith(EXPLORE_PATH + "/")) {
        const address = path.substring(EXPLORE_PATH.length + 1);
        if (address) {
          const video = ApiService.getVideoByAddress(address);
          if (video) {
            setCurrentVideoId(video.address);
          }
        }
      } else if (path !== EXPLORE_PATH) {
        window.history.replaceState({}, "", EXPLORE_PATH);
      }
    }
  }, [initialAddress]);

  useEffect(() => {
    if (currentVideo) {
      ApiService.preloadNextVideo(currentVideo.address);
    }
  }, [currentVideo]);

  const videoStats = currentVideo?.stats
    ? [
        currentVideo.stats[0] || "",
        currentVideo.stats[1] || "",
        currentVideo.stats[2] || "",
      ].filter((stat) => stat !== "")
    : [];

  const handleConnectWallet = async () => {
    setIsWalletConnected(true);
    await StorageService.setWalletConnected(true);
  };

  const goToNextVideo = () => {
    if (isLastVideo || !hasVideos) return;
    setIsLoading(true);
    const nextVideo = ApiService.getNextVideo(currentVideoId);
    setCurrentVideoId(nextVideo.address);

    // Simulate loading for demo purposes
    setTimeout(() => setIsLoading(false), 800);
  };

  const goToPreviousVideo = () => {
    if (isFirstVideo || !hasVideos) return;
    setIsLoading(true);
    const prevVideo = ApiService.getPreviousVideo(currentVideoId);
    setCurrentVideoId(prevVideo.address);

    // Simulate loading for demo purposes
    setTimeout(() => setIsLoading(false), 800);
  };

  const getVideoUrl = () => {
    if (!currentVideo || !currentVideo.address)
      return `${BASE_URL}${EXPLORE_PATH}`;
    return `${BASE_URL}${EXPLORE_PATH}/${currentVideo.address}`;
  };

  const renderVideoContent = () => {
    if (isLoading) {
      return (
        <View style={styles.videoContainer}>
          <View style={styles.loadingContainer}>
            <Image
              source={require("../assets/logo-outline.svg")}
              style={styles.loadingPlaceholder}
            />
            <Text>Loading...</Text>
          </View>
        </View>
      );
    }

    if (!hasVideos || !currentVideo) {
      return (
        <View style={styles.emptyVideoContainer}>
          <Image
            source={require("../assets/logo-outline.svg")}
            style={styles.emptyVideoIcon}
          />
          <Text style={styles.emptyVideoText}>No videos available yet</Text>
          <Text style={styles.emptyVideoSubText}>
            Create your first video by going to the creation tab
          </Text>
        </View>
      );
    }

    return (
      <VideoNote
        videoSource={currentVideo.source}
        texts={videoStats}
        dom={{
          matchContents: true,
          scrollEnabled: false,
        }}
      />
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        {renderVideoContent()}

        <View style={styles.navigationButtons}>
          <Button
            iconPath={require("../assets/emojis/left-arrow.png")}
            onPress={goToPreviousVideo}
            disabled={isFirstVideo || !hasVideos || isLoading}
            style={styles.navButton}
            round
          />

          <Button
            title="Discussion"
            iconPosition="right"
            iconPath={require("../assets/emojis/chain.png")}
            onPress={() => Linking.openURL(getVideoUrl())}
            style={styles.linkButton}
          />

          <Button
            iconPath={require("../assets/emojis/right-arrow.png")}
            onPress={goToNextVideo}
            disabled={isLastVideo || !hasVideos || isLoading}
            style={styles.navButton}
            round
          />
        </View>

        <GloriousButton
          title={isWalletConnected ? "Bump" : "Connect Wallet"}
          onPress={() =>
            WebApp.showPopup({
              title: "Connect Wallet",
              message: "Please connect your wallet to continue",
              buttons: [{ text: "Connect", onPress: handleConnectWallet }],
            })
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    maxWidth: 512,
    width: "100%",
    alignSelf: "center",
    padding: 16,
    gap: 16,
  },
  content: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 16,
  },
  videoContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingPlaceholder: {
    width: 60,
    height: 60,
  },
  emptyVideoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyVideoIcon: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  emptyVideoText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyVideoSubText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
  },
  linkButton: {
    width: "100%",
    marginBottom: 8,
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: 16,
    marginVertical: 8,
  },
  navButton: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    width: 40,
    height: 40,
    borderRadius: 999,
  },
  connectButton: {
    flex: 1,
  },
  shareButton: {
    width: "100%",
    marginTop: 8,
  },
});
