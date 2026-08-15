const CACHE_NAME = "hcc-v78";
const CRITICAL_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];
const OPTIONAL_ASSETS = [
  "./images/hero-home-dusk.jpg",
  "./images/hero-irr.jpg",
  "./images/hero-yard.jpg",
  "./images/hero-guardian.jpg",
  "./images/hero-car.jpg",
  "./images/hero-cameras.jpg",
  "./images/hero-lux.jpg",
  "./images/white-house-dispatch.jpg",
  "./images/splash-portrait.jpg",
  "./images/splash-landscape.jpg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(CRITICAL_ASSETS).then(() =>
        Promise.allSettled(OPTIONAL_ASSETS.map(url => cache.add(url)))
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // API calls always go to network
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(event.request));
    return;
  }

  // HTML / navigation requests: NETWORK-FIRST so code fixes always land.
  const isHTML = event.request.mode === "navigate" ||
    url.pathname === "/" || url.pathname.endsWith("/index.html");
  if (isHTML) {
    event.respondWith(
      fetch(event.request, { cache: "no-cache" })
        .then(resp => {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, copy));
          return resp;
        })
        .catch(() => caches.match(event.request).then(r => r || caches.match("./index.html")))
    );
    return;
  }

  // Images: STALE-WHILE-REVALIDATE â€” serve cached instantly, update in background.
  // This fixes the bug where new hero images never showed because old ones were cached forever.
  const isImage = url.pathname.startsWith("/images/") || url.pathname.endsWith(".jpg") || url.pathname.endsWith(".png");
  if (isImage) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        const fetchPromise = fetch(event.request).then(resp => {
          if (resp.ok) {
            const copy = resp.clone();
            caches.open(CACHE_NAME).then(c => c.put(event.request, copy));
          }
          return resp;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Everything else (icons, manifest, fonts): cache-first
  event.respondWith(
    caches.match(event.request).then(r => r || fetch(event.request))
  );
});
