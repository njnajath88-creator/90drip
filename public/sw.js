const CACHE_NAME = "90drip-admin-v3";
const ASSETS = [
  "/manifest.json",
  "/icon.png"
];

// ─── Install ──────────────────────────────────────────────────────────────────
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// ─── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// ─── Fetch ────────────────────────────────────────────────────────────────────
self.addEventListener("fetch", (e) => {
  // Pass API calls and navigation directly through — never cache them
  if (e.request.url.includes("/api/") || e.request.mode === "navigate") {
    return;
  }
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});

// ─── Push ─────────────────────────────────────────────────────────────────────
// Handles Web Push messages sent from a future server-side push service.
// On iOS 16.4+ (installed PWA) this fires native lock-screen notifications.
self.addEventListener("push", (e) => {
  let data = { title: "New Order! 📦", body: "A customer just placed an order." };
  try {
    if (e.data) data = e.data.json();
  } catch (_) {}

  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon.png",
      badge: "/icon.png",
      tag: "new-order-push",
      renotify: true,          // show even if same tag is already displayed
      requireInteraction: false
      // NOTE: vibrate is intentionally omitted — iOS ignores it and it can
      // cause showNotification() to silently fail on some versions.
    })
  );
});

// ─── Notification Click ───────────────────────────────────────────────────────
// When the admin taps the notification on their iPhone lock screen,
// bring the app to the foreground or open the admin dashboard.
self.addEventListener("notificationclick", (e) => {
  e.notification.close();

  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      // If admin dashboard is already open, focus it
      for (const client of clients) {
        if (client.url.includes("/admin") && "focus" in client) {
          return client.focus();
        }
      }
      // Otherwise open the admin page
      if (self.clients.openWindow) {
        return self.clients.openWindow("/admin");
      }
    })
  );
});
