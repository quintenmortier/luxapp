const CACHE_NAME = "lux-bingo-v19";
const BASE_URL = new URL("./", self.location.href);
const INDEX_URL = new URL("./index.html", self.location.href).href;
const APP_SHELL = [
  BASE_URL.href,
  INDEX_URL,
  new URL("./styles.css", self.location.href).href,
  new URL("./app.js", self.location.href).href,
  new URL("./manifest.webmanifest", self.location.href).href,
  new URL("./images/arabic.png", self.location.href).href,
  new URL("./images/degas.jpg", self.location.href).href,
  new URL("./images/goya.jpg", self.location.href).href,
  new URL("./images/icarus.jpg", self.location.href).href,
  new URL("./images/italian.png", self.location.href).href,
  new URL("./images/japanese.png", self.location.href).href,
  new URL("./images/latin.png", self.location.href).href,
  new URL("./images/Maria Theresa of Spain.jpeg", self.location.href).href,
  new URL("./images/mandarin.png", self.location.href).href,
  new URL("./images/monalisa.jpg", self.location.href).href,
  new URL("./images/lux.jpg", self.location.href).href,
  new URL("./images/luxlux.jpg", self.location.href).href,
  new URL("./images/motomami.jpg", self.location.href).href,
  new URL("./images/schreeuw.jpg", self.location.href).href,
  new URL("./images/ukrainian.png", self.location.href).href,
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

  const requestUrl = new URL(event.request.url);
  const isSameOrigin = requestUrl.origin === self.location.origin;

  if (!isSameOrigin) {
    return;
  }

  if (event.request.mode === "navigate" || shouldUseNetworkFirst(requestUrl)) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  event.respondWith(cacheFirst(event.request));
});

function shouldUseNetworkFirst(url) {
  return [".html", ".css", ".js", ".webmanifest"].some((suffix) =>
    url.pathname.endsWith(suffix)
  );
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    if (request.mode === "navigate") {
      const cachedIndex = await caches.match(INDEX_URL);
      if (cachedIndex) {
        return cachedIndex;
      }
    }

    throw error;
  }
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await fetch(request);
  const cache = await caches.open(CACHE_NAME);
  cache.put(request, networkResponse.clone());
  return networkResponse;
}
