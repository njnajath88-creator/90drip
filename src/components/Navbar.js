"use client";
import { useEffect } from "react";

export default function Navbar({
  cartCount,
  onOpenCart,
  isProfileOpen,
  setIsProfileOpen,
  onOpenCartFromProfile,
}) {
  // Navbar scroll behaviour
  useEffect(() => {
    const navbar = document.getElementById("navbar");
    const onScroll = () => {
      if (window.scrollY > 50) {
        navbar?.classList.add("scrolled");
      } else {
        navbar?.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="navbar" id="navbar" role="navigation" aria-label="Main navigation">
      <div className="container">
        <div className="navbar-inner">

          {/* Left: nav-links on desktop | search+profile on mobile */}
          <div className="nav-left">
            <ul className="nav-links" role="list">
              <li><a href="#home">Home</a></li>
              <li><a href="#categories">Categories</a></li>
              <li><a href="#shop">Shop</a></li>
              <li>
                <a href="/admin" style={{ color: "#3b82f6", fontWeight: 600 }}>
                  Admin
                </a>
              </li>
            </ul>
            {/* Mobile-only left icons */}
            <button className="nav-icon-btn nav-icon-mobile" aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <button
              className="nav-icon-btn nav-icon-mobile"
              aria-label="User Account"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
          </div>

          {/* Center: Logo */}
          <a href="#" className="nav-logo" aria-label="90Drip Home">
            <img src="/images/90driplogo.png" alt="90DRIP" className="nav-logo-img" />
          </a>

          {/* Right: all 4 icons on desktop | wishlist+cart only on mobile */}
          <div className="nav-actions" style={{ position: "relative" }}>
            <button className="nav-icon-btn nav-icon-desktop" aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <button
              className={`nav-icon-btn nav-icon-desktop ${isProfileOpen ? "active" : ""}`}
              aria-label="User Account"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
            <button className="nav-icon-btn" aria-label="Wishlist">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <button
              className="nav-icon-btn"
              id="cart-btn"
              aria-label="Shopping cart"
              onClick={onOpenCart}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span className="cart-badge">{cartCount}</span>
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <>
                <div
                  className="profile-dropdown-overlay"
                  onClick={() => setIsProfileOpen(false)}
                />
                <div className="profile-dropdown-menu">
                  <div className="profile-dropdown-header">
                    <div className="profile-avatar">AD</div>
                    <div className="profile-user-info">
                      <div className="profile-name">Store Admin</div>
                      <div className="profile-email">admin@90drip.com</div>
                    </div>
                  </div>
                  <div className="profile-divider"></div>
                  <ul className="profile-menu-list">
                    <li>
                      <a href="/admin" className="profile-menu-item admin-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="7" height="9"></rect>
                          <rect x="14" y="3" width="7" height="5"></rect>
                          <rect x="14" y="12" width="7" height="9"></rect>
                          <rect x="3" y="16" width="7" height="5"></rect>
                        </svg>
                        <span>Admin Dashboard</span>
                        <span className="badge-admin-pill">ADMIN</span>
                      </a>
                    </li>
                    <li>
                      <button
                        className="profile-menu-item"
                        onClick={() => {
                          setIsProfileOpen(false);
                          alert("Account Profile: Store Admin (admin@90drip.com)");
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>My Profile</span>
                      </button>
                    </li>
                    <li>
                      <button
                        className="profile-menu-item"
                        onClick={() => {
                          setIsProfileOpen(false);
                          onOpenCartFromProfile();
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        </svg>
                        <span>My Cart &amp; Orders</span>
                      </button>
                    </li>
                    <li>
                      <button
                        className="profile-menu-item"
                        onClick={() => {
                          setIsProfileOpen(false);
                          alert("Logged out successfully");
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                          <polyline points="16 17 21 12 16 7"></polyline>
                          <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        <span>Sign Out</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
