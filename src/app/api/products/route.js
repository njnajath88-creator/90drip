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
    image: "/images/jersey_product1.png",
    backImage: "/images/jersey_product2.png",
    closeupImage: "/images/jersey_product3.png",
    fitImage: "/images/jersey_product4.png",
    badges: ["New"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    name: "Classic #7 Red",
    category: "Half Sleeve",
    sport: "Football",
    price: 1499,
    originalPrice: null,
    image: "/images/jersey_product2.png",
    backImage: "/images/jersey_product1.png",
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
    image: "/images/jersey_product3.png",
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
    originalPrice: null,
    image: "/images/jersey_product4.png",
    backImage: "/images/jersey_product3.png",
    closeupImage: "/images/jersey_product2.png",
    fitImage: "/images/jersey_product1.png",
    badges: [],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
];

// GET — fetch all products (seeds DB on first run if empty)
export async function GET() {
  try {
    await connectDB();

    let products = await Product.find().sort({ createdAt: -1 });

    // Auto-seed on first run
    if (products.length === 0) {
      await Product.insertMany(SEED_PRODUCTS);
      products = await Product.find().sort({ createdAt: -1 });
    }

    return Response.json(products.map((p) => p.toJSON()));
  } catch (error) {
    console.error("GET /api/products error:", error);
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
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
    return Response.json({ error: "Failed to create product" }, { status: 400 });
  }
}

// PUT — update an existing product by id
export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return Response.json({ error: "Product ID is required" }, { status: 400 });
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      {
        ...updateData,
        price: parseFloat(updateData.price),
        originalPrice: updateData.originalPrice
          ? parseFloat(updateData.originalPrice)
          : null,
        badges: Array.isArray(updateData.badges)
          ? updateData.badges
          : updateData.badges
          ? updateData.badges.split(",").map((b) => b.trim())
          : [],
        sizes: Array.isArray(updateData.sizes)
          ? updateData.sizes
          : updateData.sizes
          ? updateData.sizes.split(",").map((s) => s.trim())
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
    return Response.json({ error: "Failed to update product" }, { status: 400 });
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
    return Response.json({ error: "Failed to delete product" }, { status: 400 });
  }
}
