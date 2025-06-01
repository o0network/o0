import { useEffect, useState, useRef, useMemo } from "react";
import { View, StyleSheet, TouchableOpacity, Pressable, Animated, Easing, LayoutChangeEvent, PanResponder, Platform } from "react-native";
import { VideoView, useVideoPlayer, VideoPlayerStatus, PlayerError } from "expo-video";
import { useEventListener } from "expo";
import * as Haptics from "expo-haptics";
import { Text } from "./index";
import Svg, { Circle, Path } from "react-native-svg";
import { usePlatform } from "../contexts/ScreenContext";

// Simplified haptic feedback
const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error', isPlatformFn: (platform: any) => boolean) => {
  if (isPlatformFn('telegram')) {
    const tgHaptic = window.Telegram?.WebApp?.HapticFeedback;
    if (tgHaptic) {
      try {
        switch (type) {
          case 'light':
            tgHaptic.impactOccurred('light');
            break;
          case 'medium':
            tgHaptic.impactOccurred('medium');
            break;
          case 'heavy':
            tgHaptic.impactOccurred('heavy');
            break;
          case 'selection':
            tgHaptic.selectionChanged();
            break;
          case 'success':
            tgHaptic.notificationOccurred('success');
            break;
          case 'warning':
            tgHaptic.notificationOccurred('warning');
            break;
          case 'error':
            tgHaptic.notificationOccurred('error');
            break;
        }
        return;
      } catch (e) {
        console.warn("Telegram HapticFeedback error:", e);
      }
    }
  }

  if (!isPlatformFn('web')) {
    switch (type) {
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'selection':
        Haptics.selectionAsync();
        break;
      case 'success':
      case 'warning':
      case 'error':
        Haptics.notificationAsync(
          type === 'success' ? Haptics.NotificationFeedbackType.Success :
          type === 'warning' ? Haptics.NotificationFeedbackType.Warning :
          Haptics.NotificationFeedbackType.Error
        );
        break;
    }
  }
};

type StatusChangeEventPayload = {
  status: VideoPlayerStatus;
  oldStatus?: VideoPlayerStatus;
  error?: PlayerError;
};

type VideoNoteProps = {
  videoSource: string;
  texts?: string[];
  x?: number;
  y?: number;
  scale?: number;
  transparent?: boolean;
  autoplay?: boolean;
  inverted?: boolean;
};

