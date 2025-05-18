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
import { Text, GloriousButton, Button, Inbound } from "../components";
import VideoNote from "../components/VideoNote";
import { ApiService, VideoData, API_URL } from "../data/api";
import SafeAreaView from "../components/SafeAreaView";
import { useIsFocused } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { useModal } from "../contexts/ModalContext";

const EXPLORE_PATH = "/explore";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Canvas and video configuration
const ITEM_SIZE = 180; // Larger video size
const FOCUSED_VIDEO_MAX_SIZE = Math.min(512, screenWidth - 40);
const ANIMATION_DURATION = 350;
const LOAD_BATCH_SIZE = 10;
const VIEWPORT_PADDING = 300; // Load videos this distance outside the viewport

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

// Canvas Store for managing viewport and coordinates
class CanvasStore {
  private static instance: CanvasStore;
  private _shouldRender = true;
  private _camera = { x: 0, y: 0, scale: 1 };
  private _viewport = { width: 0, height: 0 };
  private _pointer = { x: 0, y: 0 };
  private _lastPosition = { x: 0, y: 0 }; // Track last position to detect significant movement

  static getInstance(): CanvasStore {
    if (!CanvasStore.instance) {
      CanvasStore.instance = new CanvasStore();
    }
    return CanvasStore.instance;
  }

  initialize(width: number, height: number) {
    this._viewport = { width, height };
    this._camera = { x: 0, y: 0, scale: 1 };
    this._shouldRender = true;
    this._lastPosition = { x: 0, y: 0 };
  }

  get shouldRender() {
    return this._shouldRender;
  }

  set shouldRender(value: boolean) {
    this._shouldRender = value;
  }

  get camera() {
    return this._camera;
  }

  get viewport() {
    return this._viewport;
  }

  // Has camera moved significantly since last check
  hasMovedSignificantly(threshold = 100) {
    const dx = Math.abs(this._camera.x - this._lastPosition.x);
    const dy = Math.abs(this._camera.y - this._lastPosition.y);
    return dx > threshold || dy > threshold;
  }

  // Update last position
  updateLastPosition() {
    this._lastPosition = { x: this._camera.x, y: this._camera.y };
  }

  get visibleRect() {
    return {
      left: -this._camera.x / this._camera.scale,
      top: -this._camera.y / this._camera.scale,
      width: this._viewport.width / this._camera.scale,
      height: this._viewport.height / this._camera.scale,
    };
  }

  // Check if a point with size is visible in the viewport (with padding)
  isVisible(x: number, y: number, size: number): boolean {
    const { left, top, width, height } = this.visibleRect;
    const padding = VIEWPORT_PADDING / this._camera.scale;

    return (
      x + size > left - padding &&
      x - size < left + width + padding &&
      y + size > top - padding &&
      y - size < top + height + padding
    );
  }

  // Move camera by delta
  moveCamera(dx: number, dy: number) {
    this._camera.x += dx;
    this._camera.y += dy;
    this._shouldRender = true;
  }

  // Zoom camera at pointer position
  zoomCamera(scale: number, centerX: number, centerY: number) {
    const prevScale = this._camera.scale;
    const newScale = Math.max(0.1, Math.min(5, this._camera.scale * scale));

    // Calculate the world point under the pointer
    const worldX = (centerX - this._camera.x) / prevScale;
    const worldY = (centerY - this._camera.y) / prevScale;

    // Calculate new camera position to keep worldX, worldY under the pointer
    this._camera.x = centerX - worldX * newScale;
    this._camera.y = centerY - worldY * newScale;
    this._camera.scale = newScale;
    this._shouldRender = true;
  }

  // Set pointer position
  movePointer(x: number, y: number) {
    this._pointer = { x, y };
  }

  // World to screen coordinates
  worldToScreen(x: number, y: number) {
    return {
      x: x * this._camera.scale + this._camera.x,
      y: y * this._camera.scale + this._camera.y,
    };
  }

  // Screen to world coordinates
  screenToWorld(x: number, y: number) {
    return {
      x: (x - this._camera.x) / this._camera.scale,
      y: (y - this._camera.y) / this._camera.scale,
    };
  }
}

// Video types
type VideoItem = VideoData & {
  id: string;
  x: number;
  y: number;
  relevance: number;
  size: number;
  scale: Animated.Value;
  opacity: Animated.Value;
  parallaxFactor: number;
  numericStats: {
    minted: number;
    price: number;
    value: number;
  };
};

