"use-dom";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { usePlatformContext } from "../utils/platform";
import { DeviceMotion } from "expo-sensors";
import { View, StyleSheet, Platform } from "react-native";

// Fragment Shader for the liquid gradient effect
const fragmentShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform vec2 u_orientation; // Using vec2 for beta/gamma
  uniform float u_is_mobile; // 0.0 for non-mobile, 1.0 for mobile

  // Modified rainbowColor function using the specified palette
  vec3 rainbowColor(float position, float time) {
    // Define the color palette
    vec3 palette[8] = vec3[](
      vec3(0.9490, 0.0000, 1.0000),   // #f200ff - bright magenta
      vec3(0.9608, 0.1961, 0.8627),   // #f532dc - bright pink
      vec3(0.9804, 0.2353, 0.7255),   // #fa3cb9 - hot pink
      vec3(0.9882, 0.2745, 0.5686),   // #fc4691 - coral pink
      vec3(0.9961, 0.3137, 0.3922),   // #fe5064 - bright coral
      vec3(1.0000, 0.4706, 0.2549),   // #ff7841 - bright orange
      vec3(1.0000, 0.6275, 0.1176),   // #ffa01e - bright amber
      vec3(1.0000, 0.7843, 0.0000)    // #ffc800 - bright gold
    );

    // Create a repeating pattern using position and time
    float pattern = fract(position * 0.5 + time * 0.1);

    // Map the pattern to palette indices with smooth transitions
    float index = pattern * 8.0;
    int i0 = int(floor(index));
    int i1 = int(ceil(index));
    float t = fract(index);

    // Ensure indices stay within array bounds
    i0 = i0 % 8;
    i1 = i1 % 8;

    // Mix between adjacent colors
    return mix(palette[i0], palette[i1], t);
  }

  // Noise function (simple procedural noise)
  float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;
    st.x *= aspect;

    // Input influence (mouse or device orientation)
    vec2 influence = mix(u_mouse, u_orientation, u_is_mobile);
    influence.y *= -1.0; // Invert Y for intuitive control
    influence *= 2.0; // Amplify influence

    // Base movement pattern (sin/cos waves)
    float base_pattern = 0.0;
    base_pattern += sin(st.x * 10.0 + u_time * 0.5 + influence.x * 0.5) * 0.5 + 0.5;
    base_pattern += cos(st.y * 10.0 + u_time * 0.3 + influence.y * 0.5) * 0.5 + 0.5;

    // Add noise for distortion
    float noise_val = noise(st * 5.0 + u_time * 0.2 + influence * 0.1) * 0.5;

    // Combine patterns and noise
    float combined_pattern = base_pattern * 0.7 + noise_val * 0.3;

    // Distort coordinates based on the pattern
    vec2 distorted_st = st + vec2(
      cos(combined_pattern * 3.14159 * 2.0 + influence.x * 0.5) * 0.05,
      sin(combined_pattern * 3.14159 * 2.0 + influence.y * 0.5) * 0.05
    );

    // Final color calculation using the distorted coordinates
    float color_intensity = 0.0;
    color_intensity += sin(distorted_st.x * 8.0 + cos(u_time * 0.5 + distorted_st.y * 10.0 + sin(distorted_st.x * 12.0 + u_time * 1.0))) * 0.8;
    color_intensity += cos(distorted_st.y * 8.0 + sin(u_time * 0.3 + distorted_st.x * 10.0 + cos(distorted_st.y * 12.0 + u_time * 1.0))) * 0.8;

    // Get rainbow color based on intensity and time
    vec3 final_color = rainbowColor(color_intensity * 0.5 + 0.5, u_time * 0.5);

    gl_FragColor = vec4(final_color, 1.0);
  }
