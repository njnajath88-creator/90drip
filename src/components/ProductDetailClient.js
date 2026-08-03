"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import AuthModal from "@/components/AuthModal";
import CartSidebar from "@/components/CartSidebar";
import {
  getCart,
  addToCart as addToCartStore,
  updateCartQuantity as updateCartStoreQty,
  removeFromCart as removeFromCartStore,
} from "@/lib/cartStore";
import { requireAuth } from "@/lib/authUtils";

export default function ProductDetailClient({ productId, initialProduct = null, allProducts = [] }) {
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(!initialProduct);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(initialProduct?.sizes?.[0] || "M");
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("90drip_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error("Failed to load user state:", e);
    }
  }, []);

  // Detect touch device to disable image zoom on mobile
  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  // Listen for global open auth modal request
  useEffect(() => {
    const handleOpenAuth = () => {
      setIsAuthModalOpen(true);
    };
    window.addEventListener("90drip_open_auth_modal", handleOpenAuth);
    return () => window.removeEventListener("90drip_open_auth_modal", handleOpenAuth);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem("90drip_user", JSON.stringify(userData));
    } catch (e) {
      console.error("Failed to save user state:", e);
    }
  };

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", rating: 5, title: "", comment: "" });
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Marcus V.",
      rating: 5,
      date: "2 days ago",
      title: "Phenomenal Quality & Stitching",
      comment: "The authentic match fabric feels incredible. Breathable, sleek fit, and the badge details are top tier. Will definitely buy again!"
    },
    {
      id: 2,
      name: "Liam K.",
      rating: 5,
      date: "1 week ago",
      title: "Spot on sizing and super fast delivery",
      comment: "Ordered an M and it fits like a glove. The printing on the back looks official and sharp."
    },
    {
      id: 3,
      name: "Rohan S.",
      rating: 4,
      date: "2 weeks ago",
      title: "Great jersey for matchdays",
      comment: "Premium fabric, lightweight, feels great during intense football sessions."
    }
  ]);

  // Sync cart from cartStore
  useEffect(() => {
    const syncCart = () => setCart(getCart());
    syncCart();
    window.addEventListener("90drip_cart_updated", syncCart);
    return () => window.removeEventListener("90drip_cart_updated", syncCart);
  }, []);

  // Background fallback if initialProduct was null
  useEffect(() => {
    if (product) return;
    async function loadProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products?t=${Date.now()}`, { cache: "no-store" });
        const data = await res.json();
        const found = data.find((p) => String(p.id) === String(productId) || String(p._id) === String(productId));
        if (found) {
          setProduct(found);
          setSelectedSize(found.sizes?.[0] || "M");
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    }
    if (productId) loadProduct();
  }, [productId, product]);

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;
    const reviewToAdd = {
      id: Date.now(),
      name: newReview.name,
      rating: Number(newReview.rating),
      date: "Just now",
      title: newReview.title || "Great product!",
      comment: newReview.comment
    };
    setReviews([reviewToAdd, ...reviews]);
    setNewReview({ name: "", rating: 5, title: "", comment: "" });
    setIsReviewModalOpen(false);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 44, height: 44, border: "4px solid #e2e8f0", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "#64748b", fontWeight: 600 }}>Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "20px" }}>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Product Not Found</h2>
        <p style={{ color: "#64748b" }}>This jersey could not be found.</p>
        <Link href="/" className="btn-primary" style={{ textDecoration: "none" }}>Back to Shop</Link>
      </div>
    );
  }

  const photos = [
    { src: product.image, label: "Front" },
    { src: product.backImage, label: "Rear" },
    { src: product.closeupImage, label: "Close-up" },
    { src: product.fitImage, label: "Fit Shot" },
  ].filter((p) => Boolean(p.src));

  const cartTotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);
  const cartCount = cart.reduce((t, i) => t + i.quantity, 0);

  const handleAddToCart = () => {
    if (!requireAuth()) return;
    for (let i = 0; i < qty; i++) {
      addToCartStore(product, selectedSize);
    }
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleMouseEnter = () => {
    if (typeof window !== "undefined" && (window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 768)) {
      return;
    }
    setIsZoomed(true);
  };

  const handleMouseMove = (e) => {
    if (typeof window !== "undefined" && (window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 768)) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const discountPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* Responsive Navbar */}
      <nav className="navbar scrolled" id="navbar" style={{ position: "sticky", top: 0, zIndex: 1000, background: "#ffffff" }}>
        <div className="container">
          <div className="navbar-inner" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div className="nav-left">
              <Link href="/" style={{ display: "flex", alignItems: "center", gap: 6, color: "#0f172a", textDecoration: "none", fontWeight: 800, fontSize: 13 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                </svg>
                <span className="hide-on-mobile">Back to Store</span>
              </Link>
            </div>
            <Link href="/" className="nav-logo">
              <Image src="/images/90driplogo.png" alt="90DRIP" width={240} height={64} priority className="nav-logo-img" style={{ height: "54px", maxHeight: "60px", width: "auto", objectFit: "contain" }} />
            </Link>
            <div className="nav-actions">
              <button className="nav-icon-btn" onClick={() => setIsCartOpen(true)} aria-label="Cart">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main style={{ padding: "20px 0 60px" }}>
        <div className="container">

          {/* Breadcrumb */}
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <Link href="/" style={{ color: "#94a3b8", textDecoration: "none" }}>Home</Link>
            <span>›</span>
            <Link href="/#shop" style={{ color: "#94a3b8", textDecoration: "none" }}>Jerseys</Link>
            <span>›</span>
            <span style={{ color: "#0f172a", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px" }}>{product.name}</span>
          </div>

          {/* Product Grid */}
          <div className="product-detail-layout">

            {/* ─── LEFT: Image Gallery ─── */}
            <div className="gallery-wrapper">

              {/* Main Image Display Container */}
              <div className="main-image-container" style={{ aspectRatio: "4 / 5", width: "100%", borderRadius: 22, overflow: "hidden", border: "1px solid #e8e8e2" }}>
                <div
                  className="product-main-card"
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "#ffffff",
                    position: "relative",
                    cursor: isTouchDevice ? "default" : (isZoomed ? "zoom-out" : "zoom-in"),
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                  onTouchStart={() => setIsZoomed(false)}
                  onMouseLeave={() => setIsZoomed(false)}
                >
                  <Image
                    src={photos[activePhotoIdx]?.src || "/images/jersey_product1.png"}
                    alt={`${product.name} - ${photos[activePhotoIdx]?.label}`}
                    width={800}
                    height={1000}
                    priority
                    sizes="(max-width: 900px) 100vw, 50vw"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "top center",
                      transition: "opacity 0.3s",
                      transform: (isZoomed && !isTouchDevice) ? "scale(1.8)" : "scale(1)",
                      display: "block"
                    }}
                  />

                  {/* View label badge */}
                  <div style={{
                    position: "absolute", bottom: 12, left: 12,
                    background: "rgba(15,23,42,0.75)", color: "#fff",
                    fontSize: 10, fontWeight: 800, letterSpacing: "0.06em",
                    padding: "4px 10px", borderRadius: 20, backdropFilter: "blur(4px)",
                    textTransform: "uppercase"
                  }}>
                    {photos[activePhotoIdx]?.label} · {activePhotoIdx + 1}/{photos.length}
                  </div>

                  {/* Prev / Next arrows */}
                  {photos.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); setActivePhotoIdx((p) => (p === 0 ? photos.length - 1 : p - 1)); }}
                        style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", zIndex: 10 }}
                      >
                        ‹
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setActivePhotoIdx((p) => (p === photos.length - 1 ? 0 : p + 1)); }}
                        style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", zIndex: 10 }}
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Thumbnails Row */}
              {photos.length > 1 && (
                <div style={{ display: "flex", gap: 10, marginTop: 12, overflowX: "auto", paddingBottom: 4 }}>
                  {photos.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIdx(idx)}
                      style={{
                        border: activePhotoIdx === idx ? "2.5px solid #2563eb" : "1.5px solid #e2e8f0",
                        borderRadius: 12,
                        padding: 2,
                        background: "#fff",
                        cursor: "pointer",
                        width: 64, height: 64,
                        overflow: "hidden",
                        flexShrink: 0,
                        transition: "all 0.2s"
                      }}
                    >
                      <Image src={p.src} alt={p.label} width={64} height={64} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", borderRadius: 8 }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ─── RIGHT: Product Info ─── */}
            <div className="product-info-wrapper" style={{ padding: "4px 0" }}>

              {/* Badges */}
              {(product.badges?.length > 0 || product.sport) && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                  {product.badges?.map((b, i) => (
                    <span key={i} style={{ background: b.toLowerCase() === "sale" ? "#fef2f2" : "#f1f5f9", color: b.toLowerCase() === "sale" ? "#ef4444" : "#475569", fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {b}
                    </span>
                  ))}
                  {product.sport && (
                    <span style={{ background: "#f1f5f9", color: "#475569", fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {product.sport}
                    </span>
                  )}
                </div>
              )}

              {/* Name */}
              <h1 style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.02em", lineHeight: 1.2 }}>
                {product.name}
              </h1>

              {/* Price */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 28 }}>
                <span style={{ fontSize: 26, fontWeight: 900, color: "#0f172a" }}>₹{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <>
                    <span style={{ fontSize: 15, color: "#94a3b8", textDecoration: "line-through", fontWeight: 600 }}>₹{product.originalPrice.toLocaleString()}</span>
                    <span style={{ fontSize: 12, fontWeight: 900, color: "#16a34a" }}>{discountPct}% off</span>
                  </>
                )}
              </div>

              {/* Size Selector */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 11, fontWeight: 900, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 10 }}>Size</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(product.sizes || ["S", "M", "L", "XL"]).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      style={{
                        padding: "9px 18px",
                        borderRadius: 8,
                        border: selectedSize === sz ? "2px solid #0f172a" : "1.5px solid #e2e8f0",
                        background: selectedSize === sz ? "#0f172a" : "#ffffff",
                        color: selectedSize === sz ? "#ffffff" : "#475569",
                        fontWeight: 800,
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #e2e8f0", borderRadius: 10, overflow: "hidden" }}>
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: 38, height: 46, border: "none", background: "transparent", fontWeight: 900, fontSize: 18, cursor: "pointer", color: "#0f172a" }}>−</button>
                  <span style={{ padding: "0 14px", fontWeight: 900, fontSize: 14, color: "#0f172a" }}>{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} style={{ width: 38, height: 46, border: "none", background: "transparent", fontWeight: 900, fontSize: 18, cursor: "pointer", color: "#0f172a" }}>+</button>
                </div>
                <button
                  onClick={handleAddToCart}
                  style={{
                    flex: 1,
                    minWidth: 160,
                    padding: "14px 20px",
                    borderRadius: 10,
                    border: "none",
                    background: "#0f172a",
                    color: "#ffffff",
                    fontWeight: 900,
                    fontSize: 14,
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Add to Cart · ₹{(product.price * qty).toLocaleString()}
                </button>
              </div>

              {addedToast && (
                <div style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", padding: "10px 14px", borderRadius: 8, fontSize: 13, fontWeight: 700, marginTop: 14 }}>
                  ✓ Added to cart!
                </div>
              )}

            </div>


          </div>

          {/* Reviews Section */}
          <div style={{ marginTop: 60, background: "#ffffff", padding: 32, borderRadius: 22, border: "1px solid #e8e8e2" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: "#0f172a", margin: 0 }}>Customer Reviews</h3>
                <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0", fontWeight: 600 }}>Verified purchaser ratings & feedback</p>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                style={{ padding: "10px 18px", borderRadius: 10, border: "1.5px solid #0f172a", background: "#0f172a", color: "#ffffff", fontWeight: 900, fontSize: 13, cursor: "pointer" }}
              >
                Write A Review
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              {reviews.map((r) => (
                <div key={r.id} style={{ background: "#f8fafc", padding: 20, borderRadius: 16, border: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontWeight: 800, fontSize: 14, color: "#0f172a" }}>{r.name}</span>
                    <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{r.date}</span>
                  </div>
                  <div style={{ color: "#f59e0b", fontSize: 14, marginBottom: 6 }}>{"★".repeat(r.rating)}</div>
                  <div style={{ fontWeight: 800, fontSize: 13, color: "#0f172a", marginBottom: 4 }}>{r.title}</div>
                  <p style={{ fontSize: 12, color: "#64748b", margin: 0, lineHeight: 1.5, fontWeight: 500 }}>{r.comment}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#ffffff", width: "100%", maxWidth: 460, borderRadius: 20, padding: 28, position: "relative" }}>
            <h3 style={{ fontSize: 18, fontWeight: 900, margin: "0 0 16px" }}>Write A Review</h3>
            <form onSubmit={handleAddReview} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input
                type="text"
                placeholder="Your Name"
                value={newReview.name}
                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                required
                style={{ padding: 12, borderRadius: 10, border: "1.5px solid #cbd5e1", fontSize: 13 }}
              />
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                style={{ padding: 12, borderRadius: 10, border: "1.5px solid #cbd5e1", fontSize: 13 }}
              >
                <option value={5}>5 Stars ★★★★★</option>
                <option value={4}>4 Stars ★★★★☆</option>
                <option value={3}>3 Stars ★★★☆☆</option>
              </select>
              <input
                type="text"
                placeholder="Review Title"
                value={newReview.title}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                style={{ padding: 12, borderRadius: 10, border: "1.5px solid #cbd5e1", fontSize: 13 }}
              />
              <textarea
                placeholder="Write your review comments..."
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                required
                rows={4}
                style={{ padding: 12, borderRadius: 10, border: "1.5px solid #cbd5e1", fontSize: 13 }}
              />
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 10 }}>
                <button type="button" onClick={() => setIsReviewModalOpen(false)} style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid #cbd5e1", background: "#fff", fontWeight: 700 }}>Cancel</button>
                <button type="submit" style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "#2563eb", color: "#fff", fontWeight: 900 }}>Submit Review</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={(id, q) => updateCartStoreQty(id, q)}
        removeFromCart={(id) => removeFromCartStore(id)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}
