/* Digital Skills with Maha — service worker
 * - Precaches the app shell on install
 * - Pages: network-first, falls back to cache when offline
 * - Static assets (_next/static, icons, fonts): cache-first
 * Bump VERSION to force clients to refresh caches.
 */
const VERSION = "dswm-v2";
const SCOPE = new URL(self.registration.scope).pathname; // e.g. "/digitalskillswithmaha/"
const SHELL = [SCOPE, `${SCOPE}manifest.webmanifest`, `${SCOPE}icons/icon-192.png`, `${SCOPE}content/skills.json`, `${SCOPE}content/testimonials.json`];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.includes("/api/")) return;

  if (request.mode === "navigate" || url.pathname.includes("/content/")) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request).then((hit) => hit || caches.match(SCOPE))),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(
      (hit) =>
        hit ||
        fetch(request).then((res) => {
          if (res.ok && (url.pathname.includes("/_next/static/") || /\.(png|webp|ico|woff2|svg)$/.test(url.pathname))) {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(request, copy));
          }
          return res;
        }),
    ),
  );
});
