const CACHE_NAME = "hcc-v4";
const CRITICAL_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];
const OPTIONAL_ASSETS = [
  "./images/hero-home.jpg",
  "./images/hero-irr.jpg",
  "./images/hero-yard.jpg"
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
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(event.request));
    return;
  }
  event.respondWith(
    caches.match(event.request).then(r => r || fetch(event.request))
  );
});
