import { app, BrowserWindow, ipcMain, globalShortcut, screen } from 'electron';
import * as path from 'path';
import { exec, spawn } from 'child_process';
import { fileURLToPath } from 'url';
import bindings from 'bindings';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WindowTracker = bindings('window_tracker').WindowTracker;
const windowTracker = new WindowTracker();

app.dock.hide();

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null = null;
let chromeProcess: any = null;
let isOurWindow = false;
let trackingInterval: NodeJS.Timeout | null = null;
let currentPosition = { x: 0, y: 0 };
let targetPosition = { x: 0, y: 0 };
const SMOOTHING_FACTOR = 0.3;
let focusCheckInterval: NodeJS.Timeout | null = null;

function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

function createWindow() {
  win = new BrowserWindow({
    width: 600,
    height: 60,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    backgroundColor: "#00000000",
    skipTaskbar: true,
    focusable: true,
    hasShadow: false,
    roundedCorners: true,
    visualEffectState: "active",
    vibrancy: "window",
  });

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  win.setPosition(Math.floor(width / 2 - 300), Math.floor(height / 2 - 30));

  const bounds = win.getBounds();
  currentPosition = { x: bounds.x, y: bounds.y };
  targetPosition = { x: bounds.x, y: bounds.y };

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }

  // Handle Esc key
  win.webContents.on("before-input-event", (event, input) => {
    if (input.key === "Escape") {
      win?.hide();
    }
  });

  // Handle focus event
  win.on("focus", () => {
    win?.webContents.focus();
  });
}

export function launchChromeWindow(url = "https://google.com") {
  // Get the extension path from the app's resources
  const extensionPath = app.isPackaged
    ? path.join(process.resourcesPath, "extension")
    : path.join(process.env.APP_ROOT || "", "extension");

  const chrome = spawn(
    "/Applications/o0.app/Contents/MacOS/Google\ Chrome",
    [`--load-extension=${extensionPath}`, "--no-first-run", "--silent-launch"],
    {
      env: {
        ...process.env,
        CHROME_BUNDLE_ID: "com.wtf403.o0",
        LSUIElement: "1",
      },
      stdio: "pipe",
    }
  );

  return chrome;
}

function openInChrome(url: string) {
  if (!isOurWindow) {
    chromeProcess = launchChromeWindow(url);

    chromeProcess.on('exit', () => {
      chromeProcess = null;
      isOurWindow = false;
    });

    isOurWindow = true;
  } else {
    const script = `osascript -e 'tell application "Google Chrome" to set URL of active tab of front window to "${url}"'`;
    exec(script);
  }
}

async function getActiveChromeWindow() {
  const bounds = windowTracker.getChromeWindowBounds();
  return bounds || null;
}

async function updateUrlBarPosition(urlBarWindow: BrowserWindow) {
  const chromeWindow = await getActiveChromeWindow();

  if (chromeWindow && win?.isVisible()) {
    targetPosition = {
      x: Math.round(
        chromeWindow.x + chromeWindow.width / 2 - urlBarWindow.getSize()[0] / 2
      ),
      y: Math.round(
        chromeWindow.y + chromeWindow.height / 2 - urlBarWindow.getSize()[1] / 2
      ),
    };

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

    const roundedX = Math.round(currentPosition.x);
    const roundedY = Math.round(currentPosition.y);

    const currentBounds = urlBarWindow.getBounds();
    if (
      Math.abs(currentBounds.x - roundedX) > 0.5 ||
      Math.abs(currentBounds.y - roundedY) > 0.5
    ) {
      urlBarWindow.setPosition(roundedX, roundedY);
    }

    urlBarWindow.setAlwaysOnTop(true, 'floating', 1);
  }
}

function startWindowTracking() {
  if (trackingInterval) {
    clearInterval(trackingInterval);
  }

  trackingInterval = setInterval(() => {
    if (win) {
      updateUrlBarPosition(win);
    }
  }, 16.667);
}

async function showUrlBar() {
  if (!win) return;
  const window = win;

  const bounds = await getActiveChromeWindow();
  if (bounds) {
    const x = Math.floor(bounds.x + bounds.width / 2 - 300);
    const y = Math.floor(bounds.y + bounds.height / 2 - 30);
    
    window.setPosition(x, y);
    window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    window.setAlwaysOnTop(true, 'floating', 1);
    window.show();
    window.focus();
    window.webContents.focus();
    
    // Update current position for smooth tracking
    currentPosition = { x, y };
    targetPosition = { x, y };
  } else {
    // Fallback to center of primary display if Chrome window not found
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    const x = Math.floor(width / 2 - 300);
    const y = Math.floor(height / 2 - 30);
    
    window.setPosition(x, y);
    window.show();
    window.focus();
    window.webContents.focus();
  }
}

async function isMissionControlActive(): Promise<boolean> {
  return new Promise((resolve) => {
    exec(
      'osascript -e \'tell application "System Events" to tell process "Dock" to get value of UI element 1 of list 1 of group "Mission Control" of group 1 of group "Spaces Bar" of group 1\'',
      (error) => {
        // If there's no error, Mission Control is active
        resolve(!error);
      }
    );
  });
}

async function checkChromeWindowFocus() {
  if (!win?.isVisible()) return;

  const [activeApp, missionControlActive] = await Promise.all([
    new Promise<string>((resolve) => {
      exec(
        'osascript -e \'tell application "System Events" to get name of first application process whose frontmost is true\'',
        (error, stdout) => {
          if (error) {
            console.error('Error checking active window:', error);
            resolve('');
          } else {
            resolve(stdout.trim());
          }
        }
      );
    }),
    isMissionControlActive()
  ]);

  if (missionControlActive || (activeApp !== 'Google Chrome' && win?.isVisible())) {
    win?.hide();
  }
}

function startFocusTracking() {
  if (focusCheckInterval) {
    clearInterval(focusCheckInterval);
  }

  focusCheckInterval = setInterval(checkChromeWindowFocus, 100);
}

app.whenReady().then(() => {
  createWindow();
  chromeProcess = launchChromeWindow();
  chromeProcess.on('exit', () => {
    chromeProcess = null;
    isOurWindow = false;
  });
  isOurWindow = true;
  startWindowTracking();
  startFocusTracking();

  globalShortcut.register('CommandOrControl+P', async () => {
    if (win?.isVisible()) {
      win.hide();
    } else {
      const [activeApp, missionControlActive] = await Promise.all([
        new Promise<string>((resolve) => {
          exec(
            'osascript -e \'tell application "System Events" to get name of first application process whose frontmost is true\'',
            (error, stdout) => {
              if (error) {
                console.error('Error checking active window:', error);
                resolve('');
              } else {
                resolve(stdout.trim());
              }
            }
          );
        }),
        isMissionControlActive()
      ]);

      if (!missionControlActive && activeApp === 'Google Chrome' && isOurWindow) {
        await showUrlBar();
      }
    }
  });

  // Handle URL navigation
  ipcMain.on('navigate', (_event, url) => {
    const fullUrl = url.includes('://') ? url : `http://${url}`;
    openInChrome(fullUrl);
    win?.hide();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  if (trackingInterval) {
    clearInterval(trackingInterval);
  }
  if (focusCheckInterval) {
    clearInterval(focusCheckInterval);
  }
  globalShortcut.unregisterAll();
}); 