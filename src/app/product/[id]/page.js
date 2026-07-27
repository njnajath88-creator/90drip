"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import CartSidebar from "@/components/CartSidebar";
import {
  getCart,
  addToCart as addToCartStore,
  updateCartQuantity as updateCartStoreQty,
  removeFromCart as removeFromCartStore,
} from "@/lib/cartStore";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

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

  // Sync cart from cartStore
  useEffect(() => {
    const syncCart = () => setCart(getCart());
    syncCart();
    window.addEventListener("90drip_cart_updated", syncCart);
    return () => window.removeEventListener("90drip_cart_updated", syncCart);
  }, []);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        const found = data.find((p) => String(p.id) === String(productId));
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
  }, [productId]);

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
    for (let i = 0; i < qty; i++) {
      addToCartStore(product, selectedSize);
    }
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleMouseMove = (e) => {
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
              <img src="/images/90driplogo.png" alt="90DRIP" className="nav-logo-img" style={{ maxHeight: "28px" }} />
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
              <div className="main-image-container">
                <div
                  className="product-main-card"
                  style={{
                    background: "#ffffff",
                    borderRadius: 22,
                    overflow: "hidden",
                    position: "relative",
                    cursor: isZoomed ? "zoom-out" : "zoom-in",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    aspectRatio: "1 / 1",
                    border: "1px solid #e8e8e2",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  onMouseEnter={() => setIsZoomed(true)}
                  onMouseLeave={() => setIsZoomed(false)}
                  onMouseMove={handleMouseMove}
                >
                  <img
                    src={photos[activePhotoIdx]?.src}
                    alt={`${product.name} - ${photos[activePhotoIdx]?.label}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: isZoomed ? "none" : "opacity 0.3s, transform 0.3s ease-out",
                      transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                      transform: isZoomed ? "scale(1.8)" : "scale(1.05)",
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
                        onClick={() => setActivePhotoIdx((p) => (p === 0 ? photos.length - 1 : p - 1))}
                        style={{
                          position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                          width: 36, height: 36, borderRadius: "50%",
                          background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.15)", zIndex: 2,
                        }}
                        aria-label="Previous"
                      >‹</button>
                      <button
                        onClick={() => setActivePhotoIdx((p) => (p === photos.length - 1 ? 0 : p + 1))}
                        style={{
                          position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                          width: 36, height: 36, borderRadius: "50%",
                          background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.15)", zIndex: 2,
                        }}
                        aria-label="Next"
                      >›</button>
                    </>
                  )}
                </div>
              </div>

              {/* Thumbnails Row */}
              {photos.length > 1 && (
                <div className="thumbnail-strip">
                  {photos.map((photo, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIdx(idx)}
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 12,
                        overflow: "hidden",
                        border: idx === activePhotoIdx ? "2.5px solid #2563eb" : "1.5px solid #e2e8f0",
                        background: "#ffffff",
                        cursor: "pointer",
                        padding: 0,
                        flexShrink: 0,
                        transition: "all 0.2s",
                        boxShadow: idx === activePhotoIdx ? "0 4px 12px rgba(37,99,235,0.2)" : "none",
                      }}
                      title={photo.label}
                    >
                      <img
                        src={photo.src}
                        alt={photo.label}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ─── RIGHT: Product Info ─── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: "900", color: "#2563eb", textTransform: "uppercase", background: "#eff6ff", padding: "4px 10px", borderRadius: "20px" }}>
                  {product.category} • Authentic Match Edition
                </span>
                <h1 style={{ fontSize: "28px", fontWeight: "900", color: "#0f172a", margin: "8px 0 6px", textTransform: "uppercase" }}>
                  {product.name}
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#f59e0b", fontSize: "14px", fontWeight: "800" }}>★★★★★</span>
                  <span style={{ fontSize: "13px", fontWeight: "800", color: "#0f172a" }}>4.9</span>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>({reviews.length} Verified Reviews)</span>
                </div>
              </div>

              {/* Price Row */}
              <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
                <span style={{ fontSize: "26px", fontWeight: "900", color: "#0f172a" }}>
                  ₹{product.price?.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <>
                    <span style={{ fontSize: "16px", color: "#94a3b8", textDecoration: "line-through", fontWeight: "600" }}>
                      ₹{product.originalPrice?.toLocaleString()}
                    </span>
                    <span style={{ fontSize: "12px", fontWeight: "800", color: "#16a34a", background: "#dcfce7", padding: "2px 8px", borderRadius: "6px" }}>
                      Save {discountPct}%
                    </span>
                  </>
                )}
              </div>

              {/* Size Selector */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase" }}>Select Size</label>
                  <span style={{ fontSize: "11px", color: "#2563eb", fontWeight: "700", cursor: "pointer" }}>Size Guide</span>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {(product.sizes || ["S", "M", "L", "XL"]).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      style={{
                        padding: "10px 18px", borderRadius: "10px",
                        border: selectedSize === sz ? "2px solid #2563eb" : "1px solid #cbd5e1",
                        background: selectedSize === sz ? "#eff6ff" : "#ffffff",
                        color: selectedSize === sz ? "#1d4ed8" : "#334155",
                        fontWeight: "800", fontSize: "13px", cursor: "pointer"
                      }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label style={{ fontWeight: 800, fontSize: 13, color: "#0f172a", display: "block", marginBottom: 10, textTransform: "uppercase" }}>Quantity</label>
                <div style={{ display: "flex", alignItems: "center", gap: 0, border: "1.5px solid #e2e8f0", borderRadius: 12, overflow: "hidden", width: "fit-content", background: "#ffffff" }}>
                  <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 44, height: 44, border: "none", background: "#f8fafc", cursor: "pointer", fontSize: 18, fontWeight: 800, color: "#475569" }}>−</button>
                  <span style={{ width: 52, textAlign: "center", fontWeight: 900, fontSize: 16, color: "#0f172a" }}>{qty}</span>
                  <button onClick={() => setQty(qty + 1)} style={{ width: 44, height: 44, border: "none", background: "#f8fafc", cursor: "pointer", fontSize: 18, fontWeight: 800, color: "#475569" }}>+</button>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 6 }}>
                <button
                  onClick={handleAddToCart}
                  style={{
                    padding: "16px 20px", borderRadius: 14, border: "none",
                    background: "#0f172a", color: "#fff", fontWeight: 900, fontSize: 14,
                    cursor: "pointer", transition: "all 0.2s", textTransform: "uppercase",
                    letterSpacing: "0.04em", boxShadow: "0 4px 14px rgba(15,23,42,0.2)",
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                  <span>Add {qty} to Cart — ₹{(product.price * qty).toLocaleString()}</span>
                </button>
                <button
                  onClick={() => { handleAddToCart(); setIsCartOpen(true); }}
                  style={{
                    padding: "16px 20px", borderRadius: 14, border: "none",
                    background: "#2563eb", color: "#fff",
                    fontWeight: 900, fontSize: 14, cursor: "pointer", transition: "all 0.2s",
                    textTransform: "uppercase", letterSpacing: "0.04em",
                    boxShadow: "0 4px 14px rgba(37,99,235,0.3)", width: "100%"
                  }}
                >
                  Buy Now
                </button>
              </div>

              {/* Toast */}
              {addedToast && (
                <div style={{
                  background: "#dcfce7", color: "#15803d", borderRadius: 12,
                  padding: "12px 18px", fontWeight: 800, fontSize: 13,
                  border: "1px solid #bbf7d0", display: "flex", alignItems: "center", gap: 8,
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>{product.name} ({selectedSize}) added to cart!</span>
                </div>
              )}

            </div>
          </div>

          {/* Customer Reviews & Fit Rating Section */}
          <div style={{ marginTop: "60px", paddingTop: "40px", borderTop: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: "900", color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Verified Buyer Reviews
                </span>
                <h2 style={{ fontSize: "24px", fontWeight: "900", color: "#0f172a", margin: "4px 0 0" }}>
                  Customer Ratings & Reviews
                </h2>
              </div>

              <button
                onClick={() => setIsReviewModalOpen(true)}
                style={{
                  background: "#0f172a",
                  color: "#ffffff",
                  padding: "12px 20px",
                  borderRadius: "12px",
                  fontWeight: "800",
                  fontSize: "13px",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                <span>Write a Review</span>
              </button>
            </div>

            {/* Overall Rating & Fit Score Card */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "20px",
                background: "#ffffff",
                borderRadius: "20px",
                padding: "24px",
                border: "1px solid #e2e8f0",
                marginBottom: "32px",
              }}
            >
              <div style={{ textAlign: "center", paddingRight: "20px", borderRight: "1px solid #f1f5f9" }}>
                <div style={{ fontSize: "44px", fontWeight: "900", color: "#0f172a", lineHeight: 1 }}>4.9</div>
                <div style={{ color: "#f59e0b", fontSize: "18px", margin: "6px 0" }}>★★★★★</div>
                <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "700" }}>Based on {reviews.length} ratings</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", justifyCenter: "center", gap: "6px" }}>
                <div style={{ fontSize: "12px", fontWeight: "800", color: "#334155" }}>Fit Rating Summary</div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#16a34a", fontWeight: "800" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>96% of buyers say True to Size</span>
                </div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>Order your standard shirt size for optimal match day fit.</div>
              </div>
            </div>

            {/* Reviews List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    padding: "20px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a" }}>{rev.name}</span>
                        <span style={{ fontSize: "10px", fontWeight: "800", color: "#16a34a", background: "#dcfce7", padding: "2px 8px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          <span>Verified Buyer</span>
                        </span>
                      </div>
                      <div style={{ color: "#f59e0b", fontSize: "12px", marginTop: "2px" }}>
                        {"★".repeat(rev.rating)}
                      </div>
                    </div>
                    <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>{rev.date}</span>
                  </div>

                  <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a", margin: "4px 0" }}>{rev.title}</h4>
                  <p style={{ fontSize: "13px", color: "#475569", margin: 0, lineHeight: 1.5 }}>{rev.comment}</p>
                </div>
              ))}
            </div>

          </div>

        </div>
      </main>

      {/* Write a Review Modal */}
      {isReviewModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(6px)",
            zIndex: 100000,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setIsReviewModalOpen(false)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              padding: "28px",
              maxWidth: "460px",
              width: "100%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: "20px", fontWeight: "900", color: "#0f172a", margin: "0 0 16px" }}>
              Write a Review for {product.name}
            </h2>

            <form onSubmit={handleAddReview} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex M."
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>Star Rating *</label>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none" }}
                >
                  <option value={5}>★★★★★ (5 / 5 - Excellent)</option>
                  <option value={4}>★★★★☆ (4 / 5 - Very Good)</option>
                  <option value={3}>★★★☆☆ (3 / 5 - Average)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>Review Title</label>
                <input
                  type="text"
                  placeholder="e.g. Superb Quality & Fit!"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>Your Review *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share details about the jersey quality, sizing fit, or shipping speed..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", fontFamily: "inherit" }}
                />
              </div>

              <button
                type="submit"
                style={{
                  background: "#2563eb",
                  color: "#ffffff",
                  padding: "14px",
                  borderRadius: "12px",
                  fontWeight: "900",
                  fontSize: "14px",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "6px",
                }}
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={(id, q) => updateCartStoreQty(id, q)}
        removeFromCart={(id) => removeFromCartStore(id)}
      />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .product-detail-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 36px;
          align-items: start;
        }

        .gallery-wrapper {
          display: flex;
          gap: 14px;
        }

        .thumbnail-strip {
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex-shrink: 0;
        }

        .main-image-container {
          flex: 1;
        }

        @media (max-width: 768px) {
          .hide-on-mobile {
            display: none !important;
          }
          .product-detail-layout {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .gallery-wrapper {
            flex-direction: column !important;
          }
          .thumbnail-strip {
            flex-direction: row !important;
            overflow-x: auto;
            padding-bottom: 4px;
          }
          .product-main-card {
            aspect-ratio: 1 / 1 !important;
            max-height: 380px !important;
            width: 100% !important;
            margin: 0 auto !important;
          }
        }
      `}</style>
    </div>
  );
}
