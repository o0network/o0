import {
  View,
  StyleSheet,
  Image,
  Platform,
  Dimensions,
  TouchableOpacity,
  Animated,
  PanResponderInstance,
  PanResponder,
} from "react-native";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Text, GloriousButton, Button, Inbound, VideoNote } from "../components";
import { ApiService, VideoData, API_URL } from "../data/api";
import SafeAreaView from "../components/SafeAreaView";
import { useIsFocused } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { useModal } from "../contexts/ModalContext";
import { useRoute, RouteProp } from "@react-navigation/native";

const EXPLORE_PATH = "/explore";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Canvas configuration inspired by HTML approach
const GRID_SPACING = 360; // Spacing between video centers
const FOCUSED_VIDEO_MAX_SIZE = Math.min(480, screenWidth - 40);
const ANIMATION_DURATION = 350;

// Video properties
const MIN_VIDEO_RADIUS = 80;
const MAX_VIDEO_RADIUS = 120;
const MIN_MOVEMENT_PARALLAX = 0.8;
const MAX_MOVEMENT_PARALLAX = 1.2;

// Alignment effect configuration
let alignmentInfluenceRadius = Math.min(screenWidth, screenHeight) / 2 * 0.8;

// Parse stats helpers
const parseMinted = (mintedStr?: string): number => {
  if (!mintedStr) return 0;
  const match = mintedStr.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

const parseNumericStat = (statStr?: string): number => {
  if (!statStr) return 0;
  return parseFloat(statStr) || 0;
};

// Video item type
type VideoItem = VideoData & {
  id: string;
  worldX: number;
  worldY: number;
  radius: number;
  movementParallaxFactor: number;
  scale: Animated.Value;
  opacity: Animated.Value;
  numericStats: {
    minted: number;
    price: number;
    value: number;
  };
  loaded: boolean;
};

/**
 * Generates a random float within a specified range.
 */
function getRandomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Calculates the movement parallax factor based on video radius.
 */
function calculateMovementParallaxFactor(radius: number): number {
  const normalizedRadius = (radius - MIN_VIDEO_RADIUS) / (MAX_VIDEO_RADIUS - MIN_VIDEO_RADIUS);
  return MIN_MOVEMENT_PARALLAX + normalizedRadius * (MAX_MOVEMENT_PARALLAX - MIN_MOVEMENT_PARALLAX);
}

export default function ExploreScreen({
  initialAddress,
}: {
  initialAddress?: string | null;
}) {
  const route = useRoute<RouteProp<Record<string, { address?: string }>, string>>();
  const routeAddress = route.params?.address;
  const addressFromUrl = routeAddress || initialAddress;

  const isFocused = useIsFocused();
  const { isWalletConnected } = useAuth();
  const { openWalletConnect } = useModal();

  // Camera state
  const [cameraX, setCameraX] = useState(0);
  const [cameraY, setCameraY] = useState(0);
  const [forceRender, setForceRender] = useState(0);

  // Video state
  const [focusedVideoId, setFocusedVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiExhausted, setApiExhausted] = useState(false);
  const [canInteract, setCanInteract] = useState(true);

  // Refs
  const panResponderRef = useRef<PanResponderInstance | null>(null);
  const lastTouchRef = useRef({ x: 0, y: 0 });
  const videosDataRef = useRef<Map<string, VideoItem>>(new Map());
  const apiVideosRef = useRef<VideoData[]>([]);
  const currentOffsetRef = useRef<number>(0);
  const isDraggingRef = useRef(false);
  const isApiLoadingRef = useRef(false); // Prevent multiple simultaneous API calls
  const cacheReplayIndexRef = useRef<number>(-1); // Index for replaying cached videos in reverse order when API exhausted
  const directOpenHandledRef = useRef(false); // Track if direct-link focus has been handled

  // Batch load videos from API
  const loadVideosFromAPI = useCallback(async (batchSize: number = 12): Promise<VideoData[]> => {
    if (isApiLoadingRef.current || apiExhausted) {
      return [];
    }

    isApiLoadingRef.current = true;
    setIsLoading(true);

    try {
      const fetchedVideos = await ApiService.fetchVideos(batchSize, currentOffsetRef.current);

      if (fetchedVideos.length === 0) {
        setApiExhausted(true);
        cacheReplayIndexRef.current = apiVideosRef.current.length - 1;
        return [];
      }

      // Add to cache
      apiVideosRef.current.push(...fetchedVideos);
      currentOffsetRef.current += fetchedVideos.length;

      console.log(`Loaded ${fetchedVideos.length} videos from API. Total cached: ${apiVideosRef.current.length}`);

      return fetchedVideos;
    } catch (error) {
      console.error("Error fetching videos:", error);
      return [];
    } finally {
      isApiLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [apiExhausted]);

  // Get random video from cache or trigger batch load
  const getRandomVideoData = useCallback(async (): Promise<VideoData | null> => {
    // When API not exhausted, get random from cache or load more
    if (!apiExhausted) {
      if (apiVideosRef.current.length > 0) {
        const randomIndex = Math.floor(Math.random() * apiVideosRef.current.length);
        return apiVideosRef.current[randomIndex];
      }
      if (!isApiLoadingRef.current) {
        await loadVideosFromAPI(12);
        if (apiVideosRef.current.length > 0) {
          const randomIndex = Math.floor(Math.random() * apiVideosRef.current.length);
          return apiVideosRef.current[randomIndex];
        }
      }
      return null;
    }

    // When API exhausted, replay cached videos in reverse order
    if (cacheReplayIndexRef.current >= 0) {
      const videoData = apiVideosRef.current[cacheReplayIndexRef.current];
      cacheReplayIndexRef.current--;
      return videoData;
    }

    return null;
  }, [loadVideosFromAPI, apiExhausted]);

  // Check if we need to preload more videos
  const checkAndPreloadVideos = useCallback(() => {
    const MIN_CACHED_VIDEOS = 20; // Keep at least 20 videos cached

    if (apiVideosRef.current.length < MIN_CACHED_VIDEOS && !isApiLoadingRef.current && !apiExhausted) {
      console.log(`Preloading more videos. Current cache: ${apiVideosRef.current.length}`);
      loadVideosFromAPI(12);
    }
  }, [loadVideosFromAPI, apiExhausted]);

  // Create video item for a grid position
  const createVideoItem = useCallback(async (worldX: number, worldY: number, videoKey: string): Promise<VideoItem | null> => {
    const videoData = await getRandomVideoData();
    if (!videoData) return null;

    const mintedCount = parseMinted(videoData.stats?.minted);
    const price = parseNumericStat(videoData.stats?.price);
    const value = parseNumericStat(videoData.stats?.value);

    const radius = getRandomFloat(MIN_VIDEO_RADIUS, MAX_VIDEO_RADIUS);
    const movementParallaxFactor = calculateMovementParallaxFactor(radius);

    const videoItem: VideoItem = {
      ...videoData,
      id: `${videoData.address}-${videoKey}`,
      worldX,
      worldY,
      radius,
      movementParallaxFactor,
      scale: new Animated.Value(0),
      opacity: new Animated.Value(0),
      source: `/api/video/${videoData.address}`,
      thumbnailUrl: `/api/thumbnail/${videoData.address}`,
      numericStats: {
        minted: mintedCount,
        price,
        value
      },
      loaded: false,
    };

          // Prefetch thumbnail
    if (videoItem.thumbnailUrl) {
      Image.prefetch(`${API_URL}${videoItem.thumbnailUrl}`).catch(() => {});
    }

    // Animate video appearing
          Animated.parallel([
      Animated.spring(videoItem.scale, {
              toValue: 1,
              friction: 8,
              tension: 50,
              useNativeDriver: true
            }),
      Animated.timing(videoItem.opacity, {
              toValue: 1,
              duration: ANIMATION_DURATION,
              useNativeDriver: true
            })
          ]).start();

    return videoItem;
  }, [getRandomVideoData]);

  // Handle video focus
  const handleVideoFocus = useCallback((videoItem: VideoItem, options?: { preserveUrl?: boolean }) => {
    const preserveUrlOnFocus = options?.preserveUrl || false;

    if (focusedVideoId === videoItem.id) {
      // Unfocus video
      setFocusedVideoId(null);
      setCanInteract(true);

      // Restore all videos
      videosDataRef.current.forEach(item => {
          Animated.parallel([
          Animated.spring(item.scale, {
              toValue: 1,
              friction: 8,
              tension: 50,
              useNativeDriver: true
            }),
          Animated.spring(item.opacity, {
              toValue: 1,
              friction: 8,
              tension: 50,
              useNativeDriver: true
            })
          ]).start();
      });

      if (Platform.OS === 'web') {
        window.history.replaceState({}, "", EXPLORE_PATH);
      }
      return;
    }

    // Focus new video
    setFocusedVideoId(videoItem.id);
    setCanInteract(false);

    // Center camera on focused video
    setCameraX(videoItem.worldX);
    setCameraY(videoItem.worldY);

    // Hide other videos and enhance focused video
    videosDataRef.current.forEach(item => {
      const isFocusedItem = item.id === videoItem.id;
        Animated.parallel([
        Animated.spring(item.scale, {
            toValue: isFocusedItem ? 1.5 : 0,
            friction: 8,
            tension: 50,
            useNativeDriver: true
          }),
        Animated.spring(item.opacity, {
            toValue: isFocusedItem ? 1 : 0,
            friction: 8,
            tension: 50,
            useNativeDriver: true
          })
        ]).start();
    });

    if (Platform.OS === 'web' && !preserveUrlOnFocus) {
      if (videoItem.address) {
        const targetPath = `${EXPLORE_PATH}/${encodeURIComponent(videoItem.address)}`;
        window.history.replaceState({}, "", targetPath);
      }
    }
  }, [focusedVideoId]);

  // Get focused video
  const focusedVideo = useMemo(() => {
    if (!focusedVideoId) return null;

    // Find video by ID across all stored videos
    for (const [key, video] of videosDataRef.current) {
      if (video.id === focusedVideoId) {
        return video;
      }
    }

    return null;
  }, [focusedVideoId]);

  // Calculate visible videos and render them
  const renderVideos = useCallback(() => {
    // Calculate visible world bounds
    const renderMargin = Math.max(MAX_VIDEO_RADIUS, GRID_SPACING) * 2;
    const leftWorldBound = cameraX - screenWidth / 2 - renderMargin;
    const rightWorldBound = cameraX + screenWidth / 2 + renderMargin;
    const topWorldBound = cameraY - screenHeight / 2 - renderMargin;
    const bottomWorldBound = cameraY + screenHeight / 2 + renderMargin;

    // Calculate grid start/end points
    const startX = Math.floor(leftWorldBound / GRID_SPACING) * GRID_SPACING;
    const endX = Math.ceil(rightWorldBound / GRID_SPACING) * GRID_SPACING;
    const startY = Math.floor(topWorldBound / GRID_SPACING) * GRID_SPACING;
    const endY = Math.ceil(bottomWorldBound / GRID_SPACING) * GRID_SPACING;

    const videosToRender: React.ReactElement[] = [];

    // Iterate through grid positions
    for (let y = startY; y <= endY; y += GRID_SPACING) {
      // Apply Y-pattern offset for alternating rows
      const isEvenRow = (Math.floor(Math.abs(y) / GRID_SPACING)) % 2 === 0;
      const rowOffset = isEvenRow ? GRID_SPACING / 2 : 0;

      for (let x = startX; x <= endX; x += GRID_SPACING) {
        const worldX = x + rowOffset;
        const worldY = y;
        const videoKey = `${worldX}_${worldY}`;

        // Get or create video for this position
        let videoItem = videosDataRef.current.get(videoKey);
        if (!videoItem && !isLoading) {
          // Asynchronously create video item
          createVideoItem(worldX, worldY, videoKey).then(newVideoItem => {
            if (newVideoItem) {
              videosDataRef.current.set(videoKey, newVideoItem);
             setForceRender(prev => prev + 1);

              // Check if we need to preload more videos
              checkAndPreloadVideos();
            }
          });
          continue; // Skip rendering this frame
        }

        if (!videoItem) continue;

        // Calculate screen position for video center (dot position)
        const screenX_dot = videoItem.worldX - cameraX + screenWidth / 2;
        const screenY_dot = videoItem.worldY - cameraY + screenHeight / 2;

        // Calculate video position with parallax and alignment
        const dx_dot_from_center_screen = screenX_dot - screenWidth / 2;
        const dy_dot_from_center_screen = screenY_dot - screenHeight / 2;

        // Parallax position
        const parallaxed_screenX_relative = dx_dot_from_center_screen * videoItem.movementParallaxFactor;
        const parallaxed_screenY_relative = dy_dot_from_center_screen * videoItem.movementParallaxFactor;

        const parallaxed_screenX = screenWidth / 2 + parallaxed_screenX_relative;
        const parallaxed_screenY = screenHeight / 2 + parallaxed_screenY_relative;

        // Alignment blending
        const distance_from_center = Math.hypot(dx_dot_from_center_screen, dy_dot_from_center_screen);
        const alignmentBlend = Math.max(0, 1 - Math.min(1, distance_from_center / alignmentInfluenceRadius));

        // Final position
        const final_screenX = parallaxed_screenX * (1 - alignmentBlend) + screenX_dot * alignmentBlend;
        const final_screenY = parallaxed_screenY * (1 - alignmentBlend) + screenY_dot * alignmentBlend;

        const thumbnailUrl = `${API_URL}/api/thumbnail/${videoItem.address}`;
        const displaySize = videoItem.radius * 2; // Convert radius to diameter

        videosToRender.push(
        <Animated.View
            key={videoKey}
          style={[
            styles.videoItem,
            {
              transform: [
                  { translateX: final_screenX - displaySize / 2 },
                  { translateY: final_screenY - displaySize / 2 },
                  { scale: videoItem.scale }
                ],
                opacity: videoItem.opacity,
              width: displaySize,
              height: displaySize,
              borderRadius: displaySize / 2,
            }
          ]}
        >
          <TouchableOpacity
              onPress={() => canInteract && handleVideoFocus(videoItem)}
            activeOpacity={0.7}
              style={[styles.videoTouchable, { borderRadius: displaySize / 2 }]}
              disabled={!canInteract}
          >
              <Image
                source={{ uri: thumbnailUrl }}
                style={[styles.videoThumbnail, { borderRadius: displaySize / 2 }]}
                onLoad={() => {
                  const updatedItem = videosDataRef.current.get(videoKey);
                  if (updatedItem) {
                    updatedItem.loaded = true;
                  }
                }}
              />
          </TouchableOpacity>
        </Animated.View>
      );
      }
    }

    return videosToRender;
  }, [cameraX, cameraY, forceRender, canInteract, handleVideoFocus, isLoading, createVideoItem]);

  // Render focused video overlay
  const renderFocusedVideoOverlay = useCallback(() => {
    if (!focusedVideo) return null;

    const priceText = focusedVideo.numericStats.price > 0
      ? `$${focusedVideo.numericStats.price.toFixed(2)}`
      : "Price N/A";
    const valueText = focusedVideo.numericStats.value > 0
      ? `${focusedVideo.numericStats.value.toFixed(2)} ETH`
      : "Value N/A";
    const mintedText = focusedVideo.numericStats.minted > 0
      ? `${focusedVideo.numericStats.minted} minted`
      : "Minted N/A";

    const videoSource = `${API_URL}/api/video/${focusedVideo.address}`;

    return (
      <View style={styles.focusedVideoOuterContainer}>
        <View style={{ marginBottom: 20 }}>
          <Button
            title="Hide"
            onPress={() => handleVideoFocus(focusedVideo)}
            style={{ width: 120 }}
          />
        </View>

        <View style={styles.focusedVideoContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => handleVideoFocus(focusedVideo)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.videoPlayerContainer}>
            <VideoNote
              videoSource={videoSource}
              scale={1}
              transparent
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
      </View>
    );
  }, [focusedVideo, handleVideoFocus]);

  // Load initial videos on mount
  useEffect(() => {
    if (apiVideosRef.current.length === 0 && !isApiLoadingRef.current && !apiExhausted) {
      // Compute required number of videos based on grid intersections
      const renderMargin = Math.max(MAX_VIDEO_RADIUS, GRID_SPACING) * 2;
      const leftWorldBound = -screenWidth / 2 - renderMargin;
      const rightWorldBound = screenWidth / 2 + renderMargin;
      const topWorldBound = -screenHeight / 2 - renderMargin;
      const bottomWorldBound = screenHeight / 2 + renderMargin;
      const startX = Math.floor(leftWorldBound / GRID_SPACING) * GRID_SPACING;
      const endX = Math.ceil(rightWorldBound / GRID_SPACING) * GRID_SPACING;
      const startY = Math.floor(topWorldBound / GRID_SPACING) * GRID_SPACING;
      const endY = Math.ceil(bottomWorldBound / GRID_SPACING) * GRID_SPACING;
      const numCols = Math.floor((endX - startX) / GRID_SPACING) + 1;
      const numRows = Math.floor((endY - startY) / GRID_SPACING) + 1;
      const initialBatchSize = numCols * numRows;
      console.log(`Loading initial batch of ${initialBatchSize} videos...`);
      // Fetch until we have enough or API is exhausted
      const fetchAll = async () => {
        while (!apiExhausted && apiVideosRef.current.length < initialBatchSize) {
          const toFetch = initialBatchSize - apiVideosRef.current.length;
          await loadVideosFromAPI(toFetch);
        }
      };
      fetchAll();
    }
  }, [loadVideosFromAPI, apiExhausted]);

  // Initialize pan responder
  useEffect(() => {
    panResponderRef.current = PanResponder.create({
      onStartShouldSetPanResponder: () => canInteract,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (!canInteract) return false;
        const { dx, dy } = gestureState;
        return Math.abs(dx) > 5 || Math.abs(dy) > 5;
      },
      onPanResponderGrant: (evt) => {
        if (!canInteract) return;
        isDraggingRef.current = true;
        lastTouchRef.current = {
          x: evt.nativeEvent.pageX,
          y: evt.nativeEvent.pageY
        };

        if (Platform.OS === 'web') {
          document.body.style.cursor = 'grabbing';
        }
      },
      onPanResponderMove: (evt) => {
        if (!canInteract || !isDraggingRef.current) return;
        const { pageX, pageY } = evt.nativeEvent;
        const dx = pageX - lastTouchRef.current.x;
        const dy = pageY - lastTouchRef.current.y;

        setCameraX(prev => prev - dx);
        setCameraY(prev => prev - dy);

        lastTouchRef.current = { x: pageX, y: pageY };

        // Preload more videos when exploring canvas
        checkAndPreloadVideos();
      },
      onPanResponderRelease: () => {
        isDraggingRef.current = false;
        if (Platform.OS === 'web') {
          document.body.style.cursor = 'grab';
        }
      },
      onPanResponderTerminate: () => {
        isDraggingRef.current = false;
        if (Platform.OS === 'web') {
          document.body.style.cursor = 'grab';
        }
      }
    });

    if (Platform.OS === 'web') {
      document.body.style.cursor = 'grab';
    }

    return () => {
      if (Platform.OS === 'web') {
        document.body.style.cursor = '';
      }
    };
  }, [canInteract]);

  // Handle initial address focus
  useEffect(() => {
    if (addressFromUrl && !focusedVideoId && !directOpenHandledRef.current) {
      directOpenHandledRef.current = true;
      // Try to find existing video with this address
      for (const [key, video] of videosDataRef.current) {
        if (video.address === addressFromUrl) {
          handleVideoFocus(video, { preserveUrl: true });
          return;
        }
      }

      // If not found, load specific video info and place it at center
      const loadSpecificVideo = async () => {
        try {
          setIsLoading(true);
          const videoInfo = await ApiService.getVideoInfo(addressFromUrl);
          if (videoInfo) {
            const videoKey = `specific_${addressFromUrl}`;

            // Create video item directly with the specific video info
            const mintedCount = parseMinted(videoInfo.stats?.minted);
            const price = parseNumericStat(videoInfo.stats?.price);
            const value = parseNumericStat(videoInfo.stats?.value);

            const radius = getRandomFloat(MIN_VIDEO_RADIUS, MAX_VIDEO_RADIUS);
            const movementParallaxFactor = calculateMovementParallaxFactor(radius);

            const newVideoItem: VideoItem = {
              ...videoInfo,
              id: `${videoInfo.address}-${videoKey}`,
              worldX: 0, // Place at center
              worldY: 0,
              radius,
              movementParallaxFactor,
              scale: new Animated.Value(0),
              opacity: new Animated.Value(0),
              source: `/api/video/${videoInfo.address}`,
              thumbnailUrl: `/api/thumbnail/${videoInfo.address}`,
              numericStats: {
                minted: mintedCount,
                price,
                value
              },
              loaded: false,
            };

            // Prefetch thumbnail
            if (newVideoItem.thumbnailUrl) {
              Image.prefetch(`${API_URL}${newVideoItem.thumbnailUrl}`).catch(() => {});
            }

            // Animate video appearing
            Animated.parallel([
              Animated.spring(newVideoItem.scale, {
                toValue: 1,
                friction: 8,
                tension: 50,
                useNativeDriver: true
              }),
              Animated.timing(newVideoItem.opacity, {
                toValue: 1,
                duration: ANIMATION_DURATION,
                useNativeDriver: true
              })
            ]).start();

            videosDataRef.current.set(videoKey, newVideoItem);
            handleVideoFocus(newVideoItem, { preserveUrl: true });
          }
        } catch (error) {
          console.error("Error loading specific video:", error);
        } finally {
          setIsLoading(false);
        }
      };

      loadSpecificVideo();
    }
  }, [addressFromUrl, focusedVideoId, handleVideoFocus]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      alignmentInfluenceRadius = Math.min(screenWidth, screenHeight) / 2 * 0.8;
    };

    if (Platform.OS === 'web') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Screen props with interaction control
  const screenProps = {
    ...(canInteract ? panResponderRef.current?.panHandlers : {}),
    style: styles.container,
  };

  return (
    <View style={{ ...StyleSheet.absoluteFillObject }}>
      {!isWalletConnected && (
        <GloriousButton
          style={styles.gloriousButton}
          onPress={openWalletConnect}
          title="Connect Wallet"
        />
      )}

      <SafeAreaView style={styles.container}>
        <View {...screenProps}>
          {!focusedVideoId && renderVideos()}
          {focusedVideoId && renderFocusedVideoOverlay()}

          {videosDataRef.current.size === 0 && apiExhausted && (
            <View style={styles.noVideosContainer}>
              <Text style={styles.noVideosText}>No videos available</Text>
              <Button
                title="Retry"
                onPress={() => {
                  setApiExhausted(false);
                  isApiLoadingRef.current = false;
                  videosDataRef.current.clear();
                  apiVideosRef.current = [];
                  currentOffsetRef.current = 0;
                  setForceRender(prev => prev + 1);
                  // Trigger initial load
                  loadVideosFromAPI(24);
                }}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  videoItem: {
    position: "absolute",
    overflow: "hidden",
    justifyContent: 'center',
    alignItems: 'center',

  },
  videoTouchable: {
    width: "100%",
    height: "100%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoThumbnail: {
    width: "100%",
    height: "100%",

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
    backgroundColor: "#000",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  videoPlayerContainer: {
    width: "100%",
    height: "100%",
    borderRadius: FOCUSED_VIDEO_MAX_SIZE / 2,
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
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
  gloriousButton: {
    marginBottom: 20,
    width: 240,
    position: "absolute",
    bottom: 40,
    zIndex: 100,
    left: "50%",
    transform: [{ translateX: "-50%" }],
    alignSelf: "center",
  },
});