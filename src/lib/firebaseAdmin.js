import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

function getFirebaseAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Check for Firebase Admin service account environment variables
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined;

  if (projectId && clientEmail && privateKey) {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  // Fallback: If service account JSON string is provided in env
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      return initializeApp({
        credential: cert(serviceAccount),
      });
    } catch (e) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:", e);
    }
  }

  // Fallback default app init if running on GCP / Firebase hosting environment
  try {
    return initializeApp();
  } catch (err) {
    console.warn("Firebase Admin SDK credentials not fully configured:", err.message);
    return null;
  }
}

/**
 * Sends FCM push notification to a list of device tokens.
 * @param {Array<string>} tokens - Array of FCM registration tokens
 * @param {string} title - Notification Title
 * @param {string} body - Notification Body text
 * @param {string} url - Target URL when clicked
 */
export async function sendFcmNotification(tokens, title, body, url = "/admin") {
  if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
    return { successCount: 0, failureCount: 0 };
  }

  const app = getFirebaseAdminApp();
  if (!app) {
    console.warn("Skipping FCM send — Firebase Admin SDK not initialized.");
    return { successCount: 0, failureCount: 0 };
  }

  try {
    const messaging = getMessaging(app);
    const message = {
      notification: {
        title,
        body,
      },
      data: {
        url,
        title,
        body,
      },
      webpush: {
        headers: {
          Urgency: "high",
        },
        notification: {
          title,
          body,
          icon: "/icon.png",
          badge: "/icon.png",
          click_action: url,
        },
        fcmOptions: {
          link: url,
        },
      },
      tokens,
    };

    const response = await messaging.sendEachForMulticast(message);
    console.log(`FCM sent: ${response.successCount} succeeded, ${response.failureCount} failed.`);
    return response;
  } catch (error) {
    console.error("sendFcmNotification error:", error);
    return { successCount: 0, failureCount: tokens.length, error };
  }
}

export { getFirebaseAdminApp };
