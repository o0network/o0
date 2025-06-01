import { useState, useRef, useEffect, useCallback, type ComponentRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  BackHandler,
  Modal,
  Animated,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Frame, SafeAreaView, GloriousButton, VideoNote, Button } from "../components";
import { useModal } from "../contexts/ModalContext";
import { useAuth } from "../contexts/AuthContext";
import { usePlatform } from "../contexts/ScreenContext";
import ApiService from "../data/api";
import { retrieveLaunchParams } from "@telegram-apps/sdk";
import Svg, { Circle } from "react-native-svg";
import { useIsFocused } from '@react-navigation/native';
import { Easing } from "react-native";

const RECORD_DURATION = 60;

type Mode = "initial" | "camera" | "recording" | "preview";

// create an animated SVG Circle
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function CreateScreen() {
  const [mode, setMode] = useState<Mode>("initial");
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [showCameraAccess, setShowCameraAccess] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Web-specific state
  const [webStream, setWebStream] = useState<MediaStream | null>(null);
  const [webRecordedBlob, setWebRecordedBlob] = useState<Blob | null>(null);

  const cameraRef = useRef<ComponentRef<typeof CameraView>>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { openWalletConnect } = useModal();
  const { isWalletConnected } = useAuth();
  const { isPlatform } = usePlatform();

  const isWeb = isPlatform("web");
  const isFocused = useIsFocused();

  // prepare animated progress ring
  const strokeWidth = 1; // thinner line
  const gap = mode === "recording" && !paused ? 0 : 8; // no gap when recording, small gap when paused
  const radius = 49 - strokeWidth - gap;
  const circumference = 2 * Math.PI * radius;
  const strokeAnim = useRef(new Animated.Value(circumference)).current;

  // Navigation lock during recording
  useEffect(() => {
    if (mode === "recording") {
      const onBack = () => {
        return true;
      };
      const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
      return () => sub.remove();
    }
  }, [mode]);

  // continuously animate ring over recording duration, pausing/resuming as needed
  useEffect(() => {
    if (mode === "recording" && !paused) {
      // start from current progress
      const startOffset = circumference * (1 - recordingDuration / RECORD_DURATION);
      strokeAnim.setValue(startOffset);
      const remaining = (RECORD_DURATION - recordingDuration) * 1000;
      Animated.timing(strokeAnim, {
        toValue: 0,
        duration: remaining > 0 ? remaining : 0,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    } else {
      // stop animation and reset when not recording
      strokeAnim.stopAnimation();
      strokeAnim.setValue(circumference);
    }
  }, [mode, paused]);

  // Recording timer and progress
  useEffect(() => {
    if (mode !== "recording" || paused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    timerRef.current = setInterval(() => {
      setRecordingDuration((prev) => {
        if (prev + 1 >= RECORD_DURATION) {
          finishRecording();
          return RECORD_DURATION;
        }
        return prev + 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode, paused]);

  // Memoize finishRecording
  const finishRecording = useCallback(async () => {
    if (isWeb) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        console.log("finishRecording: Stopping web mediaRecorder.");
        mediaRecorderRef.current.stop(); // This will trigger its onstop handler
      }
      // webStream cleanup is now generally handled by the mode === 'initial' effect
      // or visibilitychange. But if called directly, ensure tracks are stopped.
      if (webStream) {
        console.log("finishRecording: Stopping webStream tracks (direct call).");
        webStream.getTracks().forEach(track => track.stop());
        setWebStream(null);
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      // Note: MediaRecorder onstop handler sets mode to "preview"
    } else { // Native
      if (isRecording && cameraRef.current) {
        try {
          console.log("finishRecording: Stopping native recording.");
          await cameraRef.current.stopRecording();
          // native stopRecording inherently sets recordedVideo and mode to preview via its promise
        } catch (e) {
          console.error("Error stopping native recording:", e);
        }
        // setIsRecording(false); // Already handled by recordAsync promise resolution
        // setMode("preview"); // Already handled by recordAsync promise resolution
      }
    }
  }, [isWeb, webStream, isRecording, cameraRef, mediaRecorderRef, videoRef, setWebStream]); // Removed setIsRecording, setMode as they are handled by camera/recorder callbacks

  // Reset state on initial
  useEffect(() => {
    if (mode === "initial") {
      console.log("Effect: mode is 'initial'. Performing cleanup.");
      setIsRecording(false);
      setPaused(false);
      setRecordingDuration(0);
      setRecordedVideo(null);
      setWebRecordedBlob(null);
      if (webStream) {
        console.log("Effect (mode === 'initial'): Stopping webStream tracks.");
        webStream.getTracks().forEach(track => track.stop());
        setWebStream(null);
      }
    }
  }, [mode, webStream]);

  // Handle screen focus changes
  useEffect(() => {
    if (!isFocused) {
      console.log(`Effect: Screen lost focus. Current mode: ${mode}, isRecording: ${isRecording}`);
      if (mode === "recording") {
        console.log("Effect (!isFocused): Active recording detected. Calling finishRecording.");
        finishRecording();
      }
      console.log("Effect (!isFocused): Setting mode to 'initial'.");
      setMode("initial");
    }
  }, [isFocused, mode, isRecording, finishRecording]); // Removed setMode from deps as it's called directly

  // Existing useEffect for web visibility changes (document.hidden)
  // This is crucial for web tab switches and should remain.
  // Ensure its webStream handling is robust.
  useEffect(() => {
    if (!isWeb) return;

    const handleBeforeUnload = () => {
      if (webStream) {
        console.log("handleBeforeUnload: Stopping webStream tracks.");
        webStream.getTracks().forEach(track => track.stop());
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("handleVisibilityChange: Page hidden.");
        if (mode === "recording" && mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          console.log("handleVisibilityChange: Stopping web recording.");
          mediaRecorderRef.current.stop(); // This will trigger its onstop handler
        }
        // Regardless of recording state, if page is hidden, reset to initial.
        // The mode === "initial" effect will handle webStream cleanup.
        console.log("handleVisibilityChange: Setting mode to 'initial'.");
        setMode("initial");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isWeb, mode, webStream, setMode]); // Added mode and setMode, webStream dependency remains

  // Web camera permission and stream setup
  const requestWebCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing === "front" ? "user" : "environment" },
        audio: true
      });
      setWebStream(stream);
      return true;
    } catch (error) {
      console.error("Web camera access denied:", error);
      return false;
    }
  };

  const requestCameraAccess = async () => {
    if (isWeb) {
      return await requestWebCameraAccess();
    } else {
      const newPermission = await requestPermission();
      return newPermission?.granted || false;
    }
  };

  // Button handlers
  const handleCreate = async () => {
    setShowCameraAccess(true);
    if (isWeb) {
      const granted = await requestWebCameraAccess();
      if (!granted) return;
    } else {
      if (!permission?.granted) {
        const granted = await requestCameraAccess();
        if (!granted) return;
      }
    }
    setShowCameraAccess(false);
    setMode("camera");
  };

  const startRecording = async () => {
    if (isWeb) {
      if (!webStream) return;

      chunksRef.current = [];

      // Try different codecs based on browser support
      let options: MediaRecorderOptions = {
        videoBitsPerSecond: 1000000,
        audioBitsPerSecond: 128000
      };

      // We'll try several formats in order of preference, starting with the most compressed
      const mimeTypes = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
        'video/mp4'
      ];

      // Find the first supported MIME type
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          options.mimeType = mimeType;
          break;
        }
      }

      const mediaRecorder = new MediaRecorder(webStream, options);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Use the same MIME type that was recorded with
        const mimeType = options.mimeType || 'video/webm';
        const blob = new Blob(chunksRef.current, { type: mimeType });

        setWebRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setRecordedVideo(url);
        setIsRecording(false);
        setMode("preview");
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Collect data every second for more reliable chunks
      setIsRecording(true);
      setPaused(false);
      setRecordingDuration(0);
      setMode("recording");
    } else {
      // Native recording logic
      if (!permission?.granted) return;
      setIsRecording(true);
      setPaused(false);
      setRecordingDuration(0);
      setRecordedVideo(null);
      setMode("recording");
      cameraRef.current?.recordAsync().then((data: any) => {
        if (data && data.uri) {
          setRecordedVideo(data.uri);
          setIsRecording(false);
          setMode("preview");
        }
      });
    }
  };

  const pauseRecording = () => {
    if (isWeb) {
      if (mediaRecorderRef.current) {
        if (paused) {
          mediaRecorderRef.current.resume();
        } else {
          mediaRecorderRef.current.pause();
        }
      }
    }
    setPaused((p) => !p);
  };

  const retake = () => {
    console.log("Retake called");
    setRecordedVideo(null);
    setWebRecordedBlob(null);
    // Re-request camera access before setting mode to camera
    if (isWeb) {
      requestWebCameraAccess().then(granted => {
        if (granted) {
          console.log("Web camera access granted for retake");
          setMode("camera");
        } else {
          console.log("Web camera access denied for retake");
          setMode("initial"); // Or handle error
        }
      });
    } else { // Native
       requestCameraAccess().then(granted => {
        if (granted) {
          console.log("Native camera access granted for retake");
          setMode("camera");
        } else {
          console.log("Native camera access denied for retake");
          setMode("initial"); // Or handle error
        }
      });
    }
  };

  const sendVideo = async () => {
    if (!recordedVideo && !webRecordedBlob) {
      Alert.alert("Error", "No video to send. Please record a video first.");
      return;
    }
    try {
      setIsSending(true);

      if (isWeb && webRecordedBlob) {
        const result = await ApiService.submitVideoBlob(webRecordedBlob, "Video Note");
        if (result.success) {
          Alert.alert("Success", "Video uploaded successfully!");
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            setMode("initial");
          }, 1000);
        } else {
          Alert.alert("Error", result.message || "Failed to upload video");
        }
      } else if (recordedVideo) {
        const result = await ApiService.submitVideo(recordedVideo, "Video Note");
        if (result.success) {
          Alert.alert("Success", "Video uploaded successfully!");
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            setMode("initial");
          }, 1000);
        } else {
          Alert.alert("Error", result.message || "Failed to upload video");
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload video. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  // Add back toggleCameraFacing
  const toggleCameraFacing = () => {
    if (isWeb) {
      // For web, we need to restart the stream with new constraints
      const newFacing = facing === "back" ? "front" : "back";
      setFacing(newFacing);
      if (webStream) {
        webStream.getTracks().forEach(track => track.stop());
        navigator.mediaDevices.getUserMedia({
          video: { facingMode: newFacing === "front" ? "user" : "environment" },
          audio: true
        }).then(stream => {
          setWebStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        });
      }
    } else {
      setFacing((current) => (current === "back" ? "front" : "back"));
    }
  };

  // UI helpers
  const getMainButtonText = () => {
    let text = "Submit";
    if (!isWalletConnected) text = "Connect Wallet";
    else if (mode === "initial") text = "Create";
    else if (mode === "preview") text = "Submit";
    return text;
  };

  const getMainButtonAction = () => {
    const action = !isWalletConnected ? openWalletConnect :
      mode === "initial" ? handleCreate :
      mode === "preview" ? sendVideo : undefined;
    return action;
  };

  const isMainButtonDisabled = () => {
    const disabled = isSending || showCameraAccess || mode === "camera" || mode === "recording" || (mode === "preview" && !recordedVideo && !webRecordedBlob);
    return disabled;
  };

  // Progress bar
  const renderProgressBar = () => {
    if (mode !== "recording") {
      return null;
    }
    return (
      <Animated.View style={[StyleSheet.absoluteFill, styles.progressSvgContainer]} pointerEvents="none">
        <Svg viewBox="0 0 100 100" style={styles.progressSvg}>
          <AnimatedCircle
            cx={50}
            cy={50}
            r={radius}
            stroke="#EEEEEE"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeAnim}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </Svg>
      </Animated.View>
    );
  };

  // UI rendering
  const renderCircleContent = () => {
    if (showSuccess) {
      return (
        <View style={styles.logoCircle}>
          <Image source={require("../assets/emojis/check-mark.png")} style={{ width: 64, height: 64 }} resizeMode="contain" />
        </View>
      );
    }
    if (mode === "initial") {
      return (
        <View style={styles.logoCircle}>
          <Image source={require("../assets/logo.png")} style={styles.logo} resizeMode="contain" />
        </View>
      );
    }
    if (mode === "camera" || mode === "recording") {
      if (isWeb) {
        return (
          <video
            ref={videoRef}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: facing === "front" ? "scaleX(-1)" : "none",
            }}
            autoPlay
            muted
            playsInline
            onLoadedMetadata={() => {
              // Ensure video plays when metadata is loaded
              if (videoRef.current) {
                videoRef.current.play();
              }
            }}
          />
        );
      } else {
        if (!permission?.granted) return null;
        return (
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing={facing}
            ref={cameraRef}
            videoStabilizationMode="auto"
          />
        );
      }
    }
    if (mode === "preview" && recordedVideo) {
      return (
        <View style={{
          width: "100%",
          height: "100%",
          transform: [{ scaleX: facing === "front" ? -1 : 1 }]
        }}>
          <VideoNote
            videoSource={recordedVideo}
            transparent
            scale={1}
          />
        </View>
      );
    }
    return null;
  };

  // Control buttons under the video
  const renderControls = () => {
    if (mode === "camera") {
      return (
        <View style={styles.controlsRow}>
          {!isWeb && <Button title="⏸" disabled onPress={pauseRecording} />}
          <Button title="Start" onPress={startRecording} />
          {!isWeb && <Button title="⟲" onPress={toggleCameraFacing} />}
        </View>
      );
    }
    if (mode === "recording") {
      return (
        <View style={styles.controlsRow}>
          {!isWeb && <Button title="⏸" onPress={pauseRecording} />}
          <Button title="Finish" onPress={finishRecording} />
          {!isWeb && <Button title="⟲" disabled onPress={toggleCameraFacing} />}
        </View>
      );
    }
    if (mode === "preview") {
      return (
        <View style={styles.controlsRow}>
          <Button title="Retake" onPress={retake} />
        </View>
      );
    }
    return null;
  };

  const renderAdvice = () => (
    <>
      <Frame style={styles.cardFrame}>
        <Text style={styles.cardTitle}>Record 60s video pitch</Text>
        <Text style={styles.cardText}>• Try to describe the key features</Text>
        <Text style={styles.cardText}>• Highlight unique problem and solution</Text>
        <Text style={styles.cardText}>• Show traction or market potential</Text>
        <Text style={styles.cardText}>• Be concise, passionate, and clear</Text>
      </Frame>
    </>
  );

  const renderWarning = () => (
    <Frame style={styles.cardFrame}>
      <Text style={styles.cardTitle}>⚠️ Video pitch will be send to validation first</Text>
    </Frame>
  );

  // Assign web camera stream to video element for live preview
  useEffect(() => {
    if (isWeb && webStream && videoRef.current) {
      videoRef.current.srcObject = webStream;
      videoRef.current.play().catch(() => {});
    }
  }, [isWeb, webStream]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.videoSection}>
        <View style={styles.cameraContainer}>
          {renderCircleContent()}
          {renderProgressBar()}
        </View>
        {renderControls()}
      </View>
      { mode === "initial" && renderAdvice()}
      { mode === "preview" && renderWarning()}
      <View style={styles.bottomSection}>
        <GloriousButton
          style={[
            styles.mainButton,
          ]}
          onPress={getMainButtonAction()}
          title={getMainButtonText()}
          disabled={isMainButtonDisabled()}
        />
      </View>
      {/* Camera permission request modal */}
      {showCameraAccess && !permission?.granted && (
        <Modal transparent visible animationType="fade">
          <View style={styles.permissionModalBackdrop}>
            <View style={styles.permissionModalBox}>
              <Text style={styles.permissionModalText}>Allow camera access to record your pitch</Text>
              <Button title="Allow Camera Access" onPress={requestCameraAccess} />
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    maxWidth: 512,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 16,
    marginTop: 12,
  },
  videoSection: {
    width: "100%",
    alignItems: "center",
    position: "relative",
    marginBottom: 20,
  },
  cameraContainer: {
    width: "80%",
    aspectRatio: 1,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  logoCircle: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 128,
    height: 128,
    resizeMode: "contain",
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
    marginTop: 20,
  },
  controlButton: {
    minWidth: 60,
    minHeight: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  controlIcon: {
    color: "#FF4136",
    fontSize: 18,
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.3,
  },
  mainButton: {
    width: 240,
    marginTop: 24,
  },
  bottomSection: {
    width: "100%",
    position: "absolute",
    bottom: 40,
    alignItems: "center",
    gap: 16,
    paddingBottom: 20,
  },
  cardFrame: {
    width: "90%",
    textAlign: "left",
    borderRadius: 16,
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingVertical: 18,
    gap: 4,
    marginBottom: 12,
  },
  cardTitle: {
    width: "100%",
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "left",
  },
  cardText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "left",
    width: "100%",
  },
  permissionModalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  permissionModalBox: {
    backgroundColor: "#222",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    width: 320,
    maxWidth: "90%",
  },
  permissionModalText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  permissionModalButton: {
    width: 180,
  },
  progressSvgContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  progressSvg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
