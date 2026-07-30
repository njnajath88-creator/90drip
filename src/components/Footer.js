"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        
        {/* Top Newsletter Bar */}
        <div className="footer-newsletter">
          <div className="footer-newsletter-text">
            <h3>JOIN THE DRIP CLUB</h3>
            <p>Get exclusive access to new jersey drops, secret sales & 10% off your first order.</p>
          </div>
          <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
            {subscribed ? (
              <div className="footer-newsletter-success">
                ✓ You're in! Welcome to the 90Drip Club.
              </div>
            ) : (
              <>
                <input
                  type="email"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit">SUBSCRIBE</button>
              </>
            )}
          </form>
        </div>

        {/* Main Footer Grid */}
        <div className="footer-grid">
          
          {/* Brand Column */}
          <div className="footer-brand-col">
            <Link href="/" className="footer-logo" aria-label="90DRIP Home">
              <Image
                src="/images/90driplogo.png"
                alt="90DRIP"
                width={130}
                height={44}
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
              <a href="#" aria-label="WhatsApp" className="social-icon-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </a>
              <a href="#" aria-label="Twitter" className="social-icon-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
            </div>
          </div>

          {/* Links Columns Group for Mobile 2-Column Grid */}
          <div className="footer-links-wrapper">
            
            {/* Shop Column */}
            <div className="footer-col">
              <h4 className="footer-col-title">Shop</h4>
              <ul className="footer-links">
                <li><a href="/#shop">New Arrivals</a></li>
                <li><a href="/category/full-sleeve">Full Sleeve</a></li>
                <li><a href="/category/half-sleeve">Half Sleeve</a></li>
                <li><a href="/category/5-sleeve">5 Sleeve</a></li>
                <li><a href="/category/retro">Retro Kits</a></li>
              </ul>
            </div>

            {/* Customer Care Column */}
            <div className="footer-col">
              <h4 className="footer-col-title">Customer Care</h4>
              <ul className="footer-links">
                <li><a href="#">Size Guide</a></li>
                <li><a href="#">Shipping Info</a></li>
                <li><a href="#">Returns & Exchange</a></li>
                <li><a href="#">Track Order</a></li>
              </ul>
            </div>

            {/* About Column */}
            <div className="footer-col">
              <h4 className="footer-col-title">About</h4>
              <ul className="footer-links">
                <li><a href="#">Our Story</a></li>
                <li><a href="#">Authenticity</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Payment & Trust Bar */}
        <div className="footer-trust-bar">
          <div className="trust-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            <span>100% Authentic Match Kits</span>
          </div>
          <div className="trust-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            <span>Express Shipping Across India</span>
          </div>
          <div className="trust-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>Custom Name & Numbering</span>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© 2026 90DRIP. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <span>•</span>
            <a href="#">Terms</a>
            <span>•</span>
            <a href="#">Refund Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
