import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      default: "Half Sleeve",
      trim: true
    },
    sport: {
      type: String,
      default: "Football",
      trim: true
    },
    price: { type: Number, required: true },
    originalPrice: { type: Number, default: null },
    image: { type: String, default: "/images/jersey_product1.png" },
    backImage: { type: String, default: null },
    closeupImage: { type: String, default: null },
    fitImage: { type: String, default: null },
    badges: { type: [String], default: [] },
    sizes: { type: [String], default: ["S", "M", "L", "XL"] },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Prevent model recompilation error in Next.js dev mode (hot reload)
export const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
