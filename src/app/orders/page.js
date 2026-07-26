"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getOrders } from "@/lib/orderStore";
import { addToCart } from "@/lib/cartStore";

const INITIAL_DEMO_ORDERS = [
  {
    id: "90D-849201",
    date: "2026-07-24",
    status: "Processing",
    total: 1999,
    paymentMethod: "cod",
    customer: "Alex Morgan",
    address: "B-402 Horizon Heights, Bandra West, Mumbai - 400050",
    cartItems: [
      { id: "1", name: "FC Barcelona #10 Home", price: 1999, size: "L", quantity: 1, image: "/images/cat_full_sleeve.png" }
    ],
    trackingSteps: [
      { title: "Order Placed", date: "Jul 24, 02:30 PM", completed: true },
      { title: "Quality Checked & Packed", date: "Jul 25, 10:00 AM", completed: true },
      { title: "Handed to Courier (Bluedart)", date: "Jul 26, 08:00 AM", completed: true },
      { title: "Out for Delivery", date: "Expected Today", completed: false, current: true },
    ]
  },
  {
    id: "90D-712049",
    date: "2026-07-18",
    status: "Delivered",
    total: 3298,
    paymentMethod: "upi",
    customer: "Alex Morgan",
    address: "B-402 Horizon Heights, Bandra West, Mumbai - 400050",
    cartItems: [
      { id: "2", name: "Classic #7 Red", price: 1499, size: "M", quantity: 1, image: "/images/cat_half_sleeve.png" },
      { id: "3", name: "City FC #9 Blue", price: 1799, size: "M", quantity: 1, image: "/images/cat_5_sleeve.png" }
    ],
    trackingSteps: [
      { title: "Order Placed", date: "Jul 18", completed: true },
      { title: "Quality Checked & Packed", date: "Jul 19", completed: true },
      { title: "Handed to Courier", date: "Jul 20", completed: true },
      { title: "Delivered Successfully", date: "Jul 22", completed: true },
    ]
  }
];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reorderSuccess, setReorderSuccess] = useState("");

  useEffect(() => {
    const syncOrders = () => {
      const stored = getOrders();
      if (stored.length > 0) {
        setOrders(stored);
        setSelectedOrder(stored[0]);
      } else {
        setOrders(INITIAL_DEMO_ORDERS);
        setSelectedOrder(INITIAL_DEMO_ORDERS[0]);
      }
    };
    syncOrders();
    window.addEventListener("90drip_orders_updated", syncOrders);
    return () => window.removeEventListener("90drip_orders_updated", syncOrders);
  }, []);

  const handleReorder = (order) => {
    if (order.cartItems && order.cartItems.length > 0) {
      order.cartItems.forEach((item) => {
        addToCart(item, item.size || "M");
      });
      setReorderSuccess(`Added items from order ${order.id} to cart!`);
      setTimeout(() => setReorderSuccess(""), 3500);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return { bg: "#dcfce7", color: "#15803d", border: "#bbf7d0" };
      case "shipped":
        return { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" };
      default:
        return { bg: "#fef3c7", color: "#b45309", border: "#fde68a" };
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Navbar solid={true} user={user} setUser={setUser} />

      <main style={{ paddingTop: "100px", paddingBottom: "100px" }}>
        <div className="container" style={{ maxWidth: "1200px" }}>

          {/* Breadcrumb Header */}
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                fontSize: "12px",
                color: "#64748b",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "8px",
              }}
            >
              <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>
                Home
              </Link>
              <span>›</span>
              <span style={{ color: "#0f172a", fontWeight: "800" }}>My Orders & Tracking</span>
            </div>

            <h1
              style={{
                fontSize: "32px",
                fontWeight: "900",
                color: "#0f172a",
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}
            >
              Order History & Tracking ({orders.length})
            </h1>
          </div>

          {reorderSuccess && (
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#15803d",
                padding: "12px 18px",
                borderRadius: "12px",
                fontWeight: "800",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>✓ {reorderSuccess}</span>
              <Link href="/cart" style={{ color: "#16a34a", fontWeight: "900" }}>
                View Cart →
              </Link>
            </div>
          )}

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr", gap: "28px" }}
            className="orders-grid-layout"
          >
            {/* Left Column: Orders List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: "800", color: "#475569", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Select Order to Track
              </div>

              {orders.map((ord) => {
                const statusStyle = getStatusColor(ord.status);
                const isSelected = selectedOrder?.id === ord.id;
                return (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    style={{
                      background: "#ffffff",
                      borderRadius: "18px",
                      padding: "20px",
                      border: isSelected ? "2px solid #2563eb" : "1px solid #e2e8f0",
                      boxShadow: isSelected ? "0 10px 25px rgba(37, 99, 235, 0.1)" : "0 4px 12px rgba(0,0,0,0.02)",
                      cursor: "pointer",
                      transition: "transform 0.2s ease, border-color 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <div>
                        <div style={{ fontSize: "16px", fontWeight: "900", color: "#0f172a" }}>
                          Order #{ord.id}
                        </div>
                        <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>
                          Placed on {ord.date}
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "800",
                          background: statusStyle.bg,
                          color: statusStyle.color,
                          border: `1px solid ${statusStyle.border}`,
                          padding: "4px 10px",
                          borderRadius: "20px",
                          textTransform: "uppercase",
                        }}
                      >
                        {ord.status}
                      </span>
                    </div>

                    <div style={{ fontSize: "13px", color: "#334155", fontWeight: "600", marginBottom: "12px" }}>
                      {ord.items || (ord.cartItems && ord.cartItems.map((i) => i.name).join(", "))}
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid #f1f5f9" }}>
                      <span style={{ fontSize: "15px", fontWeight: "900", color: "#0f172a" }}>
                        ₹{ord.total ? ord.total.toLocaleString() : "0"}
                      </span>
                      <span style={{ fontSize: "12px", fontWeight: "800", color: "#2563eb" }}>
                        {isSelected ? "Currently Viewing ↓" : "View Tracking →"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Live Tracking Details */}
            {selectedOrder && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                
                {/* Package Tracking Progress Timeline Card */}
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "24px",
                    padding: "24px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <div>
                      <span style={{ fontSize: "11px", fontWeight: "900", color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        Live Shipment Tracking
                      </span>
                      <h2 style={{ fontSize: "20px", fontWeight: "900", color: "#0f172a", margin: "4px 0 0" }}>
                        Tracking #{selectedOrder.id}
                      </h2>
                    </div>
                    <button
                      onClick={() => handleReorder(selectedOrder)}
                      style={{
                        background: "#eff6ff",
                        color: "#2563eb",
                        border: "1px solid #bfdbfe",
                        padding: "8px 14px",
                        borderRadius: "10px",
                        fontWeight: "800",
                        fontSize: "12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                      <span>Re-order Items</span>
                    </button>
                  </div>

                  {/* Tracking Timeline */}
                  <div style={{ position: "relative", paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "24px", margin: "20px 0" }}>
                    <div
                      style={{
                        position: "absolute",
                        left: "7px",
                        top: "10px",
                        bottom: "10px",
                        width: "2px",
                        background: "#cbd5e1",
                      }}
                    />

                    {(selectedOrder.trackingSteps || [
                      { title: "Order Placed", date: selectedOrder.date, completed: true },
                      { title: "Quality Check & Packing", date: "Completed", completed: true },
                      { title: "Handed to Courier", date: "In Transit", completed: selectedOrder.status !== "Processing" },
                      { title: "Out for Delivery", date: selectedOrder.status === "Delivered" ? "Delivered" : "Expected in 2 days", completed: selectedOrder.status === "Delivered" }
                    ]).map((step, i) => (
                      <div key={i} style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div
                          style={{
                            position: "absolute",
                            left: "-24px",
                            top: "2px",
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            background: step.completed ? "#22c55e" : "#ffffff",
                            border: step.completed ? "3px solid #dcfce7" : "3px solid #cbd5e1",
                            boxShadow: step.completed ? "0 0 0 2px #22c55e" : "none",
                          }}
                        />
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: "800", color: step.completed ? "#0f172a" : "#64748b" }}>
                            {step.title}
                          </div>
                          <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>
                            {step.date}
                          </div>
                        </div>
                        {step.completed && (
                          <span style={{ fontSize: "11px", fontWeight: "800", color: "#16a34a", background: "#f0fdf4", padding: "2px 8px", borderRadius: "6px" }}>
                            ✓ Done
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Delivery Info Box */}
                  <div style={{ background: "#f8fafc", borderRadius: "16px", padding: "16px", border: "1px solid #f1f5f9" }}>
                    <div style={{ fontSize: "12px", fontWeight: "800", color: "#475569", marginBottom: "6px" }}>
                      Shipping Address:
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>
                      {selectedOrder.customer}
                    </div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>
                      {selectedOrder.address || "B-402 Horizon Heights, Bandra West, Mumbai"}
                    </div>
                  </div>
                </div>

                {/* Items in this Order */}
                {selectedOrder.cartItems && selectedOrder.cartItems.length > 0 && (
                  <div style={{ background: "#ffffff", borderRadius: "20px", padding: "20px", border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a", marginBottom: "14px" }}>
                      Items Ordered ({selectedOrder.cartItems.length})
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {selectedOrder.cartItems.map((item, idx) => (
                        <div key={idx} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                          <img
                            src={item.image || "/images/jersey_product1.png"}
                            alt={item.name}
                            style={{ width: "56px", height: "68px", objectFit: "cover", borderRadius: "10px", border: "1px solid #e2e8f0" }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "13px", fontWeight: "800", color: "#0f172a" }}>{item.name}</div>
                            <div style={{ fontSize: "11px", color: "#64748b" }}>Size: {item.size || "M"} • Qty: {item.quantity}</div>
                          </div>
                          <div style={{ fontSize: "14px", fontWeight: "900", color: "#0f172a" }}>
                            ₹{(parseFloat(item.price) * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>
      </main>

      <Footer />

      <style>{`
        @media (min-width: 900px) {
          .orders-grid-layout {
            grid-template-columns: 420px 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
