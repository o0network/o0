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
  ActivityIndicator,
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

// Canvas and video configuration
const ITEM_SIZE = 180;
const FOCUSED_VIDEO_MAX_SIZE = Math.min(512, screenWidth - 40);
const ANIMATION_DURATION = 350;
const LOAD_BATCH_SIZE = 10;
const VIEWPORT_PADDING = 300;
const GRID_CELL_SIZE = ITEM_SIZE * 1.5; // Prevent video overlap in center
const SIGNIFICANT_MOVEMENT_THRESHOLD = 150;
const MIN_VISIBLE_VIDEOS_THRESHOLD = 8;

// Calculate initial videos needed to cover screen with Y grid pattern
const calculateInitialVideoCount = (): number => {
  // Calculate the diagonal distance from center to corner
  const diagonal = Math.sqrt(screenWidth * screenWidth + screenHeight * screenHeight) / 2;

  // Calculate how many rings we need to cover this distance in Y grid
  const ringsNeeded = Math.ceil(diagonal / (GRID_CELL_SIZE * 0.866)); // 0.866 = sin(60°) for Y grid

  // Calculate total videos in Y grid pattern up to needed rings
  // Center = 1 video
  // Ring 1 = 6 videos
  // Ring n = 6 * n videos
  let totalVideos = 1; // center video
  for (let ring = 1; ring <= ringsNeeded + 2; ring++) { // Add 2 more rings for broader initial coverage
    totalVideos += 6 * ring;
  }

  return Math.min(Math.max(totalVideos, MIN_VISIBLE_VIDEOS_THRESHOLD), 100); // Cap at 100 initial points
};

const INITIAL_GRID_POINTS_COUNT = calculateInitialVideoCount();

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

// Y Grid generator for hexagonal/triangular grid positioning
class YGridGenerator {
  private currentRing = 0;
  private currentPosition = 0;
  private center = { x: screenWidth / 2, y: screenHeight / 2 };
  private readonly rowHeight = GRID_CELL_SIZE * 0.866; // sin(60°) for Y grid spacing

  // Generate next position in Y grid pattern (hexagonal)
  getNextPosition(): { x: number; y: number; cellKey: string; ring: number; position: number } {
    if (this.currentRing === 0) {
      // Center position
      const centerData = {
        x: this.center.x,
        y: this.center.y,
        cellKey: "0,0",
        ring: 0,
        position: 0
      };
      this.currentRing = 1;
      this.currentPosition = 0;
      return centerData;
    }

    const positionsInRing = this.currentRing * 6;
    if (this.currentPosition >= positionsInRing) {
      // Move to next ring
      this.currentRing++;
      this.currentPosition = 0;
      // Fall through to calculate position for the new ring and position 0
    }

    // Capture the ring and position for the current item *before* calculating its x,y
    // and *before* potentially incrementing currentPosition for the *next* call.
    const ringForCurrentItem = this.currentRing;
    const positionForCurrentItem = this.currentPosition;

    // Calculate angle for current position in the current ring
    // Note: positionsInRing here must be for ringForCurrentItem
    const currentRingPositions = ringForCurrentItem * 6;
    const angleStep = (2 * Math.PI) / currentRingPositions;
    const angle = positionForCurrentItem * angleStep;

    const ringRadius = ringForCurrentItem * GRID_CELL_SIZE;
    const isOddRing = ringForCurrentItem % 2 === 1;
    const offsetAngle = isOddRing ? 0 : angleStep / 2;

    const x = this.center.x + ringRadius * Math.cos(angle + offsetAngle);
    const y = this.center.y + ringRadius * Math.sin(angle + offsetAngle);

    const cellKey = `${ringForCurrentItem},${positionForCurrentItem}`;

    // Increment for the *next* call to getNextPosition
    this.currentPosition++;

    return { x, y, cellKey, ring: ringForCurrentItem, position: positionForCurrentItem };
  }

  // Reset generator to start from beginning
  reset() {
    this.currentRing = 0;
    this.currentPosition = 0;
  }

  // Get a specific position by ring and position (for video reuse)
  getPositionAt(ring: number, position: number): { x: number; y: number; cellKey: string } {
    if (ring === 0) {
      return {
        x: this.center.x,
        y: this.center.y,
        cellKey: "0,0"
      };
    }

    const positionsInRing = ring * 6;
    const normalizedPosition = position % positionsInRing;

    const angleStep = (2 * Math.PI) / positionsInRing;
    const angle = normalizedPosition * angleStep;

    const ringRadius = ring * GRID_CELL_SIZE;
    const isOddRing = ring % 2 === 1;
    const offsetAngle = isOddRing ? 0 : angleStep / 2;

    const x = this.center.x + ringRadius * Math.cos(angle + offsetAngle);
    const y = this.center.y + ringRadius * Math.sin(angle + offsetAngle);

    return { x, y, cellKey: `${ring},${normalizedPosition}` };
  }

