const cacheName = "piac-pwa-v1";
const filesToCache = ["/", "/index.html", "/style.css", "/js/main.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        // Serve from cache if available
        return response;
      }

      return fetch(event.request).then((fetchResponse) => {
        if (event.request.method === "GET") {
          // Cache the response for future requests
          return caches.open(cacheName).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        }
        return fetchResponse;
      });
    }).catch(() => {
      // Fallback to /index.html if offline and navigating
      if (event.request.mode === "navigate") {
        return caches.match("/index.html");
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
