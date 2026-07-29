"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import CartSidebar from "@/components/CartSidebar";
import Footer from "@/components/Footer";

const CATEGORY_MAP = {
  "full-sleeve": {
    name: "Full Sleeve",
    description: "Long sleeve match kits, player editions & training wear for maximum style and coverage.",
    image: "/images/cat_full_sleeve.png",
    badgeColor: "#2563eb"
  },
  "half-sleeve": {
    name: "Half Sleeve",
    description: "Classic short sleeve fan & player jerseys built for breathability and game-day performance.",
    image: "/images/cat_half_sleeve.png",
    badgeColor: "#2563eb"
  },
  "5-sleeve": {
    name: "Five Sleeve",
    description: "Oversized streetwear & 3/4 sleeve fit jerseys designed for modern athletic street culture.",
    image: "/images/cat_5_sleeve.png",
    badgeColor: "#2563eb"
  },
  "retro": {
    name: "Retro",
    description: "Iconic vintage & classic heritage football kits celebrating legendary eras of the game.",
    image: "/images/cat_retro.png",
    badgeColor: "#f59e0b"
  }
};

import {
  getCart,
  addToCart as addToCartStore,
  updateCartQuantity as updateCartStoreQty,
  removeFromCart as removeFromCartStore,
} from "@/lib/cartStore";

export default function CategoryPageClient({ slug = "", initialProducts = [] }) {
  const categoryInfo = CATEGORY_MAP[slug] || {
    name: slug ? slug.replace("-", " ").toUpperCase() : "COLLECTION",
    description: "Explore our premium collection of authentic sports jerseys.",
    image: "/images/jersey_product1.png",
    badgeColor: "#0f172a"
  };

  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(initialProducts.length === 0);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Sync cart from cartStore
  useEffect(() => {
    const syncCart = () => setCart(getCart());
    syncCart();
    window.addEventListener("90drip_cart_updated", syncCart);
    return () => window.removeEventListener("90drip_cart_updated", syncCart);
  }, []);

  // Background fallback if initialProducts was empty
  useEffect(() => {
    if (products.length > 0) return;
    async function loadProducts() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products?t=${Date.now()}`, { cache: "no-store" });
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products for category:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [products]);

  const handleAddToCart = (product, selectedSize = "M") => {
    addToCartStore(product, selectedSize);
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (cartItemId) => {
    removeFromCartStore(cartItemId);
  };

  const handleUpdateQuantity = (cartItemId, newQuantity) => {
    updateCartStoreQty(cartItemId, newQuantity);
  };

  const categoryProducts = products.filter(
    (p) => p.category?.toLowerCase().replace(/\s+/g, "-") === slug
  );

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Navbar solid={true} cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} user={user} setUser={setUser} />

      <main style={{ paddingTop: "100px", paddingBottom: "100px" }}>
        <div className="container" style={{ maxWidth: "1200px" }}>
          
          {/* Breadcrumbs */}
          <div
            style={{
              fontSize: "12px",
              color: "#64748b",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "20px",
            }}
          >
            <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>
              Home
            </Link>
            <span>›</span>
            <span style={{ color: "#64748b" }}>Categories</span>
            <span>›</span>
            <span style={{ color: "#0f172a", fontWeight: "800" }}>{categoryInfo.name}</span>
          </div>

          {/* Category Banner Header */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              padding: "36px",
              border: "1px solid #e2e8f0",
              marginBottom: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "30px",
              flexWrap: "wrap",
              boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ flex: 1, minWidth: "280px", zIndex: 2 }}>
              <div
                style={{
                  display: "inline-block",
                  background: categoryInfo.badgeColor,
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: "900",
                  letterSpacing: "0.08em",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                Collection
              </div>
              <h1
                style={{
                  fontSize: "36px",
                  fontWeight: "900",
                  color: "#0f172a",
                  margin: "0 0 10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                }}
              >
                {categoryInfo.name} Jerseys
              </h1>
              <p
                style={{
                  fontSize: "14px",
                  color: "#64748b",
                  margin: 0,
                  fontWeight: "600",
                  maxWidth: "540px",
                  lineHeight: "1.6",
                }}
              >
                {categoryInfo.description}
              </p>
            </div>

            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "20px",
                overflow: "hidden",
                background: "#f1f5f9",
                border: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <img
                src={categoryInfo.image}
                alt={categoryInfo.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>

          {/* Section Sub-header */}
          <div
            style={{
              display: "flex",
              justify: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "900",
                color: "#0f172a",
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Available Jerseys ({categoryProducts.length})
            </h2>
          </div>

          {/* Category Products Grid */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#64748b" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  border: "4px solid #e2e8f0",
                  borderTopColor: "#2563eb",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  margin: "0 auto 16px",
                }}
              />
              <p style={{ fontWeight: "700" }}>Loading {categoryInfo.name} jerseys...</p>
            </div>
          ) : categoryProducts.length === 0 ? (
            <div
              style={{
                background: "#ffffff",
                borderRadius: "24px",
                padding: "60px 20px",
                textAlign: "center",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "900", color: "#0f172a", margin: "0 0 6px" }}>
                No {categoryInfo.name} jerseys found
              </h3>
              <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 20px" }}>
                Check back soon or explore our full collection of match kits.
              </p>
              <Link href="/#shop" className="btn-primary" style={{ textDecoration: "none" }}>
                Browse All Jerseys
              </Link>
            </div>
          ) : (
            <div className="products-grid-responsive">
              {categoryProducts.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={handleAddToCart}
                  index={idx}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={handleUpdateQuantity}
        removeFromCart={handleRemoveFromCart}
      />

      <style>{`
        .products-grid-responsive {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px 18px;
        }

        @media (max-width: 1024px) {
          .products-grid-responsive {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .products-grid-responsive {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px 14px;
          }
        }
      `}</style>
    </div>
  );
}