  setCenter(x: number, y: number) {
    this.center = { x, y };
  }
}

// Canvas Store for managing viewport and coordinates with Y grid support
class CanvasStore {
  private static instance: CanvasStore;
  private _shouldRender = true;
  private _camera = { x: 0, y: 0, scale: 1 };
  private _viewport = { width: 0, height: 0 };
  private _lastPosition = { x: 0, y: 0 };
  private _lastRenderPosition = { x: 0, y: 0 };

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
    this._lastRenderPosition = { x: 0, y: 0 };
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

  hasMovedSignificantly(threshold = SIGNIFICANT_MOVEMENT_THRESHOLD) {
    const dx = Math.abs(this._camera.x - this._lastPosition.x);
    const dy = Math.abs(this._camera.y - this._lastPosition.y);
    return dx > threshold || dy > threshold;
  }

  hasMovedSinceLastRender(threshold = 5) {
    const dx = Math.abs(this._camera.x - this._lastRenderPosition.x);
    const dy = Math.abs(this._camera.y - this._lastRenderPosition.y);
    return dx > threshold || dy > threshold;
  }

  updateLastPosition() {
    this._lastPosition = { x: this._camera.x, y: this._camera.y };
  }

  updateLastRenderPosition() {
    this._lastRenderPosition = { x: this._camera.x, y: this._camera.y };
  }

  get visibleRect() {
    return {
      left: -this._camera.x / this._camera.scale,
      top: -this._camera.y / this._camera.scale,
      width: this._viewport.width / this._camera.scale,
      height: this._viewport.height / this._camera.scale,
    };
  }

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

  moveCamera(dx: number, dy: number) {
    this._camera.x += dx;
    this._camera.y += dy;
    this._shouldRender = true;
  }

  centerOn(x: number, y: number) {
    this._camera.x = this._viewport.width / 2 - x * this._camera.scale;
    this._camera.y = this._viewport.height / 2 - y * this._camera.scale;
    this._shouldRender = true;
  }

  // Enhanced parallax calculation for Y grid pattern
  worldToScreenWithParallax(x: number, y: number, parallaxFactor: number) {
    // Enhanced parallax with edge effects
    const parallaxStrength = 0.75; // New: Consistent strength, adjust as needed

    const parallaxX = x - (this._camera.x * parallaxFactor * parallaxStrength);
    const parallaxY = y - (this._camera.y * parallaxFactor * parallaxStrength);

    return {
      x: parallaxX * this._camera.scale + this._camera.x,
      y: parallaxY * this._camera.scale + this._camera.y,
    };
  }

  worldToScreen(x: number, y: number) {
    return {
      x: x * this._camera.scale + this._camera.x,
      y: y * this._camera.scale + this._camera.y,
    };
  }

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
  cellKey: string;
  ring: number;
  position: number;
  numericStats: {
    minted: number;
    price: number;
    value: number;
  };
  loaded: boolean;
};

type GridPoint = {
  id: string; // Unique ID for the grid slot
  x: number;
  y: number;
  cellKey: string;
  ring: number;
  position: number;
  videoData?: VideoItem; // Video data will be attached here
  isPlaceholder: boolean; // True if it's just a placeholder
  isVisibleOnScreen: boolean; // Track if this point is currently visible
}

