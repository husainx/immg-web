// assets/js/components.js
(function () {
  // 1) Detect base path (works on GitHub Pages project sites)
  function detectBasePath() {
    // Allow manual override via <meta name="base-path" content="/repo-name/">
    const meta = document.querySelector('meta[name="base-path"]');
    if (meta?.content)
      return meta.content.endsWith("/") ? meta.content : meta.content + "/";

    const host = location.hostname.toLowerCase();
    // For project sites (user.github.io/repo), first path segment is repo
    if (host.endsWith("github.io")) {
      const parts = location.pathname.split("/").filter(Boolean);
      if (parts.length > 0) return "/" + parts[0] + "/";
    }
    // Custom domains or user/organization root sites
    return "/";
  }

  const BASE_PATH = detectBasePath();
  const VERSION = window.__ASSET_VERSION__ || String(Date.now());

  function resolveUrl(path) {
    // Ensure we always fetch under BASE_PATH (handles subfolders too)
    const base = new URL(BASE_PATH, location.origin);
    return new URL(path.replace(/^\/+/, ""), base).toString();
  }

  function withCacheBuster(absUrl) {
    const u = new URL(absUrl);
    u.searchParams.set("v", VERSION);
    return u.toString();
  }

  function initAlpineSubtree(el) {
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

    const url = withCacheBuster(resolveUrl(path));
    try {
      const res = await fetch(url, {
        cache: "no-store",
        credentials: "same-origin",
      });
      if (!res.ok)
        throw new Error(`[${res.status}] ${res.statusText} -> ${url}`);

      const html = await res.text();
      // Don’t inject GitHub’s 404 page if a proxy/edge returns 200 with 404 HTML
      if (/There isn't a GitHub Pages site here/i.test(html)) {
        throw new Error(`[GitHub Pages 404 HTML] -> ${url}`);
      }

      // Parse via template so we can adjust any relative URLs later if needed
      const tpl = document.createElement("template");
      tpl.innerHTML = html;

      container.innerHTML = "";
      container.appendChild(tpl.content);

      initAlpineSubtree(container);
      if (typeof after === "function") after(container);
    } catch (err) {
      console.error("[components] Failed to load fragment:", err);
      container.innerHTML = `<div class="text-red-600 text-sm">Failed to load component.</div>`;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("header"))
      loadComponent("header", "components/header.html");
    if (document.getElementById("header-light"))
      loadComponent("header-light", "components/header-light.html");
    if (document.getElementById("footer"))
      loadComponent("footer", "components/footer.html");
  });
})();
