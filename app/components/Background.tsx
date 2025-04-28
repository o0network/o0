import { useState, useEffect, useRef, useCallback } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { GLView, ExpoWebGLRenderingContext } from "expo-gl";
import * as THREE from "three";
import { DeviceMotion } from "expo-sensors";
import { Renderer } from "expo-three";

const fragmentShader = `
  #ifdef GL_ES
  precision highp float;
  #endif

  #define PI 3.14159265359
  #define TWO_PI 6.28318530718

  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;       // Web cursor [-1, 1]
  // Send normalized device orientation angles
  uniform float u_alpha;      // Yaw [0, 1] (normalized from 0 to 2PI)
  uniform float u_beta;       // Pitch [-1, 1] (normalized from -PI/2 to PI/2)
  uniform float u_gamma;      // Roll [-1, 1] (normalized from -PI to PI)
  uniform float u_is_mobile;

  // --- Rotation Matrices ---
  // Rotation around X axis (Pitch)
  mat3 rotX(float angle) {
      float s = sin(angle);
      float c = cos(angle);
      return mat3(1.0, 0.0, 0.0,
                  0.0, c,   -s,
                  0.0, s,   c);
  }

  // Rotation around Y axis (Yaw)
  mat3 rotY(float angle) {
      float s = sin(angle);
      float c = cos(angle);
      return mat3(c,   0.0, s,
                  0.0, 1.0, 0.0,
                  -s,  0.0, c);
  }

  // Rotation around Z axis (Roll)
  mat3 rotZ(float angle) {
      float s = sin(angle);
      float c = cos(angle);
      return mat3(c,   -s,  0.0,
                  s,   c,   0.0,
                  0.0, 0.0, 1.0);
  }

  // --- Pattern Functions (Unchanged) ---
  vec3 rainbowColor(float p, float t) {
    vec3 c[8] = vec3[](vec3(0.949,0.000,1.000),vec3(0.961,0.196,0.863),vec3(0.980,0.235,0.725),
                       vec3(0.988,0.274,0.569),vec3(0.996,0.314,0.392),vec3(1.000,0.471,0.255),
                       vec3(1.000,0.627,0.118),vec3(1.000,0.784,0.000));
    float i = fract(p*0.5+t*0.1)*8.0; int i0=int(floor(i)),i1=int(ceil(i));
    return mix(c[i0%8],c[i1%8],fract(i));
  }
  float random(vec2 st){return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453); }
  float noise(vec2 st){ vec2 i=floor(st);vec2 f=fract(st); float a=random(i);float b=random(i+vec2(1.,0.));float c=random(i+vec2(0.,1.));float d=random(i+vec2(1.,1.)); vec2 u=f*f*(3.-2.*f); return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y; }

  // --- Cube Map Sampling Simulation ---
  // Input: 3D direction vector
  // Output: 2D coordinates on the corresponding cube face [0, 1]
  vec2 directionToCubemapUv(vec3 dir) {
      vec3 absDir = abs(dir);
      vec2 uv;
      if (absDir.x >= absDir.y && absDir.x >= absDir.z) {
          // +X or -X face
          uv = dir.x > 0.0 ? vec2(-dir.z, -dir.y) / absDir.x : vec2(dir.z, -dir.y) / absDir.x;
      } else if (absDir.y >= absDir.x && absDir.y >= absDir.z) {
          // +Y or -Y face
          uv = dir.y > 0.0 ? vec2(dir.x, dir.z) / absDir.y : vec2(dir.x, -dir.z) / absDir.y;
      } else {
          // +Z or -Z face
          uv = dir.z > 0.0 ? vec2(dir.x, -dir.y) / absDir.z : vec2(-dir.x, -dir.y) / absDir.z;
      }
      // Map from [-1, 1] to [0, 1]
      return uv * 0.5 + 0.5;
  }

  void main() {
    // --- Calculate View Direction for this Pixel ---
    vec2 screen_uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    vec3 initial_dir = normalize(vec3(screen_uv.x, screen_uv.y, 1.0)); // Z=1 adjusts FOV

    // --- Apply Device/Mouse Orientation as Camera Rotation ---
    vec3 final_dir;
    if (u_is_mobile > 0.5) {
      // Mobile: Use Euler angles from device motion
      float yaw_sensitivity = 1.0;
      float pitch_sensitivity = 1.0;
      float roll_sensitivity = 1.0;

      // Apply a fixed 90-degree rotation around X axis first
      mat3 baseRotation = rotX(PI / 2.0);

      float yaw = u_alpha * TWO_PI * yaw_sensitivity;
      float pitch = u_beta * PI * pitch_sensitivity * 0.5;
      float roll = u_gamma * PI * roll_sensitivity;

      // Apply device rotation after the base rotation
      mat3 deviceRotation = rotY(yaw) * rotX(pitch) * rotZ(roll);
      final_dir = initial_dir * baseRotation * transpose(deviceRotation);
    } else {
      // Web: Mouse control
      float mouse_sensitivity = 1.5;
      float mouse_yaw = u_mouse.x * PI * mouse_sensitivity;
      float mouse_pitch = u_mouse.y * (PI / 2.0) * mouse_sensitivity;

      // Apply same 90-degree rotation for web mode for consistency
      mat3 baseRotation = rotX(PI / 2.0);
      mat3 mouseRotation = rotY(mouse_yaw) * rotX(mouse_pitch);
      final_dir = initial_dir * baseRotation * transpose(mouseRotation);
    }

    // --- Convert final direction to Cube Map UVs ---
    vec2 cubemap_uv = directionToCubemapUv(final_dir);

    // --- Pattern Generation using cubemap_uv ---
    vec2 pattern_st = cubemap_uv * 4.0; // Scale UVs for pattern density

    float noise_val = noise(pattern_st * 5.0 + u_time * 0.2) * 0.5;
    float base_pattern = 0.0;
    base_pattern += sin(pattern_st.x * 10.0 + u_time * 0.5) * 0.5 + 0.5;
    base_pattern += cos(pattern_st.y * 10.0 + u_time * 0.3) * 0.5 + 0.5;
    float combined_pattern = base_pattern * 0.7 + noise_val * 0.3;

    // --- Final Color Calculation ---
     float color_intensity = 0.0;
     color_intensity += sin(pattern_st.x * 8.0 + cos(u_time * 0.5 + pattern_st.y * 10.0 + sin(pattern_st.x * 12.0 + u_time * 1.0))) * 0.8;
     color_intensity += cos(pattern_st.y * 8.0 + sin(u_time * 0.3 + pattern_st.x * 10.0 + cos(pattern_st.y * 12.0 + u_time * 1.0))) * 0.8;

    vec3 final_color = rainbowColor(color_intensity * 0.5 + 0.5, u_time * 0.5);

    gl_FragColor = vec4(final_color, 1.0);
  }
`;

