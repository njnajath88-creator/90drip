const CACHE_NAME = "90drip-admin-v4";
const ASSETS = ["/manifest.json", "/icon.png"];

// ─── Install ──────────────────────────────────────────────────────────────────
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

// ─── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

// ─── Fetch ────────────────────────────────────────────────────────────────────
self.addEventListener("fetch", (e) => {
  if (e.request.url.includes("/api/") || e.request.mode === "navigate") return;
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});

// ─── Push ─────────────────────────────────────────────────────────────────────
// Fired by the server via VAPID Web Push — works even when phone screen is off.
// iOS 16.4+ (installed PWA) / Android Chrome / Desktop.
self.addEventListener("push", (e) => {
  let data = {
    title: "New Order! 📦",
    body: "A customer just placed an order on 90Drip.",
    url: "/admin",
  };

  try {
    if (e.data) {
      const parsed = e.data.json();
      data = { ...data, ...parsed };
    }
  } catch (_) {}

  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon.png",
      badge: "/icon.png",
      tag: "new-order",
      renotify: true,
      requireInteraction: false,
      data: { url: data.url },
      // vibrate intentionally omitted — breaks iOS silent-mode notifications
    })
  );
});

// ─── Notification Click ───────────────────────────────────────────────────────
// Tapping the notification on the lock screen opens the admin dashboard.
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const targetUrl = e.notification.data?.url || "/admin";

  e.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        // Focus existing admin tab if open
        for (const client of clients) {
          if (client.url.includes("/admin") && "focus" in client) {
            return client.focus();
          }
        }
        // Otherwise open admin page
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});