export default function ExploreScreen({
  initialAddress,
}: {
  initialAddress?: string | null;
}) {
  const isFocused = useIsFocused();
  const canvasStore = useMemo(() => CanvasStore.getInstance(), []);

  const { isWalletConnected } = useAuth();
  const { openWalletConnect } = useModal();

  // Refs and state
  const panResponderRef = useRef<PanResponderInstance | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTouchRef = useRef({ x: 0, y: 0 });
  const occupiedAreasRef = useRef<Map<string, boolean>>(new Map());
  const processedAddressesRef = useRef<Set<string>>(new Set());
  const maxRelevanceRef = useRef<number>(1);
  const loadTimerRef = useRef<any>(null);
  const currentOffsetRef = useRef<number>(0); // Track API pagination offset
  const lastRequestedOffsetRef = useRef<number>(-1); // Track last requested offset to prevent duplicates

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [focusedVideoId, setFocusedVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [allVideosLoaded, setAllVideosLoaded] = useState(false);
  const [forceRender, setForceRender] = useState(0);

  // Find focused video
  const focusedVideo = useMemo(() => {
    return videos.find(v => v.id === focusedVideoId);
  }, [videos, focusedVideoId]);

  // Generate a unique position for a video using a grid-based approach
  const generateUniquePosition = useCallback(() => {
    const { left, top, width, height } = canvasStore.visibleRect;
    const padding = VIEWPORT_PADDING / canvasStore.camera.scale;

    // Grid cell size for organized layout
    const gridCellSize = ITEM_SIZE * 1.5;

    // Start with visible viewport plus padding
    const viewportLeft = left - padding;
    const viewportTop = top - padding;
    const viewportWidth = width + padding * 2;
    const viewportHeight = height + padding * 2;

    // Create a grid structure within the viewport area
    const gridColumns = Math.floor(viewportWidth / gridCellSize);
    const gridRows = Math.floor(viewportHeight / gridCellSize);

    // Try to find an unoccupied cell
    for (let attempts = 0; attempts < 50; attempts++) {
      // Choose a random grid cell
      const gridCol = Math.floor(Math.random() * gridColumns);
      const gridRow = Math.floor(Math.random() * gridRows);

      const cellKey = `${gridCol},${gridRow}`;

      // Check if this cell is already occupied
      if (!occupiedAreasRef.current.has(cellKey)) {
        // Calculate the actual position with a small random offset to avoid perfect alignment
        const x = viewportLeft + gridCol * gridCellSize + (Math.random() * 0.3 * gridCellSize);
        const y = viewportTop + gridRow * gridCellSize + (Math.random() * 0.3 * gridCellSize);

        // Mark as occupied
        occupiedAreasRef.current.set(cellKey, true);
        return { x, y, cellKey };
      }
    }

    // If all cells are occupied, generate a random position as fallback
    const x = viewportLeft + Math.random() * viewportWidth;
    const y = viewportTop + Math.random() * viewportHeight;
    const cellKey = `random-${Date.now()}-${Math.random()}`;
    occupiedAreasRef.current.set(cellKey, true);
    return { x, y, cellKey };
  }, [canvasStore]);

  // Load videos from API
  const loadVideos = useCallback(async () => {
    if (isLoading || allVideosLoaded) return;

    // Prevent duplicate API calls with same offset
    if (lastRequestedOffsetRef.current === currentOffsetRef.current) {
      console.log(`Skipping duplicate request for offset ${currentOffsetRef.current}`);
      return;
    }

    setIsLoading(true);
    lastRequestedOffsetRef.current = currentOffsetRef.current;
    console.log(`Loading more videos with offset ${currentOffsetRef.current}...`);

    try {
      // Use the tracked offset for API call
      const fetchedVideos = await ApiService.fetchVideos(LOAD_BATCH_SIZE, currentOffsetRef.current);
      console.log(`Fetched ${fetchedVideos.length} videos with offset ${currentOffsetRef.current}`);

      // Log details of videos for debugging
      if (fetchedVideos.length > 0) {
        console.log("Sample video:", JSON.stringify(fetchedVideos[0], null, 2));
      } else {
        console.log("No videos returned from API");
      }

      if (fetchedVideos.length === 0) {
        setAllVideosLoaded(true);
        setIsLoading(false);
        return;
      }

      // Filter out videos we've already processed
      const newVideos = fetchedVideos.filter(
        video => !processedAddressesRef.current.has(video.address)
      );

      console.log(`After filtering, ${newVideos.length} new videos to display`);

      if (newVideos.length === 0) {
        // Only consider all videos loaded if we have some videos already
        if (videos.length > 0) {
          setAllVideosLoaded(true);
        } else {
          // If no videos at all, increment offset and try again later
          currentOffsetRef.current += LOAD_BATCH_SIZE;
        }
        setIsLoading(false);
        return;
      }

      // Process videos
      const videoItems: VideoItem[] = newVideos.map(video => {
        // Mark as processed
        processedAddressesRef.current.add(video.address);

        // Parse stats
        const mintedCount = parseMinted(video.stats?.minted);
        const price = parseNumericStat(video.stats?.price);
        const value = parseNumericStat(video.stats?.value);

        // Calculate relevance - we'll use minted count as primary relevance factor
        const relevance = mintedCount || Math.random();

        // Update max relevance
        if (relevance > maxRelevanceRef.current) {
          maxRelevanceRef.current = relevance;
        }

        // Generate unique position
        const { x, y, cellKey } = generateUniquePosition();

        // Calculate size based on relevance
        // More popular videos are larger
        const minSize = ITEM_SIZE * 0.8;
        const maxSize = ITEM_SIZE * 1.2;
        const normalizedRelevance = relevance / maxRelevanceRef.current;
        const size = minSize + normalizedRelevance * (maxSize - minSize);

        // Calculate parallax factor
        // IMPORTANT: Less popular videos have higher parallax factor (appear closer to user, move faster)
        const maxParallax = 0.3;
        const minParallax = 0.05;
        const parallaxFactor = maxParallax - (normalizedRelevance * (maxParallax - minParallax));

        // Always construct URLs from address
        const source = `/api/video/${video.address}`;
        const thumbnailUrl = `/api/thumbnail/${video.address}`;

        return {
          ...video,
          id: `${video.address}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          x,
          y,
          relevance,
          size,
          scale: new Animated.Value(0),
          opacity: new Animated.Value(0),
          source,
          thumbnailUrl,
          parallaxFactor,
          numericStats: {
            minted: mintedCount,
            price,
            value
          }
        };
      });

      // Add to state
      setVideos(prev => [...prev, ...videoItems]);

      // Animate videos appearing
      videoItems.forEach(video => {
        Animated.parallel([
          Animated.spring(video.scale, {
            toValue: 1,
            friction: 7,
            tension: 40,
            useNativeDriver: true
          }),
          Animated.timing(video.opacity, {
            toValue: 1,
            duration: ANIMATION_DURATION,
            useNativeDriver: true
          })
        ]).start();
      });

      // Increment the offset for the next request
      currentOffsetRef.current += fetchedVideos.length;

    } catch (error) {
      console.error("Error loading videos:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, allVideosLoaded, generateUniquePosition, videos.length]);

  // Check if we need to load more videos based on current view
  const checkLoadMoreVideos = useCallback(() => {
    if (isLoading || allVideosLoaded) return;

    // Count visible videos
    const visibleVideos = videos.filter(video =>
      canvasStore.isVisible(video.x, video.y, video.size)
    );

    // If camera has moved significantly or there are few visible videos, load more
    if (canvasStore.hasMovedSignificantly() || visibleVideos.length < 10) {
      canvasStore.updateLastPosition();
      loadVideos();
    }
  }, [videos, canvasStore, allVideosLoaded, isLoading, loadVideos]);

  // Initialize camera and canvas
  useEffect(() => {
    canvasStore.initialize(screenWidth, screenHeight);

    // Setup pan responder
    panResponderRef.current = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dx) > 5 || Math.abs(dy) > 5;
      },
      onPanResponderGrant: (evt) => {
        lastTouchRef.current = {
          x: evt.nativeEvent.pageX,
          y: evt.nativeEvent.pageY
        };

        // Change cursor for web
        if (Platform.OS === 'web') {
          document.body.style.cursor = 'grabbing';
        }

        // Clear any pending load checks
        if (loadTimerRef.current) {
          clearTimeout(loadTimerRef.current);
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        const { pageX, pageY } = evt.nativeEvent;
        const dx = pageX - lastTouchRef.current.x;
        const dy = pageY - lastTouchRef.current.y;

        canvasStore.moveCamera(dx, dy);
        lastTouchRef.current = { x: pageX, y: pageY };
        setForceRender(prev => prev + 1);
      },
      onPanResponderRelease: () => {
        // Change cursor back
        if (Platform.OS === 'web') {
          document.body.style.cursor = 'grab';
        }

        // Schedule a check to load more videos after panning
        if (loadTimerRef.current) {
          clearTimeout(loadTimerRef.current);
        }

        loadTimerRef.current = setTimeout(() => {
          checkLoadMoreVideos();
        }, 100);
      },
      onPanResponderTerminate: () => {
        if (Platform.OS === 'web') {
          document.body.style.cursor = 'grab';
        }
      }
    });

    // Setup render loop
    const startRenderLoop = () => {
      const frame = () => {
        if (canvasStore.shouldRender) {
          setForceRender(prev => prev + 1);
          canvasStore.shouldRender = false;
        }
        rafRef.current = requestAnimationFrame(frame);
      };

      rafRef.current = requestAnimationFrame(frame);
    };

    startRenderLoop();

    // Load initial videos
    loadVideos();

    // Setup interval to check for loading more videos
    const loadCheckInterval = setInterval(() => {
      if (isFocused) {
        checkLoadMoreVideos();
      }
    }, 2000); // Check every 2 seconds if we need more videos

    // Set cursor style for web
    if (Platform.OS === 'web') {
      document.body.style.cursor = 'grab';
    }

    // Clean up
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      if (loadTimerRef.current) {
        clearTimeout(loadTimerRef.current);
      }

      clearInterval(loadCheckInterval);

      if (Platform.OS === 'web') {
        document.body.style.cursor = '';
      }
    };
  }, [canvasStore, loadVideos, checkLoadMoreVideos, isFocused]);

  // Handle wheel events for zooming
  const handleWheel = useCallback((event: any) => {
    // Prevent default browser zoom/scroll behavior triggered by wheel,
    // especially if ctrl/meta is pressed (common for pinch-to-zoom on trackpads)
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
    }
    // Do not call canvasStore.zoomCamera or other zoom logic to disable zoom via wheel
  }, []); // Removed dependencies as it no longer calls zoom related functions

  // Handle focus/unfocus of a video
  const handleVideoFocus = useCallback((video: VideoItem, options?: { preserveUrl?: boolean }) => {
    const preserveUrlOnFocus = options?.preserveUrl || false;

    // If clicking the already focused video, or closing the focused video overlay
    if (focusedVideoId === video.id) {
      setFocusedVideoId(null);
      videos.forEach(v => {
        Animated.parallel([
          Animated.spring(v.scale, {
            toValue: 1,
            friction: 7,
            tension: 40,
            useNativeDriver: true
          }),
          Animated.spring(v.opacity, { // Use spring for consistency or timing as preferred
            toValue: 1,
            useNativeDriver: true
          })
        ]).start();
      });

      if (Platform.OS === 'web') {
        window.history.replaceState({}, "", EXPLORE_PATH);
      }
      return;
    }

    // Focusing a new video
    setFocusedVideoId(video.id);

    const centerX = video.x * canvasStore.camera.scale - screenWidth / 2;
    const centerY = video.y * canvasStore.camera.scale - screenHeight / 2;
    // TODO: Consider animating camera movement for smoother transition
    canvasStore.moveCamera(-centerX, -centerY);
    setForceRender(prev => prev + 1); // Ensure re-render after camera move

    videos.forEach(v => {
      const isFocusedItem = v.id === video.id;
      Animated.parallel([
        Animated.spring(v.scale, {
          toValue: isFocusedItem ? 1.5 : 0, // Other videos minimize
          friction: 7,
          tension: 40,
          useNativeDriver: true
        }),
        Animated.spring(v.opacity, { // Other videos fade out
          toValue: isFocusedItem ? 1 : 0,
          useNativeDriver: true
        })
      ]).start();
    });

    if (Platform.OS === 'web') {
      if (preserveUrlOnFocus && video.address) {
        const targetPath = `${EXPLORE_PATH}/${encodeURIComponent(video.address)}`;
        // Only update if different, though replaceState is idempotent for same state/URL
        if (window.location.pathname !== targetPath) {
            window.history.replaceState({}, "", targetPath);
        }
      } else {
        window.history.replaceState({}, "", EXPLORE_PATH);
      }
    }
  }, [videos, focusedVideoId, canvasStore]);

  // Handle initial address focus
  useEffect(() => {
    if (initialAddress && videos.length > 0 && !focusedVideoId) {
      const videoToFocus = videos.find(v => v.address === initialAddress);
      if (videoToFocus) {
        handleVideoFocus(videoToFocus, { preserveUrl: true });
      }
    }
  }, [initialAddress, videos, focusedVideoId, handleVideoFocus]);

  // Handle app focus/unfocus animations
  useEffect(() => {
    if (isFocused) {
      // Animate videos appearing
      videos.forEach(video => {
        Animated.parallel([
          Animated.spring(video.scale, {
            toValue: focusedVideoId === video.id ? 1.5 : 1,
            friction: 7,
            tension: 40,
            useNativeDriver: true
          }),
          Animated.timing(video.opacity, {
            toValue: 1,
            duration: ANIMATION_DURATION,
            useNativeDriver: true
          })
        ]).start();
      });
    } else {
      // Animate videos disappearing
      videos.forEach(video => {
        Animated.parallel([
          Animated.timing(video.scale, {
            toValue: 0,
            duration: ANIMATION_DURATION / 2,
            useNativeDriver: true
          }),
          Animated.timing(video.opacity, {
            toValue: 0,
            duration: ANIMATION_DURATION / 2,
            useNativeDriver: true
          })
        ]).start();
      });
    }
  }, [isFocused, videos, focusedVideoId]);

  // Render visible videos
  const renderVideos = useCallback(() => {
    return videos.map(video => {
      // Check if video is visible
      if (!canvasStore.isVisible(video.x, video.y, video.size)) {
        return null;
      }

      // Get screen coordinates
      const { x, y } = canvasStore.worldToScreen(video.x, video.y);

      // Calculate display size based on camera scale
      const displaySize = video.size * canvasStore.camera.scale;

      // Apply parallax effect based on camera movement
      // Videos with higher parallax factor appear closer to the user and move faster
      const offsetX = canvasStore.camera.x * video.parallaxFactor;
      const offsetY = canvasStore.camera.y * video.parallaxFactor;

      // Construct thumbnail URL directly from address
      const thumbnailUrl = `${API_URL}/api/thumbnail/${video.address}`;

      return (
        <Animated.View
          key={video.id}
          style={[
            styles.videoItem,
            {
              transform: [
                { translateX: x + offsetX },
                { translateY: y + offsetY },
                { scale: video.scale }
              ],
              opacity: video.opacity,
              width: displaySize,
              height: displaySize,
              borderRadius: displaySize / 2,
              zIndex: Math.floor((1 - video.parallaxFactor) * 10),
            }
          ]}
        >
          <TouchableOpacity
            onPress={() => handleVideoFocus(video)}
            activeOpacity={0.7}
            style={styles.videoTouchable}
          >
            <Image
              source={{ uri: thumbnailUrl }}
              style={styles.videoThumbnail}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </Animated.View>
      );
    });
  }, [videos, canvasStore, handleVideoFocus, forceRender]);

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

    // Construct video source URL directly from address
    const videoSource = `${API_URL}/api/video/${focusedVideo.address}`;

    return (
      <View style={styles.focusedVideoOuterContainer}>
        <View style={{marginBottom: 20}}>
          <Button title="Hide" onPress={() => setFocusedVideoId(null)} style={{width: 120}} />
        </View>

        <View style={styles.focusedVideoContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setFocusedVideoId(null)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.videoPlayerContainer}>
            <VideoNote
              videoSource={videoSource}
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
          onPress={() => console.log("Mint pressed")}
          title="Mint"
        />
      </View>
    );
  }, [focusedVideo]);

  // Screen for events
  const screenProps = {
    ...panResponderRef.current?.panHandlers,
    onWheel: handleWheel,
    style: styles.container,
  };

  return (
    <View style={{...StyleSheet.absoluteFillObject}}>
      {!isWalletConnected ? (
        <GloriousButton
          style={styles.gloriousButton}
            onPress={openWalletConnect}
            title="Connect Wallet"
          />
        ) : (
          <GloriousButton
            style={styles.gloriousButton}
            onPress={() => console.log("Mint pressed")}
            title="Mint"
          />
        )}

     <SafeAreaView style={styles.container}>
      <View {...screenProps}>
        {/* Render only visible videos */}
        {renderVideos()}

        {/* Focused video overlay */}
        {focusedVideoId && renderFocusedVideoOverlay()}

        {/* Loading state */}
        {videos.length === 0 && !allVideosLoaded && (
          <View style={styles.noVideosContainer}>
            <Text style={styles.noVideosText}>Loading videos...</Text>
          </View>
        )}

        {/* No videos state */}
        {videos.length === 0 && allVideosLoaded && (
          <View style={styles.noVideosContainer}>
            <Text style={styles.noVideosText}>No videos available</Text>
            <Button
              title="Retry"
              onPress={() => {
                setAllVideosLoaded(false);
                processedAddressesRef.current.clear();
                occupiedAreasRef.current.clear();
                loadVideos();
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
    backgroundColor: "#333",
  },
  videoTouchable: {
    width: "100%",
    height: "100%",
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
