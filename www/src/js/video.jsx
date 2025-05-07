import React from "react";
import {
  Engine,
  Render,
  Runner,
  Bodies,
  Body,
  Composite,
  Events,
  Vector,
} from "matter-js";

import { createRoot } from "react-dom/client";
import { useEffect, useRef, useState } from "react";
import VideoNote from "../../../client/components/VideoNote";

const videoSources = [
  "assets/media/1.mp4",
  "assets/media/2.mp4",
  "assets/media/3.mp4",
  "assets/media/4.mp4",
  "assets/media/5.mp4",
  "assets/media/6.mp4",
];
const texts = ["o0", "network", "demo"];

// --- PhysicsVideos React Component ---
const PhysicsVideos = ({ videoSources, texts }) => {
  const containerRef = useRef(null);
  const [videoStates, setVideoStates] = useState([]);
  const videoRefs = useRef([]);
  const [initialized, setInitialized] = useState(false);

  // Physics engine refs
  const engineRef = useRef(null);
  const imagesRef = useRef([]);
  const renderRef = useRef(null);
  const runnerRef = useRef(null);
  const imageSize = Math.max(Math.min(window.innerWidth * 0.24, 320), 220);

  // Initialize physics and video states
  useEffect(() => {
    if (!containerRef.current || initialized) return;
    setInitialized(true);
    const bg = containerRef.current;
    const engine = Engine.create({ enableSleeping: false });
    engine.world.gravity.y = 0;
    engineRef.current = engine;
    let images = [];
    imagesRef.current = images;
    let canvasRect = bg.getBoundingClientRect();

    // Setup walls
    function setupWalls() {
      canvasRect = bg.getBoundingClientRect();
      const wallThickness = 20;
      const walls = [
        Bodies.rectangle(
          canvasRect.width / 2,
          0,
          canvasRect.width,
          wallThickness,
          {
            isStatic: true,
            restitution: 1,
            friction: 0,
            render: { visible: false },
          }
        ),
        Bodies.rectangle(
          canvasRect.width / 2,
          canvasRect.height,
          canvasRect.width,
          wallThickness,
          {
            isStatic: true,
            restitution: 1,
            friction: 0,
            render: { visible: false },
          }
        ),
        Bodies.rectangle(
          0,
          canvasRect.height / 2,
          wallThickness,
          canvasRect.height,
          {
            isStatic: true,
            restitution: 1,
            friction: 0,
            render: { visible: false },
          }
        ),
        Bodies.rectangle(
          canvasRect.width,
          canvasRect.height / 2,
          wallThickness,
          canvasRect.height,
          {
            isStatic: true,
            restitution: 1,
            friction: 0,
            render: { visible: false },
          }
        ),
      ];
      Composite.add(engine.world, walls);
    }

    // Setup images (bodies)
    function setupImages() {
      canvasRect = bg.getBoundingClientRect();
      const centerX = canvasRect.width / 2;
      const centerY = canvasRect.height / 2;
      const newStates = [];
      for (let i = 0; i < videoSources.length; i++) {
        const angle = Math.random() * Math.PI * 2;
        const INITIAL_SPEED = 0.08;
        const vx = Math.cos(angle) * INITIAL_SPEED;
        const vy = Math.sin(angle) * INITIAL_SPEED;
        const radius = imageSize / 2;
        const body = Bodies.circle(centerX, centerY, radius, {
          restitution: 0.9,
          friction: 0,
          frictionAir: 0.02,
          density: 0.5,
          inertia: Infinity,
          render: { visible: false },
        });
        Body.setVelocity(body, { x: vx, y: vy });
        images.push({ body, idx: i });
        Composite.add(engine.world, body);
        newStates.push({
          x: centerX - imageSize / 2,
          y: centerY - imageSize / 2,
          scale: 1,
          playing: false,
        });
      }
      setVideoStates(newStates);
    }

    setupWalls();
    setupImages();

    // Physics update loop
    const update = () => {
      canvasRect = bg.getBoundingClientRect();
      setVideoStates((prev) => {
        return prev.map((state, i) => {
          const { body } = images[i];
          const scale = state.playing ? 1.05 : 1;
          return {
            ...state,
            x: body.position.x - imageSize / 2,
            y: body.position.y - imageSize / 2,
            scale,
          };
        });
      });
      requestAnimationFrame(update);
    };
    update();

    // Start engine
    const runner = Runner.create();
    Runner.run(runner, engine);
    runnerRef.current = runner;
    renderRef.current = null;

    // Clean up
    return () => {
      Runner.stop(runner);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, [videoSources, initialized]);

  // Play/pause handling
  const handlePlayPause = (idx) => {
    setVideoStates((prev) =>
      prev.map((s, i) =>
        i === idx ? { ...s, playing: !s.playing } : { ...s, playing: false }
      )
    );
    videoRefs.current.forEach((v, i) => {
      if (i === idx) {
        if (v?.paused) v.play();
        else v?.pause();
      } else {
        v?.pause();
      }
    });
  };

  // Render floating video circles using VideoNote
  return (
    <div
      ref={containerRef}
      className="preview-bg"
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {videoStates.map((state, i) => (
        <VideoNote
          key={videoSources[i]}
          videoSource={videoSources[i]}
          texts={texts}
          x={state.x}
          y={state.y}
          scale={state.scale}
          playing={state.playing}
          onClick={() => handlePlayPause(i)}
          setVideoRef={(el) => (videoRefs.current[i] = el)}
        />
      ))}
    </div>
  );
};

// Only mount after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const bg = document.querySelector(".preview-bg");
  if (bg) {
    const root = createRoot(bg);
    root.render(<PhysicsVideos videoSources={videoSources} texts={texts} />);
  }
});