export default function Background() {
  const animationRef = useRef<number | null>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const deviceOrientationRef = useRef({ alpha: 0, beta: 0, gamma: 0 }); // Stores normalized values
  const orientationStatusRef = useRef<string>("unknown"); // Store orientation status
  const motionSubscriptionRef = useRef<{ remove: () => void } | null>(null);
  const [isMobile] = useState(Platform.OS !== "web");

  // Refs for Three.js objects
  const rendererRef = useRef<Renderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);
  const planeGeometryRef = useRef<THREE.PlaneGeometry | null>(null);

  // --- Device Motion Handling ---
  useEffect(() => {
    if (!isMobile) {
      if (motionSubscriptionRef.current) {
        motionSubscriptionRef.current.remove();
        motionSubscriptionRef.current = null;
      }
      return;
    }
    let isMounted = true;
    // Thresholds for orientation detection (in radians)
    // Experiment with these values for better accuracy
    const verticalThreshold = Math.PI / 3; // ~60 degrees from horizontal
    const horizontalThreshold = Math.PI / 3; // ~60 degrees from vertical
    const flatThreshold = Math.PI / 6; // ~30 degrees from flat

    DeviceMotion.isAvailableAsync().then((isAvailable) => {
      if (isAvailable && isMounted && !motionSubscriptionRef.current) {
        motionSubscriptionRef.current = DeviceMotion.addListener(
          (motionData) => {
            const { alpha, beta, gamma } = motionData.rotation || {
              alpha: 0,
              beta: 0,
              gamma: 0,
            };

            // --- Orientation Status Detection ---
            let currentStatus = "unknown";
            const absBeta = Math.abs(beta || 0);
            const absGamma = Math.abs(gamma || 0);

            if (absBeta < flatThreshold && absGamma < flatThreshold) {
              currentStatus = "horizontal (flat)";
            } else if (absBeta > verticalThreshold) {
              currentStatus = "vertical (portrait)";
            } else if (absGamma > horizontalThreshold) {
              currentStatus = "horizontal (landscape)";
            } else {
              currentStatus = "diagonal / intermediate"; // Optional: Handle intermediate state
            }

            // Log status only if it changes to avoid flooding console
            if (currentStatus !== orientationStatusRef.current) {
              console.log("Device Orientation:", currentStatus);
              orientationStatusRef.current = currentStatus;
            }

            // --- Normalization for Shader (Unchanged) ---
            const normAlpha = (alpha || 0) / (2 * Math.PI);
            const normBeta = (beta || 0) / (Math.PI / 2);
            const normGamma = (gamma || 0) / Math.PI;
            deviceOrientationRef.current = {
              alpha: normAlpha,
              beta: normBeta,
              gamma: normGamma,
            };
          }
        );
        DeviceMotion.setUpdateInterval(100); // Update less frequently if just for status logging (e.g., 100ms)
      }
    });
    return () => {
      isMounted = false;
      if (motionSubscriptionRef.current) {
        motionSubscriptionRef.current.remove();
        motionSubscriptionRef.current = null;
      }
    };
  }, [isMobile]);

  // --- Mouse Move Handling (Web) ---
  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (event: MouseEvent) => {
      mousePositionRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1, // Invert Y
      };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  // --- WebGL Context & Rendering Setup ---
  const onContextCreate = useCallback(
    (gl: ExpoWebGLRenderingContext) => {
      rendererRef.current = new Renderer({ gl });
      sceneRef.current = new THREE.Scene();
      cameraRef.current = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      clockRef.current = new THREE.Clock();
      planeGeometryRef.current = new THREE.PlaneGeometry(2, 2);

      const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
      rendererRef.current.setSize(width, height);
      rendererRef.current.setClearColor(0x000000, 0);
      cameraRef.current.position.z = 1;

      // Define uniforms including the individual orientation angles
      const uniformData = {
        u_resolution: { value: new THREE.Vector2(width, height) },
        u_time: { value: 0.0 },
        u_mouse: {
          value: new THREE.Vector2(
            mousePositionRef.current.x,
            mousePositionRef.current.y
          ),
        },
        u_alpha: { value: deviceOrientationRef.current.alpha },
        u_beta: { value: deviceOrientationRef.current.beta },
        u_gamma: { value: deviceOrientationRef.current.gamma },
        u_is_mobile: { value: isMobile ? 1.0 : 0.0 },
      };

      materialRef.current = new THREE.ShaderMaterial({
        fragmentShader,
        vertexShader: THREE.ShaderLib.basic.vertexShader, // Basic pass-through vertex shader
        uniforms: uniformData,
        transparent: true,
      });

      const mesh = new THREE.Mesh(
        planeGeometryRef.current,
        materialRef.current
      );
      (sceneRef.current as any).add(mesh); // Using 'any' cast

      // --- Render Loop ---
      const renderLoop = () => {
        if (
          !rendererRef.current ||
          !sceneRef.current ||
          !cameraRef.current ||
          !materialRef.current ||
          !clockRef.current
        ) {
          if (animationRef.current) cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
          return;
        }
        animationRef.current = requestAnimationFrame(renderLoop);

        materialRef.current.uniforms.u_time.value =
          clockRef.current.getElapsedTime();

        // Update motion uniforms
        if (isMobile) {
          materialRef.current.uniforms.u_alpha.value =
            deviceOrientationRef.current.alpha;
          materialRef.current.uniforms.u_beta.value =
            deviceOrientationRef.current.beta;
          materialRef.current.uniforms.u_gamma.value =
            deviceOrientationRef.current.gamma;
        } else {
          materialRef.current.uniforms.u_mouse.value.set(
            mousePositionRef.current.x,
            mousePositionRef.current.y
          );
        }

        rendererRef.current.render(sceneRef.current, cameraRef.current);
        gl.endFrameEXP();
      };
      renderLoop();
    },
    [isMobile]
  );

  // --- Cleanup & Resize Handling (Unchanged) ---
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      if (materialRef.current) materialRef.current.dispose();
      if (planeGeometryRef.current) planeGeometryRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const handleResize = () => {
      if (rendererRef.current && materialRef.current) {
        const { innerWidth, innerHeight } = window;
        rendererRef.current.setSize(innerWidth, innerHeight);
        materialRef.current.uniforms.u_resolution.value.set(
          innerWidth,
          innerHeight
        );
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  return (
    <View style={styles.container}>
      <GLView style={styles.glView} onContextCreate={onContextCreate} />
    </View>
  );
}

// --- Styles (Unchanged) ---
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  glView: {
    flex: 1,
  },
});
