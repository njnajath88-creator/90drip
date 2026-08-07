/**
 * /api/push/debug
 *
 * GET — Returns a summary of all stored push subscriptions in MongoDB.
 * Used for debugging push notification issues.
 *
 * REMOVE THIS ROUTE BEFORE GOING TO PRODUCTION or protect it behind auth.
 */
import { connectDB } from "@/lib/db";
import { PushSubscription } from "@/lib/models/PushSubscription";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const subs = await PushSubscription.find({}).lean();

    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
    const vapidEmail = process.env.VAPID_CONTACT_EMAIL;

    return Response.json({
      subscriptionCount: subs.length,
      vapidPublicKeySet: !!vapidPublicKey,
      vapidPrivateKeySet: !!vapidPrivateKey,
      vapidEmailSet: !!vapidEmail,
      // Show partial endpoint so you can confirm which device is subscribed
      subscriptions: subs.map((s) => ({
        id: s._id,
        label: s.label,
        createdAt: s.createdAt,
        endpointPreview: s.endpoint?.slice(0, 60) + "...",
        hasKeys: !!(s.keys?.p256dh && s.keys?.auth),
      })),
    });
  } catch (err) {
    console.error("GET /api/push/debug error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
