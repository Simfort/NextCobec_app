const CACHE_NAME = "v1";
// Оставляем только гарантированно статичные ресурсы с фиксированными путями
const PRECACHE_PATHS = [
  "/teachvideo.mp4",
  "/",
  "/interview",
  "/interview/history",
  "/clever.png",
];

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

  // Для навигации (HTML-страницы) — стратегия «сеть с откатом на кэш»
  if (req.mode === "navigate") {
    try {
      const fetchResponse = await fetch(req);
      event.waitUntil(putInCache(req, fetchResponse.clone()));

      return fetchResponse;
    } catch (error) {
      const cachedResponse = await caches.match(req, { ignoreSearch: true });
      return cachedResponse || caches.match("/");
    }
  }

  // Для статических ресурсов Next.js (_next/static/) — кэшируем на лету
  if (req.url.includes("/_next/static/")) {
    const cachedResponse = await caches.match(req);
    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const fetchResponse = await fetch(req);
      // Только успешные ответы (статус 200) кэшируем
      if (fetchResponse.ok) {
        event.waitUntil(putInCache(req, fetchResponse.clone()));
      }
      return fetchResponse;
    } catch (error) {
      // Если сеть недоступна и в кэше нет ресурса — возвращаем заглушку или ошибку
      console.error("Failed to fetch and cache:", req.url, error);
      return new Response("Resource not available offline", { status: 503 });
    }
  }

  // Для остальных запросов — просто проксируем в сеть
  return fetch(req);
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
