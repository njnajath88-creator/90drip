import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/Product";
import mongoose from "mongoose";
import { getProductsServer } from "@/lib/getProducts";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";
// NOTE: revalidate = 0 removed — force-dynamic is sufficient to prevent caching
// and does not trigger ISR writes. revalidate = 0 + force-dynamic was causing
// an ISR write event on every single API request, burning through the 200K limit.

// GET — fetch all products (instant 0ms response via server memory cache)
export async function GET() {
  try {
    const products = await getProductsServer();
    return Response.json(products, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return Response.json([], { status: 500 });
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
      // Upload base64 images to Cloudinary (if any)
      const [imageUrl, backImageUrl, closeupImageUrl, fitImageUrl] = await Promise.all([
        uploadToCloudinary(formattedPayload.image),
        uploadToCloudinary(formattedPayload.backImage),
        uploadToCloudinary(formattedPayload.closeupImage),
        uploadToCloudinary(formattedPayload.fitImage),
      ]);

      formattedPayload.image = imageUrl;
      formattedPayload.backImage = backImageUrl;
      formattedPayload.closeupImage = closeupImageUrl;
      formattedPayload.fitImage = fitImageUrl;

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
      // Upload base64 images to Cloudinary (if any)
      const [imageUrl, backImageUrl, closeupImageUrl, fitImageUrl] = await Promise.all([
        uploadToCloudinary(formattedFields.image),
        uploadToCloudinary(formattedFields.backImage),
        uploadToCloudinary(formattedFields.closeupImage),
        uploadToCloudinary(formattedFields.fitImage),
      ]);

      if (imageUrl !== undefined) formattedFields.image = imageUrl;
      if (backImageUrl !== undefined) formattedFields.backImage = backImageUrl;
      if (closeupImageUrl !== undefined) formattedFields.closeupImage = closeupImageUrl;
      if (fitImageUrl !== undefined) formattedFields.fitImage = fitImageUrl;

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
    }
    
    // Also try deleting by _id or string ID
    await Product.deleteOne({ _id: id }).catch(() => {});
    await Product.deleteOne({ id: id }).catch(() => {});

    global.productsCache = null;

    return Response.json({ success: true, message: "Product deleted" }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("DELETE /api/products error:", error);
    return Response.json({ error: error.message || "Failed to delete product" }, { status: 400 });
  }
}
