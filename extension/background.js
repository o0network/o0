// Connect to the native messaging host
let port = chrome.runtime.connectNative("com.wtf403.shell_executor");

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "execute_script") {
    // Send message to native host
    port.postMessage({ action: "execute_script" });

    // Listen for response from native host
    port.onMessage.addListener((response) => {
      console.log("Response from native host:", response);
    });

    // Handle disconnection
    port.onDisconnect.addListener(() => {
      console.log("Disconnected from native host");
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      }
    });
  }
});

let isAutoOpenEnabled = false;
let autoOpenInterval;

chrome.windows.create({
  url: "https://google.com",
  type: "popup",
  width: 800,
  height: 600,
});
