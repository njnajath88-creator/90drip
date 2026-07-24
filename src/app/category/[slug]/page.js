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
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
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
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
        onOpenCartFromProfile={() => setIsCartOpen(true)}
      />

      <main style={{ paddingBottom: "80px" }}>
        {/* Category Header Banner */}
        <div style={{ background: "#ffffff", padding: "28px 0 16px" }}>
          <div className="container" style={{ maxWidth: "800px" }}>
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

        {/* Product Catalog Grid (Clean 2-Column Grid) */}
        <div className="container" style={{ maxWidth: "800px" }}>
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "24px 16px"
              }}
            >
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} addToCart={addToCart} />
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
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
      />
    </div>
  );
}
