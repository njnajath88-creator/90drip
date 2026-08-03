import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/Product";

const DUMMY_NAMES = [
  "FC Barcelona #10 Home",
  "Classic #7 Red",
  "City FC #9 Blue",
  "Green Eagle #11",
  "Real Madrid #7 Gold Edition",
  "Arsenal #14 Heritage Away",
  "PSG #30 Streetwear Oversized",
  "Milan #3 Legendary 1994",
];

export async function getProductsServer() {
  // Clear memory cache if dummy cleaning hasn't run yet
  if (!global.hasCleanedDummyData) {
    global.productsCache = null;
  } else if (global.productsCache && Array.isArray(global.productsCache)) {
    return global.productsCache;
  }

  try {
    await connectDB();

    // Automatically remove any dummy seed data from database
    if (!global.hasCleanedDummyData) {
      global.hasCleanedDummyData = true;
      await Product.deleteMany({ name: { $in: DUMMY_NAMES } }).catch(() => {});
    }

    const products = await Product.find().sort({ createdAt: -1 }).lean();

    const formatted = products.map((p) => ({
      ...p,
      id: p._id ? String(p._id) : p.id,
      _id: p._id ? String(p._id) : p.id,
    }));

    global.productsCache = formatted;
    return formatted;
  } catch (error) {
    console.error("getProductsServer error:", error);
    return global.productsCache || [];
  }
}
