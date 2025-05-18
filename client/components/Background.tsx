import { useEffect, useRef, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { GLView, ExpoWebGLRenderingContext } from "expo-gl";
import * as THREE from "three";
import { DeviceMotion } from "expo-sensors";
import { Renderer } from "expo-three";
import { on, postEvent } from "@telegram-apps/sdk";
import { usePlatform } from "../contexts/ScreenContext";

try {
  postEvent("web_app_start_device_orientation", { refresh_rate: 20 });
} catch (error) {
  console.error("Error starting motion events", error);
}

const vertexShader = `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  #define PI 3.14159265359
  #define TWO_PI 6.28318530718

  uniform float u_time;
  uniform vec2  u_mouse;
  uniform float u_alpha;
  uniform float u_beta;
  uniform float u_gamma;
  uniform float u_is_mobile;
  uniform mat3 u_rotMatrix;

  varying vec3 vDir;

  // --- Rotation helpers ---
  mat3 rotX(float a){
    float s = sin(a), c = cos(a);
    return mat3(1.0,0.0,0.0, 0.0,c,-s, 0.0,s,c);
  }
  mat3 rotY(float a){
    float s = sin(a), c = cos(a);
    return mat3(c,0.0,s, 0.0,1.0,0.0, -s,0.0,c);
  }
  mat3 rotZ(float a){
    float s = sin(a), c = cos(a);
    return mat3(c,-s,0.0, s,c,0.0, 0.0,0.0,1.0);
  }

  vec3 paletteColor(float t) {
    vec3 palette[8] = vec3[](
      vec3(0.9490, 0.0000, 1.0000), // #F200FF
      vec3(0.9608, 0.1961, 0.8627), // #F532DC
      vec3(0.9804, 0.2353, 0.7255), // #FA3CB9
      vec3(0.9882, 0.2745, 0.5686), // #FC4691
      vec3(0.9961, 0.3137, 0.3922), // #FE5064
      vec3(1.0000, 0.4706, 0.2549), // #FF7841
      vec3(1.0000, 0.6275, 0.1176), // #FFA01E
      vec3(1.0000, 0.7843, 0.0000)  // #FFC800
    );
    float idx = t * 7.0;
    int i0 = int(floor(idx));
    int i1 = int(ceil(idx));
    return mix(palette[i0], palette[i1], fract(idx));
  }

  // Hash & 3-D noise helpers (simple, cheap noise)
  float hash(vec3 p){ return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453123); }
  float noise(vec3 p){
    vec3 i = floor(p); vec3 f = fract(p);
    // Trilinear interpolation of 8 hashed corners
    float n000 = hash(i);
    float n100 = hash(i+vec3(1.0,0.0,0.0));
    float n010 = hash(i+vec3(0.0,1.0,0.0));
    float n110 = hash(i+vec3(1.0,1.0,0.0));
    float n001 = hash(i+vec3(0.0,0.0,1.0));
    float n101 = hash(i+vec3(1.0,0.0,1.0));
    float n011 = hash(i+vec3(0.0,1.0,1.0));
    float n111 = hash(i+vec3(1.0,1.0,1.0));
    vec3 u = f*f*(3.0-2.0*f);
    return mix(mix(mix(n000,n100,u.x), mix(n010,n110,u.x), u.y),
               mix(mix(n001,n101,u.x), mix(n011,n111,u.x), u.y), u.z);
  }

  void main(){
    vec3 dir = vDir;

    // Apply device or mouse orientation
    if (u_is_mobile > 0.5) {
      dir = u_rotMatrix * dir;
    } else {
      float yaw   = u_mouse.x * PI;
      float pitch = -u_mouse.y * PI * 0.5;
      mat3 R = rotY(yaw) * rotX(pitch);
      dir = R * dir;
    }

    // 3-D moving noise on the direction vector, reduced intensity
    float t = u_time * 0.1;
    float n = noise(dir * 2.0 + t);
    // Wave pattern with slower frequency
    float w = sin((n + t) * TWO_PI * 2.0);
    vec3 col = paletteColor(w * 0.5 + 0.5);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function Background() {
  const animationRef = useRef<number | null>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const deviceOrientationRef = useRef({ alpha: 0, beta: 0, gamma: 0 });
  const orientationStatusRef = useRef<string>("unknown");
  const motionSubscriptionRef = useRef<{ remove: () => void } | null>(null);
  const { isPlatform } = usePlatform();

  const isMobile = isPlatform("ios") || isPlatform("android");
  const isTelegramMobile = isPlatform("tg_ios") || isPlatform("tg_android");
  const hasSensors = isMobile || isTelegramMobile;
  const rendererRef = useRef<Renderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);

  useEffect(() => {
    if (!isMobile) {
      if (motionSubscriptionRef.current) {
        motionSubscriptionRef.current.remove();
        motionSubscriptionRef.current = null;
      }
      return;
    }
    let isMounted = true;
    const verticalThreshold = Math.PI / 3;
    const horizontalThreshold = Math.PI / 3;
    const flatThreshold = Math.PI / 6;

    DeviceMotion.isAvailableAsync().then((isAvailable) => {
      if (isAvailable && isMounted && !motionSubscriptionRef.current) {
        motionSubscriptionRef.current = DeviceMotion.addListener(
          (motionData) => {
            const { alpha, beta, gamma } = motionData.rotation || {
              alpha: 0,
              beta: 0,
              gamma: 0,
            };

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
              currentStatus = "diagonal / intermediate";
            }

            if (currentStatus !== orientationStatusRef.current) {
              orientationStatusRef.current = currentStatus;
            }

            deviceOrientationRef.current = {
              alpha: alpha || 0,
              beta: beta || 0,
              gamma: gamma || 0,
            };
          }
        );
        DeviceMotion.setUpdateInterval(100);
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

  try {
    on(
      "device_orientation_changed",
      (payload: { alpha?: number; beta?: number; gamma?: number }) => {
        const { alpha = 0, beta = 0, gamma = 0 } = payload;
        deviceOrientationRef.current = { alpha, beta, gamma };
      }
    );
  } catch (error) {
    console.error("Error starting device orientation", error);
  }

  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (event: MouseEvent) => {
      mousePositionRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  const onContextCreate = useCallback(
    (gl: ExpoWebGLRenderingContext) => {
      // Get actual dimensions
      const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

      // Create proper renderer
      rendererRef.current = new Renderer({
        gl,
        width,
        height,
        // Use device pixel ratio for Telegram platforms as well
        pixelRatio: window.devicePixelRatio || 1,
      });

      sceneRef.current = new THREE.Scene();
      cameraRef.current = new THREE.PerspectiveCamera(
        75,
        width / height,
        0.1,
        1000
      );
      clockRef.current = new THREE.Clock();

      // Set size correctly for the specific platform
      if (isMobile || isTelegramMobile) {
        // For mobile or Telegram, use full viewport dimensions
        const viewportWidth = window.innerWidth || width;
        const viewportHeight = window.innerHeight || height;
        rendererRef.current.setSize(viewportWidth, viewportHeight, true);
        cameraRef.current.aspect = viewportWidth / viewportHeight;
      } else {
        // For web, use window dimensions
        rendererRef.current.setSize(window.innerWidth, window.innerHeight, true);
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      }

      rendererRef.current.setClearColor(0x000000, 0);
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current!.position.z = 1;

      const mouseSensitivity = 0.04;
      const currentQuat = new THREE.Quaternion();

      const uniformData = {
        u_time: { value: 0.0 },
        u_mouse: {
          value: new THREE.Vector2(
            mousePositionRef.current.x * mouseSensitivity,
            mousePositionRef.current.y * mouseSensitivity
          ),
        },
        u_alpha: { value: deviceOrientationRef.current.alpha },
        u_beta: { value: deviceOrientationRef.current.beta },
        u_gamma: { value: deviceOrientationRef.current.gamma },
        u_is_mobile: { value: hasSensors ? 1.0 : 0.0 },
        u_rotMatrix: { value: new THREE.Matrix3() },
      };

      materialRef.current = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        side: THREE.BackSide,
        uniforms: uniformData,
        transparent: true,
      });

      const geometry = new THREE.SphereGeometry(5, 128, 128);
      const mesh = new THREE.Mesh(geometry, materialRef.current!);
      sceneRef.current.add(mesh);

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

        if (hasSensors) {
          const euler = new THREE.Euler(
            deviceOrientationRef.current.beta,
            deviceOrientationRef.current.alpha,
            -deviceOrientationRef.current.gamma,
            "YXZ"
          );
          const targetQuat = new THREE.Quaternion().setFromEuler(euler);
          const alignQuat = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(1, 0, 0),
            -Math.PI / 2
          );
          targetQuat.multiply(alignQuat);
          currentQuat.slerp(targetQuat, 0.1);
          const rotationMatrix = new THREE.Matrix3().setFromMatrix4(
            new THREE.Matrix4().makeRotationFromQuaternion(currentQuat)
          );
          materialRef.current.uniforms.u_rotMatrix.value = rotationMatrix;
        } else {
          materialRef.current.uniforms.u_mouse.value.set(
            mousePositionRef.current.x * mouseSensitivity,
            mousePositionRef.current.y * mouseSensitivity
          );
        }

        rendererRef.current.render(sceneRef.current, cameraRef.current!);
        gl.endFrameEXP();
      };
      renderLoop();
    },
    [hasSensors]
  );

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      if (materialRef.current) materialRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    // Handle resize for all platforms, not just non-mobile
    const handleResize = () => {
      if (rendererRef.current && cameraRef.current) {
        const { innerWidth, innerHeight } = window;
        const viewportWidth = innerWidth;
        const viewportHeight = innerHeight;

        // Set physical and logical size
        rendererRef.current.setSize(viewportWidth, viewportHeight, true);

        if (rendererRef.current.domElement) {
          rendererRef.current.domElement.style.width = '100%';
          rendererRef.current.domElement.style.height = '100%';
        }

        // Update camera aspect ratio
        cameraRef.current.aspect = viewportWidth / viewportHeight;
        cameraRef.current.updateProjectionMatrix();
      }
    };
    // Call it once to ensure initial sizing is correct
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Remove isMobile dependency to handle all platforms

  return (
    <View style={{...StyleSheet.absoluteFillObject, zIndex: -1}}>
      <GLView
        style={styles.glView}
        onContextCreate={onContextCreate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  glView: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
