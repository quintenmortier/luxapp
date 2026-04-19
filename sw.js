const CACHE_NAME = "lux-bingo-v2";
const BASE_URL = new URL("./", self.location.href);
const INDEX_URL = new URL("./index.html", self.location.href).href;
const APP_SHELL = [
  BASE_URL.href,
  INDEX_URL,
  new URL("./styles.css", self.location.href).href,
  new URL("./app.js", self.location.href).href,
  new URL("./manifest.webmanifest", self.location.href).href,
  new URL("./images/icarus.jpg", self.location.href).href,
  new URL("./images/Maria Theresa of Spain.jpeg", self.location.href).href,
  new URL("./images/venus.jpg", self.location.href).href,
  new URL("./icons/icon-180.png", self.location.href).href,
  new URL("./icons/icon-192.png", self.location.href).href,
  new URL("./icons/icon-512.png", self.location.href).href,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(INDEX_URL))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        const responseToCache = networkResponse.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});
