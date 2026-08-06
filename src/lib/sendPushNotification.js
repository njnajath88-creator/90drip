/**
 * sendPushNotification.js
 *
 * Server-side utility — sends a VAPID Web Push message to ALL stored
 * subscriptions in MongoDB. Called by the orders POST API whenever a
 * new order is placed.
 *
 * Works on:
 *   • Desktop Chrome / Edge / Firefox
 *   • Android Chrome (even when screen off)
 *   • iOS 16.4+ installed as PWA (even when screen off)
 */

import webpush from "web-push";
import { connectDB } from "@/lib/db";
import { PushSubscription } from "@/lib/models/PushSubscription";

// We will initialize VAPID details lazily inside sendPushToAll to prevent build crashes
// when environment variables are missing during Next.js build-time prerendering.
let isVapidInitialized = false;

/**
 * Sends a push notification to all stored device subscriptions.
 * @param {string} title  - Notification title
 * @param {string} body   - Notification body text
 * @param {string} url    - URL to open when notification is tapped
 */
export async function sendPushToAll(title, body, url = "/admin") {
  if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    console.warn("VAPID keys not configured — skipping push notifications");
    return;
  }

  // Lazily configure VAPID on first push request
  if (!isVapidInitialized) {
    try {
      webpush.setVapidDetails(
        `mailto:${process.env.VAPID_CONTACT_EMAIL || "admin@90drip.com"}`,
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
      );
      isVapidInitialized = true;
    } catch (err) {
      console.error("Failed to initialize VAPID details:", err);
      return;
    }
  }

  try {
    await connectDB();
    const subscriptions = await PushSubscription.find({}).lean();

    if (subscriptions.length === 0) return;

    const payload = JSON.stringify({ title, body, url });

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        const pushSub = {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth },
        };
        try {
          await webpush.sendNotification(pushSub, payload);
        } catch (err) {
          // 404 or 410 = subscription expired/unsubscribed — clean it up
          if (err.statusCode === 404 || err.statusCode === 410) {
            await PushSubscription.deleteOne({ endpoint: sub.endpoint }).catch(() => {});
          }
        }
      })
    );

    const sent = results.filter((r) => r.status === "fulfilled").length;
    console.log(`Push sent to ${sent}/${subscriptions.length} subscriptions`);
  } catch (err) {
    console.error("sendPushToAll error:", err);
  }
}
