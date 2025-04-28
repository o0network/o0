"use dom";

import React, { useRef } from "react";

interface VideoNoteProps {
  videoSource: string;
  texts: string[];
  dom?: import("expo/dom").DOMProps;
}

const VideoNote: React.FC<VideoNoteProps> = ({ videoSource, texts }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoDiameter = 320;
  const videoRadius = videoDiameter / 2;
  const textGap = 30;

  const containerWidth = videoDiameter;
  const containerHeight = videoDiameter + textGap + 40;

  const svgCenterX = containerWidth / 2;
  const svgCenterY = videoRadius;

  const textArcRadius = videoRadius + textGap;

  const angle1Rad = (30 * Math.PI) / 180;
  const angle2Rad = (150 * Math.PI) / 180;

  const point1X = svgCenterX + textArcRadius * Math.cos(angle1Rad);
  const point1Y = svgCenterY + textArcRadius * Math.sin(angle1Rad);
  const point2X = svgCenterX + textArcRadius * Math.cos(angle2Rad);
  const point2Y = svgCenterY + textArcRadius * Math.sin(angle2Rad);

  const largeArcFlag = "0";
  const sweepFlag = "0";

  const bottomCurvePath = `M ${point2X},${point2Y} A ${textArcRadius},${textArcRadius} 0 ${largeArcFlag} ${sweepFlag} ${point1X},${point1Y}`;

  return (
    <div
      style={{
        width: containerWidth,
        height: containerHeight,
        position: "relative",
        marginBottom: 32,
      }}
    >
      <div
        style={{
          width: videoDiameter,
          height: videoDiameter,
          borderRadius: "50%",
          overflow: "hidden",
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
          autoPlay
          muted
        />
      </div>

      <svg
        width={containerWidth}
        height={containerHeight}
        viewBox={`0 0 ${containerWidth} ${containerHeight}`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 2,
          pointerEvents: "none",
          overflow: "visible",
        }}
      >
        <defs>
          <path id="curve" d={bottomCurvePath} fill="transparent" />
        </defs>
        <text fill="white" style={{ fontSize: 18, fontWeight: 600 }}>
          {texts.map((text, index) => {
            const startOffset = ((index + 1) / (texts.length + 1)) * 100 + "%";
            return (
              <textPath
                key={index}
                xlinkHref="#curve"
                textAnchor="middle"
                startOffset={startOffset}
              >
                {text}
              </textPath>
            );
          })}
        </text>
      </svg>
    </div>
  );
};
export default VideoNote;

