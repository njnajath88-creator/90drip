// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Initialize Firebase App in Service Worker
// Values will be read from registration or fallbacks
firebase.initializeApp({
  apiKey: self.FIREBASE_API_KEY || "AIzaSy_Placeholder",
  authDomain: self.FIREBASE_AUTH_DOMAIN || "90drip.firebaseapp.com",
  projectId: self.FIREBASE_PROJECT_ID || "90drip",
  storageBucket: self.FIREBASE_STORAGE_BUCKET || "90drip.appspot.com",
  messagingSenderId: self.FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: self.FIREBASE_APP_ID || "1:000000000000:web:000000000000",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background FCM message:', payload);
  const title = payload.notification?.title || payload.data?.title || 'New Order Placed! 📦';
  const options = {
    body: payload.notification?.body || payload.data?.body || 'A new order was placed on 90Drip.',
    icon: '/icon.png',
    badge: '/icon.png',
    tag: 'fcm-order-' + Date.now(),
    data: { url: payload.data?.url || '/admin' },
  };

  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/admin';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
      for (const client of clientsArr) {
        if (client.url.includes('/admin') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
