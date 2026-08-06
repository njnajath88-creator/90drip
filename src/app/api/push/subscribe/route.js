/**
 * /api/push/subscribe
 *
 * POST — saves a new push subscription to MongoDB
 * DELETE — removes a subscription (when admin disables notifications)
 */
import { connectDB } from "@/lib/db";
import { PushSubscription } from "@/lib/models/PushSubscription";

export const dynamic = "force-dynamic";

// POST — subscribe this device
export async function POST(request) {
  try {
    const body = await request.json();
    const { endpoint, keys } = body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return Response.json({ error: "Invalid subscription object" }, { status: 400 });
    }

    await connectDB();

    // Upsert — avoid duplicates if the same device subscribes again
    await PushSubscription.findOneAndUpdate(
      { endpoint },
      { endpoint, keys, label: "admin" },
      { upsert: true, new: true }
    );

    return Response.json({ success: true, message: "Subscribed to push notifications" });
  } catch (err) {
    console.error("POST /api/push/subscribe error:", err);
    return Response.json({ error: "Failed to save subscription" }, { status: 500 });
  }
}

// DELETE — unsubscribe this device
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { endpoint } = body;

    if (!endpoint) {
      return Response.json({ error: "Endpoint required" }, { status: 400 });
    }

    await connectDB();
    await PushSubscription.deleteOne({ endpoint });

    return Response.json({ success: true, message: "Unsubscribed" });
  } catch (err) {
    console.error("DELETE /api/push/subscribe error:", err);
    return Response.json({ error: "Failed to remove subscription" }, { status: 500 });
  }
}
