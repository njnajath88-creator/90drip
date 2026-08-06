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

// Cache for 5 minutes — products change rarely, no need to hit MongoDB every 30s.
// Reduces origin transfer and MongoDB connections significantly.
const CACHE_TTL_MS = 5 * 60_000; // 5 minutes

export async function getProductsServer() {
  const now = Date.now();

  // Return cached data if still fresh
  if (
    global.productsCache &&
    Array.isArray(global.productsCache) &&
    global.productsCacheTime &&
    now - global.productsCacheTime < CACHE_TTL_MS &&
    global.hasCleanedDummyData
  ) {
    return global.productsCache;
  }

  try {
    await connectDB();

    // One-time dummy data cleanup
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

    // Store with timestamp
    global.productsCache = formatted;
    global.productsCacheTime = now;

    return formatted;
  } catch (error) {
    console.error("getProductsServer error:", error);
    return global.productsCache || [];
  }
}
