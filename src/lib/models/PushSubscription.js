import mongoose from "mongoose";

const PushSubscriptionSchema = new mongoose.Schema({
  // Type: 'vapid' or 'fcm'
  type: { type: String, enum: ["vapid", "fcm"], default: "vapid" },
  // The full PushSubscription JSON endpoint (for VAPID) or FCM registration token (for FCM)
  endpoint: { type: String, required: true, unique: true },
  keys: {
    p256dh: { type: String },
    auth: { type: String },
  },
  fcmToken: { type: String },
  label: { type: String, default: "admin" },
  createdAt: { type: Date, default: Date.now },
});

export const PushSubscription =
  mongoose.models.PushSubscription ||
  mongoose.model("PushSubscription", PushSubscriptionSchema);
