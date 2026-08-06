"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const SEEN_KEY = "90drip_admin_seen_orders";
const POLL_INTERVAL_MS = 10000; // Reduced from 15s to 10s for faster detection

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

// Detect if running on iOS (iPhone / iPad)
function isIOS() {
  if (typeof window === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

// Detect if already installed as a PWA (standalone mode)
function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.navigator.standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches
  );
}

export default function AdminNotificationPanel({ isAdmin }) {
  const [orders, setOrders] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionState, setPermissionState] = useState("default");
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const drawerRef = useRef(null);
  const pollRef = useRef(null);

  // Read current permission state on mount and detect iOS context
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermissionState(Notification.permission);
    }
    // Show iOS install guide if on iOS but not in standalone mode
    if (isIOS() && !isStandalone()) {
      setShowIOSGuide(true);
    }
  }, []);

  /**
   * Show a native notification via the Service Worker.
   *
   * KEY iOS NOTES:
   * - vibrate is omitted — iOS doesn't support it and it can silently
   *   prevent showNotification() from working on some iOS versions.
   * - renotify: true — forces iOS to show the notification even if one
   *   with the same `tag` is already displayed.
   * - This ONLY works on iOS 16.4+ when the PWA is installed to the
   *   homescreen. In a regular Safari tab it will be silently ignored.
   */
  const showOrderNotification = (title, body) => {
    if (typeof window === "undefined") return;

    const notifOptions = {
      body,
      icon: "/icon.png",
      badge: "/icon.png",
      tag: "new-order",
      renotify: true,           // show even if same tag is already on screen
      requireInteraction: false,
      // vibrate intentionally omitted — breaks iOS silent-mode notifications
    };

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then((reg) => reg.showNotification(title, notifOptions))
        .catch(() => {
          // Fallback: try the Notification constructor (desktop / Android)
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(title, { body, icon: "/icon.png" });
          }
        });
    } else if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body, icon: "/icon.png" });
    }
  };

  /**
   * Request notification permission.
   * MUST be called directly in a user-gesture handler (onClick) — iOS
   * requires the call to originate from a real tap, not a setTimeout or
   * Promise callback. This function is designed to be called inside onClick.
   */
  const enableNotifications = () => {
    if (typeof window === "undefined") return;

    // iOS: if not in standalone mode, the browser won't grant permission.
    // Show the install guide instead.
    if (isIOS() && !isStandalone()) {
      setShowIOSGuide(true);
      return;
    }

    if (!("Notification" in window)) {
      alert("Your browser does not support notifications.");
      return;
    }

    // requestPermission() called directly — iOS requires the Promise to
    // start synchronously within the gesture handler.
    Notification.requestPermission().then((permission) => {
      setPermissionState(permission);
      if (permission === "granted") {
        showOrderNotification(
          "Notifications Enabled! 🔔",
          "You will now receive real-time alerts for customer orders."
        );
      }
    });
  };

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

          // Fire native notification for truly new orders during background polling
          if (silent && newUnseen.length > 0 && permissionState === "granted") {
            const freshOrders = newUnseen.filter((o) => {
              if (!window._notifiedOrderIds) window._notifiedOrderIds = [];
              if (window._notifiedOrderIds.includes(o.id)) return false;
              window._notifiedOrderIds.push(o.id);
              return true;
            });

            if (freshOrders.length > 0) {
              const bodyText =
                freshOrders.length === 1
                  ? `Order ${freshOrders[0].id} from ${freshOrders[0].customer || "Guest"} — ₹${freshOrders[0].total}`
                  : `You have ${freshOrders.length} new customer orders!`;
              showOrderNotification("New Order Placed! 📦", bodyText);
            }
          }
        }
      }
    } catch {
      // silent fail — network might be momentarily unavailable
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  // Poll for new orders every 10s while admin is logged in
  useEffect(() => {
    if (!isAdmin) return;
    fetchOrders();
    pollRef.current = setInterval(() => fetchOrders(true), POLL_INTERVAL_MS);
    return () => clearInterval(pollRef.current);
  }, [isAdmin]);

  // Also react to same-tab order placement events
  useEffect(() => {
    if (!isAdmin) return;
    const onUpdate = () => fetchOrders(true);
    window.addEventListener("90drip_orders_updated", onUpdate);
    return () => window.removeEventListener("90drip_orders_updated", onUpdate);
  }, [isAdmin]);

  // Close drawer on outside click
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

  // Close on ESC key
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
                {isLoading ? "Refreshing…" : `${orders.length} total · refreshes every 10s`}
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

        {/* ── iOS Install-to-Homescreen Guide ─────────────────────────────── */}
        {showIOSGuide && (
          <div style={{
            background: "linear-gradient(135deg, #fff7ed, #fef3c7)",
            border: "1.5px solid #fcd34d",
            padding: "12px 16px",
            borderRadius: "14px",
            margin: "0 16px 12px 16px",
            position: "relative",
          }}>
            <button
              onClick={() => setShowIOSGuide(false)}
              style={{ position: "absolute", top: "8px", right: "10px", background: "none", border: "none", fontSize: "14px", color: "#92400e", cursor: "pointer", lineHeight: 1 }}
              aria-label="Dismiss"
            >✕</button>
            <div style={{ fontSize: "12px", fontWeight: "800", color: "#92400e", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span>📱</span> iPhone: Install for Push Alerts
            </div>
            <div style={{ fontSize: "11px", color: "#78350f", lineHeight: "1.5" }}>
              iOS only shows push notifications when the app is added to your homescreen. In Safari:
            </div>
            <ol style={{ fontSize: "11px", color: "#78350f", lineHeight: "1.7", margin: "6px 0 0 0", paddingLeft: "16px" }}>
              <li>Tap the <strong>Share</strong> button <span style={{ fontSize: "13px" }}>⎋</span> at the bottom of Safari</li>
              <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
              <li>Tap <strong>Add</strong> — then open the app from your homescreen</li>
              <li>Tap <strong>Allow Notifications</strong> in the panel</li>
            </ol>
          </div>
        )}

        {/* ── Notification Permission Request ──────────────────────────────── */}
        {!showIOSGuide && permissionState !== "granted" && (
          <div style={{
            background: "#eff6ff",
            border: "1.5px solid #bfdbfe",
            padding: "12px 16px",
            borderRadius: "14px",
            margin: "0 16px 12px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#1e3a8a" }}>
              Enable Order Alerts
            </div>
            <div style={{ fontSize: "11px", color: "#1e40af", lineHeight: "1.4" }}>
              {permissionState === "denied"
                ? "Notifications are blocked. Please enable them in your browser/device settings."
                : "Get instant alerts on your lock screen when a customer places an order."}
            </div>
            {permissionState !== "denied" && (
              <button
                onClick={enableNotifications}
                style={{
                  background: "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  fontSize: "11px",
                  fontWeight: "800",
                  cursor: "pointer",
                  textAlign: "center"
                }}
              >
                🔔 Allow Notifications
              </button>
            )}
          </div>
        )}

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