export default function ExploreScreen({
  initialAddress,
}: {
  initialAddress?: string | null;
}) {
  const route = useRoute<RouteProp<Record<string, { address?: string }>, string>>();
  const routeAddress = route.params?.address;

  // Use routeAddress (from URL) as priority, fall back to initialAddress prop
  const addressFromUrl = routeAddress || initialAddress;

  const isFocused = useIsFocused();
  const canvasStore = useMemo(() => CanvasStore.getInstance(), []);
  const yGridGenerator = useMemo(() => new YGridGenerator(), []);

  const { isWalletConnected } = useAuth();
  const { openWalletConnect } = useModal();

  // Refs and state
  const panResponderRef = useRef<PanResponderInstance | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTouchRef = useRef({ x: 0, y: 0 });
  const processedAddressesRef = useRef<Set<string>>(new Set());
  const apiVideosRef = useRef<VideoData[]>([]);
  const maxRelevanceRef = useRef<number>(1);
  const currentOffsetRef = useRef<number>(0);
  const occupiedCellsRef = useRef<Set<string>>(new Set());
  const lastLoadTimeRef = useRef<number>(0);
  const isUserInteractingRef = useRef<boolean>(false);
  const initialLoadCompleteRef = useRef<boolean>(false);
  const exploredAreasRef = useRef<Set<string>>(new Set());
  const nextGridPositionRef = useRef<{ ring: number; position: number }>({ ring: 0, position: 0 });
  const dynamicThresholdRef = useRef<number>(MIN_VISIBLE_VIDEOS_THRESHOLD);
  const velocityRef = useRef({ x: 0, y: 0 }); // For inertia
  const inertiaActiveRef = useRef(false); // To track if inertia animation is running
  const initialGridPointsRef = useRef<GridPoint[]>([]); // Store precalculated grid points

  const [gridItems, setGridItems] = useState<GridPoint[]>([]);
  const [focusedVideoId, setFocusedVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiExhausted, setApiExhausted] = useState(false);
  const [forceRender, setForceRender] = useState(0);
  const [canInteract, setCanInteract] = useState(true);

  // Find focused video
  const focusedVideo = useMemo(() => {
    // Find the grid item that contains the focused video
    const focusedGridItem = gridItems.find(item => item.videoData?.id === focusedVideoId);
    return focusedGridItem?.videoData;
  }, [gridItems, focusedVideoId]);

  // Get current area key based on camera position
  const getCurrentAreaKey = useCallback(() => {
    const { left, top } = canvasStore.visibleRect;
    const areaSize = GRID_CELL_SIZE * 2;
    const areaX = Math.floor(left / areaSize);
    const areaY = Math.floor(top / areaSize);
    return `${areaX},${areaY}`;
  }, [canvasStore]);

  // Check if we're exploring a new area
  const isExploringNewArea = useCallback(() => {
    const currentArea = getCurrentAreaKey();
    return !exploredAreasRef.current.has(currentArea);
  }, [getCurrentAreaKey]);

  // Mark current area as explored and increase dynamic threshold
  const markAreaAsExplored = useCallback(() => {
    const currentArea = getCurrentAreaKey();
    exploredAreasRef.current.add(currentArea);

    // Increase dynamic threshold based on exploration
    const exploredCount = exploredAreasRef.current.size;
    dynamicThresholdRef.current = MIN_VISIBLE_VIDEOS_THRESHOLD + Math.floor(exploredCount / 5);

    console.log('Marked area as explored:', currentArea, 'New threshold:', dynamicThresholdRef.current);
  }, [getCurrentAreaKey]);

  // Get next available grid position for video reuse
  const getNextGridPosition = useCallback((): { x: number; y: number; cellKey: string; ring: number; position: number } => {
    const { ring, position } = nextGridPositionRef.current;
    // This function remains largely the same, but its usage will change.
    // It will be used to generate new points if we expand beyond the initial set.

    // Get position from Y grid generator
    let gridPosition;
    if (ring === 0 && position === 0) {
      gridPosition = yGridGenerator.getNextPosition();
      nextGridPositionRef.current = { ring: 1, position: 0 };
    } else {
      gridPosition = yGridGenerator.getPositionAt(ring, position);

      // Advance to next position
      const positionsInRing = ring * 6;
      if (position + 1 >= positionsInRing) {
        // Move to next ring
        nextGridPositionRef.current = { ring: ring + 1, position: 0 };
      } else {
        nextGridPositionRef.current = { ring, position: position + 1 };
      }
    }

    return {
      ...gridPosition,
      ring,
      position
    };
  }, [yGridGenerator]);

  // Create video item from video data with Y grid positioning
  const createVideoItem = useCallback((video: VideoData, gridPoint: GridPoint): VideoItem => {
    // Parse stats
    const mintedCount = parseMinted(video.stats?.minted);
    const price = parseNumericStat(video.stats?.price);
    const value = parseNumericStat(video.stats?.value);

    // Calculate relevance (can be tied to stats later)
    let relevance = mintedCount || price || value || Math.random();
    if (relevance === 0) relevance = Math.random() * 0.5; // Ensure some relevance

    if (relevance > maxRelevanceRef.current) {
      maxRelevanceRef.current = relevance;
    }

    const minSize = ITEM_SIZE * 0.8;
    const maxSize = ITEM_SIZE * 1.2;
    const normalizedRelevance = maxRelevanceRef.current > 0 ? relevance / maxRelevanceRef.current : 0.5;
    const size = minSize + normalizedRelevance * (maxSize - minSize);

    const maxParallax = 0.9;
    const minParallax = 0.2;
    const parallaxFactor = maxParallax - (normalizedRelevance * (maxParallax - minParallax));

    const source = `/api/video/${video.address}`;
    const thumbnailUrl = `/api/thumbnail/${video.address}`;
    const uniqueId = `${video.address}-${gridPoint.id}`;

    // console.log(`Creating VideoItem ${uniqueId} for GridPoint ${gridPoint.id} at (${gridPoint.x}, ${gridPoint.y})`);

    return {
      ...video,
      id: uniqueId,
      x: gridPoint.x, // Use grid point coordinates
      y: gridPoint.y, // Use grid point coordinates
      relevance,
      size,
      scale: new Animated.Value(0), // Initial scale for animation
      opacity: new Animated.Value(0), // Initial opacity for animation
      source,
      thumbnailUrl,
      parallaxFactor,
      cellKey: gridPoint.cellKey,
      ring: gridPoint.ring,
      position: gridPoint.position,
      numericStats: {
        minted: mintedCount,
        price,
        value
      },
      loaded: false,
    };
  }, [maxRelevanceRef]);

  // Abstract video loading from API or reuse existing videos
  const getVideosFromSource = useCallback(async (batchSize: number): Promise<VideoData[]> => {
    if (!apiExhausted) {
      // Try API first
      const fetchedVideos = await ApiService.fetchVideos(batchSize, currentOffsetRef.current);
      if (fetchedVideos.length === 0) {
        console.log("API exhausted, will reuse existing videos");
        setApiExhausted(true);

        // Return existing videos for reuse
        const availableVideos = apiVideosRef.current;
        if (availableVideos.length === 0) return [];

        // Select random videos for reuse
        const reusedVideos = [];
        for (let i = 0; i < batchSize; i++) {
          const randomIndex = Math.floor(Math.random() * availableVideos.length);
          reusedVideos.push(availableVideos[randomIndex]);
        }
        return reusedVideos;
      } else {
        // Add new videos to cache
        fetchedVideos.forEach(video => {
          if (!apiVideosRef.current.find(v => v.address === video.address)) {
            apiVideosRef.current.push(video);
          }
        });
        currentOffsetRef.current += fetchedVideos.length;
        return fetchedVideos;
      }
    } else {
      // Reuse existing videos
      const availableVideos = apiVideosRef.current;
      if (availableVideos.length === 0) return [];

      const reusedVideos = [];
      for (let i = 0; i < batchSize; i++) {
        const randomIndex = Math.floor(Math.random() * availableVideos.length);
        reusedVideos.push(availableVideos[randomIndex]);
      }
      return reusedVideos;
    }
  }, [apiExhausted]);

  // Load videos from source (API or reuse existing)
  const loadVideos = useCallback(async (pointsToFill: GridPoint[]): Promise<void> => {
    if (isLoading || pointsToFill.length === 0) return Promise.resolve();

    console.log(`loadVideos called to fill ${pointsToFill.length} grid points`);
    setIsLoading(true);

    try {
      const batchSize = pointsToFill.length;
      const sourceVideos = await getVideosFromSource(batchSize);
      console.log(`Got ${sourceVideos.length} videos from source (API exhausted: ${apiExhausted})`);

      if (sourceVideos.length === 0) {
        setIsLoading(false);
        return Promise.resolve();
      }

      const updatedGridItems: GridPoint[] = [];
      const videosToAnimate: VideoItem[] = [];

      // Map fetched videos to the grid points that need filling
      sourceVideos.forEach((videoData, index) => {
        const pointToFill = pointsToFill[index];
        if (pointToFill && !processedAddressesRef.current.has(videoData.address)) {
          const newVideoItem = createVideoItem(videoData, pointToFill);

          // Prefetch thumbnail
          if (newVideoItem.thumbnailUrl) {
            Image.prefetch(newVideoItem.thumbnailUrl).catch(() => {});
          }

          updatedGridItems.push({
            ...pointToFill,
            videoData: newVideoItem,
            isPlaceholder: false,
          });
          videosToAnimate.push(newVideoItem);

          if (!apiExhausted) {
            processedAddressesRef.current.add(videoData.address);
          }
        } else if (pointToFill && apiExhausted) { // Handle reuse for exhausted API
          // If API is exhausted, we are reusing. Allow creating item even if address was processed.
           const newVideoItem = createVideoItem(videoData, pointToFill); // isReuse is implicitly true
           if (newVideoItem.thumbnailUrl) {
             Image.prefetch(newVideoItem.thumbnailUrl).catch(() => {});
           }
           updatedGridItems.push({
             ...pointToFill,
             videoData: newVideoItem,
             isPlaceholder: false,
           });
           videosToAnimate.push(newVideoItem);
        }
      });

      if (updatedGridItems.length > 0) {
        setGridItems(prevItems => {
          const newItemsMap = new Map(updatedGridItems.map(item => [item.id, item]));
          return prevItems.map(item => newItemsMap.get(item.id) || item);
        });

        // Animate videos appearing with spring effect
        videosToAnimate.forEach(video => {
          Animated.parallel([
            Animated.spring(video.scale, {
              toValue: 1,
              friction: 8,
              tension: 50,
              useNativeDriver: true
            }),
            Animated.timing(video.opacity, {
              toValue: 1,
              duration: ANIMATION_DURATION,
              useNativeDriver: true
            })
          ]).start();
        });
      }

      // No explicit initialLoadCompleteRef.current = true; here, driven by grid points now
      // markAreaAsExplored(); // This might need rethinking or to be called differently

    } catch (error) {
      console.error("Error loading videos:", error);
    } finally {
      setIsLoading(false);
    }

    return Promise.resolve();
  }, [isLoading, apiExhausted, getVideosFromSource, createVideoItem]);

  // Check if we need to load more videos with dynamic threshold
  const checkLoadMoreVideos = useCallback(() => {
    if (isLoading || !initialLoadCompleteRef.current) { // Keep initialLoadCompleteRef for now
      return;
    }

    const now = Date.now();
    if (now - lastLoadTimeRef.current < 2000) { // Cooldown
      return;
    }

    const visibleEmptyGridPoints = gridItems.filter(item =>
      item.isPlaceholder &&
      item.isVisibleOnScreen && // A new flag we need to set in the render loop or similar
      canvasStore.isVisible(item.x, item.y, ITEM_SIZE) // Double check with canvasStore
    );

    // Prioritize filling visible empty grid points
    if (visibleEmptyGridPoints.length > 0) {
      console.log(`Found ${visibleEmptyGridPoints.length} visible empty grid points to fill.`);
      lastLoadTimeRef.current = now;
      loadVideos(visibleEmptyGridPoints.slice(0, LOAD_BATCH_SIZE)); // Load for a batch of them
      return; // Prioritize this load
    }

    // Original logic for exploring new areas can be adapted if needed,
    // but the primary driver now is filling visible empty grid slots.
    // For now, we simplify: if many grid points are visible and empty, load them.

    // If user is interacting and exploring new areas, and we have capacity:
    if (isUserInteractingRef.current && isExploringNewArea()) {
        const allEmptyGridPoints = gridItems.filter(item => item.isPlaceholder);
        if (allEmptyGridPoints.length > LOAD_BATCH_SIZE * 2) { // Check if we have a good buffer of empty points
            console.log("Exploring new area, proactively loading for distant grid points");
            // This part needs more refinement: which points to load?
            // For now, let's just load for the first few empty ones as a placeholder for this logic
            loadVideos(allEmptyGridPoints.slice(0, LOAD_BATCH_SIZE));
            markAreaAsExplored();
            lastLoadTimeRef.current = now;
        }
    }

  }, [gridItems, canvasStore, isLoading, loadVideos, isExploringNewArea, markAreaAsExplored]);

  // Handle video focus with canvas interaction control
  const handleVideoFocus = useCallback((videoItem: VideoItem, options?: { preserveUrl?: boolean }) => {
    const preserveUrlOnFocus = options?.preserveUrl || false;

    if (focusedVideoId === videoItem.id) {
      // Unfocus video
      setFocusedVideoId(null);
      setCanInteract(true);

      gridItems.forEach(item => {
        if (item.videoData) {
          Animated.parallel([
            Animated.spring(item.videoData.scale, {
              toValue: 1,
              friction: 8,
              tension: 50,
              useNativeDriver: true
            }),
            Animated.spring(item.videoData.opacity, {
              toValue: 1,
              friction: 8,
              tension: 50,
              useNativeDriver: true
            })
          ]).start();
        }
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
    canvasStore.centerOn(videoItem.x, videoItem.y);
    setForceRender(prev => prev + 1);

    gridItems.forEach(item => {
      if (item.videoData) {
        const isFocusedItem = item.videoData.id === videoItem.id;
        Animated.parallel([
          Animated.spring(item.videoData.scale, {
            toValue: isFocusedItem ? 1.5 : 0,
            friction: 8,
            tension: 50,
            useNativeDriver: true
          }),
          Animated.spring(item.videoData.opacity, {
            toValue: isFocusedItem ? 1 : 0,
            friction: 8,
            tension: 50,
            useNativeDriver: true
          })
        ]).start();
      }
    });

    if (Platform.OS === 'web') {
      if (videoItem.address) {
        const targetPath = `${EXPLORE_PATH}/${encodeURIComponent(videoItem.address)}`;
        window.history.replaceState({}, "", targetPath);
      }
    }
  }, [gridItems, focusedVideoId, canvasStore]);

  // Initialize canvas and setup interactions
  useEffect(() => {
    // Prevent multiple initial loads
    if (initialLoadCompleteRef.current) {
      console.log('Initial load already completed, skipping');
      return;
    }

    console.log('Initializing Y grid canvas with precalculated points...');
    canvasStore.initialize(screenWidth, screenHeight);
    yGridGenerator.reset(); // Ensure generator starts from center

    // Pre-calculate initial grid points
    const points: GridPoint[] = [];
    for (let i = 0; i < INITIAL_GRID_POINTS_COUNT; i++) {
      const pos = yGridGenerator.getNextPosition();
      points.push({
        id: `grid-${pos.cellKey}-${i}`,
        ...pos,
        isPlaceholder: true,
        isVisibleOnScreen: false, // Initially false
      });
    }
    initialGridPointsRef.current = points;
    setGridItems(points);
    console.log(`Pre-calculated ${points.length} initial grid points. First point: ${points.length > 0 ? JSON.stringify(points[0]) : 'N/A'}`);
    console.log(`CanvasStore visibleRect on init: ${JSON.stringify(canvasStore.visibleRect)}`);

    // Setup pan responder with interaction control
    panResponderRef.current = PanResponder.create({
      onStartShouldSetPanResponder: () => canInteract,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (!canInteract) return false;
        const { dx, dy } = gestureState;
        return Math.abs(dx) > 5 || Math.abs(dy) > 5;
      },
      onPanResponderGrant: (evt) => {
        if (!canInteract) return;
        console.log('User started panning - enabling interaction');
        isUserInteractingRef.current = true;
        lastTouchRef.current = {
          x: evt.nativeEvent.pageX,
          y: evt.nativeEvent.pageY
        };

        if (Platform.OS === 'web') {
          document.body.style.cursor = 'grabbing';
        }
        inertiaActiveRef.current = false; // Stop any ongoing inertia
      },
      onPanResponderMove: (evt, gestureState) => {
        if (!canInteract) return;
        const { pageX, pageY } = evt.nativeEvent;
        const dx = pageX - lastTouchRef.current.x;
        const dy = pageY - lastTouchRef.current.y;

        // Update velocity for inertia calculation
        velocityRef.current = { x: gestureState.vx, y: gestureState.vy };

        // Inverted deltas for natural dragging experience
        canvasStore.moveCamera(dx, dy);
        lastTouchRef.current = { x: pageX, y: pageY };

        // Only trigger rerender if camera moved significantly
        if (canvasStore.hasMovedSinceLastRender()) {
          canvasStore.updateLastRenderPosition();
          setForceRender(prev => prev + 1);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        console.log('User released pan - checking for more videos');
        if (Platform.OS === 'web') {
          document.body.style.cursor = 'grab';
        }

        // Start inertia if velocity is significant
        const { vx, vy } = gestureState;
        const speed = Math.sqrt(vx * vx + vy * vy);
        const decelerationFactor = 0.95; // Adjust for desired slowdown speed

        if (speed > 0.1 && canInteract) { // Check canInteract again
          inertiaActiveRef.current = true;
          velocityRef.current = { x: vx * 20, y: vy * 20 }; // Multiply for noticeable effect

          // Start the inertia animation loop within the main render loop
          // The main render loop will now handle decaying velocity
          canvasStore.shouldRender = true; // Ensure render loop runs
        } else {
          inertiaActiveRef.current = false;
        }

        // Check for more videos after panning
        setTimeout(() => {
          checkLoadMoreVideos();
          // Mark user as not actively interacting after delay
          setTimeout(() => {
            console.log('Setting interaction to false');
            isUserInteractingRef.current = false;
          }, 1000);
        }, 100);
      },
      onPanResponderTerminate: () => {
        console.log('Pan responder terminated');
        isUserInteractingRef.current = false;
        if (Platform.OS === 'web') {
          document.body.style.cursor = 'grab';
        }
      }
    });

    // Setup optimized render loop
    const startRenderLoop = () => {
      const frame = () => {
        let movedByInertia = false;
        if (inertiaActiveRef.current && canInteract) {
          const decay = 0.95;
          velocityRef.current.x *= decay;
          velocityRef.current.y *= decay;

          if (Math.abs(velocityRef.current.x) < 0.1 && Math.abs(velocityRef.current.y) < 0.1) {
            inertiaActiveRef.current = false;
          } else {
            canvasStore.moveCamera(velocityRef.current.x, velocityRef.current.y);
            movedByInertia = true;
          }
        }

        let visibilityChangedThisFrame = false;
        setGridItems(currentGridItems => {
          let changed = false;
          const updatedItems = currentGridItems.map(item => {
            const currentlyVisible = canvasStore.isVisible(item.x, item.y, ITEM_SIZE);
            if (item.isVisibleOnScreen !== currentlyVisible) {
              changed = true;
              return { ...item, isVisibleOnScreen: currentlyVisible };
            }
            return item;
          });

          if (changed) {
            visibilityChangedThisFrame = true;
            return updatedItems;
          }
          return currentGridItems;
        });

        // Determine if a visual re-render is needed
        const cameraMovedSignificantly = canvasStore.hasMovedSinceLastRender();
        const explicitRenderRequest = canvasStore.shouldRender;

        if (movedByInertia || explicitRenderRequest || (visibilityChangedThisFrame && !cameraMovedSignificantly)) {
          // ^ If visibility changed but camera didn't move significantly beyond its last render pos,
          // setGridItems handles re-render. But if camera also moved, or explicit request, force it.
          // The condition `(visibilityChangedThisFrame && !cameraMovedSignificantly)` ensures that if visibility changes
          // and the camera *hasn't* moved since last render, we still consider updating last render position
          // if this visibility change warrants a new visual state that should be considered "rendered".
          // However, setGridItems should trigger a render on its own for visibility changes.
          // Let's simplify: if camera moved or was asked to render, then update and forceRender.
          // Visibility changes triggering setGridItems will cause their own render pass.
          if (cameraMovedSignificantly || explicitRenderRequest) {
             canvasStore.updateLastRenderPosition();
             setForceRender(prev => prev + 1);
             canvasStore.shouldRender = false;
          } else if (movedByInertia) {
            // Inertia moved the camera, but maybe not beyond hasMovedSinceLastRender() threshold yet
            // still, visually it has changed, so update render position and force a render.
            canvasStore.updateLastRenderPosition();
            setForceRender(prev => prev + 1);
          }
        }

        rafRef.current = requestAnimationFrame(frame);
      };
      rafRef.current = requestAnimationFrame(frame);
    };

    startRenderLoop();

    // Load initial videos for currently visible grid points
    console.log('Loading initial videos for visible grid points');
    lastLoadTimeRef.current = Date.now();
    isUserInteractingRef.current = true; // Simulate interaction for initial load trigger

    // Determine initially visible points and load them
    console.log('Determining initially visible points...');
    const initiallyVisiblePoints = points.filter(p => {
      const isVis = canvasStore.isVisible(p.x, p.y, ITEM_SIZE);
      // console.log(`Point ${p.id} at (${p.x}, ${p.y}) - visible: ${isVis}`); // Optional: very verbose
      return isVis;
    });
    console.log(`Found ${initiallyVisiblePoints.length} initially visible grid points.`);

    if (initiallyVisiblePoints.length > 0) {
        loadVideos(initiallyVisiblePoints.slice(0, LOAD_BATCH_SIZE * 2)).then(() => {
            initialLoadCompleteRef.current = true; // Mark initial setup as complete
            markAreaAsExplored();
            console.log('Initial video data load for visible points complete');
            setTimeout(() => { isUserInteractingRef.current = false; }, 500);
        });
    } else {
        // If no points are initially visible (e.g. grid starts far off), still mark complete
        initialLoadCompleteRef.current = true;
        markAreaAsExplored();
        console.log('No grid points initially visible, initial setup complete.');
        setTimeout(() => { isUserInteractingRef.current = false; }, 500);
    }

    if (Platform.OS === 'web') {
      document.body.style.cursor = 'grab';
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (Platform.OS === 'web') {
        document.body.style.cursor = '';
      }
    };
  }, []); // Empty dependency array to run only once

  // Handle initial address focus
  useEffect(() => {
    if (addressFromUrl && gridItems.length > 0 && !focusedVideoId) {
      const itemToFocus = gridItems.find(item => item.videoData?.address === addressFromUrl);
      if (itemToFocus && itemToFocus.videoData) {
        handleVideoFocus(itemToFocus.videoData, { preserveUrl: true });
      }
    }
  }, [addressFromUrl, gridItems, focusedVideoId, handleVideoFocus]);

  // Handle direct URL navigation - load specific video info
  useEffect(() => {
    if (addressFromUrl && initialLoadCompleteRef.current) {
      const loadSpecificVideo = async () => {
        // Check if the video is already in the grid
        const existingItem = gridItems.find(item => item.videoData?.address === addressFromUrl);
        if (existingItem && existingItem.videoData) {
          handleVideoFocus(existingItem.videoData, { preserveUrl: true });
          return;
        }

        // Load the specific video info from API
        try {
          const videoInfo = await ApiService.getVideoInfo(addressFromUrl);
          if (videoInfo) {
            // Find an empty grid slot to place this video
            const emptySlot = gridItems.find(item => item.isPlaceholder);
            if (emptySlot) {
              const newVideoItem = createVideoItem(videoInfo, emptySlot);

              // Update the grid with the new video
              setGridItems(prevItems =>
                prevItems.map(item =>
                  item.id === emptySlot.id
                    ? { ...emptySlot, videoData: newVideoItem, isPlaceholder: false }
                    : item
                )
              );

              // Animate the video appearing
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
              ]).start(() => {
                // Focus on the video after it's loaded
                handleVideoFocus(newVideoItem, { preserveUrl: true });
              });
            }
          }
        } catch (error) {
          console.error("Error loading specific video:", error);
        }
      };

      loadSpecificVideo();
    }
  }, [addressFromUrl, gridItems, initialLoadCompleteRef.current, handleVideoFocus, createVideoItem]);

  // Handle app focus/unfocus animations
  useEffect(() => {
    if (isFocused) {
      gridItems.forEach(item => {
        if (item.videoData) {
          Animated.parallel([
            Animated.spring(item.videoData.scale, {
              toValue: focusedVideoId === item.videoData.id ? 1.5 : 1,
              friction: 8,
              tension: 50,
              useNativeDriver: true
            }),
            Animated.timing(item.videoData.opacity, {
              toValue: 1,
              duration: ANIMATION_DURATION,
              useNativeDriver: true
            })
          ]).start();
        }
      });
    } else {
      gridItems.forEach(item => {
        if (item.videoData) {
          Animated.parallel([
            Animated.timing(item.videoData.scale, {
              toValue: 0,
              duration: ANIMATION_DURATION / 2,
              useNativeDriver: true
            }),
            Animated.timing(item.videoData.opacity, {
              toValue: 0,
              duration: ANIMATION_DURATION / 2,
              useNativeDriver: true
            })
          ]).start();
        }
      });
    }
  }, [isFocused, gridItems, focusedVideoId]);

  // Render visible videos with enhanced Y grid parallax
  const renderVideos = useCallback(() => {
    const itemsToRender = gridItems.map(item => {
      const isCurrentlyVisible = item.isVisibleOnScreen;
      let displaySize = ITEM_SIZE * canvasStore.camera.scale;
      let videoToRender = item.videoData;

      if (videoToRender) {
        displaySize = videoToRender.size * canvasStore.camera.scale;
      }

      if (!isCurrentlyVisible) {
        return null;
      }

      const { x: screenX, y: screenY } = canvasStore.worldToScreenWithParallax(
        item.x,
        item.y,
        videoToRender ? videoToRender.parallaxFactor : 0.5
      );

      // if (videoToRender) {
      //   console.log(`Rendering ${videoToRender.id} (grid: ${item.id}) at world (${item.x},${item.y}), screen (${screenX},${screenY}), size ${displaySize}`);
      // }

      const thumbnailUrl = videoToRender ? `${API_URL}/api/thumbnail/${videoToRender.address}` : null;

      return (
        <Animated.View
          key={item.id} // Use grid item ID as key
          style={[
            styles.videoItem,
            {
              transform: [
                { translateX: screenX },
                { translateY: screenY },
                // Apply scale from videoData if it exists, otherwise default or placeholder scale
                { scale: videoToRender ? videoToRender.scale : (isCurrentlyVisible ? 1 : 0) }
              ],
              // Apply opacity from videoData if it exists, otherwise default or placeholder opacity
              opacity: videoToRender ? videoToRender.opacity : (isCurrentlyVisible ? 1 : 0),
              width: displaySize,
              height: displaySize,
              borderRadius: displaySize / 2,
              zIndex: Math.floor(100 - item.ring), // Z-index from grid item
              // backgroundColor: videoToRender ? 'transparent' : 'rgba(50,50,50,0.3)', // Placeholder bg
            }
          ]}
        >
          <TouchableOpacity
            onPress={() => videoToRender && handleVideoFocus(videoToRender)}
            activeOpacity={0.7}
            style={styles.videoTouchable}
            disabled={!canInteract || !videoToRender} // Disable if no video or interaction locked
          >
            {item.isPlaceholder && isCurrentlyVisible && (
              <View style={[styles.placeholder, { borderRadius: displaySize / 2 }]} />
            )}
            {videoToRender && thumbnailUrl && (
              <Image
                source={{ uri: thumbnailUrl }}
                style={[
                  styles.videoThumbnail,
                  {
                    opacity: videoToRender.loaded ? 1 : 0,
                    borderRadius: displaySize / 2
                  }
                ]}
                onLoad={() => {
                  // Update loaded state for the specific videoData within the gridItem
                  setGridItems(prevItems => prevItems.map(gi =>
                    gi.id === item.id && gi.videoData
                      ? { ...gi, videoData: { ...gi.videoData, loaded: true } }
                      : gi
                  ));
                }}
              />
            )}
          </TouchableOpacity>
        </Animated.View>
      );
    });

    return itemsToRender.filter(Boolean); // Filter out nulls

  }, [gridItems, canvasStore, handleVideoFocus, forceRender, canInteract]);

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
          {renderVideos()}
          {focusedVideoId && renderFocusedVideoOverlay()}

          {gridItems.filter(item => !item.isPlaceholder).length === 0 && !apiExhausted && (
            <View style={styles.noVideosContainer}>
              <Text style={styles.noVideosText}>Loading videos...</Text>
            </View>
          )}

          {gridItems.filter(item => !item.isPlaceholder).length === 0 && apiExhausted && (
            <View style={styles.noVideosContainer}>
              <Text style={styles.noVideosText}>No videos available</Text>
              <Button
                title="Retry"
                onPress={() => {
                  setApiExhausted(false);
                  processedAddressesRef.current.clear();
                  occupiedCellsRef.current.clear();
                  apiVideosRef.current = [];
                  currentOffsetRef.current = 0;
                  nextGridPositionRef.current = { ring: 0, position: 0 };
                  dynamicThresholdRef.current = MIN_VISIBLE_VIDEOS_THRESHOLD;
                  exploredAreasRef.current.clear();
                  yGridGenerator.reset();
                  // Re-initialize grid points on retry
                  const points: GridPoint[] = [];
                  for (let i = 0; i < INITIAL_GRID_POINTS_COUNT; i++) {
                    const pos = yGridGenerator.getNextPosition();
                    points.push({
                      id: `grid-${pos.cellKey}-${i}`,
                      ...pos,
                      isPlaceholder: true,
                      isVisibleOnScreen: false,
                    });
                  }
                  initialGridPointsRef.current = points;
                  setGridItems(points);
                  initialLoadCompleteRef.current = false; // Allow initial load logic to run again
                  loadVideos(points.filter(p => canvasStore.isVisible(p.x, p.y, ITEM_SIZE)).slice(0, LOAD_BATCH_SIZE*2));
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
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(100, 100, 100, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
