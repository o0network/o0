import { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Frame, SafeAreaView, GloriousButton } from "../components";
import { VideoView, useVideoPlayer } from "expo-video";
import * as FileSystem from "expo-file-system";
import { useModal } from "../contexts/ModalContext";
import { useAuth } from "../contexts/AuthContext";
import ApiService from "../data/api";
import { retrieveLaunchParams } from "@telegram-apps/sdk";

type CreateScreenProps = {};

export default function CreateScreen({}: CreateScreenProps) {
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { openWalletConnect } = useModal();
  const { isWalletConnected } = useAuth();

  useEffect(() => {
    if (!isRecording) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    setRecordingDuration(0);
    timerRef.current = setInterval(() => {
      setRecordingDuration((prev) => prev + 1);
    }, 1000);

    const stopTimeout = setTimeout(() => {
      if (isRecording) {
        toggleRecording();
      }
    }, 60000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      clearTimeout(stopTimeout);
    };
  }, [isRecording]);

  const requestCameraAccess = async () => {
    const newPermission = await requestPermission();
    return newPermission?.granted || false;
  };

  const toggleRecording = async () => {
    if (!permission?.granted) {
      const granted = await requestCameraAccess();
      if (!granted) return;
    }

    if (!cameraRef.current) return;

    if (isRecording) {
      try {
        cameraRef.current.stopRecording();
        setIsRecording(false);
        const dummyUri = FileSystem.documentDirectory + "recorded_video.mp4";
        setRecordedVideo(dummyUri);
      } catch (e) {
        console.error("Error stopping recording:", e);
        setIsRecording(false);
      }
    } else {
      try {
        setRecordedVideo(null);
        setIsRecording(true);

        cameraRef.current
          .recordAsync()
          .then((data) => {
            if (data && data.uri) {
              setRecordedVideo(data.uri);
            }
          })
          .catch((error) => {
            console.error("Error in recordAsync:", error);
            setIsRecording(false);
          });
      } catch (e) {
        console.error("Error starting recording:", e);
        setIsRecording(false);
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const resetRecording = () => {
    setRecordedVideo(null);
    setRecordingDuration(0);
  };

  const sendVideo = async () => {
    if (!recordedVideo) return;

    try {
      setIsSending(true);
      if (!isWalletConnected) {
        Alert.alert(
          "Connect Wallet",
          "You need to connect your wallet before submitting videos",
          [{ text: "OK", onPress: openWalletConnect }]
        );
        return;
      }

      const launchParams = retrieveLaunchParams();
      const user = launchParams?.tgWebAppData?.user;

      if (!user) {
        return;
      }

      const result = await ApiService.submitVideo(
        recordedVideo,
        user?.id.toString() || user.username || "0",
        "Video Note"
      );

      if (result.success) {
        Alert.alert(
          "Video Submitted",
          "Your video has been submitted for validation. You'll be notified when it's approved.",
          [{ text: "OK" }]
        );
        resetRecording();
      } else {
        Alert.alert("Error", result.message || "Failed to submit video");
      }
    } catch (error) {
      console.error("Error sending video:", error);
      Alert.alert("Error", "Failed to send video. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const renderCamera = () => {
    if (recordedVideo) {
      return (
        <View style={styles.camera}>
          <VideoView
            player={useVideoPlayer(recordedVideo)}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
          />
          <TouchableOpacity style={styles.resetButton} onPress={resetRecording}>
            <Text style={styles.resetButtonText}>↺</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (permission?.granted) {
      return (
        <View style={styles.camera}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing={facing}
            ref={cameraRef}
            videoStabilizationMode="auto"
          />

          {isRecording && (
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingTimer}>
                {formatTime(recordingDuration)}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.recordButton}
            onPress={toggleRecording}
          >
            <View
              style={[
                styles.recordButtonInner,
                isRecording && styles.recordButtonInnerActive,
              ]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.flipButton}
            onPress={toggleCameraFacing}
          >
            <Text style={styles.flipButtonText}>⟲</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={[styles.camera, styles.cameraPlaceholder]}>
        <Image style={{width: 48, height: 48}} source={require("../assets/emojis/camera.png")} />
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestCameraAccess}
        >
          <Text style={styles.permissionButtonText}>Allow Camera Access</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>{renderCamera()}</View>

      <View style={styles.bottomSection}>
        <Frame style={styles.instructionFrame}>
          <Text style={styles.instructionTitle}>Advice</Text>
          <Text style={styles.instructionText}>
            • Try to describe the key features
          </Text>
          <Text style={styles.instructionText}>
            • Highlight unique problem and solution
          </Text>
          <Text style={styles.instructionText}>
            • Show traction or market potential
          </Text>
          <Text style={styles.instructionText}>
            • Be concise, passionate, and clear
          </Text>
        </Frame>

        {!isWalletConnected && (
          <GloriousButton
            style={styles.walletButton}
            onPress={openWalletConnect}
            title="Connect Wallet"
          />
        )}
      </View>
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
    gap: 16,
  },
  telegramPill: {
    backgroundColor: "rgba(128, 128, 128, 0.3)",
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    marginBottom: 10,
  },
  telegramPillText: {
    color: "rgba(255, 255, 255, 0.96)",
    fontSize: 15,
    fontWeight: "600",
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
  camera: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraPlaceholder: {
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraPlaceholderText: {
    color: "#FFFFFF",
    fontSize: 48,
    textAlign: "center",
    padding: 20,
  },
  bottomSection: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  instructionFrame: {
    width: "90%",
    textAlign: "left",
    borderRadius: 16,
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingVertical: 18,
    gap: 4,
  },
  instructionTitle: {
    width: "100%",
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "left",
  },
  instructionText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "left",
    width: "100%",
  },
  sendButton: {
    alignSelf: "center",
    width: "90%",
    marginTop: 16,
    borderRadius: 35,
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  recordButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#FF4136",
  },
  recordButtonInnerActive: {
    width: 30,
    height: 30,
    borderRadius: 5,
  },
  flipButton: {
    position: "absolute",
    right: "50%",
    bottom: 0,
    transform: [{ translateX: "50%" }, { translateY: "50%" }],
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  flipButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
  },
  recordingIndicator: {
    position: "absolute",
    top: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF4136",
    marginRight: 8,
  },
  recordingTimer: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  resetButton: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  resetButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
  },
  permissionButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  preferencesButton: {
    marginVertical: 10,
    width: "80%",
    alignSelf: "center",
  },
  walletButton: {
    margin: 12,
    width: 240,
  },
  walletConnectedButton: {
    opacity: 0.7,
  },
});
