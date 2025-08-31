// assets/js/components.js
function withCacheBuster(rawUrl) {
  try {
    const u = new URL(rawUrl, window.location.origin);
    const bust = window.__ASSET_VERSION__ || Date.now().toString();
    u.searchParams.set("v", bust);
    return u.toString();
  } catch (e) {
    return rawUrl;
  }
}

function loadComponent(id, url, callback) {
  fetch(withCacheBuster(url), { cache: "no-store" })
    .then((res) => res.text())
    .then((html) => {
      const container = document.getElementById(id);
      if (!container) return; // Guard if target isn't on this page

      container.innerHTML = html;

      const init = () => {
        // Defer to next frame to ensure DOM is committed
        requestAnimationFrame(() => {
          if (window.Alpine && typeof window.Alpine.initTree === "function") {
            // Initialize only this subtree
            window.Alpine.initTree(container);
          }
        });
      };

      if (window.Alpine) {
        init();
      } else {
        // If Alpine not yet loaded, wait for it
        document.addEventListener("alpine:init", init, { once: true });
      }
      if (callback) callback();
    });
}

document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("header"))
    loadComponent("header", "components/header.html");
  if (document.getElementById("header-light"))
    loadComponent("header-light", "components/header-light.html");
  if (document.getElementById("footer"))
    loadComponent("footer", "components/footer.html", function () {
      // Load footer enhancement script after footer is loaded
      const script = document.createElement("script");
      // script.src = "assets/js/footer.js";
      document.head.appendChild(script);
    });
  // Add more as needed
});
