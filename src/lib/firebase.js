import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app;
let messaging = null;

if (typeof window !== "undefined") {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  } catch (err) {
    console.error("Firebase Client Init Error:", err);
  }
}

export async function getFcmToken() {
  if (typeof window === "undefined") return null;

  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn("FCM is not supported in this browser context.");
      return null;
    }

    if (!app) {
      app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    }

    if (!messaging) {
      messaging = getMessaging(app);
    }

    const vapidKey =
      process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ||
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

    const swReg = await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      serviceWorkerRegistration: swReg,
      vapidKey: vapidKey,
    });

    return token;
  } catch (error) {
    console.error("Error obtaining FCM token:", error);
    return null;
  }
}

export { app, messaging };
