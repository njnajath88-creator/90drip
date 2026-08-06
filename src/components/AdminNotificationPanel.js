"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const SEEN_KEY = "90drip_admin_seen_orders";
const POLL_INTERVAL_MS = 15000;

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

const STATUS_COLORS = {
  Processing: { bg: "#fef3c7", text: "#92400e", dot: "#f59e0b" },
  Shipped:    { bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6" },
  Delivered:  { bg: "#dcfce7", text: "#166534", dot: "#22c55e" },
  Cancelled:  { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444" },
};

export default function AdminNotificationPanel({ isAdmin }) {
  const [orders, setOrders] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const drawerRef = useRef(null);
  const pollRef = useRef(null);

  const getSeenIds = () => {
    try {
      const raw = localStorage.getItem(SEEN_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveSeenIds = (ids) => {
    try {
      localStorage.setItem(SEEN_KEY, JSON.stringify(ids));
    } catch {}
  };

  const fetchOrders = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const res = await fetch(`/api/orders?t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
          const seenIds = getSeenIds();
          const newUnseen = data.filter((o) => !seenIds.includes(o.id));
          setUnreadCount(newUnseen.length);
        }
      }
    } catch (e) {
      // silent fail
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  // Poll for new orders while admin is logged in
  useEffect(() => {
    if (!isAdmin) return;
    fetchOrders();
    pollRef.current = setInterval(() => fetchOrders(true), POLL_INTERVAL_MS);
    return () => clearInterval(pollRef.current);
  }, [isAdmin]);

  // Also react to same-tab order events
  useEffect(() => {
    if (!isAdmin) return;
    const onUpdate = () => fetchOrders(true);
    window.addEventListener("90drip_orders_updated", onUpdate);
    return () => window.removeEventListener("90drip_orders_updated", onUpdate);
  }, [isAdmin]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const timer = setTimeout(() => document.addEventListener("mousedown", handleClick), 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setIsOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Mark all as read when opening
  const handleOpen = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        const ids = orders.map((o) => o.id);
        saveSeenIds(ids);
        setUnreadCount(0);
      }
      return next;
    });
  };

  if (!isAdmin) return null;

  const recentOrders = orders.slice(0, 20);

  return (
    <>
      {/* Bell Icon Button */}
      <button
        className="admin-notif-bell"
        onClick={handleOpen}
        aria-label="Admin order notifications"
        title="Order Notifications"
        id="admin-notif-bell-btn"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="admin-notif-badge" aria-label={`${unreadCount} new orders`}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div className="admin-notif-backdrop" onClick={() => setIsOpen(false)} />
      )}

      {/* Slide-in Drawer */}
      <div
        ref={drawerRef}
        className={`admin-notif-drawer ${isOpen ? "open" : ""}`}
        role="dialog"
        aria-label="Order notifications panel"
      >
        {/* Header */}
        <div className="admin-notif-drawer-header">
          <div className="admin-notif-drawer-title">
            <div className="admin-notif-drawer-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <div>
              <div className="admin-notif-drawer-heading">Order Notifications</div>
              <div className="admin-notif-drawer-subtext">
                {isLoading ? "Refreshing…" : `${orders.length} total · refreshes every 15s`}
              </div>
            </div>
          </div>
          <button
            className="admin-notif-close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Close notifications"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Stats Row */}
        <div className="admin-notif-stats-row">
          {[
            { label: "Total",      value: orders.length,                                         color: "#6366f1" },
            { label: "Processing", value: orders.filter(o => o.status === "Processing").length,  color: "#f59e0b" },
            { label: "Delivered",  value: orders.filter(o => o.status === "Delivered").length,   color: "#22c55e" },
          ].map((s) => (
            <div key={s.label} className="admin-notif-stat-chip">
              <span className="admin-notif-stat-value" style={{ color: s.color }}>{s.value}</span>
              <span className="admin-notif-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Orders Feed */}
        <div className="admin-notif-orders-list">
          {recentOrders.length === 0 ? (
            <div className="admin-notif-empty">
              <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
              <p>No orders yet</p>
              <span>Customer orders will appear here</span>
            </div>
          ) : (
            recentOrders.map((order) => {
              const sc = STATUS_COLORS[order.status] || STATUS_COLORS["Processing"];
              return (
                <div key={order.id} className="admin-notif-order-item">
                  <div className="admin-notif-order-top">
                    <span className="admin-notif-order-id">{order.id}</span>
                    <span className="admin-notif-order-status" style={{ background: sc.bg, color: sc.text }}>
                      <span className="admin-notif-status-dot" style={{ background: sc.dot }} />
                      {order.status}
                    </span>
                  </div>
                  <div className="admin-notif-order-customer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    {order.customer || "Guest Customer"}
                  </div>
                  <div className="admin-notif-order-bottom">
                    <span className="admin-notif-order-total">₹{order.total?.toLocaleString("en-IN")}</span>
                    <span className="admin-notif-order-time">{timeAgo(order.createdAt)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="admin-notif-footer">
          <Link href="/admin" className="admin-notif-dashboard-btn" onClick={() => setIsOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="3" y="3" width="7" height="9" />
              <rect x="14" y="3" width="7" height="5" />
              <rect x="14" y="12" width="7" height="9" />
              <rect x="3" y="16" width="7" height="5" />
            </svg>
            Open Full Dashboard
          </Link>
        </div>
      </div>
    </>
  );
}
