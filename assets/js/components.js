// assets/js/components.js
(function () {
  // figure out where this script is served from, then go up 2 levels to site root
  // e.g. https://user.github.io/repo-name/assets/js/components.js -> base https://user.github.io/repo-name/
  const thisScript =
    document.currentScript ||
    (function () {
      const scripts = document.getElementsByTagName("script");
      return scripts[scripts.length - 1];
    })();
  const scriptUrl = new URL(thisScript.src, location.href);
  const SITE_BASE = new URL("../../", scriptUrl).href; // up from /assets/js/ to site root

  const VERSION = window.__ASSET_VERSION__ || String(Date.now());

  function resolve(path) {
    // resolve "components/header.html" against the site base (handles repo subpaths)
    return new URL(path.replace(/^\/+/, ""), SITE_BASE).toString();
  }
  function withCacheBuster(absUrl) {
    const u = new URL(absUrl);
    u.searchParams.set("v", VERSION);
    return u.toString();
  }

  function initAlpine(el) {
    const run = () =>
      requestAnimationFrame(() => {
        if (window.Alpine?.initTree) window.Alpine.initTree(el);
      });
    window.Alpine
      ? run()
      : document.addEventListener("alpine:init", run, { once: true });
  }

  async function loadComponent(id, path, after) {
    const container = document.getElementById(id);
    if (!container) return;

    const url = withCacheBuster(resolve(path));
    try {
      const res = await fetch(url, {
        cache: "no-store",
        credentials: "same-origin",
      });
      if (!res.ok)
        throw new Error(`[${res.status}] ${res.statusText} -> ${url}`);

      const html = await res.text();
      if (/There isn't a GitHub Pages site here/i.test(html)) {
        throw new Error(`[GitHub Pages 404 HTML] -> ${url}`);
      }

      const tpl = document.createElement("template");
      tpl.innerHTML = html;
      container.innerHTML = "";
      container.appendChild(tpl.content);

      initAlpine(container);
      if (typeof after === "function") after(container);
    } catch (err) {
      console.error("[components] Failed to load", path, err);
      container.innerHTML = `<div class="text-red-600 text-sm">Failed to load component.</div>`;
    }
  }

  function boot() {
    if (document.getElementById("header"))
      loadComponent("header", "components/header.html");
    if (document.getElementById("header-light"))
      loadComponent("header-light", "components/header-light.html");
    if (document.getElementById("footer"))
      loadComponent("footer", "components/footer.html");
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", boot)
    : boot();
})();
