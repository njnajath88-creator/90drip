import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    customer: { type: String, default: "Guest Customer" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    items: { type: String, default: "" },
    cartItems: { type: Array, default: [] },
    total: { type: Number, required: true },
    paymentMethod: { type: String, default: "cod" },
    status: { type: String, default: "Processing" },
    date: { type: String, default: () => new Date().toISOString().split("T")[0] },
    trackingSteps: { type: Array, default: [] },
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