// Animated SVG component for the circular progress
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function VideoNote({
  videoSource,
  texts = [],
  x = 0,
  y = 0,
  scale = 1,
  transparent = false,
  autoplay = false,
  inverted = false,
}: VideoNoteProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressInternal, setProgressInternal] = useState(0);
  const [layout, setLayout] = useState<{ width: number; height: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { isPlatform } = usePlatform();
  const hasDragged = useRef(false);

  const player = useVideoPlayer(videoSource);

  // Animation values
  const strokeOffsetAnim = useRef(new Animated.Value(0)).current;
  const playIconOpacity = useRef(new Animated.Value(1)).current;
  const thumbOpacity = useRef(new Animated.Value(0)).current;
  // Background ring opacity: visible when paused, hidden when playing
  const bgOpacity = useRef(new Animated.Value(isPlaying ? 0 : 0.6)).current;
  // Track if video was playing when starting seek to resume after scrub
  const isPlayingOnSeek = useRef<boolean>(false);
  const thumbScale = useRef(new Animated.Value(1)).current;

  // Stroke widths for paused vs playing states
  const pausedStrokeWidth = 1.5;
  const playingStrokeWidth = 0.8;
  const currentActualStrokeWidth = isPlaying ? playingStrokeWidth : pausedStrokeWidth;
  // Gaps for paused vs playing
  const pausedGap = 5;
  const playingGap = 0.5;
  // Base radii (distance from center to ring path)
  const baseDrawRadius = 50 - pausedStrokeWidth / 2 - pausedGap;
  const targetPlayRadius = 50 - playingStrokeWidth / 2 - playingGap;
  // Always render at paused radius, scale up for playing
  const radius = baseDrawRadius;
  const circumference = 2 * Math.PI * radius;
  const playScaleFactor = targetPlayRadius / baseDrawRadius;
  const scaleAnim = useRef(new Animated.Value(isPlaying ? playScaleFactor : 1)).current;

  useEventListener(player, "statusChange", (event: StatusChangeEventPayload) => {
    if (event.status === "error" && event.error) {
      console.error(
        "VideoPlayer Error:",
        event.error.message,
        "for source:",
        videoSource
      );
      setError(event.error.message);
    } else if (event.status === "readyToPlay") {
      setError(null);
      if (autoplay && player && !isPlaying) {
        setIsPlaying(true);
      }
    }
  });

  // Configure player once
  useEffect(() => {
    if (!player) return;
    player.muted = false;
    player.timeUpdateEventInterval = 0.1;
  }, [player]);

  // Update progressInternal from timeUpdate events
  useEventListener(player, "timeUpdate", ({ currentTime }: any) => {
    if (isSeeking.current) return;
    const duration = player.duration ?? 0;
    setProgressInternal(duration > 0 ? currentTime / duration : 0);
  });

  // Play/pause side effect
  useEffect(() => {
    if (!player) return;
    if (isPlaying) player.play();
    else player.pause();
  }, [player, isPlaying]);

  // Initialize stroke offset based on initial progress
  useEffect(() => {
    strokeOffsetAnim.setValue(circumference * (1 - progressInternal));
  }, []);

  // Play/pause animation effects
  useEffect(() => {
    const playIconAnim = Animated.timing(playIconOpacity, {
      toValue: isPlaying ? 0 : 1,
      duration: 200,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    });

    const thumbAnim = Animated.timing(thumbOpacity, {
      toValue: isPlaying ? 0 : 1,
      duration: 200,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    });

    // Animate background ring opacity: hide when playing, show when paused
    const bgAnim = Animated.timing(bgOpacity, {
      toValue: isPlaying ? 0 : 0.6,
      duration: 200,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    });

    // Animate gap by scaling the ring
    const scaleAnimAnim = Animated.timing(scaleAnim, {
      toValue: isPlaying ? playScaleFactor : 1,
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    });

    Animated.parallel([playIconAnim, thumbAnim, bgAnim, scaleAnimAnim]).start();
  }, [isPlaying]);

  // PanResponder for click/drag on ring
  const isSeeking = useRef(false);
  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => {
      if (!layout || layout.width === 0) return false;

      const { locationX, locationY } = evt.nativeEvent;
      const viewCenterX = layout.width / 2;
      const viewCenterY = layout.height / 2;

      // Normalize touch coordinates to a 0-100 SVG-like coordinate system
      // where 50,50 is the center of the SVG.
      // This helps handle non-square views by normalizing to the smaller dimension
      // for radius calculations, or by using separate unitX/unitY.
      // For simplicity here, assuming square hit area or using width as primary.
      const svgUnit = layout.width / 100; // Assumes SVG viewBox 0 0 100 100

      const touchNormalizedX = (locationX - viewCenterX) / svgUnit;
      const touchNormalizedY = (locationY - viewCenterY) / svgUnit;
      const touchDistFromCenter = Math.sqrt(touchNormalizedX * touchNormalizedX + touchNormalizedY * touchNormalizedY);

      // Current visual state of the ring
      const currentScale = isPlaying ? playScaleFactor : 1;
      const visualRadius = baseDrawRadius * currentScale;
      const visualStrokeWidth = (isPlaying ? playingStrokeWidth : pausedStrokeWidth) * currentScale;

      // Allow touch if it's within 1.5x the visual stroke width from the ring's centerline
      const hitTolerance = visualStrokeWidth * 1.5;
      return Math.abs(touchDistFromCenter - visualRadius) <= hitTolerance;
    },
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      // Same logic as onStartShouldSetPanResponder for now
      // Could be optimized, e.g., if already granted, just check gestureState.dx/dy
      if (!layout || layout.width === 0) return false;
      const { locationX, locationY } = evt.nativeEvent;
      const viewCenterX = layout.width / 2;
      const viewCenterY = layout.height / 2;
      const svgUnit = layout.width / 100;
      const touchNormalizedX = (locationX - viewCenterX) / svgUnit;
      const touchNormalizedY = (locationY - viewCenterY) / svgUnit;
      const touchDistFromCenter = Math.sqrt(touchNormalizedX * touchNormalizedX + touchNormalizedY * touchNormalizedY);
      const currentScale = isPlaying ? playScaleFactor : 1;
      const visualRadius = baseDrawRadius * currentScale;
      const visualStrokeWidth = (isPlaying ? playingStrokeWidth : pausedStrokeWidth) * currentScale;
      const hitTolerance = visualStrokeWidth * 1.5;
      return Math.abs(touchDistFromCenter - visualRadius) <= hitTolerance;
    },
      onPanResponderGrant: (e) => {
      hasDragged.current = true;
      // Pause playback for frame-by-frame seeking
      isPlayingOnSeek.current = isPlaying;
      if (isPlayingOnSeek.current) setIsPlaying(false);
      isSeeking.current = true;
      setIsDragging(true);

      // Haptic feedback
      triggerHaptic('light', isPlatform);

      // Scale up thumb for better visibility while dragging
      Animated.spring(thumbScale, {
        toValue: 1.5,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();

      // Show thumb immediately when starting to drag
      Animated.timing(thumbOpacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();

      strokeOffsetAnim.stopAnimation();
      handleSeek(e.nativeEvent, false);
      },
      onPanResponderMove: (e) => {
      handleSeek(e.nativeEvent, false);
      },
      onPanResponderRelease: (e) => {
      handleSeek(e.nativeEvent, true);
        isSeeking.current = false;
      setIsDragging(false);
      // Resume playback if it was playing before seeking, but only on mobile
      if (!isPlatform('web')) {
        // On mobile: resume if it was playing before
        if (isPlayingOnSeek.current) {
          setIsPlaying(true);
        }
      } else {
        // On web: always ensure video is paused after progress bar interaction
        setIsPlaying(false);
      }

      // Scale thumb back to normal
      Animated.spring(thumbScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();

      // Hide thumb if playing
      if (isPlaying) {
        Animated.timing(thumbOpacity, {
          toValue: 0,
          duration: 300,
          delay: 500, // Keep visible for a moment after release
          useNativeDriver: true,
        }).start();
      }

      // Haptic feedback
      triggerHaptic('medium', isPlatform);
    },
  }), [layout, isPlaying, playScaleFactor, baseDrawRadius, playingStrokeWidth, pausedStrokeWidth]);

  // Continuous animation for playback progress
  useEffect(() => {
    if (!player || !layout) {
      strokeOffsetAnim.setValue(circumference * (1 - progressInternal));
      return;
    }

    if (isPlaying && !isSeeking.current) {
      const videoDuration = player.duration ?? 0;
      const elapsedVideoTime = progressInternal * videoDuration;
      const remainingMs = Math.max(0, (videoDuration - elapsedVideoTime) * 1000);

      strokeOffsetAnim.setValue(circumference * (1 - progressInternal));

      Animated.timing(strokeOffsetAnim, {
        toValue: 0,
        duration: remainingMs,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    } else if (!isPlaying) {
      strokeOffsetAnim.stopAnimation();
      Animated.timing(strokeOffsetAnim, {
        toValue: circumference * (1 - progressInternal),
        duration: 200,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: false,
      }).start();
    }
  }, [isPlaying, progressInternal, player, layout, circumference, strokeOffsetAnim]);

  // Shared seek handler
  const handleSeek = (nativeEvent: any, commit: boolean) => {
    if (!layout || !player) return;
    const { locationX, locationY } = nativeEvent;

    const centerX = layout.width / 2;
    const centerY = layout.height / 2;

    const dx = locationX - centerX;
    const dy = locationY - centerY;

    let angle = Math.atan2(dy, dx);
    let progress = (angle + Math.PI / 2) / (2 * Math.PI);
    if (progress < 0) progress += 1;
    if (progress > 1) progress -= 1;

    // Smooth animation for visual update
    if (commit) {
      Animated.timing(strokeOffsetAnim, {
        toValue: circumference * (1 - progress),
        duration: 100,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: false,
      }).start();
    } else {
      strokeOffsetAnim.setValue(circumference * (1 - progress));
    }

    setProgressInternal(progress);
    // Always update playback time for real-time scrubbing
    if (player.duration && Number.isFinite(player.duration) && player.duration > 0 && Number.isFinite(progress)) {
      const newTime = progress * player.duration;
      if (Number.isFinite(newTime)) {
        player.currentTime = newTime;
      }
    } else if (progress === 0 && player.duration === 0) {
      // Handle case where video is loaded but duration is 0 (e.g. very short or not fully parsed)
      // and user drags to the beginning.
      player.currentTime = 0;
    }
  };

  const togglePlayPause = () => {
    if (isPlatform('web') && hasDragged.current) {
      hasDragged.current = false;
      return;
    }
    hasDragged.current = false;
    // Haptic feedback
    triggerHaptic('medium', isPlatform);
    setIsPlaying((p) => !p);
  };

  const renderProgressBar = () => {
    if (!layout) return null;

    // Use baseDrawRadius for thumb positioning, as it's inside the scaled container
    const thumbAngle = (2 * Math.PI * progressInternal) - (Math.PI / 2);
    const thumbCx = 50 + baseDrawRadius * Math.cos(thumbAngle);
    const thumbCy = 50 + baseDrawRadius * Math.sin(thumbAngle);

    return (
      <View
        style={styles.progressSvgContainer}
        {...panResponder.panHandlers}
      >
        <Animated.View style={[StyleSheet.absoluteFillObject, { transform: [{ scale: scaleAnim }] }] }>
          <Svg viewBox="0 0 100 100" style={StyleSheet.absoluteFillObject}>
            {/* Background ring */}
            <AnimatedCircle
              cx="50"
              cy="50"
              r={baseDrawRadius}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth={pausedStrokeWidth}
              fill="none"
              opacity={bgOpacity}
            />

            {/* Progress ring */}
          <AnimatedCircle
            cx="50"
            cy="50"
              r={baseDrawRadius}
              stroke="rgba(255, 255, 255, 0.7)"
              strokeWidth={currentActualStrokeWidth}
            fill="none"
              strokeDasharray={[2 * Math.PI * baseDrawRadius, 2 * Math.PI * baseDrawRadius]}
            strokeDashoffset={strokeOffsetAnim}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />

            {/* Static grabber handle */}
          {!isPlaying && (
            <Circle
              cx={thumbCx}
              cy={thumbCy}
                r={2}
                fill="rgba(255, 255, 255, 1)"
              />
            )}

            {/* Thumb dot (the one that scales with drag) */}
            <Animated.View
              style={{
                position: 'absolute',
                left: `${thumbCx}%`,
                top: `${thumbCy}%`,
                transform: [
                  { translateX: -4 },
                  { translateY: -4 },
                  { scale: thumbScale }
                ],
                opacity: thumbOpacity,
              }}
            >
              <Circle
                cx="4"
                cy="4"
                r="4"
                fill="rgba(255, 255, 255, 0.8)"
                stroke="rgba(0, 0, 0, 0.2)"
                strokeWidth="1"
            />
            </Animated.View>
        </Svg>
        </Animated.View>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          transform: [{ translateX: x }, { translateY: y }, { scale }],
          backgroundColor: transparent ? "transparent" : "#333",
        },
      ]}
      onLayout={(e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        if (!layout || Math.abs(layout.width - width) > 1 || Math.abs(layout.height - height) > 1) {
          setLayout({ width, height });
        }
      }}
      onPress={togglePlayPause}
      activeOpacity={0.9}
      disabled={isDragging} // Prevent play/pause while dragging
    >
      {error ? (
        <View
          style={[styles.errorContainer, transparent && styles.transparentBg]}
        >
          <Text style={styles.errorText}>Error loading video</Text>
          <Text style={styles.errorDetail}>{error}</Text>
        </View>
      ) : (
        <>
          {/* Dimmed backdrop when paused */}
          {!isPlaying && (
            <View style={styles.pausedBackdrop} pointerEvents="none" />
          )}
          <VideoView
            player={player}
            style={[
              styles.video,
              inverted && { transform: [{ scaleX: -1 }] }
            ]}
            contentFit="cover"
            nativeControls={false}
            allowsFullscreen={false}
            allowsPictureInPicture={false}
          />
          {renderProgressBar()}

          {/* Play icon with smooth fade transition */}
          {!isDragging && (
            <Animated.View
              style={[
                styles.playIconContainer,
                { opacity: playIconOpacity }
              ]}
              pointerEvents="none"
            >
              <Svg
                width={41}
                height={47}
                viewBox="0 0 41 47"
                style={styles.playIcon}
              >
                <Path
                  d="M2 23.5L2 4.46282C2 2.9235 3.66611 1.96122 4.99944 2.73045L37.9972 21.7676C39.3313 22.5373 39.3313 24.4627 37.9972 25.2324L4.99944 44.2695C3.66611 45.0388 2 44.0765 2 42.5372L2 23.5Z"
                  fill="#EEEEEE"
                  stroke="#EEEEEE"
                  strokeWidth={2}
                  strokeLinejoin="round"
                />
              </Svg>
            </Animated.View>
          )}
        </>
      )}

      {texts.length > 0 && (
        <View style={styles.textsContainer}>
          {texts.map((text, index) => (
            <Text key={index} style={styles.text}>
              {text}
            </Text>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 12,
    backgroundColor: "#333",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  poster: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  textsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  text: {
    color: "white",
    fontSize: 14,
    marginBottom: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
    padding: 15,
  },
  transparentBg: {
    backgroundColor: "transparent",
  },
  errorText: {
    color: "#ff5252",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  errorDetail: {
    color: "#aaa",
    fontSize: 12,
    textAlign: "center",
  },
  progressSvgContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  playIconContainer: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: [{ translateX: -20.5 }, { translateY: -23.5 }],
  },
  playIcon: {
    // No positioning needed here anymore since it's in the container
  },
  pausedBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
});
