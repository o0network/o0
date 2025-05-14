import React, { useRef, useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { Text } from "./index";
import { API_URL } from "../data/api";

type VideoNoteProps = {
  videoSource: string;
  texts?: string[];
  x?: number;
  y?: number;
  scale?: number;
  playing?: boolean;
  onClick?: () => void;
  transparent?: boolean;
};

export default function VideoNote({
  videoSource,
  texts = [],
  x = 0,
  y = 0,
  scale = 1,
  playing = false,
  onClick,
  transparent = false,
}: VideoNoteProps) {
  const [error, setError] = useState<string | null>(null);

  const player = useVideoPlayer(videoSource);

  useEffect(() => {
    if (!player) return;
    if (playing) {
      player.play();
    } else {
      player.pause();
    }
    player.loop = true;
  }, [player, playing]);
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          transform: [{ translateX: x }, { translateY: y }, { scale: scale }],
          backgroundColor: transparent ? "transparent" : "#333",
        },
      ]}
      onPress={onClick}
      activeOpacity={0.9}
    >
      {error ? (
        <View
          style={[styles.errorContainer, transparent && styles.transparentBg]}
        >
          <Text style={styles.errorText}>Error loading video</Text>
          <Text style={styles.errorDetail}>{error}</Text>
        </View>
      ) : (
        <VideoView
          player={player}
          style={styles.video}
          contentFit="cover"
          allowsFullscreen={false}
          allowsPictureInPicture={false}
        />
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
});
