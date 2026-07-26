"use client";

export default function ProfileDetailsModal({ isOpen, onClose, user, onLogout }) {
  if (!isOpen || !user) return null;

  const isAdmin = user?.email?.toLowerCase() === "ad123@gmail.com" || user?.role === "admin";
  const userInitials = user.name
    ? user.name.slice(0, 2).toUpperCase()
    : user.email.slice(0, 2).toUpperCase();

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(8px)",
        zIndex: 100000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "460px",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "1px solid rgba(226, 232, 240, 0.8)",
          animation: "slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent Banner */}
        <div
          style={{
            height: "90px",
            background: isAdmin
              ? "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)"
              : "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
            position: "relative",
            padding: "16px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: "900",
              color: "rgba(255, 255, 255, 0.85)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              background: "rgba(255, 255, 255, 0.15)",
              padding: "4px 10px",
              borderRadius: "20px",
              backdropFilter: "blur(4px)",
            }}
          >
            {isAdmin ? "⚡ System Administrator" : "⭐ VIP Member"}
          </span>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              color: "#ffffff",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "transform 0.2s ease, background 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.35)";
              e.currentTarget.style.transform = "scale(1.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            ✕
          </button>
        </div>

        {/* User Main Avatar Header */}
        <div style={{ padding: "0 28px 24px", marginTop: "-36px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "16px", marginBottom: "16px" }}>
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: isAdmin ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : "#0f172a",
                color: "#ffffff",
                fontSize: "26px",
                fontWeight: "900",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "4px solid #ffffff",
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.12)",
                position: "relative",
              }}
            >
              {userInitials}
              <div
                style={{
                  position: "absolute",
                  bottom: "2px",
                  right: "2px",
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  background: "#22c55e",
                  border: "2px solid #ffffff",
                }}
                title="Online Now"
              />
            </div>

            <div style={{ marginBottom: "4px" }}>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "800",
                  color: "#0f172a",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {user.name || "User Account"}
              </h2>
              <p style={{ fontSize: "13px", color: "#64748b", margin: "2px 0 0", fontWeight: "600" }}>
                {user.email}
              </p>
            </div>
          </div>

          {/* Account Overview Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "12px 14px",
              }}
            >
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>
                Account Role
              </div>
              <div style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a", marginTop: "2px" }}>
                {isAdmin ? "Super Admin" : "Verified Customer"}
              </div>
            </div>

            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "12px 14px",
              }}
            >
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>
                Security Status
              </div>
              <div style={{ fontSize: "14px", fontWeight: "800", color: "#16a34a", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                <span>🔒</span> Active & Safe
              </div>
            </div>
          </div>

          {/* Account Privileges List */}
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                fontSize: "12px",
                fontWeight: "800",
                color: "#475569",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "10px",
              }}
            >
              Account Capabilities
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {isAdmin ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#334155", fontWeight: "600" }}>
                    <span style={{ color: "#2563eb", fontWeight: "bold" }}>✓</span> Full Product & Inventory Management
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#334155", fontWeight: "600" }}>
                    <span style={{ color: "#2563eb", fontWeight: "bold" }}>✓</span> Customer Orders & Analytics Access
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#334155", fontWeight: "600" }}>
                    <span style={{ color: "#2563eb", fontWeight: "bold" }}>✓</span> System Settings & Store Configuration
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#334155", fontWeight: "600" }}>
                    <span style={{ color: "#16a34a", fontWeight: "bold" }}>✓</span> Express Checkout & Order Tracking
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#334155", fontWeight: "600" }}>
                    <span style={{ color: "#16a34a", fontWeight: "bold" }}>✓</span> Priority Customer Support
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div style={{ display: "flex", gap: "12px" }}>
            {isAdmin && (
              <a
                href="/admin"
                style={{
                  flex: 1,
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "#ffffff",
                  textAlign: "center",
                  padding: "12px",
                  borderRadius: "12px",
                  fontWeight: "800",
                  fontSize: "14px",
                  textDecoration: "none",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
                }}
              >
                Go to Admin
              </a>
            )}

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              style={{
                flex: 1,
                background: "#fef2f2",
                color: "#ef4444",
                border: "1px solid #fecaca",
                padding: "12px",
                borderRadius: "12px",
                fontWeight: "800",
                fontSize: "14px",
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fef2f2")}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
