import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  SafeAreaView,
  Linking,
  Image,
  Share,
  Platform,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { Inbound, Outbound, Text, Button } from "../components";
import { usePlatformContext } from "../utils/platform";
import VideoNote from "../components/VideoNote";
import { ApiService } from "../data/api";
import StorageService from "../data/storage";

const { width } = Dimensions.get("window");
const isTablet = width > 768;
const contentWidth = Math.min(width, isTablet ? 420 : 390);

const BASE_URL =
  Platform.OS === "web" ? window.location.origin : "https://o0.network";
const EXPLORE_PATH = "/explore";

type ExploreScreenProps = {
  initialAddress?: string | null;
};

export default function ExploreScreen({ initialAddress }: ExploreScreenProps) {
  const { platform } = usePlatformContext();
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

  const handleShare = async () => {
    if (!currentVideo || !currentVideo.address) return;

    try {
      const videoUrl = `${BASE_URL}${EXPLORE_PATH}/${currentVideo.address}`;
      await Share.share({
        message: `Check out this video: ${videoUrl}`,
        url: videoUrl,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
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

  const getVideoUrl = () => {
    if (!currentVideo || !currentVideo.address)
      return `${BASE_URL}${EXPLORE_PATH}`;
    return `${BASE_URL}${EXPLORE_PATH}/${currentVideo.address}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        {renderVideoContent()}

        <Inbound style={styles.linkCard}>
          <Pressable
            onPress={() => {
              Linking.openURL(getVideoUrl());
            }}
          >
            <View style={styles.cardContent}>
              <View>
                <Text style={styles.cardTitle}>Link to Video:</Text>
                <Text style={styles.cardSubtitle}>{getVideoUrl()}</Text>
              </View>
              <Text style={styles.cardArrow}>🔗</Text>
            </View>
          </Pressable>
        </Inbound>

        <View style={styles.bottomControlsContainer}>
          <Pressable
            style={[
              styles.navButton,
              (isFirstVideo || !hasVideos || isLoading) &&
                styles.navButtonDisabled,
            ]}
            onPress={goToPreviousVideo}
            disabled={isFirstVideo || !hasVideos || isLoading}
          >
            <Text style={styles.navButtonText}>⬅️</Text>
          </Pressable>

          {isWalletConnected ? (
            <Button
              title="Connected"
              glorious
              onPress={() => {}}
              style={styles.gloriousButton}
            />
          ) : (
            <Outbound style={styles.connectButton}>
              <Pressable
                onPress={handleConnectWallet}
                style={styles.connectButtonInner}
              >
                <Text style={styles.connectButtonText}>Connect Wallet</Text>
              </Pressable>
            </Outbound>
          )}

          <Pressable
            style={[
              styles.navButton,
              (isLastVideo || !hasVideos || isLoading) &&
                styles.navButtonDisabled,
            ]}
            onPress={goToNextVideo}
            disabled={isLastVideo || !hasVideos || isLoading}
          >
            <Text style={styles.navButtonText}>➡️</Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.shareButton}
          onPress={handleShare}
          disabled={!currentVideo || isLoading}
        >
          <Inbound style={styles.shareButtonInner}>
            <Text style={styles.shareButtonText}>Share</Text>
          </Inbound>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "flex-start",
    maxWidth: 512,
    width: "100%",
    alignSelf: "center",
  },
  videoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  navButtonDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.8)",
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
    paddingVertical: 4,
    paddingHorizontal: 8,
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
    flex: 1,
    maxWidth: contentWidth - 130, // Make space for navigation buttons
    borderRadius: 100,
    padding: 4,
    overflow: "hidden",
    position: "relative",
  },
  connectButtonInner: {
    position: "relative",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  gloriousButton: {
    flex: 1,
    maxWidth: contentWidth - 130,
    height: 50,
  },
  connectButtonText: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    fontFamily: "Nunito_700Bold",
  },
  bottomControlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: contentWidth - 32,
    marginBottom: 16,
  },
  shareButton: {
    width: contentWidth - 32,
  },
  shareButtonInner: {
    padding: 12,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingPlaceholder: {
    width: 60,
    height: 60,
    marginBottom: 16,
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
});
