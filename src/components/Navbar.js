"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import AuthModal from "./AuthModal";

import ProfileDetailsModal from "./ProfileDetailsModal";

export default function Navbar({
  cartCount,
  onOpenCart,
  user,
  setUser,
  solid = false
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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

  return (
    <>
      <nav className="navbar" id="navbar" role="navigation" aria-label="Main navigation">
        <div className="container">
          <div className="navbar-inner">

            {/* Left Links & Mobile Search */}
            <div className="nav-left">
              <ul className="nav-links" role="list">
                <li><a href="/#home">Home</a></li>
                <li><a href="/#categories">Categories</a></li>
                <li><a href="/#shop">Shop</a></li>
                {isAdmin && (
                  <li>
                    <a href="/admin" style={{ color: "#3b82f6", fontWeight: 800 }}>
                      Admin
                    </a>
                  </li>
                )}
              </ul>
              {/* Mobile Profile & Search Icon */}
              <button
                className="nav-icon-btn nav-icon-mobile"
                aria-label="User Account"
                onClick={handleProfileClick}
              >
                {user ? (
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: isAdmin ? "#2563eb" : "#0f172a", color: "#fff", fontSize: "10px", fontWeight: "900", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {userInitials}
                  </div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                )}
              </button>
            </div>

            {/* Center Logo */}
            <a href="/" className="nav-logo" aria-label="90Drip Home">
              <img src="/images/90driplogo.png" alt="90DRIP" className="nav-logo-img" />
            </a>

            {/* Right Action Icons */}
            <div className="nav-actions" style={{ position: "relative" }}>
              <button
                className={`nav-icon-btn nav-icon-desktop ${isProfileOpen ? "active" : ""}`}
                aria-label="User Account"
                onClick={handleProfileClick}
                title={user ? `Logged in as ${user.email}` : "Sign In"}
              >
                {user ? (
                  <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: isAdmin ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : "#0f172a", color: "#fff", fontSize: "11px", fontWeight: "900", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                    {userInitials}
                  </div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                )}
              </button>

              <button
                className="nav-icon-btn"
                id="cart-btn"
                aria-label="Shopping cart"
                onClick={onOpenCart}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
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
                          {isAdmin ? "⚡ Administrator" : "⭐ VIP Member"}
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
                          onClick={() => {
                            setIsProfileOpen(false);
                            if (onOpenCart) onOpenCart();
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                          <span>View My Cart ({cartCount})</span>
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
    </>
  );
}
