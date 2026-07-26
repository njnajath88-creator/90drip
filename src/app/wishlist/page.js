"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getWishlist, removeFromWishlist, clearWishlist } from "@/lib/wishlistStore";
import { addToCart } from "@/lib/cartStore";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    const syncWishlist = () => {
      setWishlist(getWishlist());
    };
    syncWishlist();
    window.addEventListener("90drip_wishlist_updated", syncWishlist);
    return () => window.removeEventListener("90drip_wishlist_updated", syncWishlist);
  }, []);

  const handleMoveToCart = (product) => {
    addToCart(product, "M");
    removeFromWishlist(product.id);
    setToastMsg(`Moved ${product.name} to Cart!`);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear your wishlist?")) {
      setWishlist(clearWishlist());
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Navbar solid={true} user={user} setUser={setUser} />

      <main style={{ paddingTop: "100px", paddingBottom: "100px" }}>
        <div className="container" style={{ maxWidth: "1200px" }}>
          
          {/* Breadcrumb Header */}
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                fontSize: "12px",
                color: "#64748b",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "8px",
              }}
            >
              <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>
                Home
              </Link>
              <span>›</span>
              <span style={{ color: "#0f172a", fontWeight: "800" }}>My Wishlist</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h1
                style={{
                  fontSize: "32px",
                  fontWeight: "900",
                  color: "#0f172a",
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span>Saved Wishlist</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                <span style={{ fontSize: "20px", color: "#64748b" }}>({wishlist.length})</span>
              </h1>

              {wishlist.length > 0 && (
                <button
                  onClick={handleClear}
                  style={{
                    background: "#fef2f2",
                    color: "#ef4444",
                    border: "1px solid #fecaca",
                    padding: "8px 14px",
                    borderRadius: "10px",
                    fontWeight: "800",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  Clear Wishlist
                </button>
              )}
            </div>
          </div>

          {toastMsg && (
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#15803d",
                padding: "12px 18px",
                borderRadius: "12px",
                fontWeight: "800",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                {toastMsg}
              </span>
              <Link href="/cart" style={{ color: "#16a34a", fontWeight: "900" }}>
                View Cart →
              </Link>
            </div>
          )}

          {wishlist.length === 0 ? (
            /* Empty State */
            <div
              style={{
                background: "#ffffff",
                borderRadius: "24px",
                padding: "80px 20px",
                textAlign: "center",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </div>
              <h2 style={{ fontSize: "22px", fontWeight: "900", color: "#0f172a", margin: "0 0 8px" }}>
                Your Wishlist is Empty
              </h2>
              <p style={{ fontSize: "14px", color: "#64748b", maxWidth: "400px", margin: "0 auto 24px" }}>
                Click the heart icon on any jersey to save it here for later.
              </p>
              <Link
                href="/#shop"
                style={{
                  display: "inline-block",
                  background: "linear-gradient(135deg, #0f172a, #1e293b)",
                  color: "#ffffff",
                  padding: "14px 28px",
                  borderRadius: "14px",
                  fontWeight: "800",
                  fontSize: "14px",
                  textDecoration: "none",
                  boxShadow: "0 10px 20px rgba(15, 23, 42, 0.15)",
                }}
              >
                Browse All Jerseys →
              </Link>
            </div>
          ) : (
            /* Wishlist Items Grid */
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "24px",
              }}
            >
              {wishlist.map((product) => (
                <div
                  key={product.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: "20px",
                    padding: "16px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.02)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <ProductCard product={product} />
                  </div>

                  <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                    <button
                      onClick={() => handleMoveToCart(product)}
                      style={{
                        flex: 1,
                        background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                        color: "#ffffff",
                        border: "none",
                        padding: "10px",
                        borderRadius: "10px",
                        fontWeight: "800",
                        fontSize: "13px",
                        cursor: "pointer",
                        boxShadow: "0 4px 10px rgba(37, 99, 235, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                      <span>Move to Cart</span>
                    </button>

                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      style={{
                        background: "#f1f5f9",
                        color: "#64748b",
                        border: "none",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        fontWeight: "800",
                        fontSize: "13px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title="Remove from wishlist"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
