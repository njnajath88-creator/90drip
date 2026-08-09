import { sendPushToAll } from "@/lib/sendPushNotification";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const result = await sendPushToAll(
      "Test Push Notification 🔔",
      "VAPID push pipeline is working directly from your 90drip server!",
      "/admin"
    );
    return Response.json({ success: true, message: "Test push notification sent", result });
  } catch (err) {
    console.error("Error sending test push:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
