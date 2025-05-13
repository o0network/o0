import React, { useRef, useEffect } from "react";

type VideoNoteProps = {
  videoSource: string;
  texts: string[];
  x: number;
  y: number;
  scale: number;
  playing: boolean;
  onClick: () => void;
  setVideoRef?: (el: HTMLVideoElement | null) => void;
};

const VideoNote = ({
  videoSource,
  texts,
  x,
  y,
  scale,
  playing,
  onClick,
  setVideoRef,
}: VideoNoteProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageSize = 320; // match max from video.jsx
  const radius = imageSize / 2;
  const circumference = 2 * Math.PI * radius * 0.98;

  // Progress state
  const [progress, setProgress] = React.useState(0);
  const [hasPlayed, setHasPlayed] = React.useState(false);

  useEffect(() => {
    if (setVideoRef) setVideoRef(videoRef.current);
  }, [setVideoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const update = () => {
      setProgress(video.currentTime / (video.duration || 1));
      if (!video.paused) requestAnimationFrame(update);
    };
    video.addEventListener("play", update);
    video.addEventListener("pause", update);
    video.addEventListener("timeupdate", update);
    return () => {
      video.removeEventListener("play", update);
      video.removeEventListener("pause", update);
      video.removeEventListener("timeupdate", update);
    };
  }, []);

  // Play indicator SVG
  const playIndicator = (
    <div
      className="play-indicator"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        opacity: !playing ? 1 : 0,
        transition: "opacity 0.2s",
        pointerEvents: "none",
        zIndex: 3,
      }}
    >
      <svg
        width="41"
        height="47"
        viewBox="0 0 41 47"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 23.5L2 4.46282C2 2.9235 3.66611 1.96122 4.99944 2.73045L37.9972 21.7676C39.3313 22.5373 39.3313 24.4627 37.9972 25.2324L4.99944 44.2695C3.66611 45.0388 2 44.0765 2 42.5372L2 23.5Z"
          fill="#EEEEEE"
          stroke="#EEEEEE"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );

  // Progress ring SVG
  const progressRing = (
    <svg
      viewBox={`0 0 ${imageSize} ${imageSize}`}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        transform: playing
          ? "rotate(-90deg) scale(1)"
          : "rotate(-90deg) scale(0.85)",
        transition: "transform 0.2s ease",
        zIndex: 2,
        pointerEvents: "none",
      }}
    >
      {/* Background circle */}
      <circle
        cx={imageSize / 2}
        cy={imageSize / 2}
        r={radius * 0.98}
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={2}
        style={{ opacity: !playing ? 1 : 0, transition: "opacity 0.2s" }}
      />
      {/* Progress circle */}
      <circle
        cx={imageSize / 2}
        cy={imageSize / 2}
        r={radius * 0.98}
        fill="none"
        stroke="rgba(255,255,255,0.8)"
        strokeWidth={playing ? 4 : 2}
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress * circumference}
        style={{ opacity: playing ? 1 : 0, transition: "opacity 0.2s" }}
      />
      {/* End dot */}
      <circle
        cx={
          imageSize / 2 +
          radius * 0.98 * Math.cos(2 * Math.PI * progress - Math.PI / 2)
        }
        cy={
          imageSize / 2 +
          radius * 0.98 * Math.sin(2 * Math.PI * progress - Math.PI / 2)
        }
        r={3}
        fill="#EEEEEE"
        style={{ opacity: !playing ? 1 : 0, transition: "opacity 0.2s" }}
      />
      {/* Ghost dot */}
      <circle
        cx={
          imageSize / 2 +
          radius * 0.98 * Math.cos(2 * Math.PI * progress - Math.PI)
        }
        cy={
          imageSize / 2 +
          radius * 0.98 * Math.sin(2 * Math.PI * progress - Math.PI)
        }
        r={3}
        fill="rgba(255,255,255,0.5)"
        style={{ opacity: 1 }}
      />
    </svg>
  );

  // Player ring
  const playerRing = (
    <div
      className="player-ring"
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        border: "2px solid rgba(255, 255, 255, 0.8)",
        boxSizing: "border-box",
        boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.1)",
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );

  return (
    <div
      className={`floating-image physics-image${playing ? " playing" : ""}`}
      style={{
        width: imageSize,
        height: imageSize,
        borderRadius: "50%",
        position: "absolute",
        overflow: "hidden",
        zIndex: playing ? 5 : 3,
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        willChange: "transform",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <div
        className="video-container"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <video
          ref={videoRef}
          src={videoSource}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          controls={false}
          loop
          muted
        />
        {playIndicator}
      </div>
      {progressRing}
      {playerRing}
    </div>
  );
};

export default VideoNote;
