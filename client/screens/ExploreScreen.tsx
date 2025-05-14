import {
  View,
  StyleSheet,
  Image,
  Platform,
  Dimensions,
  TouchableOpacity,
  Animated,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from "react-native";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Text, GloriousButton, Button, Inbound } from "../components";
import VideoNote from "../components/VideoNote";
import { ApiService, VideoData, API_URL } from "../data/api";
import SafeAreaView from "../components/SafeAreaView";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const EXPLORE_PATH = "/explore";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const ITEM_DIAMETER = 120;
const FOCUSED_VIDEO_MAX_SIZE = Math.min(512, screenWidth - 40);
const MIN_SCALE_UNFOCUSED = 0.5;
const MAX_PARALLAX_FACTOR = 1.5;
const MIN_PARALLAX_FACTOR = 0.8;
const GRID_AVOIDANCE_RADIUS = ITEM_DIAMETER * 0.8;
const LOAD_BATCH_SIZE = 10;
const CANVAS_INITIAL_SIZE = 1000;
const LOAD_THRESHOLD = 250;
const ANIMATION_DURATION = 350;

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
  ValueXY,
  spring,
  timing,
  parallel,
  stagger,
  add,
  multiply,
  event: AnimatedEvent,
} = Animated;

export default function ExploreScreen({
  initialAddress,
}: {
  initialAddress?: string | null;
}) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // Canvas state
  const canvasPosition = useRef(new ValueXY({ x: 0, y: 0 })).current;
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: CANVAS_INITIAL_SIZE,
    height: CANVAS_INITIAL_SIZE,
  });

  // Videos state
  const [videos, setVideos] = useState<CanvasVideoItem[]>([]);
  const [focusedVideoKey, setFocusedVideoKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [allVideosLoaded, setAllVideosLoaded] = useState(false);
  const processedVideoAddresses = useRef(new Set<string>()).current;
  const occupiedPositions = useRef<Array<{ x: number; y: number }>>([]);
  const maxMintedRef = useRef(1);
  const loadCountRef = useRef(0);
  const [currentFocusedAddress, setCurrentFocusedAddress] = useState<
    string | null
  >(null);

  const focusedVideoData = useMemo(() => {
    return videos.find((v) => v.key === focusedVideoKey);
  }, [videos, focusedVideoKey]);

  // Pan responder setup
  const panResponder = useMemo(() => {
    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dx) > 5 || Math.abs(dy) > 5;
      },
      onPanResponderGrant: () => {
        canvasPosition.extractOffset();
      },
      onPanResponderMove: Animated.event(
        [null, { dx: canvasPosition.x, dy: canvasPosition.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gestureState) => {
        canvasPosition.flattenOffset();
        checkCanvasBoundaries(gestureState);
        checkLoadMore();
      },
    });
  }, []);

  // Check if we need to load more videos based on canvas position
  const checkLoadMore = useCallback(() => {
    // Use a safer approach to get current position values
    let xValue = 0;
    let yValue = 0;

    // Access the x and y values directly
    if (canvasPosition) {
      const positionX = canvasPosition.x as any;
      const positionY = canvasPosition.y as any;

      if (positionX._value !== undefined) xValue = positionX._value;
      if (positionY._value !== undefined) yValue = positionY._value;
    }

    const distanceFromRight = canvasDimensions.width - (xValue + screenWidth);
    const distanceFromBottom =
      canvasDimensions.height - (yValue + screenHeight);

    // If the user is approaching the boundaries, load more videos
    if (
      distanceFromRight < LOAD_THRESHOLD ||
      distanceFromBottom < LOAD_THRESHOLD
    ) {
      if (allVideosLoaded) {
        loadMoreVideos(true); // Recycle existing videos
      } else {
        loadMoreVideos();
      }
    }
  }, [canvasDimensions, allVideosLoaded]);

  // Prevent canvas from going out of bounds
  const checkCanvasBoundaries = useCallback(
    (gestureState: PanResponderGestureState) => {
      const { vx, vy } = gestureState;

      // Use a safer approach to get current position values
      let xValue = 0;
      let yValue = 0;

      // Access the x and y values directly
      if (canvasPosition) {
        const positionX = canvasPosition.x as any;
        const positionY = canvasPosition.y as any;

        if (positionX._value !== undefined) xValue = positionX._value;
        if (positionY._value !== undefined) yValue = positionY._value;
      }

      // Apply momentum based on velocity
      const momentumX = vx * 200;
      const momentumY = vy * 200;

      let newX = xValue + momentumX;
      let newY = yValue + momentumY;

      // Keep canvas within boundaries
      newX = Math.max(-canvasDimensions.width + screenWidth, Math.min(0, newX));
      newY = Math.max(
        -canvasDimensions.height + screenHeight,
        Math.min(0, newY)
      );

      // Apply final position with animation
      Animated.spring(canvasPosition, {
        toValue: { x: newX, y: newY },
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    },
    [canvasDimensions]
  );

  // Create a unique key for each video
  const generateUniqueKey = (address: string, batchId: number) =>
    `${address}-${batchId}-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 7)}`;

  // Find a random position that doesn't overlap with existing items
  const getRandomPosition = (
    currentBatchOccupied: Array<{ x: number; y: number }>
  ): { x: number; y: number } => {
    let xPos: number,
      yPos: number,
      attempts = 0;
    const MAX_ATTEMPTS = 50;

    do {
      // Generate position anywhere in the canvas
      xPos =
        Math.random() * (canvasDimensions.width - ITEM_DIAMETER * 2) +
        ITEM_DIAMETER;
      yPos =
        Math.random() * (canvasDimensions.height - ITEM_DIAMETER * 2) +
        ITEM_DIAMETER;

      attempts++;
      if (attempts > MAX_ATTEMPTS) break;

      // Check if this position is too close to any existing item
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

  // Load more videos from API or recycle existing ones
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

      // Expand canvas if needed
      const currentSize = Math.max(
        canvasDimensions.width,
        canvasDimensions.height
      );
      if (
        currentSize <
        CANVAS_INITIAL_SIZE + loadCountRef.current * ITEM_DIAMETER * 3
      ) {
        const newSize = currentSize + CANVAS_INITIAL_SIZE / 2;
        setCanvasDimensions({
          width: newSize,
          height: newSize,
        });
      }

      if (!isRecycling && newUniqueVideosData.length > 0) {
        // Process new videos from API
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

            // Calculate parallax factor based on popularity (minted)
            const normalizedMinted = Math.max(
              0.01,
              numericStats.minted / (maxMintedRef.current || 1)
            );
            const parallaxFactor =
              MAX_PARALLAX_FACTOR -
              normalizedMinted * (MAX_PARALLAX_FACTOR - MIN_PARALLAX_FACTOR);

            const { x: newX, y: newY } =
              getRandomPosition(currentBatchOccupied);

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

        // Animate new videos appearing
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

        if (
          fetchedData.length < LOAD_BATCH_SIZE ||
          (newUniqueVideosData.length === 0 && fetchedData.length > 0)
        ) {
          setAllVideosLoaded(true);
        }
      } else if (isRecycling && videos.length > 0) {
        // Recycle existing videos when no more from API
        const numToRecycle = Math.min(videos.length, LOAD_BATCH_SIZE);
        const videosToRecycle = videos.slice(0, numToRecycle);
        console.log("Recycling videos:", videosToRecycle.length);

        const currentBatchOccupied: Array<{ x: number; y: number }> = [];
        const recycledCanvasVideos: CanvasVideoItem[] = videosToRecycle.map(
          (videoData) => {
            const { x: newX, y: newY } =
              getRandomPosition(currentBatchOccupied);
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

        // Animate recycled videos appearing
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
      } else if (!isRecycling && newUniqueVideosData.length === 0) {
        setAllVideosLoaded(true);
      }
      setIsLoading(false);
    },
    [
      isLoading,
      allVideosLoaded,
      videos,
      processedVideoAddresses,
      canvasDimensions,
    ]
  );

  // Initial load and animate on navigation focus
  useEffect(() => {
    console.log("ExploreScreen mounted, calling loadMoreVideos()");
    loadMoreVideos();
  }, [loadMoreVideos]);

  useEffect(() => {
    if (isFocused) {
      // When screen is focused, animate all videos appearing
      stagger(
        30,
        videos.map((v) =>
          parallel([
            spring(v.scale, {
              toValue: focusedVideoKey === v.key ? 1.8 : 1,
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
    } else {
      // When leaving screen, animate all videos disappearing
      parallel(
        videos.map((v) =>
          parallel([
            timing(v.scale, {
              toValue: 0.1,
              duration: ANIMATION_DURATION,
              useNativeDriver: true,
            }),
            timing(v.opacity, {
              toValue: 0,
              duration: ANIMATION_DURATION,
              useNativeDriver: true,
            }),
          ])
        )
      ).start();
    }
  }, [isFocused, videos, focusedVideoKey]);

  // Handle initial address focus and web path updates
  useEffect(() => {
    if (initialAddress && videos.length > 0 && !focusedVideoKey) {
      const videoToFocus = videos.find((v) => v.address === initialAddress);
      if (videoToFocus) {
        handleVideoFocus(videoToFocus);
      }
    }

    if (Platform.OS === "web") {
      let newPath = EXPLORE_PATH;
      if (focusedVideoData && focusedVideoData.address) {
        newPath = `${EXPLORE_PATH}/${encodeURIComponent(
          focusedVideoData.address
        )}`;
      }

      if (window.location.pathname !== newPath) {
        console.log("Updating window path to:", newPath);
        window.history.replaceState({}, "", newPath);
      }
    }
  }, [initialAddress, videos, focusedVideoKey, focusedVideoData]);

  // Video thumbnail press handler
  const handleVideoFocus = useCallback(
    (videoItem: CanvasVideoItem) => {
      // Center the canvas on the selected video
      const centerX = -videoItem.x + (screenWidth / 2 - ITEM_DIAMETER / 2);
      const centerY = -videoItem.y + (screenHeight / 2 - ITEM_DIAMETER / 2);

      Animated.spring(canvasPosition, {
        toValue: { x: centerX, y: centerY },
        useNativeDriver: true,
        tension: 40,
        friction: 7,
      }).start();

      const isAlreadyFocused = focusedVideoKey === videoItem.key;
      const newFocusedKey = isAlreadyFocused ? null : videoItem.key;

      setFocusedVideoKey(newFocusedKey);

      if (newFocusedKey) {
        setCurrentFocusedAddress(videoItem.address);
      } else {
        setCurrentFocusedAddress(null);
      }

      // Animate all videos based on focus state
      parallel(
        videos.map((v) => {
          let targetScale = 1;
          if (newFocusedKey) {
            targetScale = v.key === newFocusedKey ? 1.8 : MIN_SCALE_UNFOCUSED;
          }
          return spring(v.scale, {
            toValue: targetScale,
            tension: 40,
            friction: 7,
            useNativeDriver: true,
          });
        })
      ).start();
    },
    [videos, focusedVideoKey]
  );

  // Close focused video
  const handleCloseFocusedVideo = () => {
    setFocusedVideoKey(null);
    setCurrentFocusedAddress(null);

    // Restore all videos to normal scale
    parallel(
      videos.map((v) =>
        spring(v.scale, {
          toValue: 1,
          tension: 40,
          friction: 7,
          useNativeDriver: true,
        })
      )
    ).start();
  };

  // Handle mint button press
  const handleMintPress = () => {
    if (focusedVideoData) {
      console.log("Mint pressed for video:", focusedVideoData.address);
    }
  };

  // Render focused video overlay
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

    return (
      <View style={styles.focusedVideoOuterContainer}>
        <View style={{ marginBottom: 10 }}>
          <Button
            title="hide"
            onPress={handleCloseFocusedVideo}
            style={styles.closeButton}
          />
        </View>

        <View style={styles.focusedVideoContainer}>
          <TouchableOpacity
            onPress={handleCloseFocusedVideo}
            style={styles.hideButton}
          >
            <Text style={styles.hideButtonText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.videoPlayerContainer}>
            <VideoNote
              videoSource={`${API_URL}${focusedVideoData.source}`}
              playing={true}
            />
          </View>
        </View>

        <View style={styles.statsContainer}>
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
      <Animated.View
        style={[
          styles.canvasContainer,
          {
            width: canvasDimensions.width,
            height: canvasDimensions.height,
            transform: [
              { translateX: canvasPosition.x },
              { translateY: canvasPosition.y },
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        {videos.map((item) => {
          // Apply parallax effect based on canvas position
          const translateX = multiply(
            canvasPosition.x,
            item.parallaxFactor - 1
          );
          const translateY = multiply(
            canvasPosition.y,
            item.parallaxFactor - 1
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
                  top: item.y,
                  opacity: item.opacity,
                  transform: [
                    { translateX },
                    { translateY },
                    { scale: item.scale },
                  ],
                  zIndex: isFocusedItem
                    ? 100
                    : Math.floor(item.parallaxFactor * 10),
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
      </Animated.View>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  canvasContainer: {
    position: "absolute",
  },
  closeButton: {
    height: 20,
  },
  videoItemContainer: {
    position: "absolute",
    width: ITEM_DIAMETER,
    height: ITEM_DIAMETER,
    borderRadius: ITEM_DIAMETER / 2,
    overflow: "hidden",
    backgroundColor: "#333",
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
  focusedVideoContainer: {
    width: FOCUSED_VIDEO_MAX_SIZE,
    height: FOCUSED_VIDEO_MAX_SIZE,
    borderRadius: FOCUSED_VIDEO_MAX_SIZE / 2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    position: "relative",
  },
  videoPlayerContainer: {
    width: "100%",
    height: "100%",
    borderRadius: FOCUSED_VIDEO_MAX_SIZE / 2,
    overflow: "hidden",
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
  statsContainer: {
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
    marginTop: 20,
    width: 120,
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
});
