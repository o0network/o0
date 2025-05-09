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

document.addEventListener("DOMContentLoaded", () => {
  const engine = Engine.create({ enableSleeping: false });
  engine.world.gravity.y = 0;
  const bg = document.querySelector(".preview-bg");
  if (!bg) return;

  let videos = [];
  let isDragging = false;
  let currentBody = null;
  let dragOffset = { x: 0, y: 0 };
  let clickStartTime = 0;

  // Size based on viewport width
  const isNarrowScreen = window.innerWidth < 600;
  // Calculate size in vw units and convert to pixels
  const videoSizeVw = isNarrowScreen ? 15 : 22;
  const videoSize = (window.innerWidth * videoSizeVw) / 100;

  // Apply safe view height to the background container
  function updateBgHeight() {
    // Use svh (safe viewport height) with fallback
    const safeHeight = window.innerHeight;
    bg.style.height = `100svh`; // Modern browsers with safe viewport units
    bg.style.height = `${safeHeight}px`; // Fallback
  }

  updateBgHeight();

  const render = Render.create({
    element: bg,
    engine: engine,
    options: {
      width: bg.clientWidth,
      height: bg.clientHeight,
      wireframes: false,
      background: "transparent",
      pixelRatio: window.devicePixelRatio,
    },
  });

  render.canvas.style.display = "none";

  let canvasRect = bg.getBoundingClientRect();

  setupVideos();
  setupOrbitalPath();
  setupDragHandling();
  setupEngineEvents();
  setupClickOutsideReset();

  window.addEventListener("resize", debounce(handleResize, 100));
  window.addEventListener("orientationchange", debounce(handleResize, 100));

  const runner = Runner.create();
  Runner.run(runner, engine);

  function setupVideos() {
    canvasRect = bg.getBoundingClientRect();
    const centerX = canvasRect.width / 2;
    const centerY = canvasRect.height / 2;

    // Calculate orbital parameters based on screen dimensions
    const aspectRatio = canvasRect.width / canvasRect.height;

    // Adjust orbital size based on available space using vw and vh
    const viewportMin = Math.min(window.innerWidth, window.innerHeight);
    const orbitalSizeVw = isNarrowScreen ? 35 : 40;
    const orbitalSize = viewportMin * (orbitalSizeVw / 100);

    // Calculate horizontal and vertical radii
    const horizontalRadius = Math.min(centerX * 0.85, orbitalSize);
    const verticalRadius = Math.min(centerY * 0.85, orbitalSize);

    // More oval for vertical screens, more circular for horizontal
    const isVertical = window.innerWidth < window.innerHeight;
    const orbitalA = isVertical ? horizontalRadius * 0.65 : horizontalRadius;
    const orbitalB = isVertical ? verticalRadius : verticalRadius * 0.65;

    const count = 6;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;

      // Elliptical coordinates
      const spawnX = centerX + Math.cos(angle) * orbitalA;
      const spawnY = centerY + Math.sin(angle) * orbitalB;

      const body = createPhysicsBody(
        spawnX,
        spawnY,
        i,
        centerX,
        centerY,
        orbitalA,
        orbitalB
      );
      const wrapper = createVideoElement(i + 1, body.id);
      wrapper.style.transform = `translate3d(${spawnX - videoSize / 2}px, ${
        spawnY - videoSize / 2
      }px, 0)`;
      videos.push({ body, element: wrapper, angle, orbitalA, orbitalB });
      Composite.add(engine.world, body);
      bg.appendChild(wrapper);
    }
  }

  function createPhysicsBody(
    spawnX,
    spawnY,
    index,
    centerX,
    centerY,
    orbitalA,
    orbitalB
  ) {
    const angle = (index / 6) * Math.PI * 2;

    // Calculate tangent to the ellipse at this point
    const tangentAngle =
      Math.atan2(-orbitalA * Math.sin(angle), orbitalB * Math.cos(angle)) +
      Math.PI / 2;

    const ORBITAL_SPEED = 0.2;
    const vx = Math.cos(tangentAngle) * ORBITAL_SPEED;
    const vy = Math.sin(tangentAngle) * ORBITAL_SPEED;

    const radius = videoSize / 2;
    const body = Bodies.circle(spawnX, spawnY, radius, {
      restitution: 0.8,
      friction: 0.01,
      frictionAir: 0.02,
      density: 0.6,
      inertia: Infinity,
      render: { visible: false },
      plugin: {
        attractors: [
          function (bodyA, bodyB) {
            if (bodyB.isStatic || bodyA.isStatic) return null;

            // Current position in relation to center
            const dx = bodyA.position.x - centerX;
            const dy = bodyA.position.y - centerY;

            // Current distance from elliptical path
            const currentAngle = Math.atan2(dy, dx);
            const targetX = centerX + Math.cos(currentAngle) * orbitalA;
            const targetY = centerY + Math.sin(currentAngle) * orbitalB;

            // Force towards the elliptical path
            const forceX = (targetX - bodyA.position.x) * 0.0001;
            const forceY = (targetY - bodyA.position.y) * 0.0001;

            return {
              x: forceX,
              y: forceY,
            };
          },
        ],
      },
    });

    Body.setVelocity(body, { x: vx, y: vy });
    return body;
  }

  function setupOrbitalPath() {
    // No physical walls, just orbital forces applied in setupEngineEvents
  }

  function createVideoElement(i, id) {
    const wrapper = document.createElement("div");
    wrapper.className = "video-note";
    wrapper.style.width = `${videoSize}px`;
    wrapper.style.height = `${videoSize}px`;
    wrapper.style.willChange = "transform";
    wrapper.style.borderRadius = "50%";
    wrapper.style.position = "absolute";
    wrapper.style.overflow = "hidden";
    wrapper.style.zIndex = "3";
    wrapper.dataset.bodyId = id;

    const playerRing = document.createElement("div");
    playerRing.className = "player-ring";
    playerRing.style.position = "absolute";
    playerRing.style.width = "100%";
    playerRing.style.height = "100%";
    playerRing.style.borderRadius = "50%";
    playerRing.style.border = "2px solid rgba(255, 255, 255, 0.8)";
    playerRing.style.boxSizing = "border-box";
    playerRing.style.boxShadow = "0 0 0 2px rgba(0, 0, 0, 0.1)";
    playerRing.style.zIndex = "1";

    const videoContainer = document.createElement("div");
    videoContainer.className = "video-container";
    videoContainer.style.width = "100%";
    videoContainer.style.height = "100%";
    videoContainer.style.borderRadius = "50%";
    videoContainer.style.overflow = "hidden";
    videoContainer.style.position = "relative";
    videoContainer.style.display = "flex";
    videoContainer.style.alignItems = "center";
    videoContainer.style.justifyContent = "center";

    const thumbnail = document.createElement("img");
    thumbnail.src = `assets/thumbnails/${i}.jpg`;
    thumbnail.alt = `Video ${i} preview`;
    thumbnail.style.width = "100%";
    thumbnail.style.height = "100%";
    thumbnail.style.objectFit = "cover";
    thumbnail.style.objectPosition = "center";
    thumbnail.style.cursor = "pointer";
    thumbnail.draggable = false;

    const video = document.createElement("video");
    video.src = `assets/media/${i}.mp4`;
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";
    video.style.objectPosition = "center";
    video.style.display = "none";
    video.controls = false;
    video.draggable = false;

    const playIndicator = document.createElement("div");
    playIndicator.className = "play-indicator";
    playIndicator.style.position = "absolute";
    playIndicator.style.top = "50%";
    playIndicator.style.left = "50%";
    playIndicator.style.transform = "translate(-50%, -50%)";
    playIndicator.style.transition = "opacity 0.2s";
    playIndicator.style.zIndex = "4";
    playIndicator.innerHTML = `
<svg width="41" height="47" viewBox="0 0 41 47" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M2 23.5L2 4.46282C2 2.9235 3.66611 1.96122 4.99944 2.73045L37.9972 21.7676C39.3313 22.5373 39.3313 24.4627 37.9972 25.2324L4.99944 44.2695C3.66611 45.0388 2 44.0765 2 42.5372L2 23.5Z" fill="#EEEEEE" stroke="#EEEEEE" stroke-width="4" stroke-linejoin="round"/>
</svg>`;

    wrapper.addEventListener("click", function (e) {
      if (isDragging || Date.now() - clickStartTime < 200) return;

      if (video.style.display === "none") {
        thumbnail.style.display = "none";
        video.style.display = "block";
        playIndicator.style.opacity = "0";
        video.play();
        wrapper.classList.add("playing");
        Body.setStatic(
          videos.find((vid) => vid.body.id === parseInt(id)).body,
          true
        );
        wrapper.style.zIndex = "5";

        document.querySelectorAll(".video-note video").forEach((v) => {
          if (v !== video && v.style.display === "block") {
            const otherWrapper = v.closest(".video-note");
            v.pause();
            v.style.display = "none";
            otherWrapper.querySelector("img").style.display = "block";
            otherWrapper.querySelector(".play-indicator").style.opacity = "1";
            otherWrapper.classList.remove("playing");
            const otherBody = videos.find(
              (vid) => vid.element === otherWrapper
            ).body;
            Body.setStatic(otherBody, false);
            otherWrapper.style.zIndex = "3";
          }
        });
      } else if (!video.paused) {
        video.pause();
        playIndicator.style.opacity = "1";
      } else {
        video.play();
        playIndicator.style.opacity = "0";
      }
    });

    video.addEventListener("ended", function () {
      video.style.display = "none";
      thumbnail.style.display = "block";
      playIndicator.style.opacity = "1";
      wrapper.classList.remove("playing");
      Body.setStatic(videos.find((vid) => vid.element === wrapper).body, false);
      wrapper.style.zIndex = "3";
    });

    videoContainer.appendChild(thumbnail);
    videoContainer.appendChild(video);
    videoContainer.appendChild(playIndicator);
    wrapper.appendChild(videoContainer);
    wrapper.appendChild(playerRing);

    return wrapper;
  }

  function setupDragHandling() {
    document.addEventListener("mousedown", startDrag);
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", endDrag);
    document.addEventListener("touchstart", startDrag, { passive: false });
    document.addEventListener("touchmove", handleDrag, { passive: false });
    document.addEventListener("touchend", endDrag, { passive: false });
  }

  function startDrag(e) {
    const evt = e.touches?.[0] || e;
    const target = evt.target.closest(".video-note");
    if (!target) return;
    clickStartTime = Date.now();
    isDragging = true;
    currentBody = videos.find(
      (vid) => vid.body.id === parseInt(target.dataset.bodyId)
    )?.body;
    if (currentBody) {
      target.classList.add("dragging");
      document.body.classList.add("dragging");
      Body.setVelocity(currentBody, { x: 0, y: 0 });
      if (!target.classList.contains("playing")) {
        Body.setStatic(currentBody, true);
      }
      const scale = render.options.pixelRatio;
      const mouseX = (evt.clientX - canvasRect.left) * scale;
      const mouseY = (evt.clientY - canvasRect.top) * scale;
      dragOffset.x = mouseX - currentBody.position.x;
      dragOffset.y = mouseY - currentBody.position.y;
    }
  }

  function handleDrag(e) {
    if (!isDragging || !currentBody) return;
    e.preventDefault();
    const evt = e.touches?.[0] || e;
    const scale = render.options.pixelRatio;
    const mouseX = (evt.clientX - canvasRect.left) * scale;
    const mouseY = (evt.clientY - canvasRect.top) * scale;
    const radius = videoSize / 2;
    const targetX = Math.max(
      radius,
      Math.min(canvasRect.width - radius, mouseX - dragOffset.x)
    );
    const targetY = Math.max(
      radius,
      Math.min(canvasRect.height - radius, mouseY - dragOffset.y)
    );
    Body.setPosition(currentBody, { x: targetX, y: targetY });
  }

  function endDrag(e) {
    if (e.type === "mouseup" || e.type === "touchend") {
      document.querySelectorAll(".video-note.dragging").forEach((el) => {
        el.classList.remove("dragging");
      });
      document.body.classList.remove("dragging");
    }
    if (!currentBody) return;

    const isClick = Date.now() - clickStartTime < 200;
    const element = videos.find((vid) => vid.body === currentBody)?.element;

    if (!element?.classList.contains("playing")) {
      Body.setStatic(currentBody, false);

      // Find original position on the elliptical path based on image's index
      const centerX = canvasRect.width / 2;
      const centerY = canvasRect.height / 2;
      const videoData = videos.find((vid) => vid.body === currentBody);

      if (videoData) {
        // Force immediate return to original position on the path
        const idx = videos.indexOf(videoData);
        const angle = (idx / videos.length) * Math.PI * 2;
        const targetX = centerX + Math.cos(angle) * videoData.orbitalA;
        const targetY = centerY + Math.sin(angle) * videoData.orbitalB;

        // Strong homing velocity toward the target position
        const dx = targetX - currentBody.position.x;
        const dy = targetY - currentBody.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Calculate tangent vector at the target angle
        const tangentAngle =
          Math.atan2(
            -videoData.orbitalA * Math.sin(angle),
            videoData.orbitalB * Math.cos(angle)
          ) +
          Math.PI / 2;

        // Stronger return velocity that increases with distance
        const RETURN_SPEED = Math.min(0.5, 0.2 + dist * 0.001);
        Body.setVelocity(currentBody, {
          x: Math.cos(tangentAngle) * RETURN_SPEED + dx * 0.01,
          y: Math.sin(tangentAngle) * RETURN_SPEED + dy * 0.01,
        });
      }
    }

    isDragging = false;
    currentBody = null;
  }

  function setupEngineEvents() {
    const BASE_SPEED = 0.05;
    const REPULSION_STRENGTH = 0.001;
    const REPULSION_DISTANCE = 120;
    const REPULSION_DISTANCE_SQ = REPULSION_DISTANCE * REPULSION_DISTANCE;
    const centerX = canvasRect.width / 2;
    const centerY = canvasRect.height / 2;

    Events.on(engine, "afterUpdate", () => {
      canvasRect = bg.getBoundingClientRect();

      videos.forEach(({ body, element, orbitalA, orbitalB }, index) => {
        if (!isDragging || body !== currentBody) {
          // Calculate target position on elliptical path based on original index
          const targetAngle = (index / videos.length) * Math.PI * 2;
          const targetX = centerX + Math.cos(targetAngle) * orbitalA;
          const targetY = centerY + Math.sin(targetAngle) * orbitalB;

          // Current position and angle
          const currentDx = body.position.x - centerX;
          const currentDy = body.position.y - centerY;
          const currentAngle = Math.atan2(currentDy, currentDx);

          // Calculate forces to return to intended position
          const dx = targetX - body.position.x;
          const dy = targetY - body.position.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Stronger force with greater distance
          const pathForceMultiplier = Math.min(0.004, 0.001 + dist * 0.00001);
          const pathForceX = dx * pathForceMultiplier;
          const pathForceY = dy * pathForceMultiplier;

          Body.applyForce(body, body.position, {
            x: pathForceX,
            y: pathForceY,
          });

          // Add tangential force to maintain orbital motion
          const tangentAngle =
            Math.atan2(
              -orbitalA * Math.sin(targetAngle),
              orbitalB * Math.cos(targetAngle)
            ) +
            Math.PI / 2;

          const speed = Vector.magnitude(body.velocity);
          if (speed < BASE_SPEED || dist > orbitalA * 0.2) {
            // Stronger tangential force when far from orbital path
            const tangentForceMagnitude = Math.min(
              0.0004,
              0.0001 + dist * 0.000001
            );
            Body.applyForce(body, body.position, {
              x: Math.cos(tangentAngle) * tangentForceMagnitude,
              y: Math.sin(tangentAngle) * tangentForceMagnitude,
            });
          }

          // Damping to prevent too much oscillation/energy
          if (speed > BASE_SPEED * 2) {
            Body.setVelocity(body, {
              x: body.velocity.x * 0.98,
              y: body.velocity.y * 0.98,
            });
          }
        }

        // Clamp to bounds to prevent flying off
        const radius = videoSize / 2;
        const clampedX = Math.max(
          radius,
          Math.min(canvasRect.width - radius, body.position.x)
        );
        const clampedY = Math.max(
          radius,
          Math.min(canvasRect.height - radius, body.position.y)
        );
        if (clampedX !== body.position.x || clampedY !== body.position.y) {
          Body.setPosition(body, { x: clampedX, y: clampedY });
        }

        // Apply transform with scale if playing
        const scale = element.classList.contains("playing") ? 1.05 : 1;
        element.style.transform = `translate3d(${
          body.position.x - videoSize / 2
        }px, ${body.position.y - videoSize / 2}px, 0) scale(${scale})`;
      });

      // Gentle repulsion between videos
      for (let i = 0; i < videos.length; i++) {
        for (let j = i + 1; j < videos.length; j++) {
          const A = videos[i].body,
            B = videos[j].body;
          if ((A === currentBody || B === currentBody) && isDragging) continue;
          const dx = B.position.x - A.position.x,
            dy = B.position.y - A.position.y;
          const distSq = dx * dx + dy * dy;
          if (distSq > 0 && distSq < REPULSION_DISTANCE_SQ) {
            const dist = Math.sqrt(distSq);
            const forceMag = REPULSION_STRENGTH / dist;
            const force = { x: dx * forceMag, y: dy * forceMag };
            Body.applyForce(A, A.position, { x: -force.x, y: -force.y });
            Body.applyForce(B, B.position, force);
          }
        }
      }
    });
  }

  function setupClickOutsideReset() {
    document.addEventListener(
      "click",
      (e) => {
        const playingWrapper = document.querySelector(".video-note.playing");
        if (!playingWrapper) return;
        if (!playingWrapper.contains(e.target)) {
          const video = playingWrapper.querySelector("video");
          const thumbnail = playingWrapper.querySelector("img");
          if (video && video.style.display === "block") {
            video.pause();
            video.style.display = "none";
            thumbnail.style.display = "block";
            playingWrapper.querySelector(".play-indicator").style.opacity = "1";
            playingWrapper.classList.remove("playing");
            Body.setStatic(
              videos.find((vid) => vid.element === playingWrapper).body,
              false
            );
            playingWrapper.style.zIndex = "3";
          }
        }
      },
      true
    );
  }

  function handleResize() {
    const isVerticalNow = window.innerWidth < window.innerHeight;
    const isNarrowScreenNow = window.innerWidth < 600;

    // Recalculate video size in vw
    const videoSizeVwNew = isNarrowScreenNow ? 15 : 22;
    const videoSizeNew = (window.innerWidth * videoSizeVwNew) / 100;

    // Update background height
    updateBgHeight();

    // Get new dimensions
    canvasRect = bg.getBoundingClientRect();
    const centerX = canvasRect.width / 2;
    const centerY = canvasRect.height / 2;

    // Calculate new orbital parameters
    const viewportMin = Math.min(window.innerWidth, window.innerHeight);
    const orbitalSizeVw = isNarrowScreenNow ? 35 : 40;
    const orbitalSize = viewportMin * (orbitalSizeVw / 100);

    const horizontalRadius = Math.min(centerX * 0.85, orbitalSize);
    const verticalRadius = Math.min(centerY * 0.85, orbitalSize);

    const orbitalA = isVerticalNow ? horizontalRadius * 0.65 : horizontalRadius;
    const orbitalB = isVerticalNow ? verticalRadius : verticalRadius * 0.65;

    // Full reset is needed if major layout changes or size changes
    if (
      isVertical !== isVerticalNow ||
      isNarrowScreen !== isNarrowScreenNow ||
      Math.abs(videoSize - videoSizeNew) > 10
    ) {
      window.location.reload();
      return;
    }

    // Update render dimensions
    render.canvas.width = canvasRect.width;
    render.canvas.height = canvasRect.height;

    // Update orbital parameters for each video
    videos.forEach((vid) => {
      vid.orbitalA = orbitalA;
      vid.orbitalB = orbitalB;
    });
  }

  function debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(null, args), wait);
    };
  }
});
