"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { getFcmToken } from "@/lib/firebase";

const SEEN_KEY = "90drip_admin_seen_orders";
const POLL_INTERVAL_MS = 30000;

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

function isIOS() {
  if (typeof window === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.navigator.standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches
  );
}

// ── In-App Toast ──────────────────────────────────────────────────────────────
// A floating banner that slides in from the top. This is the PRIMARY notification
// mechanism — it works 100% on all devices including iPhone, with zero OS/browser
// permission requirements. It fires whenever the admin has the app open.
function InAppToast({ toasts, onDismiss }) {
  return (
    <div
      style={{
        position: "fixed",
        top: "80px",
        right: "16px",
        zIndex: 999999,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        pointerEvents: "none",
        maxWidth: "340px",
        width: "calc(100vw - 32px)",
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
            color: "#fff",
            borderRadius: "16px",
            padding: "14px 16px",
            boxShadow: "0 12px 40px rgba(15,23,42,0.45)",
            display: "flex",
            gap: "12px",
            alignItems: "flex-start",
            animation: "toastSlideIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
            pointerEvents: "auto",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              flexShrink: 0,
            }}
          >
            📦
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "13px", fontWeight: "800", marginBottom: "2px" }}>
              {t.title}
            </div>
            <div style={{ fontSize: "11px", opacity: 0.8, lineHeight: "1.4", wordBreak: "break-word" }}>
              {t.body}
            </div>
            {t.orderId && (
              <Link
                href="/admin"
                style={{
                  display: "inline-block",
                  marginTop: "6px",
                  fontSize: "10px",
                  fontWeight: "800",
                  color: "#93c5fd",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                View in Dashboard →
              </Link>
            )}
          </div>
          <button
            onClick={() => onDismiss(t.id)}
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              borderRadius: "6px",
              width: "22px",
              height: "22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: "12px",
              lineHeight: 1,
            }}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      ))}

      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(60px) scale(0.92); }
          to   { opacity: 1; transform: translateX(0)   scale(1); }
        }
      `}</style>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AdminNotificationPanel({ isAdmin }) {
  const [orders, setOrders] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionState, setPermissionState] = useState("default");
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [toasts, setToasts] = useState([]);
  const drawerRef = useRef(null);
  const pollRef = useRef(null);
  const toastTimers = useRef({});

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermissionState(Notification.permission);
    }
    if (isIOS() && !isStandalone()) {
      setShowIOSGuide(true);
    }
  }, []);

  // ── In-App Toast (works on ALL devices, no OS permission needed) ──────────
  const showInAppToast = useCallback((title, body, orderId) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, body, orderId }]);
    // Auto-dismiss after 8 seconds
    toastTimers.current[id] = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      delete toastTimers.current[id];
    }, 8000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (toastTimers.current[id]) {
      clearTimeout(toastTimers.current[id]);
      delete toastTimers.current[id];
    }
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(toastTimers.current).forEach(clearTimeout);
    };
  }, []);

  // ── Native OS Notification (via Service Worker) ───────────────────────────
  // This works on:
  //   • Desktop browsers (Chrome, Edge, Firefox, Safari 16+)
  //   • Android Chrome (background too)
  //   • iOS 16.4+ ONLY when installed as PWA to homescreen
  // It is SILENTLY IGNORED on iOS Safari (tab mode) — that's an Apple limit.
  const showNativeNotification = (title, body) => {
    if (typeof window === "undefined") return;
    const opts = {
      body,
      icon: "/icon.png",
      badge: "/icon.png",
      tag: "new-order",
      renotify: true,
      requireInteraction: false,
      // vibrate intentionally omitted — breaks iOS
    };

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then((reg) => reg.showNotification(title, opts))
        .catch(() => {
          // Service worker not ready — try direct Notification API
          if ("Notification" in window && Notification.permission === "granted") {
            try { new Notification(title, { body, icon: "/icon.png" }); } catch {}
          }
        });
    } else if ("Notification" in window && Notification.permission === "granted") {
      try { new Notification(title, { body, icon: "/icon.png" }); } catch {}
    }
  };

  // Fires both in-app toast AND native notification for every new order
  const alertNewOrders = useCallback((freshOrders) => {
    if (freshOrders.length === 0) return;

    const title = "New Order Placed! 📦";
    const body =
      freshOrders.length === 1
        ? `${freshOrders[0].customer || "A customer"} ordered ₹${freshOrders[0].total} · ID: ${freshOrders[0].id}`
        : `${freshOrders.length} new orders just placed!`;
    const orderId = freshOrders.length === 1 ? freshOrders[0].id : null;

    // In-app toast — always works
    showInAppToast(title, body, orderId);

    // Native OS notification — works on desktop & Android freely,
    // iOS needs PWA installed + iOS 16.4+
    if (permissionState === "granted") {
      showNativeNotification(title, body);
    }
  }, [permissionState, showInAppToast]);

  /**
   * enableNotifications — full VAPID push subscription flow.
   * 1. Request browser permission
   * 2. Subscribe via pushManager with VAPID public key
   * 3. Save subscription to MongoDB via /api/push/subscribe
   *
   * After this, the SERVER sends push messages directly to Apple/Google
   * push servers — which wake up the device even when screen is off.
   */
  const enableNotifications = async () => {
    if (typeof window === "undefined") return;

    // iOS: must be installed as PWA first
    if (isIOS() && !isStandalone()) {
      setShowIOSGuide(true);
      return;
    }

    if (!("Notification" in window)) {
      alert("Push notifications are not supported in this browser.");
      return;
    }

    // Step 1: Request OS permission (must be in user gesture handler)
    const permission = await Notification.requestPermission();
    setPermissionState(permission);

    if (permission !== "granted") {
      showInAppToast("Permission Denied", "Enable notifications in your device settings.", null);
      return;
    }

    try {
      // Step 2: Obtain FCM Registration Token if configured
      try {
        const fcmToken = await getFcmToken();
        if (fcmToken) {
          console.log("FCM registration token obtained:", fcmToken);
          await fetch("/api/push/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fcmToken, type: "fcm" }),
          });
        }
      } catch (fcmErr) {
        console.warn("FCM token retrieval notice:", fcmErr);
      }

      // Step 3: Subscribe via Service Worker pushManager with VAPID public key
      const reg = await navigator.serviceWorker.ready;

      // Fetch VAPID public key dynamically from the server at runtime.
      const keyRes = await fetch("/api/push/key");
      if (!keyRes.ok) {
        throw new Error("Failed to load VAPID public key from server");
      }
      const { publicKey: vapidPublicKey } = await keyRes.json();
      if (!vapidPublicKey) {
        throw new Error("VAPID public key is empty");
      }

      const padding = "=".repeat((4 - (vapidPublicKey.length % 4)) % 4);
      const base64 = (vapidPublicKey + padding).replace(/-/g, "+").replace(/_/g, "/");
      const rawData = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

      const existingSub = await reg.pushManager.getSubscription();
      if (existingSub) {
        console.log("Unsubscribing stale push subscription before re-subscribing...");
        await existingSub.unsubscribe();
      }

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: rawData,
      });

      console.log("New push subscription created:", subscription.endpoint);

      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription.toJSON()),
      });

      if (res.ok) {
        showInAppToast(
          "Push Notifications Active! 🔔",
          "You'll now get lock-screen alerts even when your phone is off.",
          null
        );
      } else {
        const errText = await res.text().catch(() => "unknown error");
        throw new Error(`Server failed to save subscription: ${res.status} ${errText}`);
      }
    } catch (err) {
      console.error("Push subscription error:", err);
      showInAppToast("Setup Failed", `Could not enable push: ${err.message}`, null);
    }
  };

  // Test notification — sends via server so it tests the full VAPID pipeline
  const sendTestNotification = async () => {
    showInAppToast("Test Alert ✓", "In-app notifications are working!", null);
    // Test native notification via SW
    try {
      const reg = await navigator.serviceWorker.ready;
      reg.showNotification("Test Push ✓", {
        body: "VAPID push pipeline is working! You\'ll get this on your lock screen.",
        icon: "/icon.png",
        badge: "/icon.png",
        tag: "test-push",
        renotify: true,
      });
    } catch {}
  };

  const getSeenIds = () => {
    try {
      const raw = localStorage.getItem(SEEN_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  };

  const saveSeenIds = (ids) => {
    try { localStorage.setItem(SEEN_KEY, JSON.stringify(ids)); } catch {}
  };

  const fetchOrders = useCallback(async (silent = false) => {
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

          if (silent && newUnseen.length > 0) {
            const freshOrders = newUnseen.filter((o) => {
              if (!window._notifiedOrderIds) window._notifiedOrderIds = [];
              if (window._notifiedOrderIds.includes(o.id)) return false;
              window._notifiedOrderIds.push(o.id);
              return true;
            });
            alertNewOrders(freshOrders);
          }
        }
      }
    } catch {
      // silent fail
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [alertNewOrders]);

  // Poll every 10s while admin is open
  useEffect(() => {
    if (!isAdmin) return;
    fetchOrders();
    pollRef.current = setInterval(() => fetchOrders(true), POLL_INTERVAL_MS);
    return () => clearInterval(pollRef.current);
  }, [isAdmin, fetchOrders]);

  // Same-tab event listener
  useEffect(() => {
    if (!isAdmin) return;
    const onUpdate = () => fetchOrders(true);
    window.addEventListener("90drip_orders_updated", onUpdate);
    return () => window.removeEventListener("90drip_orders_updated", onUpdate);
  }, [isAdmin, fetchOrders]);

  // Close drawer on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) setIsOpen(false);
    };
    const timer = setTimeout(() => document.addEventListener("mousedown", handleClick), 0);
    return () => { clearTimeout(timer); document.removeEventListener("mousedown", handleClick); };
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setIsOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

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
      {/* ── In-App Toast Container ───────────────────────────────────────── */}
      <InAppToast toasts={toasts} onDismiss={dismissToast} />

      {/* ── Bell Icon Button ─────────────────────────────────────────────── */}
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

      {/* ── Backdrop ─────────────────────────────────────────────────────── */}
      {isOpen && <div className="admin-notif-backdrop" onClick={() => setIsOpen(false)} />}

      {/* ── Slide-in Drawer ───────────────────────────────────────────────── */}
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
                {isLoading ? "Refreshing…" : `${orders.length} total · live every 10s`}
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

        {/* ── iOS Guide (not installed as PWA) ──────────────────────────── */}
        {showIOSGuide && (
          <div style={{
            background: "linear-gradient(135deg, #fff7ed, #fef3c7)",
            border: "1.5px solid #fcd34d",
            padding: "12px 16px",
            borderRadius: "14px",
            margin: "0 16px 10px 16px",
            position: "relative",
          }}>
            <button
              onClick={() => setShowIOSGuide(false)}
              style={{ position: "absolute", top: "8px", right: "10px", background: "none", border: "none", fontSize: "14px", color: "#92400e", cursor: "pointer" }}
              aria-label="Dismiss"
            >✕</button>
            <div style={{ fontSize: "12px", fontWeight: "800", color: "#92400e", marginBottom: "4px" }}>
              📱 iPhone: Install for Lock-Screen Alerts
            </div>
            <div style={{ fontSize: "11px", color: "#78350f", lineHeight: "1.5", marginBottom: "6px" }}>
              <strong>In-app alerts already work</strong> (banner appears when you have the page open). For lock-screen alerts, install as a PWA:
            </div>
            <ol style={{ fontSize: "11px", color: "#78350f", lineHeight: "1.8", margin: 0, paddingLeft: "16px" }}>
              <li>Tap <strong>Share ⎋</strong> in Safari → <strong>"Add to Home Screen"</strong></li>
              <li>Open the app from your homescreen icon</li>
              <li>Tap <strong>Allow Notifications</strong> in this panel</li>
            </ol>
            <div style={{ marginTop: "8px", fontSize: "10px", color: "#92400e", fontWeight: "600", background: "rgba(255,255,255,0.5)", padding: "4px 8px", borderRadius: "6px" }}>
              ✅ Requires iOS 16.4 or later
            </div>
          </div>
        )}

        {/* ── Notification Permission Section ───────────────────────────── */}
        {!showIOSGuide && permissionState !== "granted" && (
          <div style={{
            background: "#eff6ff",
            border: "1.5px solid #bfdbfe",
            padding: "12px 16px",
            borderRadius: "14px",
            margin: "0 16px 10px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#1e3a8a" }}>
              Enable Lock-Screen Alerts
            </div>
            <div style={{ fontSize: "11px", color: "#1e40af", lineHeight: "1.5" }}>
              {permissionState === "denied"
                ? "🚫 Notifications are blocked. Go to Settings → Safari / Browser → Notifications and allow this site."
                : "In-app alerts are already active. Enable this for lock-screen notifications too."}
            </div>
            {permissionState !== "denied" && (
              <button
                onClick={enableNotifications}
                style={{
                  background: "#2563eb", color: "#fff", border: "none",
                  borderRadius: "8px", padding: "9px 12px",
                  fontSize: "11px", fontWeight: "800", cursor: "pointer",
                }}
              >
                🔔 Allow Lock-Screen Notifications
              </button>
            )}
          </div>
        )}

        {/* ── Granted: show test button ─────────────────────────────────── */}
        {permissionState === "granted" && (
          <div style={{
            margin: "0 16px 10px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "12px",
            padding: "10px 14px",
            gap: "10px",
          }}>
            <div style={{ fontSize: "11px", color: "#166534", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
              <span>✅</span> Alerts active
            </div>
            <button
              onClick={sendTestNotification}
              style={{
                background: "#16a34a", color: "#fff", border: "none",
                borderRadius: "7px", padding: "6px 12px",
                fontSize: "10px", fontWeight: "800", cursor: "pointer",
              }}
            >
              Test Alert
            </button>
          </div>
        )}

        {/* Stats Row */}
        <div className="admin-notif-stats-row">
          {[
            { label: "Total",      value: orders.length,                                        color: "#6366f1" },
            { label: "Processing", value: orders.filter(o => o.status === "Processing").length, color: "#f59e0b" },
            { label: "Delivered",  value: orders.filter(o => o.status === "Delivered").length,  color: "#22c55e" },
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
