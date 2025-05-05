const cacheName = "piac-pwa-v1";
const baseUrl = "/uni-PWA-JS/"
const filesToCache = [
  baseUrl + "index.html",
  baseUrl + "manifest.json",
  baseUrl + "images/icons/icon-192x192.png",
  baseUrl + "styles.css",
  baseUrl + "js/main.js"
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(filesToCache).catch(err => {
        console.error("Caching failed:", err);
      });
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then((fetchResponse) => {
        if (event.request.method === "GET") {
          return caches.open(cacheName).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        }
        return fetchResponse;
      });
    }).catch(() => {
      if (event.request.mode === "navigate") {
        return caches.match(baseUrl + "index.html");
      }
    })
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [cacheName];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (!cacheWhitelist.includes(cache)) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
