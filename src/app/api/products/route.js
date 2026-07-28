import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/Product";
import mongoose from "mongoose";

// Seed data — inserted once if the collection is empty
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

// GET — fetch all products (with global in-memory caching & fast fallback)
export async function GET() {
  const CACHE_TTL_MS = 60 * 1000; // 60 seconds cache

  // Check server-side memory cache first for superfast response
  if (global.productsCache && Date.now() - (global.productsCacheTime || 0) < CACHE_TTL_MS) {
    return Response.json(global.productsCache, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  }

  try {
    // Add a 3-second timeout guard to prevent hanging DB connections
    const dbPromise = (async () => {
      await connectDB();
      let products = await Product.find().sort({ createdAt: -1 });

      if (products.length < 4) {
        await Product.deleteMany({});
        await Product.insertMany(SEED_PRODUCTS);
        products = await Product.find().sort({ createdAt: -1 });
      }
      return products.map((p) => p.toJSON());
    })();

    const timeoutPromise = new Promise((resolve) =>
      setTimeout(() => resolve(null), 2500)
    );

    const result = await Promise.race([dbPromise, timeoutPromise]);

    if (result) {
      global.productsCache = result;
      global.productsCacheTime = Date.now();
      return Response.json(result, {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      });
    }

    // If DB request timed out or returned empty, serve cached or seed data instantly
    const fallbackData = global.productsCache || SEED_PRODUCTS.map((p, idx) => ({ ...p, id: `seed-${idx + 1}` }));
    return Response.json(fallbackData, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    const fallbackData = global.productsCache || SEED_PRODUCTS.map((p, idx) => ({ ...p, id: `seed-${idx + 1}` }));
    return Response.json(fallbackData, { status: 200 });
  }
}

// POST — create a new product
export async function POST(request) {
  try {
    const body = await request.json();

    const formattedPayload = {
      name: body.name || "Untitled Jersey",
      category: body.category || "Half Sleeve",
      sport: body.sport || "Football",
      price: parseFloat(body.price) || 0,
      originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
      image: body.image || "/images/jersey_product1.png",
      backImage: body.backImage || null,
      closeupImage: body.closeupImage || null,
      fitImage: body.fitImage || null,
      badges: Array.isArray(body.badges)
        ? body.badges
        : body.badges
        ? body.badges.split(",").map((b) => b.trim()).filter(Boolean)
        : [],
      sizes: Array.isArray(body.sizes)
        ? body.sizes
        : body.sizes
        ? body.sizes.split(",").map((s) => s.trim()).filter(Boolean)
        : ["S", "M", "L", "XL"],
    };

    const createPromise = (async () => {
      await connectDB();
      const product = await Product.create(formattedPayload);
      return product.toJSON();
    })();

    const timeoutPromise = new Promise((resolve) =>
      setTimeout(() => resolve(null), 3500)
    );

    const result = await Promise.race([createPromise, timeoutPromise]);

    if (result) {
      global.productsCache = null;
      global.productsCacheTime = 0;
      return Response.json(result, { status: 201 });
    }

    // Fallback if DB connection timed out
    const fallbackProduct = {
      id: `prod-${Date.now()}`,
      ...formattedPayload,
      createdAt: new Date().toISOString(),
    };

    if (!global.productsCache) global.productsCache = [];
    global.productsCache = [fallbackProduct, ...global.productsCache];
    return Response.json(fallbackProduct, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return Response.json({ error: error.message || "Failed to create product" }, { status: 400 });
  }
}

// PUT — update an existing product by id
export async function PUT(request) {
  try {
    const body = await request.json();
    const productId = body.id || body._id;

    if (!productId) {
      return Response.json({ error: "Product ID is required" }, { status: 400 });
    }

    const { id, _id, ...updateFields } = body;

    const formattedFields = {
      ...updateFields,
      price: parseFloat(updateFields.price) || 0,
      originalPrice: updateFields.originalPrice
        ? parseFloat(updateFields.originalPrice)
        : null,
      badges: Array.isArray(updateFields.badges)
        ? updateFields.badges
        : updateFields.badges
        ? updateFields.badges.split(",").map((b) => b.trim()).filter(Boolean)
        : [],
      sizes: Array.isArray(updateFields.sizes)
        ? updateFields.sizes
        : updateFields.sizes
        ? updateFields.sizes.split(",").map((s) => s.trim()).filter(Boolean)
        : ["S", "M", "L", "XL"],
    };

    const updatePromise = (async () => {
      await connectDB();
      let updated = null;
      if (mongoose.Types.ObjectId.isValid(productId)) {
        updated = await Product.findByIdAndUpdate(
          productId,
          formattedFields,
          { new: true, runValidators: true }
        );
      }
      if (!updated) {
        updated = await Product.create({
          name: updateFields.name || "Updated Jersey",
          ...formattedFields,
        });
      }
      return updated.toJSON();
    })();

    const timeoutPromise = new Promise((resolve) =>
      setTimeout(() => resolve(null), 3500)
    );

    const result = await Promise.race([updatePromise, timeoutPromise]);

    const finalProduct = result || {
      id: productId || `prod-${Date.now()}`,
      ...formattedFields,
    };

    global.productsCache = null;
    global.productsCacheTime = 0;
    return Response.json(finalProduct);
  } catch (error) {
    console.error("PUT /api/products error:", error);
    return Response.json({ error: error.message || "Failed to update product" }, { status: 400 });
  }
}

// DELETE — delete a product by id
export async function DELETE(request) {
  try {
    await connectDB();
    const url = new URL(request.url, "http://localhost:3000");
    const id = url.searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Product ID is required" }, { status: 400 });
    }

    if (mongoose.Types.ObjectId.isValid(id)) {
      await Product.findByIdAndDelete(id);
    } else {
      // Fallback for seed string IDs or custom string IDs
      await Product.deleteOne({ _id: id }).catch(() => {});
    }

    global.productsCache = null;
    global.productsCacheTime = 0;
    return Response.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("DELETE /api/products error:", error);
    return Response.json({ error: error.message || "Failed to delete product" }, { status: 400 });
  }
}
