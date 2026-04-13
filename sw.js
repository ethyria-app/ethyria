// ─────────────────────────────────────────────────────────────
//  Ethyria Service Worker – Cache-First for assets, Network-First for HTML
//  Version must be bumped on every deploy to trigger cache refresh.
// ─────────────────────────────────────────────────────────────

const CACHE_VERSION = "ethyria-v2";
const OFFLINE_URL = "/offline.html";

const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/index.en.html",
  "/index.fr.html",
  "/index.es.html",
  "/index.ru.html",
  "/offline.html",
  "/style.css",
  "/assets/tailwind.min.css",
  "/assets/beta-signup.js",
  "/assets/faq-accordion.js",
  "/assets/section-nav.js",
  "/assets/Ethyria_new_app_icon.png",
  "/assets/icon-192x192.png",
  "/assets/icon-512x512.png",
  "/fonts/poppins_bold.woff2",
  "/fonts/inter_regular.woff2",
  "/symbols/index.html",
];

// ── Install: precache critical assets ─────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }),
  );
  self.skipWaiting();
});

// ── Activate: clean old caches ────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION)
          .map((key) => caches.delete(key)),
      );
    }),
  );
  self.clients.claim();
});

// ── Fetch strategy ────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== "GET") return;

  // Skip cross-origin requests (Google Apps Script, fonts API, etc.)
  if (!request.url.startsWith(self.location.origin)) return;

  // HTML pages: Network-First (always get fresh content, offline fallback)
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match(OFFLINE_URL);
          });
        }),
    );
    return;
  }

  // Static assets: Cache-First (fast loading, network fallback)
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        // Cache successful responses for known asset types
        if (
          response.ok &&
          (request.url.match(/\.(css|js|woff2|webp|jpg|png|svg|json)$/) ||
            request.url.includes("/assets/") ||
            request.url.includes("/fonts/"))
        ) {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    }),
  );
});
