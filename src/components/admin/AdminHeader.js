import Link from "next/link";

export default function AdminHeader() {
  return (
    <header className="admin-header">
      <div className="admin-header-container">
        <div className="admin-brand">
          <Link href="/" className="admin-logo-link">
            <img
              src="/images/90driplogo.png"
              alt="90DRIP"
              style={{ height: "36px", objectFit: "contain" }}
            />
          </Link>
          <span className="admin-badge">ADMIN PORTAL</span>
        </div>

        <div className="admin-nav-actions">
          <Link href="/" className="admin-back-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            View Shop Front
          </Link>
          <div className="admin-user-profile">
            <div className="admin-avatar">AD</div>
            <span className="admin-user-name">Manager</span>
          </div>
        </div>
      </div>
    </header>
  );
}
