"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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

export default function CategoryPage() {
  const params = useParams();
  const rawSlug = params?.slug || "";
  const slug = String(rawSlug).toLowerCase();

  const categoryInfo = CATEGORY_MAP[slug] || {
    name: rawSlug.replace("-", " ").toUpperCase(),
    description: "Explore our premium collection of authentic sports jerseys.",
    image: "/images/jersey_product1.png",
    badgeColor: "#0f172a"
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products for category:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

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
    (p) =>
      p.category?.toLowerCase() === categoryInfo.name.toLowerCase() ||
      p.sport?.toLowerCase() === categoryInfo.name.toLowerCase() ||
      (slug === "5-sleeve" && p.category === "5 Sleeve")
  );

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff" }}>
      <Navbar
        solid={true}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        user={user}
        setUser={setUser}
      />

      <main style={{ paddingTop: "90px", paddingBottom: "80px" }}>
        {/* Category Header Banner */}
        <div style={{ background: "#ffffff", padding: "28px 0 16px" }}>
          <div className="container" style={{ maxWidth: "1200px" }}>
            {/* Back Button */}
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "14px",
                fontWeight: "700",
                color: "#475569",
                textDecoration: "none",
                marginBottom: "20px"
              }}
            >
              <span style={{ fontSize: "16px" }}>←</span>
              <span>Back</span>
            </Link>

            <div style={{ marginBottom: "16px" }}>
              <h1 style={{ fontSize: "32px", fontWeight: "900", color: "#0f172a", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                {categoryInfo.name}
              </h1>
              <p style={{ fontSize: "14px", color: "#64748b", margin: 0, fontWeight: "600" }}>
                {categoryProducts.length} Products Found
              </p>
            </div>
          </div>
        </div>

        {/* Product Catalog Grid (4 Columns on PC, 2 Columns on Mobile) */}
        <div className="container" style={{ maxWidth: "1200px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>
              Loading {categoryInfo.name} collection...
            </div>
          ) : categoryProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", background: "#f8fafc", borderRadius: "20px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "44px", marginBottom: "12px" }}>👕</div>
              <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: "0 0 8px" }}>
                No Products Found in {categoryInfo.name}
              </h3>
              <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px" }}>
                Check back soon or explore other categories in our store.
              </p>
              <Link href="/" className="btn-primary" style={{ textDecoration: "none" }}>
                Explore All Products
              </Link>
            </div>
          ) : (
            <div className="products-grid-responsive">
              {categoryProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} addToCart={handleAddToCart} index={idx} />
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
