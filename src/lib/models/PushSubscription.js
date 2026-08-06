import mongoose from "mongoose";

const PushSubscriptionSchema = new mongoose.Schema({
  // The full PushSubscription JSON from the browser
  endpoint: { type: String, required: true, unique: true },
  keys: {
    p256dh: { type: String, required: true },
    auth:   { type: String, required: true },
  },
  // Who subscribed (optional label for debugging)
  label: { type: String, default: "admin" },
  createdAt: { type: Date, default: Date.now },
});

export const PushSubscription =
  mongoose.models.PushSubscription ||
  mongoose.model("PushSubscription", PushSubscriptionSchema);
