import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models/Order";

export const dynamic = "force-dynamic";
export const revalidate = 0;

if (!global.ordersCache) {
  global.ordersCache = [];
}

// GET — Fetch all orders (supports optional email filtering)
export async function GET(request) {
  try {
    const url = new URL(request.url, "http://localhost:3000");
    const email = url.searchParams.get("email");

    const filterCache = (cache) => {
      if (!email) return cache;
      return cache.filter((o) => o.email?.toLowerCase() === email.toLowerCase());
    };

    const fetchPromise = (async () => {
      await connectDB();
      const filter = email ? { email: new RegExp("^" + email + "$", "i") } : {};
      const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
      return orders.map((o) => ({ ...o, id: o.id || o._id.toString() }));
    })();

    const timeoutPromise = new Promise((resolve) =>
      setTimeout(() => resolve(null), 3000)
    );

    const result = await Promise.race([fetchPromise, timeoutPromise]);

    if (result && Array.isArray(result) && result.length > 0) {
      if (!email) {
        global.ordersCache = result; // update main cache only if fetching all orders
      }
      return Response.json(result, {
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
      });
    }

    const fallbackResult = filterCache(global.ordersCache || []);
    return Response.json(fallbackResult, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    const url = new URL(request.url, "http://localhost:3000");
    const email = url.searchParams.get("email");
    const filterCache = (cache) => {
      if (!email) return cache;
      return cache.filter((o) => o.email?.toLowerCase() === email.toLowerCase());
    };
    return Response.json(filterCache(global.ordersCache || []));
  }
}

// POST — Create new order
export async function POST(request) {
  try {
    const body = await request.json();
    const newOrder = {
      id: body.id || `90D-${Math.floor(100000 + Math.random() * 900000)}`,
      customer: body.customer || body.name || "Guest Customer",
      email: body.email || "",
      phone: body.phone || "",
      address: body.address || "",
      items: body.items || "",
      cartItems: body.cartItems || [],
      total: parseFloat(body.total) || 0,
      paymentMethod: body.paymentMethod || "cod",
      status: body.status || "Processing",
      date: body.date || new Date().toISOString().split("T")[0],
      trackingSteps: body.trackingSteps || [
        { title: "Order Placed", date: "Just now", completed: true },
        { title: "Quality Check & Packing", date: "In Progress", completed: false },
        { title: "Handed to Courier", date: "Expected Tomorrow", completed: false },
        { title: "Out for Delivery", date: "Expected in 3 days", completed: false },
      ],
      createdAt: new Date().toISOString(),
    };

    // Update server memory cache immediately
    global.ordersCache = [newOrder, ...global.ordersCache.filter(o => o.id !== newOrder.id)];

    // Persist to MongoDB
    (async () => {
      try {
        await connectDB();
        await Order.create(newOrder);
      } catch (dbErr) {
        console.error("MongoDB Order creation error:", dbErr);
      }
    })();

    return Response.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return Response.json({ error: "Failed to place order" }, { status: 400 });
  }
}

// PUT — Update order status
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return Response.json({ error: "Order id and status required" }, { status: 400 });
    }

    // Update in-memory cache
    global.ordersCache = global.ordersCache.map(o => o.id === id ? { ...o, status } : o);

    // Update MongoDB
    (async () => {
      try {
        await connectDB();
        await Order.findOneAndUpdate({ id }, { status });
      } catch (e) {
        console.error("MongoDB order status update error:", e);
      }
    })();

    return Response.json({ success: true, id, status });
  } catch (error) {
    console.error("PUT /api/orders error:", error);
    return Response.json({ error: "Failed to update order" }, { status: 400 });
  }
}

// DELETE — Delete order or clear all orders
export async function DELETE(request) {
  try {
    const url = new URL(request.url, "http://localhost:3000");
    const id = url.searchParams.get("id");
    const clearAll = url.searchParams.get("all");

    if (clearAll === "true") {
      global.ordersCache = [];
      (async () => {
        try {
          await connectDB();
          await Order.deleteMany({});
        } catch (e) {}
      })();
      return Response.json({ success: true, message: "All orders cleared" });
    }

    if (!id) {
      return Response.json({ error: "Order ID required" }, { status: 400 });
    }

    global.ordersCache = global.ordersCache.filter(o => o.id !== id);

    (async () => {
      try {
        await connectDB();
        await Order.deleteOne({ id });
      } catch (e) {}
    })();

    return Response.json({ success: true, id });
  } catch (error) {
    console.error("DELETE /api/orders error:", error);
    return Response.json({ error: "Failed to delete order" }, { status: 400 });
  }
}
