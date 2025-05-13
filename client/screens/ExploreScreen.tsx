import { View, StyleSheet, Linking, Image, Platform } from "react-native";
import { useState, useEffect, useRef } from "react";
import { Text, GloriousButton, Button } from "../components";
import VideoNote from "../components/VideoNote";
import { ApiService } from "../data/api";
import StorageService from "../data/storage";
import SafeAreaView from "../components/SafeAreaView";
import { useScreen } from "../contexts/ScreenContext";
import { isPlatform } from "../utils/platform";
import {
  Animated,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import type { VideoData } from "../data/api";

const EXPLORE_PATH = "/explore";

type CanvasVideo = VideoData & {
  x: number;
  y: number;
  speed: number;
  scale: Animated.Value;
  focused: boolean;
  timestamp?: number;
};

const { width, height } = Dimensions.get("window");
const ITEM_WIDTH = 100;
const ITEM_HEIGHT = 100;

export default function ExploreScreen({
  initialAddress,
}: {
  initialAddress?: string | null;
}) {
  const { isLargeScreen } = useScreen();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [videos, setVideos] = useState<CanvasVideo[]>([]);
  const [threshold, setThreshold] = useState(0);
  const [focusedVideo, setFocusedVideo] = useState<string | null>(null);
  const maxMintedRef = useRef(1);
  const canvasHeight = useRef(height * 10);

  const batchSize = Math.max(
    9,
    Math.floor((width * height) / (ITEM_WIDTH * ITEM_HEIGHT * 2))
  );

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    if (initialAddress) {
      const videoExists = videos.some((v) => v.address === initialAddress);
      if (videoExists) {
        console.log("Initial address video exists:", initialAddress);
      } else {
        console.log("Initial address video not loaded yet:", initialAddress);
      }
      if (Platform.OS === "web") {
        window.history.replaceState(
          {},
          "",
          `${EXPLORE_PATH}/${initialAddress}`
        );
      }
    } else if (Platform.OS === "web") {
      const path = window.location.pathname;
      if (path.startsWith(EXPLORE_PATH + "/")) {
        const address = path.substring(EXPLORE_PATH.length + 1);
        if (address) {
          console.log("Deep link address found:", address);
        }
      } else if (path !== EXPLORE_PATH) {
        window.history.replaceState({}, "", EXPLORE_PATH);
      }
    }
  }, [initialAddress, videos]);

  useEffect(() => {
    if (Platform.OS === "web") {
      const newPath = focusedVideo
        ? `${EXPLORE_PATH}/${focusedVideo}`
        : EXPLORE_PATH;
      window.history.replaceState({}, "", newPath);
    }
  }, [focusedVideo]);

  const loadVideos = async (isRecycling = false) => {
    try {
      const screenRatio = width / height;
      console.log(
        `Fetching videos. Threshold: ${threshold}, Batch Size: ${batchSize}, Screen Ratio: ${screenRatio}`
      );
      const fetched = await ApiService.fetchVideos(
        threshold,
        batchSize,
        screenRatio
      );
      console.log(`Fetched ${fetched.length} videos.`);

      if (fetched.length > 0) {
        fetched.forEach((v) => {
          const minted = v.stats?.minted ?? 0;
          if (minted > maxMintedRef.current) {
            maxMintedRef.current = minted;
            console.log(`New max minted: ${maxMintedRef.current}`);
          }
        });

        const newCanvasVideos = fetched.map((v) => {
          const minted = v.stats?.minted ?? 0;
          const normalizedMinted =
            maxMintedRef.current > 0 ? minted / maxMintedRef.current : 0;
          const speed = 0.8 + normalizedMinted * 0.2;
          const xPos = Math.random() * (width - ITEM_WIDTH);
          const yPos = canvasHeight.current + Math.random() * height * 1.5;

          return {
            ...v,
            x: xPos,
            y: yPos,
            speed: speed,
            scale: new Animated.Value(1),
            timestamp: Date.now(),
          } as CanvasVideo;
        });

        const maxY = newCanvasVideos.reduce(
          (max, v) => Math.max(max, v.y + ITEM_HEIGHT),
          canvasHeight.current
        );
        canvasHeight.current = maxY + height;

        setVideos((prev) => [...prev, ...newCanvasVideos]);
        setThreshold((prev) => prev + fetched.length);
        console.log(
          `Total videos: ${
            videos.length + newCanvasVideos.length
          }, New threshold: ${threshold + fetched.length}, Canvas height: ${
            canvasHeight.current
          }`
        );
      } else if (!isRecycling) {
        console.log("No more videos from API. Starting recycling.");
        recycleVideos();
      } else {
        console.log("Recycling finished or no videos to recycle.");
      }
    } catch (err) {
      console.error("Error loading videos:", err);
      if (!isRecycling) {
        console.log("Error loading videos. Attempting recycling.");
        recycleVideos();
      }
    }
  };

  const recycleVideos = () => {
    if (videos.length === 0) {
      console.log("No videos to recycle.");
      return;
    }

    console.log(`Recycling ${videos.length} videos.`);
    const recycledVideos = videos.map((v) => {
      const xPos = Math.random() * (width - ITEM_WIDTH);
      const yPos = canvasHeight.current + Math.random() * height * 1.5;
      v.scale.setValue(1);
      return {
        ...v,
        x: xPos,
        y: yPos,
        scale: v.scale,
        timestamp: Date.now(),
      } as CanvasVideo;
    });

    const maxY = recycledVideos.reduce(
      (max, v) => Math.max(max, v.y + ITEM_HEIGHT),
      canvasHeight.current
    );
    canvasHeight.current = maxY + height;

    setVideos((prev) => [...prev, ...recycledVideos]);
    console.log(
      `Recycled ${recycledVideos.length} videos. Total videos: ${
        videos.length + recycledVideos.length
      }, Canvas height: ${canvasHeight.current}`
    );
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const contentHeight = event.nativeEvent.contentSize.height;
        const layoutHeight = event.nativeEvent.layoutMeasurement.height;

        if (
          contentHeight > layoutHeight &&
          offsetY >= contentHeight - layoutHeight * 2
        ) {
          loadVideos();
        }
      },
    }
  );

  const handleVideoPress = (videoAddress: string) => {
    const currentlyFocused = focusedVideo === videoAddress;

    setFocusedVideo(currentlyFocused ? null : videoAddress);

    videos.forEach((v) => {
      let toValue = 1;
      if (!currentlyFocused) {
        toValue = v.address === videoAddress ? 1.5 : 0.6;
      }

      Animated.spring(v.scale, {
        toValue,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }).start();
    });
  };

  const renderVideoStats = () => {
    const video = videos.find((v) => v.address === focusedVideo);
    if (!video || !video.stats) return null;

    const priceStat = video.stats.price
      ? `${video.stats.price.toFixed(4)} ETH`
      : null;
    const mintedStat =
      video.stats.minted !== undefined ? `${video.stats.minted} minted` : null;
    const valueStat = video.stats.value
      ? `$${video.stats.value.toFixed(2)} value`
      : null;

    const stats = [priceStat, mintedStat, valueStat].filter(Boolean);

    if (stats.length === 0) return null;

    return (
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <Text key={index} style={styles.statsText}>
            {stat}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={{
          height: canvasHeight.current,
        }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {videos.map((v) => {
          const translateY = Animated.add(
            v.y,
            Animated.multiply(scrollY, Animated.subtract(1, v.speed))
          );

          const isFocused = focusedVideo === v.address;
          const uniqueKey = `${v.address}-${v.timestamp ?? v.id}`;

          return (
            <Animated.View
              key={uniqueKey}
              style={[
                styles.videoContainer,
                {
                  left: v.x,
                  top: 0,
                  transform: [{ translateY }, { scale: v.scale }],
                  zIndex: isFocused ? 10 : 1,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => handleVideoPress(v.address)}
                activeOpacity={0.8}
              >
                {isFocused ? (
                  <VideoNote
                    videoSource={v.source}
                    texts={[]}
                    x={0}
                    y={0}
                    scale={1}
                    playing={true}
                    onClick={() => handleVideoPress(v.address)}
                  />
                ) : (
                  <Image
                    source={{ uri: v.thumbnailUrl }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>
      {renderVideoStats()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    position: "absolute",
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#333",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  videoNote: {
    width: "100%",
    height: "100%",
  },
  statsContainer: {
    position: "absolute",
    bottom: Platform.select({ ios: 30, default: 20 }),
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  statsText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
});
