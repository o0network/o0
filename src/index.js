const {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  screen,
} = require("electron");
const { exec, spawn } = require("child_process");
const path = require("path");
const WindowTracker = require("bindings")("window_tracker").WindowTracker;
const windowTracker = new WindowTracker();
const { launchChromeWindow } = require("../electron/main");

app.dock.hide();

let urlBarWindow = null;
let chromeProcess = null;
let isOurWindow = false;
let trackingInterval = null;
let currentPosition = { x: 0, y: 0 };
let targetPosition = { x: 0, y: 0 };
const SMOOTHING_FACTOR = 0.3;

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

function createUrlBar() {
  urlBarWindow = new BrowserWindow({
    width: 600,
    height: 60,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    backgroundColor: "#00000000",
    hasShadow: true,
    roundedCorners: false,
    movable: false,
    focusable: true,
    skipTaskbar: true,
  });

  urlBarWindow.loadFile("urlbar.html");

  const bounds = urlBarWindow.getBounds();
  currentPosition = { x: bounds.x, y: bounds.y };
  targetPosition = { x: bounds.x, y: bounds.y };
}

function openInChrome(url) {
  if (!isOurWindow) {
    chromeProcess = launchChromeWindow(url);

    chromeProcess.on("exit", () => {
      chromeProcess = null;
      isOurWindow = false;
    });

    isOurWindow = true;
  } else {
    // For existing window, use AppleScript to change URL
    const script = `osascript -e 'tell application "Google Chrome" to set URL of active tab of front window to "${url}"'`;
    exec(script);
  }
}

function openHomepage() {
  chromeProcess = launchChromeWindow();

  chromeProcess.on("exit", () => {
    chromeProcess = null;
    isOurWindow = false;
  });

  isOurWindow = true;
  createUrlBar();
}

async function getActiveChromeWindow() {
  const bounds = windowTracker.getChromeWindowBounds();
  return bounds || null;
}

async function updateUrlBarPosition(urlBarWindow) {
  const chromeWindow = await getActiveChromeWindow();

  if (chromeWindow) {
    // Calculate target position
    targetPosition = {
      x: Math.round(
        chromeWindow.x + chromeWindow.width / 2 - urlBarWindow.getSize()[0] / 2
      ),
      y: Math.round(
        chromeWindow.y + chromeWindow.height / 2 - urlBarWindow.getSize()[1] / 2
      ),
    };

    // Smoothly interpolate to target position
    currentPosition.x = lerp(
      currentPosition.x,
      targetPosition.x,
      SMOOTHING_FACTOR
    );
    currentPosition.y = lerp(
      currentPosition.y,
      targetPosition.y,
      SMOOTHING_FACTOR
    );

    // Round positions to avoid subpixel rendering
    const roundedX = Math.round(currentPosition.x);
    const roundedY = Math.round(currentPosition.y);

    // Only update position if it has changed significantly
    const currentBounds = urlBarWindow.getBounds();
    if (
      Math.abs(currentBounds.x - roundedX) > 0.5 ||
      Math.abs(currentBounds.y - roundedY) > 0.5
    ) {
      urlBarWindow.setPosition(roundedX, roundedY);
    }

    if (!urlBarWindow.isVisible()) {
      urlBarWindow.show();
    }

    urlBarWindow.setAlwaysOnTop(true, "floating", 1);
  } else if (urlBarWindow.isVisible()) {
    urlBarWindow.hide();
  }
}

function startWindowTracking() {
  if (trackingInterval) {
    clearInterval(trackingInterval);
  }

  // Use requestAnimationFrame-like timing (about 60fps)
  trackingInterval = setInterval(() => {
    if (urlBarWindow) {
      updateUrlBarPosition(urlBarWindow);
    }
  }, 16.667); // ~60fps
}

app.whenReady().then(() => {
  openHomepage();
  startWindowTracking();

  globalShortcut.register("CommandOrControl+P", () => {
    if (urlBarWindow.isVisible()) {
      urlBarWindow.hide();
    } else {
      exec(
        "osascript -e 'tell application \"System Events\" to get name of first application process whose frontmost is true'",
        (error, stdout) => {
          if (error) {
            console.error("Error checking active window:", error);
            return;
          }

          if (stdout.trim() === "Google Chrome" && isOurWindow) {
            const point = screen.getCursorScreenPoint();
            urlBarWindow.setPosition(point.x - 300, point.y - 30);
            urlBarWindow.show();
            urlBarWindow.focus();
          }
        }
      );
    }
  });

  ipcMain.on("hide-window", () => {
    urlBarWindow.hide();
  });

  ipcMain.on("open-url", (event, { url }) => {
    openInChrome(url);
    urlBarWindow.hide();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("will-quit", () => {
  if (trackingInterval) {
    clearInterval(trackingInterval);
  }
  globalShortcut.unregisterAll();
});
