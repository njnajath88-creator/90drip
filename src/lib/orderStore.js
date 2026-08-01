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
 * Add a new placed order
 */
export function addOrder(orderData) {
  if (typeof window === "undefined") return;
  try {
    const current = getOrders();
    const newOrder = {
      ...orderData,
      id: orderData.id || `90D-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
      status: orderData.status || "Processing",
      trackingSteps: [
        { title: "Order Placed", date: "Just now", completed: true },
        { title: "Quality Check & Packing", date: "In Progress", completed: false },
        { title: "Handed to Courier", date: "Expected Tomorrow", completed: false },
        { title: "Out for Delivery", date: "Expected in 3 days", completed: false },
      ],
    };
    const updated = [newOrder, ...current];
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("90drip_orders_updated"));
    return newOrder;
  } catch (e) {
    console.error("Failed to save order to localStorage:", e);
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
    return [];
  } catch (e) {
    console.error("Failed to clear orders:", e);
    return [];
  }
}
