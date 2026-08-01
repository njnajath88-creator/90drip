"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import AuthModal from "./AuthModal";

import ProfileDetailsModal from "./ProfileDetailsModal";
import SearchModal from "./SearchModal";

export default function Navbar({
  cartCount,
  onOpenCart,
  user,
  setUser,
  solid = false
}) {
  const pathname = usePathname() || "";
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const profileContainerRef = useRef(null);

  // Close profile dropdown on outside click or ESC key
  useEffect(() => {
    if (!isProfileOpen) return;

    const handleOutsideClick = (e) => {
      if (profileContainerRef.current && !profileContainerRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener("click", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
      document.addEventListener("keydown", handleKeyDown);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProfileOpen]);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("90drip_user");
      if (savedUser && setUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error("Failed to load user state:", e);
    }
  }, [setUser]);

  // Listen for global open auth modal request (e.g. unauthenticated add to cart/wishlist)
  useEffect(() => {
    const handleOpenAuth = () => {
      setIsAuthModalOpen(true);
    };
    window.addEventListener("90drip_open_auth_modal", handleOpenAuth);
    return () => window.removeEventListener("90drip_open_auth_modal", handleOpenAuth);
  }, []);

  // Navbar scroll behavior
  useEffect(() => {
    const navbar = document.getElementById("navbar");
    if (solid) {
      navbar?.classList.add("scrolled");
      return;
    }
    const onScroll = () => {
      if (window.scrollY > 50) {
        navbar?.classList.add("scrolled");
      } else {
        navbar?.classList.remove("scrolled");
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [solid]);

  const handleProfileClick = () => {
    if (user) {
      setIsProfileOpen(!isProfileOpen);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem("90drip_user", JSON.stringify(userData));
    } catch (e) {
      console.error("Failed to save user state:", e);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsProfileOpen(false);
    setIsProfileModalOpen(false);
    try {
      localStorage.removeItem("90drip_user");
    } catch (e) {
      console.error("Failed to clear user state:", e);
    }
  };

  const isAdmin = user?.email?.toLowerCase() === "ad123@gmail.com" || user?.role === "admin";
  const userInitials = user ? (user.name ? user.name.slice(0, 2).toUpperCase() : user.email.slice(0, 2).toUpperCase()) : "";

  const isHomeActive = pathname === "/" || pathname === "";
  const isWishlistActive = pathname === "/wishlist";

  return (
    <>
      <nav className="navbar" id="navbar" role="navigation" aria-label="Main navigation">
        <div className="container">
          <div className="navbar-inner">

            {/* Left Glass Floating Pill Links Bar */}
            <div className="nav-left">
              <div className="nav-pill-container" role="list">
                <Link href="/" className={`nav-pill-item ${isHomeActive ? "active" : ""}`}>
                  Home
                </Link>
                <Link href="/wishlist" className={`nav-pill-item ${isWishlistActive ? "active" : ""}`}>
                  Wishlist
                </Link>
                <a href="/#categories" className="nav-pill-item">
                  <span>Fresh In</span>
                  <span className="nav-pill-badge">New</span>
                </a>
              </div>

            </div>

            {/* Center Logo */}
            <a href="/" className="nav-logo" aria-label="90Drip Home">
              <Image
                src="/images/90driplogo.png"
                alt="90DRIP"
                width={240}
                height={64}
                priority
                className="nav-logo-img"
                style={{ width: "auto", height: "54px", maxHeight: "60px", objectFit: "contain" }}
              />
            </a>

            {/* Right Standalone Circle Buttons */}
            <div className="nav-actions" style={{ position: "relative", display: "flex", alignItems: "center", gap: "10px" }}>
              {/* Search Button */}
              <button
                className="nav-glass-circle"
                aria-label="Search"
                title="Search Jerseys"
                onClick={() => setIsSearchModalOpen(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </button>

              {/* Cart Button with Red Notification Dot */}
              <button
                className="nav-glass-circle"
                id="cart-btn"
                aria-label="Shopping cart"
                onClick={onOpenCart}
                title="View Shopping Cart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                {cartCount > 0 && (
                  <span className="nav-cart-count-badge">{cartCount}</span>
                )}
              </button>

              {/* User Profile Container */}
              <div ref={profileContainerRef} style={{ position: "relative", display: "inline-block" }}>
                <button
                  className={`nav-glass-circle nav-icon-desktop ${isProfileOpen ? "active" : ""}`}
                  aria-label="User Account"
                  onClick={handleProfileClick}
                  title={user ? `Logged in as ${user.email}` : "Sign In"}
                >
                  {user ? (
                    <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: isAdmin ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : "#0f172a", color: "#fff", fontSize: "10px", fontWeight: "900", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {userInitials}
                    </div>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  )}
                </button>

                {/* Advanced Profile Dropdown Menu */}
                {user && isProfileOpen && (
                  <>
                    <div
                      className="profile-dropdown-overlay"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="profile-dropdown-menu">
                      {/* Header with Avatar & Online Dot */}
                      <div className="profile-dropdown-header">
                        <div className="profile-avatar-wrapper">
                          <div className="profile-avatar" style={{ background: isAdmin ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : "#0f172a" }}>
                            {userInitials}
                          </div>
                          <div className="profile-online-dot" title="Active Session" />
                        </div>
                        <div className="profile-user-info">
                          <div className="profile-name">{user.name || "User Account"}</div>
                          <div className="profile-email">{user.email}</div>
                          <div className={`profile-role-badge ${isAdmin ? "admin" : "customer"}`}>
                            {isAdmin ? "Administrator" : "VIP Member"}
                          </div>
                        </div>
                      </div>

                      {/* Quick Stats Bar */}
                      <div className="profile-stats-row">
                        <div className="profile-stat-chip">
                          Cart
                          <span>{cartCount} Items</span>
                        </div>
                        <div style={{ width: "1px", background: "#cbd5e1" }} />
                        <div className="profile-stat-chip">
                          Status
                          <span style={{ color: "#16a34a" }}>Active</span>
                        </div>
                      </div>

                      <div className="profile-divider"></div>

                      {/* Action Items List */}
                      <ul className="profile-menu-list">
                        {isAdmin && (
                          <li>
                            <a href="/admin" className="profile-menu-item admin-link">
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
                              <span>Admin Dashboard</span>
                              <span className="badge-admin-pill">ADMIN</span>
                            </a>
                          </li>
                        )}
                        <li>
                          <a href="/orders" className="profile-menu-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                            <span>My Orders & Tracking</span>
                          </a>
                        </li>
                        <li>
                          <a href="/wishlist" className="profile-menu-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                            <span>My Saved Wishlist</span>
                          </a>
                        </li>
                        <li>
                          <button
                            className="profile-menu-item"
                            onClick={() => {
                              setIsProfileOpen(false);
                              setIsProfileModalOpen(true);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            <span>My Profile & Details</span>
                          </button>
                        </li>
                        <li>
                          <button
                            className="profile-menu-item"
                            onClick={handleLogout}
                            style={{ color: "#ef4444" }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
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
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />

      {/* Profile Details Modal */}
      <ProfileDetailsModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onLogout={handleLogout}
      />

      {/* Instant Search Overlay Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  );
}
