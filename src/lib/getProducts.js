import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/Product";

const SEED_PRODUCTS = [
  {
    name: "FC Barcelona #10 Home",
    category: "Full Sleeve",
    sport: "Football",
    price: 1999,
    originalPrice: 2499,
    image: "/images/cat_full_sleeve.png",
    backImage: "/images/jersey_product1.png",
    closeupImage: "/images/jersey_product2.png",
    fitImage: "/images/jersey_product3.png",
    badges: ["New"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    name: "Classic #7 Red",
    category: "Half Sleeve",
    sport: "Football",
    price: 1499,
    originalPrice: 1999,
    image: "/images/cat_half_sleeve.png",
    backImage: "/images/jersey_product2.png",
    closeupImage: "/images/jersey_product4.png",
    fitImage: "/images/jersey_product3.png",
    badges: ["Sale"],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    name: "City FC #9 Blue",
    category: "5 Sleeve",
    sport: "Football",
    price: 1799,
    originalPrice: 2199,
    image: "/images/cat_5_sleeve.png",
    backImage: "/images/jersey_product4.png",
    closeupImage: "/images/jersey_product1.png",
    fitImage: "/images/jersey_product2.png",
    badges: ["New"],
    sizes: ["S", "M", "L"],
  },
  {
    name: "Green Eagle #11",
    category: "Retro",
    sport: "Football",
    price: 1299,
    originalPrice: 1699,
    image: "/images/cat_retro.png",
    backImage: "/images/jersey_product3.png",
    closeupImage: "/images/jersey_product2.png",
    fitImage: "/images/jersey_product1.png",
    badges: ["Retro"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    name: "Real Madrid #7 Gold Edition",
    category: "Full Sleeve",
    sport: "Football",
    price: 2199,
    originalPrice: 2699,
    image: "/images/jersey_product1.png",
    backImage: "/images/cat_full_sleeve.png",
    closeupImage: "/images/jersey_product3.png",
    fitImage: "/images/jersey_product4.png",
    badges: ["Exclusive"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    name: "Arsenal #14 Heritage Away",
    category: "Half Sleeve",
    sport: "Football",
    price: 1599,
    originalPrice: 1899,
    image: "/images/jersey_product2.png",
    backImage: "/images/cat_half_sleeve.png",
    closeupImage: "/images/jersey_product1.png",
    fitImage: "/images/jersey_product3.png",
    badges: ["Hot"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    name: "PSG #30 Streetwear Oversized",
    category: "5 Sleeve",
    sport: "Football",
    price: 1899,
    originalPrice: 2299,
    image: "/images/jersey_product3.png",
    backImage: "/images/cat_5_sleeve.png",
    closeupImage: "/images/jersey_product2.png",
    fitImage: "/images/jersey_product4.png",
    badges: ["Trending"],
    sizes: ["M", "L", "XL"],
  },
  {
    name: "Milan #3 Legendary 1994",
    category: "Retro",
    sport: "Football",
    price: 1699,
    originalPrice: 2099,
    image: "/images/jersey_product4.png",
    backImage: "/images/cat_retro.png",
    closeupImage: "/images/jersey_product1.png",
    fitImage: "/images/jersey_product2.png",
    badges: ["Classic"],
    sizes: ["S", "M", "L", "XL"],
  }
];

export async function getProductsServer() {
  // Ultra-fast memory cache return (0ms latency!)
  if (global.productsCache && global.productsCache.length > 0) {
    return global.productsCache;
  }

  try {
    await connectDB();
    let products = await Product.find().sort({ createdAt: -1 }).lean();

    if (products.length === 0 && !global.hasInitializedSeed) {
      global.hasInitializedSeed = true;
      const count = await Product.countDocuments();
      if (count === 0) {
        await Product.insertMany(SEED_PRODUCTS);
        products = await Product.find().sort({ createdAt: -1 }).lean();
      }
    }

    const formatted = products.map((p) => ({
      ...p,
      id: p._id ? String(p._id) : p.id,
      _id: p._id ? String(p._id) : p.id,
    }));
    global.productsCache = formatted;
    return formatted;
  } catch (error) {
    console.error("getProductsServer error:", error);
    return global.productsCache || SEED_PRODUCTS.map((p, idx) => ({ ...p, id: `seed-${idx + 1}` }));
  }
}
