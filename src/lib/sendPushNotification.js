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
import { sendFcmNotification } from "@/lib/firebaseAdmin";

let isVapidInitialized = false;

/**
 * Sends a push notification to all stored device subscriptions (FCM + VAPID).
 * @param {string} title  - Notification title
 * @param {string} body   - Notification body text
 * @param {string} url    - URL to open when notification is tapped
 */
export async function sendPushToAll(title, body, url = "/admin") {
  try {
    await connectDB();
    const subscriptions = await PushSubscription.find({}).lean();

    if (!subscriptions || subscriptions.length === 0) return;

    // Separate FCM tokens from VAPID subscriptions
    const fcmTokens = subscriptions
      .filter((s) => s.type === "fcm" || s.fcmToken)
      .map((s) => s.fcmToken || s.endpoint)
      .filter(Boolean);

    const vapidSubs = subscriptions.filter(
      (s) => (s.type === "vapid" || !s.type) && s.keys?.p256dh && s.keys?.auth
    );

    // 1. Dispatch FCM Push Notifications
    if (fcmTokens.length > 0) {
      sendFcmNotification(fcmTokens, title, body, url).catch((err) =>
        console.error("FCM dispatch error:", err)
      );
    }

    // 2. Dispatch VAPID Push Notifications
    if (
      vapidSubs.length > 0 &&
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY &&
      process.env.VAPID_PRIVATE_KEY
    ) {
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
        }
      }

      if (isVapidInitialized) {
        const payload = JSON.stringify({ title, body, url });
        await Promise.allSettled(
          vapidSubs.map(async (sub) => {
            const pushSub = {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth },
            };
            try {
              await webpush.sendNotification(pushSub, payload, {
                TTL: 86400,
                urgency: "high",
              });
            } catch (err) {
              if (err.statusCode === 404 || err.statusCode === 410) {
                await PushSubscription.deleteOne({ endpoint: sub.endpoint }).catch(() => {});
              }
            }
          })
        );
      }
    }
  } catch (err) {
    console.error("sendPushToAll error:", err);
  }
}
