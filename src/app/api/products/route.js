import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/Product";

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

// GET — fetch all products (seeds DB on first run if empty)
export async function GET() {
  try {
    await connectDB();

    let products = await Product.find().sort({ createdAt: -1 });

    if (products.length < 4) {
      await Product.deleteMany({});
      await Product.insertMany(SEED_PRODUCTS);
      products = await Product.find().sort({ createdAt: -1 });
    }

    return Response.json(products.map((p) => p.toJSON()));
  } catch (error) {
    console.error("GET /api/products error:", error);
    return Response.json({ error: error.message || "Failed to fetch products" }, { status: 500 });
  }
}

// POST — create a new product
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const product = await Product.create({
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
        ? body.badges.split(",").map((b) => b.trim())
        : [],
      sizes: Array.isArray(body.sizes)
        ? body.sizes
        : body.sizes
        ? body.sizes.split(",").map((s) => s.trim())
        : ["S", "M", "L", "XL"],
    });

    return Response.json(product.toJSON(), { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return Response.json({ error: error.message || "Failed to create product" }, { status: 400 });
  }
}

// PUT — update an existing product by id
export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();
    const productId = body.id || body._id;

    if (!productId) {
      return Response.json({ error: "Product ID is required" }, { status: 400 });
    }

    const { id, _id, ...updateFields } = body;

    const updated = await Product.findByIdAndUpdate(
      productId,
      {
        ...updateFields,
        price: parseFloat(updateFields.price) || 0,
        originalPrice: updateFields.originalPrice
          ? parseFloat(updateFields.originalPrice)
          : null,
        badges: Array.isArray(updateFields.badges)
          ? updateFields.badges
          : updateFields.badges
          ? updateFields.badges.split(",").map((b) => b.trim())
          : [],
        sizes: Array.isArray(updateFields.sizes)
          ? updateFields.sizes
          : updateFields.sizes
          ? updateFields.sizes.split(",").map((s) => s.trim())
          : ["S", "M", "L", "XL"],
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json(updated.toJSON());
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

    await Product.findByIdAndDelete(id);
    return Response.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("DELETE /api/products error:", error);
    return Response.json({ error: error.message || "Failed to delete product" }, { status: 400 });
  }
}
