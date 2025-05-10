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

  let backdropElement;
  let currentZoomedVideoInfo = null;

  // Size based on viewport width
  let isNarrowScreen = window.innerWidth < 600;
  // Calculate size in vw units and convert to pixels
  let videoSizeVw = isNarrowScreen ? 15 : 22;
  let videoSize = Math.max(30, (window.innerWidth * videoSizeVw) / 100); // Ensure minimum size

  // Apply safe view height to the background container
  function updateBgHeight() {
    // Use svh (safe viewport height) with fallback
    const safeHeight = window.innerHeight;
    bg.style.height = `100svh`; // Modern browsers with safe viewport units
    bg.style.height = `${safeHeight}px`; // Fallback
  }

  updateBgHeight();
  createBackdrop();

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
  setupDragHandling();
  setupEngineEvents();
  setupClickOutsideReset();

  window.addEventListener("resize", debounce(handleResize, 100));
  window.addEventListener("orientationchange", debounce(handleResize, 100));

  const runner = Runner.create();
  Runner.run(runner, engine);

  function createBackdrop() {
    backdropElement = document.createElement("div");
    backdropElement.className = "video-backdrop";
    backdropElement.style.position = "fixed";
    backdropElement.style.top = "0";
    backdropElement.style.left = "0";
    backdropElement.style.width = "100vw";
    backdropElement.style.height = "100vh";
    backdropElement.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    backdropElement.style.display = "none";
    backdropElement.style.zIndex = "9";
    backdropElement.style.cursor = "pointer";
    document.body.appendChild(backdropElement);

    backdropElement.addEventListener("click", () => {
      if (currentZoomedVideoInfo) {
        unzoomVideo(currentZoomedVideoInfo.element);
      }
    });
  }

  function setupVideos() {
    canvasRect = bg.getBoundingClientRect();
    const centerX = canvasRect.width / 2;
    const centerY = canvasRect.height / 2;
    const count = 6;
    // Remove old videos if any
    videos.forEach((v) => v.element.remove());
    videos = [];

    // Responsive oval radii
    const isVertical = window.innerWidth < window.innerHeight;
    const isTiny = window.innerWidth < 420 || window.innerHeight < 420;
    let ovalA = centerX * (isVertical ? 0.65 : 0.85);
    let ovalB = centerY * (isVertical ? 0.85 : 0.65);
    // Clamp minimums
    ovalA = Math.max(ovalA, videoSize * 2);
    ovalB = Math.max(ovalB, videoSize * 2);

    for (let i = 0; i < count; i++) {
      let x, y;
      if (isTiny) {
        // 3 on top, 3 on bottom
        const row = i < 3 ? 0 : 1;
        const col = i % 3;
        const spacing = (canvasRect.width - videoSize * 3) / 4;
        x = spacing + videoSize / 2 + col * (videoSize + spacing);
        y =
          row === 0
            ? videoSize / 2 + spacing
            : canvasRect.height - videoSize / 2 - spacing;
      } else {
        // Evenly around oval
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
        x = centerX + Math.cos(angle) * ovalA;
        y = centerY + Math.sin(angle) * ovalB;
      }
      const wrapper = createVideoElement(i + 1, null, i + 1);
      wrapper.style.transform = `translate3d(${x - videoSize / 2}px, ${
        y - videoSize / 2
      }px, 0)`;
      videos.push({ element: wrapper, angle: i, ovalA, ovalB });
      bg.appendChild(wrapper);
    }
  }

  function createVideoElement(i, _body, id) {
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

    if (target.classList.contains("zoomed")) {
      isDragging = false;
      return;
    }
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
      const mouseX = evt.clientX - canvasRect.left;
      const mouseY = evt.clientY - canvasRect.top;
      dragOffset.x = mouseX - currentBody.position.x;
      dragOffset.y = mouseY - currentBody.position.y;
    }
  }

  function handleDrag(e) {
    if (!isDragging || !currentBody) return;
    e.preventDefault();
    const evt = e.touches?.[0] || e;
    const mouseX = evt.clientX - canvasRect.left;
    const mouseY = evt.clientY - canvasRect.top;
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
    if (!currentBody) {
      isDragging = false;
      return;
    }

    const isClick = Date.now() - clickStartTime < 200;
    const element = videos.find((vid) => vid.body === currentBody)?.element;

    if (!isClick) {
      if (element && !element.classList.contains("zoomed")) {
        Body.setStatic(currentBody, false);

        const centerX = canvasRect.width / 2;
        const centerY = canvasRect.height / 2;
        const videoData = videos.find((vid) => vid.body === currentBody);

        if (videoData) {
          const idx = videos.indexOf(videoData);
          const angle = (idx / videos.length) * Math.PI * 2;
          const targetX = centerX + Math.cos(angle) * videoData.ovalA;
          const targetY = centerY + Math.sin(angle) * videoData.ovalB;

          const dx = targetX - currentBody.position.x;
          const dy = targetY - currentBody.position.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const tangentAngle =
            Math.atan2(
              -videoData.ovalA * Math.sin(angle),
              videoData.ovalB * Math.cos(angle)
            ) +
            Math.PI / 2;

          const RETURN_SPEED = Math.min(0.5, 0.2 + dist * 0.001);
          Body.setVelocity(currentBody, {
            x: Math.cos(tangentAngle) * RETURN_SPEED + dx * 0.01,
            y: Math.sin(tangentAngle) * RETURN_SPEED + dy * 0.01,
          });
        }
      } else if (element && element.classList.contains("zoomed")) {
        Body.setStatic(currentBody, true);
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

      videos.forEach(({ body, element, ovalA, ovalB }, index) => {
        if (element.classList.contains("zoomed")) {
          // Zoomed videos are positioned via direct style manipulation (left, top, width, height)
          // and their physics body is static. No transform update from physics needed here.
        } else {
          // Update transform for non-zoomed videos based on physics body
          const currentVideoRadius = videoSize / 2;
          element.style.transform = `translate3d(${
            body.position.x - currentVideoRadius
          }px, ${body.position.y - currentVideoRadius}px, 0) scale(1)`;

          // Physics logic for returning to slot (if not static and not dragged)
          if (!body.isStatic && (!isDragging || body !== currentBody)) {
            // Calculate target position on elliptical path based on original index
            const targetAngle = (index / videos.length) * Math.PI * 2;
            const targetX = centerX + Math.cos(targetAngle) * ovalA;
            const targetY = centerY + Math.sin(targetAngle) * ovalB;

            // Current position and angle
            const currentDx = body.position.x - centerX;
            const currentDy = body.position.y - centerY;

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

            // Add tangential force to maintain orbital motion (gentle nudge)
            const tangentAngle =
              Math.atan2(
                -ovalA * Math.sin(targetAngle),
                ovalB * Math.cos(targetAngle)
              ) +
              Math.PI / 2;
            const speed = Vector.magnitude(body.velocity);
            if (speed < BASE_SPEED || dist > ovalA * 0.2) {
              const tangentForceMagnitude = Math.min(
                0.0004,
                0.0001 + dist * 0.000001
              );
              Body.applyForce(body, body.position, {
                x: Math.cos(tangentAngle) * tangentForceMagnitude,
                y: Math.sin(tangentAngle) * tangentForceMagnitude,
              });
            }

            // Damping
            if (speed > BASE_SPEED * 2) {
              Body.setVelocity(body, {
                x: body.velocity.x * 0.98,
                y: body.velocity.y * 0.98,
              });
            }
          }
        }

        // Clamp to bounds to prevent flying off (applies to all)
        const radius = element.classList.contains("zoomed")
          ? parseFloat(element.style.width) / 2
          : videoSize / 2;
        const itemIsZoomedAndCentered = element.classList.contains("zoomed");

        if (!itemIsZoomedAndCentered) {
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
        }
      });

      // Gentle repulsion between videos (non-zoomed ones primarily)
      for (let i = 0; i < videos.length; i++) {
        for (let j = i + 1; j < videos.length; j++) {
          const A = videos[i].body,
            B = videos[j].body;
          if ((A === currentBody || B === currentBody) && isDragging) continue;
          if (
            currentZoomedVideoInfo &&
            (A === currentZoomedVideoInfo.body ||
              B === currentZoomedVideoInfo.body)
          ) {
            continue;
          }
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
        if (currentZoomedVideoInfo && currentZoomedVideoInfo.element) {
          const zoomedElement = currentZoomedVideoInfo.element;
          if (e.target === backdropElement) {
            return;
          }
          if (!zoomedElement.contains(e.target)) {
            if (
              e.target.closest(".video-note") &&
              e.target.closest(".video-note") !== zoomedElement
            ) {
              return;
            }
            unzoomVideo(zoomedElement);
          }
        }
      },
      true
    );
  }

  function unzoomVideo(wrapper) {
    if (!wrapper || !wrapper.classList.contains("zoomed")) return;

    const videoData = videos.find((vid) => vid.element === wrapper);
    if (!videoData) return;

    const video = wrapper.querySelector("video");
    const thumbnail = wrapper.querySelector("img");
    const playIndicator = wrapper.querySelector(".play-indicator");

    if (video) {
      video.pause();
      video.style.display = "none";
    }
    if (thumbnail) thumbnail.style.display = "block";
    if (playIndicator) playIndicator.style.opacity = "1";

    wrapper.classList.remove("zoomed");
    wrapper.classList.remove("playing");
    Body.setStatic(videoData.body, false);

    wrapper.style.width = `${videoSize}px`;
    wrapper.style.height = `${videoSize}px`;
    wrapper.style.left = "";
    wrapper.style.top = "";
    wrapper.style.zIndex = "3";

    if (backdropElement) backdropElement.style.display = "none";
    currentZoomedVideoInfo = null;
  }

  function handleResize() {
    isNarrowScreen = window.innerWidth < 600;
    videoSizeVw = isNarrowScreen ? 15 : 22;
    const videoSizeNew = Math.max(30, (window.innerWidth * videoSizeVw) / 100);
    updateBgHeight();
    videoSize = videoSizeNew;
    setupVideos();
    if (currentZoomedVideoInfo && currentZoomedVideoInfo.element) {
      const wrapper = currentZoomedVideoInfo.element;
      const zoomedWidth = Math.min(window.innerWidth * 0.9, 512);
      const zoomedHeight = zoomedWidth;
      wrapper.style.width = `${zoomedWidth}px`;
      wrapper.style.height = `${zoomedHeight}px`;
    }
  }

  function debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(null, args), wait);
    };
  }
});
