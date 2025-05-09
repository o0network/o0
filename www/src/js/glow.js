import * as THREE from "three";

document.addEventListener("DOMContentLoaded", function () {
  // Create container for glow effect
  const glowContainer = document.createElement("div");
  glowContainer.id = "glow-effect";
  glowContainer.style.position = "absolute";
  glowContainer.style.top = "0";
  glowContainer.style.left = "0";
  glowContainer.style.width = "100%";
  glowContainer.style.height = "100%";
  glowContainer.style.pointerEvents = "none";
  glowContainer.style.zIndex = "1"; // Between background and content

  // Insert before the logo section
  const logoSection = document.querySelector(".logo-section");
  if (logoSection && logoSection.parentNode) {
    logoSection.parentNode.insertBefore(glowContainer, logoSection);
  }

  // Check if container was created successfully
  if (!glowContainer) return;

  const startTime = Date.now();

  // Create scene
  const scene = new THREE.Scene();

  // Set width and height to fill the viewport
  const width = window.innerWidth;
  const height = window.innerHeight;
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.lookAt(scene.position);
  camera.position.z = 10;

  // Create renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(width, height);
  glowContainer.appendChild(renderer.domElement);

  // Make the container fill the viewport
  glowContainer.style.width = "100vw";
  glowContainer.style.height = "100vh";

  // Handle window resize
  window.addEventListener("resize", function () {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    renderer.setSize(newWidth, newHeight);
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    glowContainer.style.width = "100vw";
    glowContainer.style.height = "100vh";
  });

  // Load textures
  const loader = new THREE.TextureLoader();

  // Create a circlar mask texture
  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = 512;
  maskCanvas.height = 512;
  const maskCtx = maskCanvas.getContext("2d");

  const gradient = maskCtx.createRadialGradient(
    maskCanvas.width / 2,
    maskCanvas.height / 2,
    0,
    maskCanvas.width / 2,
    maskCanvas.height / 2,
    maskCanvas.width / 2
  );

  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.8)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  maskCtx.fillStyle = gradient;
  maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

  const maskTexture = new THREE.CanvasTexture(maskCanvas);

  // Create a noise texture for distortion
  const distCanvas = document.createElement("canvas");
  distCanvas.width = 512;
  distCanvas.height = 512;
  const distCtx = distCanvas.getContext("2d");

  for (let y = 0; y < distCanvas.height; y++) {
    for (let x = 0; x < distCanvas.width; x++) {
      distCtx.fillStyle = `rgba(
        ${Math.floor(Math.random() * 255)},
        ${Math.floor(Math.random() * 255)},
        ${Math.floor(Math.random() * 255)},
        1)`;
      distCtx.fillRect(x, y, 1, 1);
    }
  }

  const distTexture = new THREE.CanvasTexture(distCanvas);

  // More saturated vibrant colors array
  const colors = [
    new THREE.Vector3(1.0, 0.0, 0.0), // Red
    new THREE.Vector3(0.0, 0.0, 1.0), // Blue
    new THREE.Vector3(1.0, 0.5, 0.0), // Orange
    new THREE.Vector3(0.5, 0.0, 1.0), // Purple
    new THREE.Vector3(0.0, 1.0, 0.0), // Green
    new THREE.Vector3(1.0, 1.0, 0.0), // Yellow
  ];

  // Create materials and meshes
  const mats = [];
  const objs = [];
  const numLayers = 20; // Fewer layers   for better performance

  // Create shader materials
  for (let i = 0; i < numLayers; i++) {
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        _time: { value: 1.0 },
        _random: { value: Math.random() * 2 - 1 },
        _mask: { value: maskTexture },
        _dist: { value: distTexture },
        _color: { value: colors[i % colors.length] },
        _scale: { value: 1.0 }, // For animation during click
      },
      vertexShader: document.getElementById("glowVertexShader").textContent,
      fragmentShader: document.getElementById("glowFragmentShader").textContent,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    mats.push(mat);
  }

  // Create plane geometry for all glow layers
  const geometry = new THREE.PlaneGeometry(4, 4, 1);

  // Create meshes and add to scene
  for (let i = 0; i < mats.length; i++) {
    const object = new THREE.Mesh(geometry, mats[i]);
    scene.add(object);

    // Position more tightly around the center
    const radius = 1.0;
    const angle = Math.random() * Math.PI * 2;
    object.position.x = Math.cos(angle) * radius * Math.random();
    object.position.y = Math.sin(angle) * radius * Math.random();
    object.position.z = -2 + i * 0.05; // Layer them at different depths

    // Randomize scale for variety
    const scale = 0.3 + Math.random() * 0.7;
    object.scale.set(scale, scale, 1);

    objs.push(object);
  }

  // Animation state - reduced speed
  let glowScale = 1.0;
  let targetScale = 1.0;
  let isAnimating = false;
  let rotationSpeed = 0.0003; // Reduced from 0.001
  let targetRotationSpeed = 0.0003; // Reduced from 0.001

  // Listen for logo click
  const logoWrapper = document.querySelector(".logo-wrapper");
  if (logoWrapper) {
    logoWrapper.addEventListener("click", () => {
      // Minimize the glow
      targetScale = 0.5; // Less dramatic reduction
      targetRotationSpeed = 0.002; // Slower rotation, reduced from 0.01
      isAnimating = true;

      // Reset back to normal after a delay
      setTimeout(() => {
        targetScale = 1.0;
        targetRotationSpeed = 0.0003;
      }, 200);
    });
  }

  // Listen for download button click
  const downloadLink = document.querySelector(".download-link");
  if (downloadLink) {
    downloadLink.addEventListener("click", () => {
      // Maximize the glow and add rotation - reduced values
      targetScale = 1.5; // Less expansion
      targetRotationSpeed = 0.01; // Slower rotation, reduced from 0.05
      isAnimating = true;

      // Pulse effect
      setTimeout(() => {
        targetScale = 1.1;
      }, 300);

      setTimeout(() => {
        targetScale = 1.3;
      }, 600);

      // Reset back to normal after the animation
      setTimeout(() => {
        targetScale = 1.0;
        targetRotationSpeed = 0.0003;
      }, 1000);
    });
  }

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    const elapsedMilliseconds = Date.now() - startTime;
    const elapsedSeconds = elapsedMilliseconds / 1000;

    // Smoothly animate scale and rotation
    if (isAnimating) {
      glowScale += (targetScale - glowScale) * 0.05; // Slower transition
      rotationSpeed += (targetRotationSpeed - rotationSpeed) * 0.05; // Slower speed change

      // Stop animating when close enough to target
      if (
        Math.abs(glowScale - targetScale) < 0.01 &&
        Math.abs(rotationSpeed - targetRotationSpeed) < 0.0001
      ) {
        isAnimating = false;
      }
    }

    // Update shader uniforms and rotate objects
    for (let i = 0; i < mats.length; i++) {
      // Update time with rotation speed - slowed down time factor
      mats[i].uniforms._time.value =
        20.0 * // Reduced from 60.0
        mats[i].uniforms._random.value *
        elapsedSeconds *
        (1 + rotationSpeed * 5); // Reduced multiplier from 10 to 5
      mats[i].uniforms._scale.value = glowScale;

      // Rotate objects around center - slower rotation
      const object = objs[i];
      const angle =
        rotationSpeed * elapsedMilliseconds * 0.0005 * (i % 2 === 0 ? 1 : -1); // Reduced factor from 0.001 to 0.0005
      const radius = Math.sqrt(
        object.position.x * object.position.x +
          object.position.y * object.position.y
      );
      const currentAngle = Math.atan2(object.position.y, object.position.x);
      object.position.x = Math.cos(currentAngle + angle) * radius;
      object.position.y = Math.sin(currentAngle + angle) * radius;
    }

    renderer.render(scene, camera);
  }

  animate();
});
