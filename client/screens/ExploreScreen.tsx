import {
  View,
  StyleSheet,
  Image,
  Platform,
  Dimensions,
  TouchableOpacity,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  FlexAlignType,
} from "react-native";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Text, GloriousButton, Button, Inbound } from "../components";
import VideoNote from "../components/VideoNote";
import { ApiService, VideoData, API_URL } from "../data/api";
import SafeAreaView from "../components/SafeAreaView";
import { useNavigation } from "@react-navigation/native";

const EXPLORE_PATH = "/explore";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const ITEM_DIAMETER = 120;
const FOCUSED_VIDEO_MAX_SIZE = Math.min(512, screenWidth - 40);
const MIN_SCALE_UNFOCUSED = 0.5;
const MAX_PARALLAX_FACTOR = 1.5;
const MIN_PARALLAX_FACTOR = 0.8;
const GRID_AVOIDANCE_RADIUS = ITEM_DIAMETER * 0.8;
const LOAD_BATCH_SIZE = 10;
const SCROLL_LOAD_THRESHOLD_FACTOR = 2.5;
const ANIMATION_DURATION = 350;
const CANVAS_INITIAL_HEIGHT_FACTOR = 5;

const parseMinted = (mintedStr?: string): number => {
  if (!mintedStr) return 0;
  const match = mintedStr.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

const parseNumericStat = (statStr?: string): number => {
  if (!statStr) return 0;
  return parseFloat(statStr) || 0;
};

type CanvasVideoItem = VideoData & {
  x: number;
  y: number;
  scale: Animated.Value;
  opacity: Animated.Value;
  parallaxFactor: number;
  key: string;
  numericStats: {
    price: number;
    minted: number;
    value: number;
  };
};

const {
  Value,
  event: AnimatedEvent,
  spring,
  timing,
  parallel,
  stagger,
  add,
} = Animated;

export default function ExploreScreen({
  initialAddress,
}: {
  initialAddress?: string | null;
}) {
  const scrollY = useRef(new Value(0)).current;
  const [videos, setVideos] = useState<CanvasVideoItem[]>([]);
  const [focusedVideoKey, setFocusedVideoKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [allVideosLoaded, setAllVideosLoaded] = useState(false);
  const processedVideoAddresses = useRef(new Set<string>()).current;
  const canvasHeight = useRef(screenHeight * CANVAS_INITIAL_HEIGHT_FACTOR);
  const occupiedPositions = useRef<Array<{ x: number; y: number }>>([]);
  const maxMintedRef = useRef(1);
  const loadCountRef = useRef(0);
  const [currentFocusedAddress, setCurrentFocusedAddress] = useState<
    string | null
  >(null);
  const navigation = useNavigation();

  const focusedVideoData = useMemo(() => {
    return videos.find((v) => v.key === focusedVideoKey);
  }, [videos, focusedVideoKey]);

  const generateUniqueKey = (address: string, batchId: number) =>
    `${address}-${batchId}-${Math.random().toString(36).substring(2, 7)}`;

  const getRandomPosition = (
    currentBatchOccupied: Array<{ x: number; y: number }>,
    baseYOffset: number
  ): { x: number; y: number } => {
    let xPos: number,
      yPos: number,
      attempts = 0;
    const MAX_ATTEMPTS = 50;
    do {
      xPos = Math.random() * (screenWidth - ITEM_DIAMETER);
      yPos = baseYOffset + Math.random() * (screenHeight * 1.5);
      attempts++;
      if (attempts > MAX_ATTEMPTS) break;
      const tooClose = [
        ...occupiedPositions.current,
        ...currentBatchOccupied,
      ].some((pos) => {
        const dist = Math.sqrt(
          Math.pow(pos.x - xPos, 2) + Math.pow(pos.y - yPos, 2)
        );
        return dist < GRID_AVOIDANCE_RADIUS;
      });
      if (!tooClose) break;
    } while (true);
    currentBatchOccupied.push({ x: xPos, y: yPos });
    return { x: xPos, y: yPos };
  };

  const loadMoreVideos = useCallback(
    async (isRecycling = false) => {
      if (isLoading || (allVideosLoaded && !isRecycling)) return;
      setIsLoading(true);
      loadCountRef.current += 1;
      const currentLoadBatchId = loadCountRef.current;

      let fetchedData: VideoData[] = [];
      if (!isRecycling) {
        try {
          console.log("Fetching videos with batch size:", LOAD_BATCH_SIZE);
          fetchedData = await ApiService.fetchVideos(LOAD_BATCH_SIZE);
          console.log("Fetched videos:", fetchedData);
        } catch (error) {
          console.error("Error fetching videos:", error);
          setIsLoading(false);
          return;
        }
      }

      const newUniqueVideosData = fetchedData.filter(
        (v) => !processedVideoAddresses.has(v.address)
      );
      console.log("New unique videos:", newUniqueVideosData.length);

      if (!isRecycling && newUniqueVideosData.length > 0) {
        newUniqueVideosData.forEach((v) => {
          const currentMinted = parseMinted(v.stats?.minted);
          if (currentMinted > maxMintedRef.current) {
            maxMintedRef.current = currentMinted;
          }
        });

        const currentBatchOccupied: Array<{ x: number; y: number }> = [];
        const newCanvasVideos: CanvasVideoItem[] = newUniqueVideosData.map(
          (videoData) => {
            if (!videoData.thumbnailUrl && videoData.source) {
              videoData.thumbnailUrl = videoData.source.replace(
                "/api/video/",
                "/api/thumbnail/"
              );
            }

            processedVideoAddresses.add(videoData.address);

            const numericStats = {
              minted: parseMinted(videoData.stats?.minted),
              price: parseNumericStat(videoData.stats?.price),
              value: parseNumericStat(videoData.stats?.value),
            };

            const normalizedMinted = Math.max(
              0.01,
              numericStats.minted / (maxMintedRef.current || 1)
            );
            const parallaxFactor =
              MAX_PARALLAX_FACTOR -
              normalizedMinted * (MAX_PARALLAX_FACTOR - MIN_PARALLAX_FACTOR);

            const lastItem =
              videos.length > 0 ? videos[videos.length - 1] : null;
            const lastItemYPos = lastItem ? lastItem.y : 0;
            const maxOccupiedY =
              occupiedPositions.current.length > 0
                ? Math.max(0, ...occupiedPositions.current.map((p) => p.y))
                : 0;
            const baseYOffset = Math.max(lastItemYPos, maxOccupiedY);

            const { x: newX, y: newY } = getRandomPosition(
              currentBatchOccupied,
              baseYOffset + ITEM_DIAMETER
            );

            return {
              ...videoData,
              x: newX,
              y: newY,
              scale: new Value(0.1),
              opacity: new Value(0),
              parallaxFactor,
              key: generateUniqueKey(videoData.address, currentLoadBatchId),
              numericStats,
            };
          }
        );

        console.log("Created canvas videos:", newCanvasVideos.length);

        occupiedPositions.current.push(...currentBatchOccupied);
        setVideos((prev) => {
          const updated = [...prev, ...newCanvasVideos];
          console.log("Updated videos array length:", updated.length);
          return updated;
        });

        stagger(
          50,
          newCanvasVideos.map((v) =>
            parallel([
              spring(v.scale, {
                toValue: 1,
                useNativeDriver: true,
                tension: 40,
                friction: 7,
              }),
              timing(v.opacity, {
                toValue: 1,
                duration: ANIMATION_DURATION,
                useNativeDriver: true,
              }),
            ])
          )
        ).start();

        const maxY = Math.max(
          0,
          ...newCanvasVideos.map((v) => v.y + ITEM_DIAMETER)
        );
        canvasHeight.current = Math.max(
          canvasHeight.current,
          maxY + screenHeight * 2
        );
        if (
          fetchedData.length < LOAD_BATCH_SIZE ||
          (newUniqueVideosData.length === 0 && fetchedData.length > 0)
        ) {
          setAllVideosLoaded(true);
        }
      } else if (isRecycling && videos.length > 0) {
        const numToRecycle = Math.min(videos.length, LOAD_BATCH_SIZE);
        const videosToRecycle = videos.slice(0, numToRecycle);
        console.log("Recycling videos:", videosToRecycle.length);

        const currentBatchOccupied: Array<{ x: number; y: number }> = [];
        const recycledCanvasVideos: CanvasVideoItem[] = videosToRecycle.map(
          (videoData) => {
            const baseYOffset = canvasHeight.current - screenHeight * 1.5;
            const { x: newX, y: newY } = getRandomPosition(
              currentBatchOccupied,
              baseYOffset
            );
            return {
              ...videoData,
              x: newX,
              y: newY,
              scale: new Value(0.1),
              opacity: new Value(0),
              key: generateUniqueKey(videoData.address, currentLoadBatchId),
            };
          }
        );

        occupiedPositions.current.push(...currentBatchOccupied);
        setVideos((prev) => [...prev, ...recycledCanvasVideos]);

        stagger(
          50,
          recycledCanvasVideos.map((v) =>
            parallel([
              spring(v.scale, {
                toValue: 1,
                useNativeDriver: true,
                tension: 40,
                friction: 7,
              }),
              timing(v.opacity, {
                toValue: 1,
                duration: ANIMATION_DURATION,
                useNativeDriver: true,
              }),
            ])
          )
        ).start();
        const maxY = Math.max(
          0,
          ...recycledCanvasVideos.map((v) => v.y + ITEM_DIAMETER)
        );
        canvasHeight.current = Math.max(
          canvasHeight.current,
          maxY + screenHeight * 2
        );
      } else if (!isRecycling && newUniqueVideosData.length === 0) {
        setAllVideosLoaded(true);
      }
      setIsLoading(false);
    },
    [isLoading, allVideosLoaded, videos, processedVideoAddresses]
  );

  useEffect(() => {
    console.log("ExploreScreen mounted, calling loadMoreVideos()");
    loadMoreVideos();
  }, [loadMoreVideos]);

  useEffect(() => {
    if (initialAddress && videos.length > 0 && !focusedVideoKey) {
      const videoToFocus = videos.find((v) => v.address === initialAddress);
      if (videoToFocus) {
        handleThumbnailPress(videoToFocus);
      }
    }
    if (Platform.OS === "web") {
      let newPath = EXPLORE_PATH;
      if (focusedVideoData && focusedVideoData.address) {
        newPath = `${EXPLORE_PATH}/${encodeURIComponent(
          focusedVideoData.address
        )}`;
      } else if (initialAddress && !focusedVideoData) {
        // Path remains /explore if initialAddress video not found or no focus
      }

      if (window.location.pathname !== newPath) {
        console.log("Updating window path to:", newPath);
        window.history.replaceState({}, "", newPath);
      }
    }
  }, [initialAddress, videos, focusedVideoKey, focusedVideoData]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;

    AnimatedEvent([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
      useNativeDriver: false,
    })(event);

    if (
      offsetY > contentHeight - layoutHeight * SCROLL_LOAD_THRESHOLD_FACTOR &&
      !isLoading
    ) {
      if (allVideosLoaded) {
        loadMoreVideos(true);
      } else {
        loadMoreVideos();
      }
    }
  };

  const handleThumbnailPress = (videoItem: CanvasVideoItem) => {
    const isAlreadyFocused = focusedVideoKey === videoItem.key;
    const newFocusedKey = isAlreadyFocused ? null : videoItem.key;
    setFocusedVideoKey(newFocusedKey);

    parallel(
      videos.map((v) => {
        let targetScale = 1;
        if (newFocusedKey) {
          targetScale = v.key === newFocusedKey ? 1.8 : MIN_SCALE_UNFOCUSED;
        } else {
          targetScale = 1;
        }
        return spring(v.scale, {
          toValue: targetScale,
          tension: 40,
          friction: 7,
          useNativeDriver: true,
        });
      })
    ).start();
  };

  const handleHideFocusedVideo = () => {
    if (focusedVideoData) {
      handleThumbnailPress(focusedVideoData);
    }
  };

  const handleVideoFocus = useCallback((video: CanvasVideoItem) => {
    setFocusedVideoKey(video.key);
    const encodedAddress = encodeURIComponent(video.address);
    setCurrentFocusedAddress(encodedAddress);
  }, []);

  const handleCloseFocusedVideo = () => {
    setFocusedVideoKey(null);
    setCurrentFocusedAddress(null);
  };

  const handleMintPress = () => {
    if (focusedVideoData) {
      console.log("Mint pressed for video:", focusedVideoData.address);
    }
  };

  const renderFocusedVideo = () => {
    if (!focusedVideoData) return null;

    const { numericStats } = focusedVideoData;
    const priceText =
      numericStats.price > 0
        ? `$${numericStats.price.toFixed(2)}`
        : "Price N/A";
    const valueText =
      numericStats.value > 0
        ? `${numericStats.value.toFixed(2)} ETH`
        : "Value N/A";
    const mintedText =
      numericStats.minted > 0 ? `${numericStats.minted} minted` : "Minted N/A";

    const videoContainerStyle: ViewStyle = {
      width: FOCUSED_VIDEO_MAX_SIZE,
      height: FOCUSED_VIDEO_MAX_SIZE,
      borderRadius: FOCUSED_VIDEO_MAX_SIZE / 2,
      overflow: "hidden",
      alignItems: "center" as FlexAlignType,
      justifyContent: "center",
      backgroundColor: "transparent",
      position: "relative",
    };

    return (
      <View style={styles.focusedVideoOuterContainer}>
        <View style={{ marginBottom: 10 }}>
          <Button
            title="hide"
            onPress={handleCloseFocusedVideo}
            style={styles.closeButton}
          />
        </View>
        <Animated.View
          style={[
            videoContainerStyle,
            {
              // If scale of focused video itself needs to be animated:
              // transform: [{ scale: focusedVideoData.scale }],
            },
          ]}
        >
          <TouchableOpacity
            onPress={handleHideFocusedVideo}
            style={styles.hideButton}
          >
            <Text style={styles.hideButtonText}>✕</Text>
          </TouchableOpacity>
          <VideoNote
            videoSource={`${API_URL}${focusedVideoData.source}`}
            playing={true}
          />
        </Animated.View>

        <View style={styles.statsDisplayContainer}>
          <Inbound style={styles.statItem}>
            <Text style={styles.statText}>{priceText}</Text>
          </Inbound>
          <Inbound style={styles.statItem}>
            <Text style={styles.statText}>{valueText}</Text>
          </Inbound>
          <Inbound style={styles.statItem}>
            <Text style={styles.statText}>{mintedText}</Text>
          </Inbound>
        </View>

        <GloriousButton
          style={styles.mintButtonContainer}
          onPress={handleMintPress}
          title="Mint"
        />
      </View>
    );
  };

  console.log("Rendering ExploreScreen, videos count:", videos.length);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ height: canvasHeight.current }}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {videos.map((item) => {
          const translateY = add(
            item.y,
            scrollY.interpolate({
              inputRange: [
                Math.max(0, item.y - screenHeight * 2),
                item.y + screenHeight * 2,
              ],
              outputRange: [
                -screenHeight * (item.parallaxFactor - 1) * 2,
                screenHeight * (item.parallaxFactor - 1) * 2,
              ],
              extrapolate: "clamp",
            })
          );

          const isFocusedItem = focusedVideoKey === item.key;
          const isAnyVideoFocused = !!focusedVideoKey;

          return (
            <Animated.View
              key={item.key}
              style={[
                styles.videoItemContainer,
                {
                  left: item.x,
                  top: 0,
                  width: ITEM_DIAMETER,
                  height: ITEM_DIAMETER,
                  opacity: item.opacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      0,
                      isAnyVideoFocused && !isFocusedItem ? 0.5 : 1,
                    ],
                  }),
                  transform: [{ translateY }, { scale: item.scale }],
                  zIndex: isFocusedItem
                    ? 100
                    : isAnyVideoFocused
                    ? 1
                    : Math.floor(item.parallaxFactor * 10),
                  backgroundColor: "#333",
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => handleVideoFocus(item)}
                activeOpacity={0.8}
                style={styles.touchableThumbnail}
              >
                {item.thumbnailUrl ? (
                  <Image
                    source={{ uri: API_URL + item.thumbnailUrl }}
                    style={styles.thumbnailImage}
                    onError={(e) =>
                      console.error(
                        "Error loading thumbnail:",
                        e.nativeEvent.error,
                        API_URL + item.thumbnailUrl
                      )
                    }
                  />
                ) : (
                  <View
                    style={[
                      styles.thumbnailImage,
                      {
                        backgroundColor: "#555",
                        justifyContent: "center",
                        alignItems: "center",
                      },
                    ]}
                  >
                    <Text style={{ color: "white", fontSize: 10 }}>No Img</Text>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>

      {focusedVideoKey && renderFocusedVideo()}

      {videos.length === 0 && !isLoading && !allVideosLoaded && (
        <View style={styles.noVideosContainer}>
          <Text style={styles.noVideosText}>Loading Videos...</Text>
        </View>
      )}
      {videos.length === 0 && !isLoading && allVideosLoaded && (
        <View style={styles.noVideosContainer}>
          <Text style={styles.noVideosText}>No videos found on server.</Text>
          <GloriousButton
            title="Retry"
            onPress={() => {
              setAllVideosLoaded(false);
              loadMoreVideos();
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

import { ViewStyle } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollView: {
    flex: 1,
  },
  closeButton: {
    height: 20,
  },
  videoItemContainer: {
    position: "absolute",
    borderRadius: ITEM_DIAMETER / 2,
    overflow: "hidden",
  },
  touchableThumbnail: {
    width: "100%",
    height: "100%",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  focusedVideoOuterContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 200,
  },
  hideButton: {
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  hideButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  statsDisplayContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    paddingHorizontal: 10,
    width: FOCUSED_VIDEO_MAX_SIZE * 0.9,
  },
  statItem: {
    backgroundColor: "rgba(30, 30, 30, 0.85)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    marginVertical: 4,
    width: "100%",
    alignItems: "center",
  },
  statText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  mintButtonContainer: {
    position: "absolute",
    bottom: 40,
    width: 120,
    left: "50%",
    transform: [{ translateX: "-50%" }],
    alignItems: "center",
    zIndex: 100,
  },
  noVideosContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    padding: 20,
  },
  noVideosText: {
    color: "white",
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  retryButton: {
    backgroundColor: "#FF3B80",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
