import Link from "next/link";
import Image from "next/image";
import AdminNotificationPanel from "@/components/AdminNotificationPanel";

export default function AdminHeader() {
  return (
    <header className="admin-header" style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "12px 0" }}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          
          {/* Brand Logo & Portal Tag */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center" }}>
              <Image
                src="/images/90driplogo.png"
                alt="90DRIP"
                width={100}
                height={26}
                loading="lazy"
                style={{ height: "26px", width: "auto", objectFit: "contain" }}
              />
            </Link>
            <span
              style={{
                background: "#2563eb",
                color: "#ffffff",
                fontSize: "10px",
                fontWeight: "900",
                letterSpacing: "0.06em",
                padding: "4px 8px",
                borderRadius: "6px",
                textTransform: "uppercase"
              }}
            >
              ADMIN
            </span>
          </div>

          {/* Right Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Notification Bell — always admin here */}
            <AdminNotificationPanel isAdmin={true} />

            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                fontWeight: "800",
                color: "#0f172a",
                textDecoration: "none",
                background: "#f8fafc",
                padding: "8px 12px",
                borderRadius: "10px",
                border: "1.5px solid #e2e8f0"
              }}
            >
              <span>←</span>
              <span>Shop Front</span>
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f8fafc", padding: "4px 10px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "#0f172a",
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: "900",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                AD
              </div>
              <span style={{ fontSize: "12px", fontWeight: "800", color: "#0f172a" }}>Manager</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
