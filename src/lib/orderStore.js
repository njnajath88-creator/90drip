"use client";

const ORDERS_KEY = "90drip_orders";

/**
 * Fetch all orders from localStorage
 */
export function getOrders() {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(ORDERS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Failed to load orders from localStorage:", e);
    return [];
  }
}

/**
 * Fetch orders from server API and sync with localStorage
 */
export async function fetchOrdersServer(email) {
  if (typeof window === "undefined") return [];
  try {
    const url = email
      ? `/api/orders?email=${encodeURIComponent(email)}&t=${Date.now()}`
      : `/api/orders?t=${Date.now()}`;
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) {
      const serverOrders = await res.json();
      if (Array.isArray(serverOrders)) {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(serverOrders));
        window.dispatchEvent(new Event("90drip_orders_updated"));
        return serverOrders;
      }
    }
  } catch (e) {
    console.error("Failed to fetch orders from server:", e);
  }
  return getOrders();
}

/**
 * Add a new placed order (saves to local & syncs to API).
 * Now async — awaits the server POST so the order is in MongoDB
 * before this function returns, eliminating the admin delay race condition.
 */
export async function addOrder(orderData) {
  if (typeof window === "undefined") return;
  try {
    const current = getOrders();
    const newOrder = {
      ...orderData,
      id: orderData.id || `90D-${Math.floor(100000 + Math.random() * 900000)}`,
      date: orderData.date || new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
      status: orderData.status || "Processing",
      trackingSteps: [
        { title: "Order Placed", date: "Just now", completed: true },
        { title: "Quality Check & Packing", date: "In Progress", completed: false },
        { title: "Handed to Courier", date: "Expected Tomorrow", completed: false },
        { title: "Out for Delivery", date: "Expected in 3 days", completed: false },
      ],
    };

    // Immediately update localStorage so the user sees their order
    const updated = [newOrder, ...current.filter(o => o.id !== newOrder.id)];
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("90drip_orders_updated"));

    // Await the server POST — this ensures the order is persisted in MongoDB
    // before we return, so the admin page will see it on its next poll.
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });
    } catch (err) {
      console.error("Error syncing order to API:", err);
    }

    return newOrder;
  } catch (e) {
    console.error("Failed to save order:", e);
  }
}

/**
 * Update an order's fulfillment status
 */
export function updateOrderStatus(orderId, newStatus) {
  if (typeof window === "undefined") return [];
  try {
    const current = getOrders();
    const updated = current.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord));
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("90drip_orders_updated"));

    // PUT to server API
    fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, status: newStatus }),
    }).catch((err) => console.error("Error updating order status on API:", err));

    return updated;
  } catch (e) {
    console.error("Failed to update order status:", e);
    return getOrders();
  }
}

/**
 * Delete a single order
 */
export function deleteOrder(orderId) {
  if (typeof window === "undefined") return [];
  try {
    const current = getOrders();
    const updated = current.filter((ord) => ord.id !== orderId);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("90drip_orders_updated"));

    // DELETE on server API
    fetch(`/api/orders?id=${orderId}`, { method: "DELETE" }).catch((err) =>
      console.error("Error deleting order from API:", err)
    );

    return updated;
  } catch (e) {
    console.error("Failed to delete order:", e);
    return getOrders();
  }
}

/**
 * Clear all orders
 */
export function clearOrders() {
  if (typeof window === "undefined") return [];
  try {
    localStorage.removeItem(ORDERS_KEY);
    window.dispatchEvent(new Event("90drip_orders_updated"));

    fetch("/api/orders?all=true", { method: "DELETE" }).catch((err) =>
      console.error("Error clearing orders on API:", err)
    );

    return [];
  } catch (e) {
    console.error("Failed to clear orders:", e);
    return [];
  }
}
