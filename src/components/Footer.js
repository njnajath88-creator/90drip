"use client";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">

        {/* Main Footer Grid */}
        <div className="footer-grid" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "32px", paddingBottom: "40px" }}>

          {/* Brand Column */}
          <div className="footer-brand-col" style={{ maxWidth: "420px" }}>
            <Link href="/" className="footer-logo" aria-label="90DRIP Home">
              <Image
                src="/images/90driplogo.png"
                alt="90DRIP"
                width={160}
                height={50}
                loading="lazy"
                style={{
                  height: "44px",
                  width: "auto",
                  objectFit: "contain",
                  display: "block",
                  filter: "brightness(0) invert(1)"
                }}
              />
            </Link>
            <p className="footer-tagline">
              Elevating football streetwear culture. Authentic match kits, player editions & retro classics delivered across India.
            </p>
            {/* Social Links */}
            <div className="footer-socials">
              <a
                href="https://www.instagram.com/90drip.in?igsh=MWU0cDd1NTBtNHduaw=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @90drip.in"
                title="Follow @90drip.in on Instagram"
                className="social-icon-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>

          {/* Customer Care Column (Phone & Email Only) */}
          <div className="footer-col" style={{ minWidth: "220px" }}>
            <h4 className="footer-col-title" style={{ fontSize: "14px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.05em", color: "#ffffff", marginBottom: "16px" }}>
              Customer Care
            </h4>
            <ul className="footer-links" style={{ display: "flex", flexDirection: "column", gap: "12px", listStyle: "none", padding: 0, margin: 0 }}>
              <li>
                <a href="tel:+9123456789" style={{ display: "inline-flex", alignItems: "center", gap: "10px", color: "#cbd5e1", textDecoration: "none", fontSize: "14px", fontWeight: "700" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <span>+9123456789</span>
                </a>
              </li>
              <li>
                <a href="mailto:support@90drip.in" style={{ display: "inline-flex", alignItems: "center", gap: "10px", color: "#cbd5e1", textDecoration: "none", fontSize: "14px", fontWeight: "700" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <span>support@90drip.in</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© 2026 90DRIP. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}
