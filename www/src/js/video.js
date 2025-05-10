import {
  Engine,
  Render,
  Runner,
  Bodies,
  Body,
  Composite,
  Events,
} from "matter-js";

document.addEventListener("DOMContentLoaded", () => {
  const engine = Engine.create({ enableSleeping: true });
  engine.world.gravity.y = 0;
  const bg = document.querySelector(".preview-bg");
  if (!bg) return;

  let videos = [];
  let isDragging = false;
  let currentDragBody = null;
  let dragOffset = { x: 0, y: 0 };

  let backdropElement;
  let currentZoomedVideoInfo = null;

  let videoNoteWidth = 150;
  let videoNoteHeight = videoNoteWidth;

  function updateBgHeight() {
    const safeHeight = window.innerHeight;
    bg.style.height = `${safeHeight}px`;
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
  setupEngineRenderLoop();
  setupClickOutsideReset();

  window.addEventListener("resize", debounce(handleResize, 150));
  window.addEventListener("orientationchange", debounce(handleResize, 150));

  const runner = Runner.create();
  Runner.run(runner, engine);

  function calculateVideoSizes() {
    videoNoteWidth = Math.max(80, Math.min(180, window.innerWidth * 0.15));
    videoNoteHeight = videoNoteWidth;
  }

  function createBackdrop() {
    backdropElement = document.createElement("div");
    backdropElement.className = "video-backdrop";
    Object.assign(backdropElement.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      display: "none",
      zIndex: "990",
      cursor: "pointer",
    });
    document.body.appendChild(backdropElement);
    backdropElement.addEventListener("click", () => {
      if (currentZoomedVideoInfo) unzoomVideo(currentZoomedVideoInfo.element);
    });
  }

  function setupVideos() {
    videos.forEach((vid) => {
      vid.element.remove();
      if (vid.body) Composite.remove(engine.world, vid.body);
    });
    videos = [];
    Composite.clear(engine.world, false);

    canvasRect = bg.getBoundingClientRect();
    const centerX = canvasRect.width / 2;
    const centerY = canvasRect.height / 2;
    const count = 6;

    calculateVideoSizes();

    const aspectRatio = canvasRect.width / canvasRect.height;
    const useArchLayout = aspectRatio < 1.1;

    let ovalA, ovalB;

    for (let i = 0; i < count; i++) {
      let x, y;

      if (useArchLayout) {
        const numInRow = 3;
        const row = i < numInRow ? 0 : 1;
        const col = i % numInRow;

        const totalVideoWidthInRow = numInRow * videoNoteWidth;
        const spacing = Math.max(
          videoNoteWidth * 0.2,
          (canvasRect.width - totalVideoWidthInRow) / (numInRow + 1)
        );
        x = spacing + col * (videoNoteWidth + spacing) + videoNoteWidth / 2;
        if (
          totalVideoWidthInRow + (numInRow + 1) * spacing <
          canvasRect.width
        ) {
          x +=
            (canvasRect.width -
              (totalVideoWidthInRow + (numInRow + 1) * spacing)) /
            2;
        }

        const archDepth = videoNoteHeight * 0.3;
        let yOffsetForRow = 0;
        if (col === 1) {
          yOffsetForRow = row === 0 ? -archDepth : archDepth;
        } else {
          yOffsetForRow = row === 0 ? -archDepth * 0.5 : archDepth * 0.5;
        }

        const verticalRowBase = canvasRect.height * (row === 0 ? 0.3 : 0.7);
        y = verticalRowBase + yOffsetForRow;

        const verticalPadding = videoNoteHeight * 0.2;
        y = Math.max(y, verticalPadding + videoNoteHeight / 2);
        y = Math.min(
          y,
          canvasRect.height - videoNoteHeight / 2 - verticalPadding
        );
      } else {
        if (i === 0) {
          ovalA = centerX * (aspectRatio < 1 ? 0.65 : 0.8);
          ovalB = centerY * (aspectRatio < 1 ? 0.8 : 0.65);
          ovalA = Math.max(
            ovalA,
            videoNoteWidth * 1.8 * (count / (Math.PI * 2))
          );
          ovalB = Math.max(
            ovalB,
            videoNoteHeight * 1.8 * (count / (Math.PI * 2))
          );
        }
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
        x = centerX + Math.cos(angle) * ovalA;
        y = centerY + Math.sin(angle) * ovalB;
      }

      const videoInfo = createVideoElement(i + 1, x, y);
      videos.push(videoInfo);
      bg.appendChild(videoInfo.element);
      if (videoInfo.body) Composite.add(engine.world, videoInfo.body);
    }
  }

  function createVideoElement(id, spawnX, spawnY) {
    const wrapper = document.createElement("div");
    wrapper.className = "video-note";
    Object.assign(wrapper.style, {
      width: `${videoNoteWidth}px`,
      height: `${videoNoteHeight}px`,
      position: "absolute",
      overflow: "hidden",
      zIndex: "10",
      cursor: "pointer",
      borderRadius: "50%",
      transform: `translate3d(${spawnX - videoNoteWidth / 2}px, ${
        spawnY - videoNoteHeight / 2
      }px, 0)`,
      willChange: "transform, position, width, height, z-index",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    });
    wrapper.dataset.videoId = id;

    const thumbnail = document.createElement("img");
    thumbnail.src = `assets/thumbnails/${id}.jpg`;
    thumbnail.alt = `Video ${id} preview`;
    Object.assign(thumbnail.style, {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
      position: "absolute",
      borderRadius: "50%",
    });
    thumbnail.draggable = false;

    const video = document.createElement("video");
    video.src = `assets/media/${id}.mp4`;
    Object.assign(video.style, {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "none",
      position: "absolute",
      borderRadius: "50%",
    });
    video.controls = false;
    video.draggable = false;
    video.preload = "metadata";
    video.playsInline = true;
    video.setAttribute("playsinline", "");

    wrapper.appendChild(thumbnail);
    wrapper.appendChild(video);

    const physicsBody = Bodies.rectangle(
      spawnX,
      spawnY,
      videoNoteWidth,
      videoNoteHeight,
      {
        isStatic: true,
        render: { visible: false },
        chamfer: { radius: videoNoteWidth / 2 },
      }
    );
    physicsBody.id = `video-${id}`;

    wrapper.addEventListener("click", function (e) {
      const pressStartTimeString = this.dataset.pressStartTime || "0";
      const pressStartTime = parseInt(pressStartTimeString);
      const movedDuringPress = this.dataset.mouseMoved === "true";

      this.dataset.pressStartTime = "0";
      this.dataset.mouseMoved = "false";

      const duration = Date.now() - pressStartTime;

      if (pressStartTime === 0 || movedDuringPress || duration > 250) {
        return;
      }

      if (wrapper.classList.contains("zoomed")) {
        if (!video.paused) {
          video.pause();
        } else {
          video.play();
        }
        return;
      }

      const isPlayingThis = video.style.display === "block" && !video.paused;

      videos.forEach((vidInfo) => {
        if (vidInfo.id !== id && vidInfo.videoEl.style.display === "block") {
          vidInfo.videoEl.pause();
          vidInfo.videoEl.style.display = "none";
          vidInfo.thumbnailEl.style.display = "block";
          vidInfo.element.classList.remove("playing");
          if (vidInfo.body && !vidInfo.element.classList.contains("zoomed"))
            Body.setStatic(vidInfo.body, true);
          vidInfo.element.style.zIndex = "10";
        }
      });

      if (isPlayingThis) {
        video.pause();
      } else {
        thumbnail.style.display = "none";
        video.style.display = "block";
        video.currentTime = 0;
        video
          .play()
          .catch((error) => console.error("Play interrupted:", error));
        wrapper.classList.add("playing");
        zoomVideo(wrapper, physicsBody);
      }
    });

    video.addEventListener("ended", function () {
      video.style.display = "none";
      thumbnail.style.display = "block";
      wrapper.classList.remove("playing");
      if (!wrapper.classList.contains("zoomed") && physicsBody) {
        Body.setStatic(physicsBody, true);
      }
      if (!wrapper.classList.contains("zoomed")) {
        wrapper.style.zIndex = "10";
      }
    });

    return {
      element: wrapper,
      videoEl: video,
      thumbnailEl: thumbnail,
      id,
      body: physicsBody,
      initialX: spawnX,
      initialY: spawnY,
    };
  }

  function zoomVideo(wrapper, body) {
    if (wrapper.classList.contains("zoomed")) return;

    const videoData = videos.find((v) => v.element === wrapper);
    if (!videoData) return;

    videoData.originalParent = wrapper.parentElement;
    videoData.originalNextSibling = wrapper.nextSibling;
    currentZoomedVideoInfo = videoData;

    videos.forEach((vid) => {
      if (vid.element !== wrapper) {
        if (!vid.videoEl.paused) {
          vid.videoEl.pause();
          vid.videoEl.style.display = "none";
          vid.thumbnailEl.style.display = "block";
          vid.element.classList.remove("playing");
        }
        vid.element.style.zIndex = "10";
        if (vid.body) Body.setStatic(vid.body, true);
      }
    });

    if (videoData.videoEl.paused) {
      videoData.thumbnailEl.style.display = "none";
      videoData.videoEl.style.display = "block";
      videoData.videoEl
        .play()
        .catch((e) => console.error("Error playing video on zoom:", e));
      wrapper.classList.add("playing");
    }

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const targetSize = Math.min(screenWidth * 0.8, screenHeight * 0.8, 600);
    const targetWidth = targetSize;
    const targetHeight = targetSize;

    document.body.appendChild(wrapper);
    wrapper.classList.add("zoomed");

    Object.assign(wrapper.style, {
      position: "fixed",
      width: `${targetWidth}px`,
      height: `${targetHeight}px`,
      left: `${(screenWidth - targetWidth) / 2}px`,
      top: `${(screenHeight - targetHeight) / 2}px`,
      transform: "translate3d(0,0,0)",
      zIndex: "999",
      borderRadius: "50%",
    });
    if (body) Body.setStatic(body, true);
    backdropElement.style.display = "block";
  }

  function unzoomVideo(wrapper) {
    if (
      !wrapper ||
      !wrapper.classList.contains("zoomed") ||
      !currentZoomedVideoInfo
    )
      return;

    const videoData = currentZoomedVideoInfo;
    wrapper.classList.remove("zoomed");

    if (videoData.videoEl) {
      videoData.videoEl.pause();
      videoData.videoEl.currentTime = 0;
      videoData.videoEl.style.display = "none";
    }
    if (videoData.thumbnailEl) {
      videoData.thumbnailEl.style.display = "block";
    }
    wrapper.classList.remove("playing");

    Object.assign(wrapper.style, {
      position: "absolute",
      width: `${videoNoteWidth}px`,
      height: `${videoNoteHeight}px`,
      left: "",
      top: "",
      zIndex: wrapper.classList.contains("playing") ? "20" : "10",
      transform: `translate3d(${videoData.initialX - videoNoteWidth / 2}px, ${
        videoData.initialY - videoNoteHeight / 2
      }px, 0)`,
      borderRadius: "50%",
    });

    if (videoData.originalParent) {
      videoData.originalParent.insertBefore(
        wrapper,
        videoData.originalNextSibling
      );
    }

    if (videoData.body) {
      Body.setStatic(videoData.body, true);
      Body.setPosition(videoData.body, {
        x: videoData.initialX,
        y: videoData.initialY,
      });
      Body.setVelocity(videoData.body, { x: 0, y: 0 });
      Body.setAngle(videoData.body, 0);
    }

    backdropElement.style.display = "none";
    currentZoomedVideoInfo = null;
  }

  function setupDragHandling() {
    document.addEventListener("mousedown", handlePressDown, { passive: true });
    document.addEventListener("mousemove", handlePressMove, { passive: false });
    document.addEventListener("mouseup", handlePressUp, { passive: true });
    document.addEventListener("touchstart", handlePressDown, { passive: true });
    document.addEventListener("touchmove", handlePressMove, { passive: false });
    document.addEventListener("touchend", handlePressUp, { passive: true });
  }

  function handlePressDown(e) {
    const evt = e.touches?.[0] || e;
    const targetElement = evt.target.closest(".video-note");
    if (!targetElement || targetElement.classList.contains("zoomed")) {
      isDragging = false;
      currentDragBody = null;
      if (targetElement) {
        targetElement.dataset.pressStartTime = "0";
        targetElement.dataset.mouseMoved = "false";
      }
      return;
    }

    targetElement.dataset.pressStartTime = Date.now().toString();
    targetElement.dataset.mouseMoved = "false";

    const videoId = parseInt(targetElement.dataset.videoId);
    const videoData = videos.find((v) => v.id === videoId);

    if (videoData && videoData.body) {
      isDragging = true;
      currentDragBody = videoData.body;
      Body.setStatic(currentDragBody, false);
      targetElement.classList.add("dragging");
      targetElement.style.zIndex = "30";
      document.body.classList.add("dragging");

      const mouseX = evt.clientX - canvasRect.left;
      const mouseY = evt.clientY - canvasRect.top;
      dragOffset.x = mouseX - currentDragBody.position.x;
      dragOffset.y = mouseY - currentDragBody.position.y;

      if (!videoData.videoEl.paused) {
        videoData.videoEl.pause();
      }
    } else {
      isDragging = false;
      currentDragBody = null;
    }
  }

  function handlePressMove(e) {
    if (!isDragging || !currentDragBody) return;
    e.preventDefault();
    const evt = e.touches?.[0] || e;

    const videoData = videos.find((v) => v.body === currentDragBody);
    if (videoData && videoData.element) {
      videoData.element.dataset.mouseMoved = "true";
    }

    const mouseX = evt.clientX - canvasRect.left;
    const mouseY = evt.clientY - canvasRect.top;
    const targetX = mouseX - dragOffset.x;
    const targetY = mouseY - dragOffset.y;
    Body.setPosition(currentDragBody, { x: targetX, y: targetY });
  }

  function handlePressUp(e) {
    const releasedBody = currentDragBody;
    const draggedElement = releasedBody
      ? videos.find((v) => v.body === releasedBody)?.element
      : null;

    isDragging = false;
    currentDragBody = null;
    document.body.classList.remove("dragging");

    if (releasedBody && draggedElement) {
      const videoData = videos.find((v) => v.body === releasedBody);
      if (videoData) {
        videoData.element.classList.remove("dragging");

        const pressStartTime = parseInt(
          draggedElement.dataset.pressStartTime || "0"
        );
        const movedDuringPress = draggedElement.dataset.mouseMoved === "true";
        const duration = Date.now() - pressStartTime;
        let wasDragOrLongPress = false;

        if (pressStartTime > 0 && (movedDuringPress || duration > 250)) {
          wasDragOrLongPress = true;
        }

        if (wasDragOrLongPress) {
          videoData.initialX = releasedBody.position.x;
          videoData.initialY = releasedBody.position.y;
        }

        if (
          !videoData.element.classList.contains("zoomed") &&
          !videoData.element.classList.contains("playing")
        ) {
          videoData.element.style.zIndex = "10";
        } else if (
          videoData.element.classList.contains("playing") &&
          !videoData.element.classList.contains("zoomed")
        ) {
          videoData.element.style.zIndex = "20";
        }
        Body.setStatic(releasedBody, true);
      }
    }
  }

  function setupEngineRenderLoop() {
    Events.on(engine, "afterUpdate", () => {
      if (isDragging && currentDragBody) {
        const videoData = videos.find((v) => v.body === currentDragBody);
        if (videoData) {
          const { x, y } = currentDragBody.position;
          videoData.element.style.transform = `translate3d(${
            x - videoNoteWidth / 2
          }px, ${y - videoNoteHeight / 2}px, 0) scale(1)`;
        }
      }
    });
  }

  function setupClickOutsideReset() {
    bg.addEventListener("click", (e) => {
      if (currentZoomedVideoInfo && currentZoomedVideoInfo.element) {
        if (!e.target.closest(".video-note")) {
          unzoomVideo(currentZoomedVideoInfo.element);
        }
      }
    });
  }

  function handleResize() {
    updateBgHeight();
    canvasRect = bg.getBoundingClientRect();
    Render.setPixelRatio(render, window.devicePixelRatio);
    render.options.width = canvasRect.width;
    render.options.height = canvasRect.height;

    calculateVideoSizes();
    setupVideos();

    if (currentZoomedVideoInfo && currentZoomedVideoInfo.element) {
      const wrapper = currentZoomedVideoInfo.element;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const targetSize = Math.min(screenWidth * 0.8, screenHeight * 0.8, 600);
      const targetWidth = targetSize;
      const targetHeight = targetSize;

      Object.assign(wrapper.style, {
        width: `${targetWidth}px`,
        height: `${targetHeight}px`,
        left: `${(screenWidth - targetWidth) / 2}px`,
        top: `${(screenHeight - targetHeight) / 2}px`,
        borderRadius: "50%",
      });
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