`;

export default function Background() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { platform } = usePlatformContext();
  const animationRef = useRef<number | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const deviceOrientationRef = useRef({ beta: 0, gamma: 0 }); // Using vec2 for beta/gamma
  const motionSubscriptionRef = useRef<{ remove: () => void } | null>(null); // Use a generic ref for the subscription

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    const isMobilePlatform = platform === "mobile";

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup (Orthographic for 2D shader plane)
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Shader Uniforms
    const uniformData = {
      u_resolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      u_time: { value: 0.0 },
      u_mouse: { value: new THREE.Vector2(0.0, 0.0) },
      u_orientation: { value: new THREE.Vector2(0.0, 0.0) },
      u_is_mobile: { value: isMobilePlatform ? 1.0 : 0.0 },
    };

    // Create a plane geometry that covers the screen
    const planeGeometry = new THREE.PlaneGeometry(2, 2); // Covers view (-1 to 1)

    // Shader Material
    const shaderMaterial = new THREE.ShaderMaterial({
      fragmentShader: fragmentShader,
      uniforms: uniformData,
    });
    materialRef.current = shaderMaterial;

    // Create the mesh and add to scene
    const mesh = new THREE.Mesh(planeGeometry, shaderMaterial);
    scene.add(mesh);

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      if (!materialRef.current || !rendererRef.current) return;

      materialRef.current.uniforms.u_time.value = clock.getElapsedTime();

      // Update mouse/orientation uniforms directly
      if (isMobilePlatform) {
        materialRef.current.uniforms.u_orientation.value.set(
          deviceOrientationRef.current.gamma * 0.01, // Scale gamma for x-axis influence
          deviceOrientationRef.current.beta * 0.01 // Scale beta for y-axis influence
        );
      } else {
        materialRef.current.uniforms.u_mouse.value.set(
          mousePositionRef.current.x,
          mousePositionRef.current.y
        );
      }

      rendererRef.current.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!rendererRef.current || !materialRef.current) return;
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      materialRef.current.uniforms.u_resolution.value.set(
        window.innerWidth,
        window.innerHeight
      );
    };

    window.addEventListener("resize", handleResize);

    // Handle mouse movement (for web/telegram)
    const handleMouseMove = (event: MouseEvent) => {
      mousePositionRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1, // Normalize to -1 to 1
        y: -(event.clientY / window.innerHeight) * 2 + 1, // Normalize and invert Y
      };
    };

    if (!isMobilePlatform) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      if (containerRef.current && rendererRef.current) {
        // Check if parentNode exists before removing
        if (rendererRef.current.domElement.parentNode) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
      }

      window.removeEventListener("resize", handleResize);

      if (!isMobilePlatform) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [platform]);

  // Handle device motion for mobile
  useEffect(() => {
    if (platform !== "mobile") {
      // Clean up any existing subscription if platform changes away from mobile
      if (motionSubscriptionRef.current) {
        motionSubscriptionRef.current.remove();
        motionSubscriptionRef.current = null;
      }
      return;
    }

    DeviceMotion.isAvailableAsync().then((isAvailable) => {
      if (isAvailable && !motionSubscriptionRef.current) {
        // Only subscribe if available and not already subscribed
        motionSubscriptionRef.current = DeviceMotion.addListener((data) => {
          const { beta, gamma } = data.rotation || { beta: 0, gamma: 0 };
          // Use normalized values or apply scaling as needed
          deviceOrientationRef.current = { beta: beta || 0, gamma: gamma || 0 };
        });
      }
    });

    return () => {
      // Cleanup the subscription when the component unmounts or platform changes
      if (motionSubscriptionRef.current) {
        motionSubscriptionRef.current.remove();
        motionSubscriptionRef.current = null;
      }
    };
  }, [platform]);

  return (
    <View style={styles.outerContainer} pointerEvents="none">
      {/* This div is purely for attaching the Three.js canvas */}
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0, // Ensure it's behind other content
        }}
      />
    </View>
  );
}

// React Native styles
const styles = StyleSheet.create({
  outerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    zIndex: -1, // Place it behind everything else
  },
});
