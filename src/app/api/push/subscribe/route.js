/**
 * /api/push/subscribe
 *
 * POST — saves a new push subscription to MongoDB
 * DELETE — removes a subscription (when admin disables notifications)
 */
import { connectDB } from "@/lib/db";
import { PushSubscription } from "@/lib/models/PushSubscription";

export const dynamic = "force-dynamic";

// POST — subscribe this device (VAPID or FCM)
export async function POST(request) {
  try {
    const body = await request.json();
    const { endpoint, keys, fcmToken, type } = body;

    await connectDB();

    // Handling FCM registration token
    if (fcmToken || type === "fcm") {
      const token = fcmToken || endpoint;
      if (!token) {
        return Response.json({ error: "FCM token required" }, { status: 400 });
      }

      await PushSubscription.findOneAndUpdate(
        { endpoint: token },
        { endpoint: token, fcmToken: token, type: "fcm", label: "admin" },
        { upsert: true, new: true }
      );

      return Response.json({ success: true, message: "Subscribed to FCM push notifications" });
    }

    // Handling standard VAPID Web Push
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return Response.json({ error: "Invalid subscription object" }, { status: 400 });
    }

    // Upsert — avoid duplicates if the same device subscribes again
    await PushSubscription.findOneAndUpdate(
      { endpoint },
      { endpoint, keys, type: "vapid", label: "admin" },
      { upsert: true, new: true }
    );

    return Response.json({ success: true, message: "Subscribed to VAPID push notifications" });
  } catch (err) {
    console.error("POST /api/push/subscribe error:", err);
    return Response.json({ error: "Failed to save subscription" }, { status: 500 });
  }
}

// DELETE — unsubscribe this device
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { endpoint, fcmToken } = body;
    const target = fcmToken || endpoint;

    if (!target) {
      return Response.json({ error: "Endpoint or FCM token required" }, { status: 400 });
    }

    await connectDB();
    await PushSubscription.deleteOne({ endpoint: target });

    return Response.json({ success: true, message: "Unsubscribed" });
  } catch (err) {
    console.error("DELETE /api/push/subscribe error:", err);
    return Response.json({ error: "Failed to remove subscription" }, { status: 500 });
  }
}
