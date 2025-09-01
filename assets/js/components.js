// assets/js/components.js
(function () {
  const VERSION = window.__ASSET_VERSION__ || Date.now() + "";
  // Optional: set <meta name="csp-nonce" content="..."> if you use a CSP nonce
  const CSP_NONCE =
    (document.querySelector('meta[name="csp-nonce"]') || {}).content || null;

  // Map target id -> fragment url
  const COMPONENTS = {
    header: "/components/header.html",
    "header-light": "/components/header-light.html",
    footer: "/components/footer.html",
  };

  function withCacheBuster(rawUrl) {
    try {
      const u = new URL(rawUrl, window.location.origin);
      u.searchParams.set("v", VERSION);
      return u.toString();
    } catch {
      return rawUrl;
    }
  }

  // Make relative URLs inside the fragment absolute (img/src, link/href, script/src, a/href, source/src, use/href)
  function absolutizeUrls(root, baseUrl) {
    const base = new URL(baseUrl, window.location.origin);
    const pairs = [
      ["img", "src"],
      ["script", "src"],
      ["link", "href"],
      ["a", "href"],
      ["source", "src"],
      ["use", "href"],
    ];
    for (const [tag, attr] of pairs) {
      root.querySelectorAll(`${tag}[${attr}]`).forEach((el) => {
        const val = el.getAttribute(attr);
        if (
          !val ||
          val.startsWith("http") ||
          val.startsWith("data:") ||
          val.startsWith("mailto:") ||
          val.startsWith("#")
        )
          return;
        try {
          el.setAttribute(attr, new URL(val, base).href);
        } catch {}
      });
    }
  }

  // Recreate and run <script> tags found inside the injected fragment
  async function executeScripts(container) {
    const scripts = Array.from(container.querySelectorAll("script"));
    for (const old of scripts) {
      const s = document.createElement("script");
      // Copy attributes (type, async, defer, nomodule, etc.)
      for (const { name, value } of Array.from(old.attributes)) {
        if (name === "nonce" && CSP_NONCE) continue; // we will set our own nonce if provided
        s.setAttribute(name, value);
      }
      if (CSP_NONCE) s.setAttribute("nonce", CSP_NONCE);

      if (old.src) {
        // External script
        s.src = old.src; // already absolutized above
        await new Promise((resolve, reject) => {
          s.onload = resolve;
          s.onerror = reject;
          document.head.appendChild(s);
        });
      } else {
        // Inline script (may be blocked by CSP if no nonce policy allows it)
        try {
          s.textContent = old.textContent || "";
          document.head.appendChild(s);
        } catch (err) {
          console.warn("[components] Inline script blocked by CSP:", err);
        }
      }
      old.remove();
    }
  }

  function initAlpineSubtree(el) {
    const init = () => {
      requestAnimationFrame(() => {
        if (window.Alpine && typeof window.Alpine.initTree === "function") {
          window.Alpine.initTree(el);
        }
      });
    };
    if (window.Alpine) {
      init();
    } else {
      document.addEventListener("alpine:init", init, { once: true });
    }
  }

  async function loadComponent(targetId, url, afterLoad) {
    const container = document.getElementById(targetId);
    if (!container) return;

    const absUrl = withCacheBuster(url);

    try {
      const res = await fetch(absUrl, {
        cache: "no-store",
        credentials: "same-origin",
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const html = await res.text();

      // Parse safely using <template>
      const tpl = document.createElement("template");
      tpl.innerHTML = html;

      // Fix relative paths inside the fragment against its own URL
      absolutizeUrls(tpl.content, absUrl);

      // Inject
      container.innerHTML = "";
      container.appendChild(tpl.content);

      // Execute any scripts included in the fragment
      await executeScripts(container);

      // Re-init Alpine on just this subtree
      initAlpineSubtree(container);

      // Optional hook
      if (typeof afterLoad === "function") afterLoad(container);
    } catch (err) {
      console.error(`[components] Failed to load ${url}:`, err);
      container.innerHTML = `<div class="text-red-600 text-sm">Failed to load component.</div>`;
    }
  }

  function bootstrap() {
    // Only request components that exist on the page
    for (const [id, url] of Object.entries(COMPONENTS)) {
      if (document.getElementById(id)) {
        loadComponent(id, url, (el) => {
          // Example: after footer is loaded, run an enhancement script
          if (id === "footer") {
            // If you have a separate footer JS, prefer external file (CSP friendly)
            // const s = document.createElement('script');
            // s.src = withCacheBuster('/assets/js/footer.js');
            // document.head.appendChild(s);
          }
        });
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
  } else {
    bootstrap();
  }
})();
