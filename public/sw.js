const CACHE_NAME = "v1";
// Оставляем только гарантированно статичные ресурсы с фиксированными путями
const PRECACHE_PATHS = ["/teachvideo.mp4", "clever.png"];

async function putInCache(req, res) {
  // Пропускаем запросы, которые нельзя кэшировать (например, от расширений браузера)
  if (!req.url.startsWith("http")) {
    return;
  }

  const cache = await caches.open(CACHE_NAME);
  await cache.put(req, res.clone());
}

// Кэшируем только заранее известные статичные ресурсы
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_PATHS))
      .then(() => self.skipWaiting()),
  );
});

async function handlerFetch(event) {
  const req = event.request;

  try {
    const fetchResponse = await fetch(req);
    event.waitUntil(putInCache(req, fetchResponse.clone()));

    return fetchResponse;
  } catch (error) {
    const cachedResponse = await caches.match(req, { ignoreSearch: true });
    return cachedResponse || caches.match("/");
  }
}

self.addEventListener("fetch", (event) => {
  event.respondWith(handlerFetch(event));
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              console.log("Deleting out of date cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        ),
      )
      .then(() => self.clients.claim()),
  );
});
