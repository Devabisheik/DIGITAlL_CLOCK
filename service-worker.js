const CACHE_NAME = "digital-clock-cache-v2";

const urlsToCache = [
  "/DIGITAlL_CLOCK/",
  "/DIGITAlL_CLOCK/index.html",
  "/DIGITAlL_CLOCK/settings.html",
  "/DIGITAlL_CLOCK/stopwatch.html",
  "/DIGITAlL_CLOCK/manifest.json",
  "/DIGITAlL_CLOCK/icon.jpg",
  "/DIGITAlL_CLOCK/CSS/clock.css",
  "/DIGITAlL_CLOCK/CSS/settings.css",
  "/DIGITAlL_CLOCK/CSS/stopwatch.css",
  "/DIGITAlL_CLOCK/JAVASCRIPT/clock.js",
  "/DIGITAlL_CLOCK/JAVASCRIPT/settings.js",
  "/DIGITAlL_CLOCK/JAVASCRIPT/stopwatch.js",
  "/DIGITAlL_CLOCK/AUDIO/ringtone1.mp3",
  "/DIGITAlL_CLOCK/AUDIO/ringtone2.mp3",
  "/DIGITAlL_CLOCK/AUDIO/ringtone3.mp3",
  "/DIGITAlL_CLOCK/AUDIO/ringtone4.mp3"
];

// Install service worker and cache files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate service worker and clean old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log("Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch files from cache or network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Handle push notifications
self.addEventListener("push", event => {
  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  const options = {
    body: data.body || "You have a new notification!",
    icon: "/DIGITAlL_CLOCK/icon.jpg",
    badge: "/DIGITAlL_CLOCK/icon.jpg",
    vibrate: [200, 100, 200],
    data: {
      url: data.url || "/DIGITAlL_CLOCK/index.html"
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "Digital Clock", options)
  );
});

// Handle notification click
self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});