import JSConfetti from "js-confetti";

const oouSound = document.getElementById("oouSound");
const rocketSound = document.getElementById("rocketSound");
let hasClickedLogo = false;
let hasDownloadPermission = false;

async function requestDownloadPermission() {
  try {
    const result = await navigator.permissions.query({ name: "downloads" });

    if (result.state === "granted") {
      hasDownloadPermission = true;
    } else if (result.state === "prompt") {
      const testBlob = new Blob([""], { type: "text/plain" });
      const testUrl = URL.createObjectURL(testBlob);
      const link = document.createElement("a");
      link.href = testUrl;
      link.download = "test.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(testUrl);

      hasDownloadPermission = true;
    }
  } catch (error) {
    console.warn("Download permission check failed:", error);
    hasDownloadPermission = true;
  } finally {
    setTimeout(() => {
      document.body.style.animation = "";
    }, 2000);
  }
}

document.querySelector(".logo-wrapper").addEventListener("click", () => {
  oouSound.currentTime = 0;
  oouSound.play();
  const logo = document.querySelector(".logo-wrapper");
  logo.classList.add("clicked");
  hasClickedLogo = true;

  setTimeout(() => {
    logo.classList.remove("clicked");
    if (!hasDownloadPermission) {
      requestDownloadPermission();
    }
  }, 200);
});

const jsConfetti = new JSConfetti();

const downloadLink = document.querySelector(".download-link");
if (downloadLink) {
  downloadLink.addEventListener("click", async () => {
    if (!hasDownloadPermission) {
      await requestDownloadPermission();
      if (!hasDownloadPermission) return;
    }

    const topLogo = document.querySelector(".logo-wrapper:nth-child(1)");
    const bottomLogo = document.querySelector(".logo-wrapper:nth-child(2)");

    topLogo.classList.add("fly-away");
    bottomLogo.classList.add("move-up");

    setTimeout(() => {
      topLogo.remove();

      const newLogo = document.createElement("div");
      newLogo.className = "logo-wrapper";
      newLogo.innerHTML = `
        <img class="logo-ghost" src="assets/logo.png" alt="o0 logo" />
      `;

      document.querySelector(".logo-stack").prepend(newLogo);
      newLogo.offsetHeight;

      bottomLogo.classList.remove("move-up");

      newLogo.addEventListener("click", () => {
        oouSound.currentTime = 0;
        oouSound.play();
        hasClickedLogo = true;
      });
    }, 1000);

    jsConfetti.addConfetti({
      emojis: ["🎉", "✨", "⭐️", "🌟", "💫"],
      emojiSize: 100,
      confettiNumber: 50,
      confettiRadius: 50,
    });

    if (hasClickedLogo) {
      rocketSound.currentTime = 0;
      setTimeout(() => {
        rocketSound.play();
      }, 1000);
    }
  });
}

document.querySelector(".logo-ghost").addEventListener("animationend", (e) => {
  if (e.animationName === "ghost-download") {
    const logo = document.querySelector(".logo-ghost");
    logo.style.animation = "float-infinity 10s infinite ease-in-out";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const downloadLink = document.querySelector(
    'a.download-link[href="https://o0.network/explore"]'
  );

  if (downloadLink) {
    downloadLink.addEventListener("click", function (event) {
      event.preventDefault();
      const href = this.href;
      const originalText = this.textContent;
      this.textContent = "Launching...";

      // Play rocket sound and navigate after it ends
      if (hasClickedLogo && rocketSound) {
        rocketSound.currentTime = 0;
        rocketSound.play();
        const onEnded = () => {
          window.location.href = href;
          rocketSound.removeEventListener("ended", onEnded);
        };
        rocketSound.addEventListener("ended", onEnded);
      } else {
        // fallback: navigate after 1s if rocket sound not available
        setTimeout(() => {
          window.location.href = href;
        }, 1000);
      }
    });
  }

  // You can add other general script logic for your page here
});
