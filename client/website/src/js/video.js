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

  let images = [];
  let isDragging = false;
  let currentBody = null;
  let dragOffset = { x: 0, y: 0 };
  let clickStartTime = 0;
  const imageSize = Math.max(Math.min(window.innerWidth * 0.24, 320), 220);

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

  setupWalls();
  setupImages();
  setTimeout(() => {
    setupLogoWalls();
  }, 1000);
  setupDragHandling();
  setupEngineEvents();
  setupClickOutsideReset();

  window.addEventListener("resize", debounce(handleResize, 100));

  const runner = Runner.create();
  Runner.run(runner, engine);

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

  function setupImages() {
    canvasRect = bg.getBoundingClientRect();
    const centerX = canvasRect.width / 2;
    const centerY = canvasRect.height / 2;

    for (let i = 0; i < 6; i++) {
      const body = createPhysicsBody(centerX, centerY);
      const wrapper = createImageElement(i + 1, body.id);
      wrapper.style.transform = `translate3d(${centerX - imageSize / 2}px, ${
        centerY - imageSize / 2
      }px, 0)`;
      images.push({ body, element: wrapper });
      Composite.add(engine.world, body);
      bg.appendChild(wrapper);
    }

    function createPhysicsBody(cx, cy) {
      const angle = Math.random() * Math.PI * 2;
      const INITIAL_SPEED = 0.08;
      const vx = Math.cos(angle) * INITIAL_SPEED;
      const vy = Math.sin(angle) * INITIAL_SPEED;
      const radius = imageSize / 2;
      const body = Bodies.circle(cx, cy, radius, {
        restitution: 0.9,
        friction: 0,
        frictionAir: 0.02,
        density: 0.5,
        inertia: Infinity,
        render: { visible: false },
      });
      Body.setVelocity(body, { x: vx, y: vy });
      return body;
    }

    function createImageElement(i, id) {
      const wrapper = document.createElement("div");
      wrapper.className = "floating-image physics-image";
      wrapper.style.width = `${imageSize}px`;
      wrapper.style.height = `${imageSize}px`;
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

      const video = document.createElement("video");
      video.src = `assets/media/${i}.mp4`;
      video.draggable = false;
      video.style.width = "100%";
      video.style.height = "100%";
      video.style.objectFit = "cover";

      // Play / Stop indicator (triangle)
      const playIndicator = document.createElement("div");
      playIndicator.className = "play-indicator";
      playIndicator.style.position = "absolute";
      playIndicator.style.top = "50%";
      playIndicator.style.left = "50%";
      playIndicator.style.transform = "translate(-50%, -50%)";
      playIndicator.style.opacity = "0"; // hidden by default
      playIndicator.style.transition = "opacity 0.2s";
      playIndicator.innerHTML = `
<svg width="41" height="47" viewBox="0 0 41 47" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M2 23.5L2 4.46282C2 2.9235 3.66611 1.96122 4.99944 2.73045L37.9972 21.7676C39.3313 22.5373 39.3313 24.4627 37.9972 25.2324L4.99944 44.2695C3.66611 45.0388 2 44.0765 2 42.5372L2 23.5Z" fill="#EEEEEE" stroke="#EEEEEE" stroke-width="4" stroke-linejoin="round"/>
</svg>`;

      wrapper.addEventListener("mouseenter", () => {
        if (video.paused) playIndicator.style.opacity = "1";
      });
      wrapper.addEventListener("mouseleave", () => {
        if (video.paused) playIndicator.style.opacity = "0";
      });

      // Progress ring SVG
      const svgNS = "http://www.w3.org/2000/svg";
      const progressSVG = document.createElementNS(svgNS, "svg");
      progressSVG.setAttribute("viewBox", "0 0 100 100");
      progressSVG.style.position = "absolute";
      progressSVG.style.top = "0";
      progressSVG.style.left = "0";
      progressSVG.style.width = "100%";
      progressSVG.style.height = "100%";
      progressSVG.style.transform = "rotate(-90deg) scale(1)";
      progressSVG.style.transition = "transform 0.2s ease";
      progressSVG.style.zIndex = "2";
      progressSVG.style.pointerEvents = "none";

      // Background circle (visible only when stopped)
      const bgCircle = document.createElementNS(svgNS, "circle");
      bgCircle.setAttribute("cx", "50");
      bgCircle.setAttribute("cy", "50");
      bgCircle.setAttribute("r", "49");
      bgCircle.setAttribute("fill", "none");
      bgCircle.setAttribute("stroke", "rgba(255,255,255,0.15)");
      bgCircle.setAttribute("stroke-width", "2");
      bgCircle.style.opacity = "0";
      progressSVG.appendChild(bgCircle);

      // Clickable seek ring
      const seekRing = document.createElementNS(svgNS, "circle");
      seekRing.setAttribute("cx", "50");
      seekRing.setAttribute("cy", "50");
      seekRing.setAttribute("r", "49");
      seekRing.setAttribute("fill", "none");
      seekRing.setAttribute("stroke", "transparent");
      seekRing.setAttribute("stroke-width", "8");
      seekRing.style.cursor = "pointer";
      seekRing.style.pointerEvents = "none"; // only active when paused
      progressSVG.appendChild(seekRing);

      // Main progress circle
      const progressCircle = document.createElementNS(svgNS, "circle");
      progressCircle.setAttribute("cx", "50");
      progressCircle.setAttribute("cy", "50");
      progressCircle.setAttribute("r", "49");
      progressCircle.setAttribute("fill", "none");
      progressCircle.setAttribute("stroke", "rgba(255,255,255,0.8)");
      progressCircle.setAttribute("stroke-width", "2");
      progressCircle.style.opacity = "0";
      const circumference = 2 * Math.PI * 49;
      progressCircle.setAttribute("stroke-dasharray", circumference);
      progressCircle.setAttribute("stroke-dashoffset", circumference);
      progressSVG.appendChild(progressCircle);

      // Ghost dot at 90° behind current progress
      const ghostDot = document.createElementNS(svgNS, "circle");
      ghostDot.setAttribute("r", "3");
      ghostDot.setAttribute("fill", "rgba(255,255,255,0.5)");
      ghostDot.style.opacity = "1";
      progressSVG.appendChild(ghostDot);

      // End-dot, visible only when stopped
      const endDot = document.createElementNS(svgNS, "circle");
      endDot.setAttribute("r", "3");
      endDot.setAttribute("fill", "#EEEEEE");
      endDot.style.opacity = "0";
      progressSVG.appendChild(endDot);

      wrapper.appendChild(progressSVG);

      let hasPlayed = false;
      let animationId = null;

      // Seek handling
      seekRing.addEventListener("click", (e) => {
        if (!video.duration) return;
        const rect = progressSVG.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        let angle = Math.atan2(e.clientY - cy, e.clientX - cx) + Math.PI / 2;
        if (angle < 0) angle += 2 * Math.PI;
        const progress = angle / (2 * Math.PI);
        video.currentTime = progress * video.duration;
        if (video.paused) updateProgress();
      });

      seekRing.addEventListener("mouseenter", () => {
        if (hasPlayed && video.paused)
          progressCircle.setAttribute("stroke-width", "4");
      });
      seekRing.addEventListener("mouseleave", () => {
        progressCircle.setAttribute("stroke-width", "2");
      });

      function updateProgress() {
        if (animationId) cancelAnimationFrame(animationId);
        const progress = video.currentTime / video.duration || 0;
        const offset = (1 - progress) * circumference;
        progressCircle.setAttribute("stroke-dashoffset", offset);

        // Ghost dot position
        const baseAngle = progress * 2 * Math.PI - Math.PI / 2;
        const behindAngle = baseAngle - Math.PI / 2;
        const xGhost = 50 + 49 * Math.cos(behindAngle);
        const yGhost = 50 + 49 * Math.sin(behindAngle);
        ghostDot.setAttribute("cx", xGhost);
        ghostDot.setAttribute("cy", yGhost);

        if (!video.paused) {
          animationId = requestAnimationFrame(updateProgress);
        }
      }

      video.addEventListener("play", () => {
        hasPlayed = true;
        wrapper.classList.add("playing");
        Body.setStatic(images.find((i) => i.body.id === body.id).body, true);

        playIndicator.style.opacity = "0";
        progressCircle.style.opacity = "1";
        bgCircle.style.opacity = "0";
        endDot.style.opacity = "0";
        seekRing.style.pointerEvents = "none";
        progressSVG.style.transform = "rotate(-90deg) scale(1)";
        updateProgress();

        // Pause and reset others
        document.querySelectorAll(".video-container video").forEach((v) => {
          if (v !== video) {
            const w = v.closest(".floating-image");
            v.pause();
            w.querySelector(".play-indicator").style.opacity = "1";
            w.classList.remove("playing");
            Body.setStatic(images.find((i) => i.element === w).body, false);
            w.style.zIndex = "3";
            const svg = w.querySelector("svg");
            svg.style.transform = "rotate(-90deg) scale(1)";
            svg.querySelectorAll("circle")[1].style.opacity = "0"; // bgCircle
            svg.querySelectorAll("circle")[4].style.opacity = "0"; // endDot
          }
        });
        wrapper.style.zIndex = "5";
      });

      video.addEventListener("pause", () => {
        if (hasPlayed) {
          wrapper.classList.remove("playing");
          Body.setStatic(images.find((i) => i.element === wrapper).body, false);

          playIndicator.style.opacity = "1";
          bgCircle.style.opacity = "1";
          progressSVG.style.transform = "rotate(-90deg) scale(0.85)";
          endDot.style.opacity = "1";
          seekRing.style.pointerEvents = "auto";
          if (animationId) cancelAnimationFrame(animationId);
        }
      });

      video.addEventListener("ended", () => {
        hasPlayed = false;
        wrapper.classList.remove("playing");
        Body.setStatic(images.find((i) => i.element === wrapper).body, false);

        progressCircle.setAttribute("stroke-dashoffset", circumference);
        progressCircle.style.opacity = "0";
        bgCircle.style.opacity = "0";
        playIndicator.style.opacity = "1";
        progressSVG.style.transform = "rotate(-90deg) scale(1)";
        endDot.style.opacity = "0";
        seekRing.style.pointerEvents = "none";
      });

      videoContainer.appendChild(video);
      videoContainer.appendChild(playIndicator);
      wrapper.appendChild(videoContainer);
      wrapper.appendChild(playerRing);

      return wrapper;
    }
  }

  function setupLogoWalls() {
    const logo = document.querySelector(".logo-section");
    if (!logo) return;
    const containerRect = bg.getBoundingClientRect();
    const logoRect = logo.getBoundingClientRect();
    const offsetX = logoRect.left - containerRect.left;
    const offsetY = logoRect.top - containerRect.top;
    const wallThickness = 10;
    const logoWalls = [
      Bodies.rectangle(
        offsetX + logoRect.width / 2,
        offsetY,
        logoRect.width,
        wallThickness,
        {
          isStatic: true,
          restitution: 1,
          friction: 0,
          render: { visible: false },
        }
      ),
      Bodies.rectangle(
        offsetX + logoRect.width / 2,
        offsetY + logoRect.height,
        logoRect.width,
        wallThickness,
        {
          isStatic: true,
          restitution: 1,
          friction: 0,
          render: { visible: false },
        }
      ),
      Bodies.rectangle(
        offsetX,
        offsetY + logoRect.height / 2,
        wallThickness,
        logoRect.height,
        {
          isStatic: true,
          restitution: 1,
          friction: 0,
          render: { visible: false },
        }
      ),
      Bodies.rectangle(
        offsetX + logoRect.width,
        offsetY + logoRect.height / 2,
        wallThickness,
        logoRect.height,
        {
          isStatic: true,
          restitution: 1,
          friction: 0,
          render: { visible: false },
        }
      ),
    ];
    Composite.add(engine.world, logoWalls);

    const centerX = offsetX + logoRect.width / 2;
    const centerY = offsetY + logoRect.height / 2;
    images.forEach(({ body, element }) => {
      if (
        body.position.x > offsetX &&
        body.position.x < offsetX + logoRect.width &&
        body.position.y > offsetY &&
        body.position.y < offsetY + logoRect.height
      ) {
        let dx = body.position.x - centerX;
        let dy = body.position.y - centerY;
        if (dx === 0 && dy === 0) {
          dx = Math.random() - 0.5;
          dy = Math.random() - 0.5;
        }
        const angle = Math.atan2(dy, dx);
        const THROW_SPEED = 5;
        Body.setVelocity(body, {
          x: Math.cos(angle) * THROW_SPEED,
          y: Math.sin(angle) * THROW_SPEED,
        });
      }
    });
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
    const target = evt.target.closest(".floating-image");
    if (!target) return;
    clickStartTime = Date.now();
    isDragging = true;
    currentBody = images.find(
      (img) => img.body.id === parseInt(target.dataset.bodyId)
    )?.body;
    if (currentBody) {
      target.classList.add("dragging");
      document.body.classList.add("dragging");
      Body.setVelocity(currentBody, { x: 0, y: 0 });
      Body.setStatic(currentBody, true);
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
    const radius = imageSize / 2;
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
    if (e.type === "mouseup") {
      document.querySelectorAll(".floating-image.dragging").forEach((el) => {
        el.classList.remove("dragging");
      });
      document.body.classList.remove("dragging");
    }
    if (!currentBody) return;
    Body.setStatic(currentBody, false);
    isDragging = false;
    const isClick = Date.now() - clickStartTime < 200;
    const target = e.target.closest(".floating-image");
    if (isClick && target) {
      const video = target.querySelector("video");
      if (video) {
        if (video.paused) {
          video.play();
          target.querySelector(".play-indicator").style.opacity = "0";
        } else {
          video.pause();
          target.querySelector(".play-indicator").style.opacity = "1";
        }
      }
    }
    const angle = Math.random() * Math.PI * 2;
    const CONSTANT_SPEED = 0.5;
    Body.setVelocity(currentBody, {
      x: Math.cos(angle) * CONSTANT_SPEED,
      y: Math.sin(angle) * CONSTANT_SPEED,
    });
    currentBody = null;
  }

  function setupEngineEvents() {
    const BASE_SPEED = 0.2;
    const SPEED_VARIATION = 0.1;
    const DIRECTION_CHANGE_PROB = 0.005;
    const REPULSION_STRENGTH = 0.015;
    const REPULSION_DISTANCE = 250;
    const REPULSION_DISTANCE_SQ = REPULSION_DISTANCE * REPULSION_DISTANCE;

    Events.on(engine, "afterUpdate", () => {
      canvasRect = bg.getBoundingClientRect();
      images.forEach(({ body, element }) => {
        // repulsion & random movement
        if (!isDragging || body !== currentBody) {
          if (Math.random() < DIRECTION_CHANGE_PROB) {
            const angle = Math.random() * Math.PI * 2;
            const speed = BASE_SPEED + (Math.random() - 0.5) * SPEED_VARIATION;
            Body.setVelocity(body, {
              x: Math.cos(angle) * speed,
              y: Math.sin(angle) * speed,
            });
          }
          const speed = Vector.magnitude(body.velocity);
          if (speed < BASE_SPEED * 0.8) {
            const angle = Math.atan2(body.velocity.y, body.velocity.x);
            Body.setVelocity(body, {
              x: Math.cos(angle) * BASE_SPEED,
              y: Math.sin(angle) * BASE_SPEED,
            });
          }
          const MAX_SPEED = 3;
          if (speed > MAX_SPEED) {
            const factor = MAX_SPEED / speed;
            Body.setVelocity(body, {
              x: body.velocity.x * factor,
              y: body.velocity.y * factor,
            });
          }
        }

        // clamp to bounds to prevent flying off
        const radius = imageSize / 2;
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

        // apply transform with scale if playing
        const scale = element.classList.contains("playing") ? 1.05 : 1;
        element.style.transform = `translate3d(${
          body.position.x - imageSize / 2
        }px, ${body.position.y - imageSize / 2}px, 0) scale(${scale})`;
      });

      // inter-image repulsion
      for (let i = 0; i < images.length; i++) {
        for (let j = i + 1; j < images.length; j++) {
          const A = images[i].body,
            B = images[j].body;
          if ((A === currentBody || B === currentBody) && isDragging) continue;
          const dx = B.position.x - A.position.x,
            dy = B.position.y - A.position.y;
          const distSq = dx * dx + dy * dy;
          if (distSq > 0 && distSq < REPULSION_DISTANCE_SQ) {
            const dist = Math.sqrt(distSq);
            const forceMag = REPULSION_STRENGTH / (distSq * dist);
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
        const playingWrapper = document.querySelector(
          ".floating-image.playing"
        );
        if (!playingWrapper) return;
        if (!playingWrapper.contains(e.target)) {
          const video = playingWrapper.querySelector("video");
          if (!video.paused) {
            video.pause();
            const svg = playingWrapper.querySelector("svg");
            const circles = svg.querySelectorAll("circle");
            playingWrapper.querySelector(".play-indicator").style.opacity = "1";
            circles[1].style.opacity = "1"; // bgCircle
            svg.style.transform = "rotate(-90deg) scale(1)";
            circles[4].style.opacity = "1"; // endDot
            svg.querySelector("circle:nth-child(4)").style.pointerEvents =
              "auto"; // seekRing
            playingWrapper.classList.remove("playing");
            Body.setStatic(
              images.find((i) => i.element === playingWrapper).body,
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
    canvasRect = bg.getBoundingClientRect();
    render.canvas.width = canvasRect.width;
    render.canvas.height = canvasRect.height;
    Composite.allBodies(engine.world).forEach((body) => {
      if (body.isStatic) Composite.remove(engine.world, body);
    });
    setupWalls();
    images.forEach(({ body, element }) => {
      const radius = imageSize / 2;
      const x = Math.max(
        radius,
        Math.min(canvasRect.width - radius, body.position.x)
      );
      const y = Math.max(
        radius,
        Math.min(canvasRect.height - radius, body.position.y)
      );
      Body.setPosition(body, { x, y });
      element.style.width = `${imageSize}px`;
      element.style.height = `${imageSize}px`;
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
