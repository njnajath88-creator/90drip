"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

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
          <div style={{ width: 48, height: 48, border: "4px solid #e2e8f0", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "#64748b", fontWeight: 500 }}>Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>Product Not Found</h2>
        <p style={{ color: "#64748b" }}>This jersey could not be found.</p>
        <Link href="/" className="btn-primary">Back to Shop</Link>
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
    const cartItem = { ...product, selectedSize, quantity: qty };
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.id === product.id && i.selectedSize === selectedSize
      );
      if (existing) {
        return prev.map((i) =>
          i.id === product.id && i.selectedSize === selectedSize
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [...prev, cartItem];
    });
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
      {/* Sticky Navbar */}
      <nav className="navbar scrolled" id="navbar" style={{ position: "sticky", top: 0, zIndex: 1000, background: "#ffffff" }}>
        <div className="container">
          <div className="navbar-inner">
            <div className="nav-left">
              <Link href="/" style={{ display: "flex", alignItems: "center", gap: 6, color: "#0f172a", textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                </svg>
                Back to Store
              </Link>
            </div>
            <Link href="/" className="nav-logo">
              <img src="/images/90driplogo.png" alt="90DRIP" className="nav-logo-img" />
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

      <main style={{ padding: "28px 0 60px" }}>
        <div className="container">

          {/* Breadcrumb */}
          <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>
            <Link href="/" style={{ color: "#94a3b8", textDecoration: "none" }}>Home</Link>
            <span>›</span>
            <Link href="/#shop" style={{ color: "#94a3b8", textDecoration: "none" }}>Jerseys</Link>
            <span>›</span>
            <span style={{ color: "#0f172a", fontWeight: 600 }}>{product.name}</span>
          </div>

          {/* Product Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>

            {/* ─── LEFT: Image Gallery ─── */}
            <div style={{ display: "flex", gap: 14 }}>

              {/* Vertical Thumbnail Strip */}
              {photos.length > 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
                  {photos.map((photo, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIdx(idx)}
                      style={{
                        width: 72,
                        height: 80,
                        borderRadius: 10,
                        overflow: "hidden",
                        border: idx === activePhotoIdx ? "2.5px solid #2563eb" : "2px solid #e2e8f0",
                        background: "#fff",
                        cursor: "pointer",
                        padding: 0,
                        transition: "border-color 0.2s, transform 0.15s",
                        transform: idx === activePhotoIdx ? "scale(1.05)" : "scale(1)",
                        boxShadow: idx === activePhotoIdx ? "0 4px 12px rgba(37,99,235,0.2)" : "none",
                      }}
                      title={photo.label}
                    >
                      <img
                        src={photo.src}
                        alt={photo.label}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <div style={{ flex: 1, position: "relative" }}>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 18,
                    overflow: "hidden",
                    position: "relative",
                    cursor: isZoomed ? "zoom-out" : "zoom-in",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                    aspectRatio: "3/4",
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
                      transition: isZoomed ? "none" : "opacity 0.3s",
                      transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                      transform: isZoomed ? "scale(1.8)" : "scale(1)",
                      display: "block",
                    }}
                  />

                  {/* View label badge */}
                  <div style={{
                    position: "absolute", bottom: 14, left: 14,
                    background: "rgba(0,0,0,0.65)", color: "#fff",
                    fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
                    padding: "4px 10px", borderRadius: 20, backdropFilter: "blur(4px)",
                  }}>
                    {photos[activePhotoIdx]?.label} · {activePhotoIdx + 1}/{photos.length}
                  </div>

                  {/* Badges */}
                  <div style={{ position: "absolute", top: 14, left: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                    {(product.badges || []).map((badge) => (
                      <span key={badge} className={`product-badge badge-${badge.toLowerCase()}`}>{badge}</span>
                    ))}
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

                {/* Dot indicators */}
                {photos.length > 1 && (
                  <div style={{ display: "flex", justifyContent: "center", gap: 7, marginTop: 12 }}>
                    {photos.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActivePhotoIdx(idx)}
                        style={{
                          width: idx === activePhotoIdx ? 22 : 7,
                          height: 7,
                          borderRadius: 4,
                          background: idx === activePhotoIdx ? "#2563eb" : "#cbd5e1",
                          border: "none",
                          cursor: "pointer",
                          transition: "all 0.25s",
                          padding: 0,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ─── RIGHT: Product Info ─── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Tags */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ background: "#eff6ff", color: "#2563eb", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, letterSpacing: "0.04em" }}>
                  {product.sport}
                </span>
                <span style={{ background: "#f1f5f9", color: "#475569", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20 }}>
                  {product.category}
                </span>
              </div>

              {/* Name */}
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", lineHeight: 1.2, margin: 0 }}>
                {product.name}
              </h1>

              {/* Price */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 32, fontWeight: 800, color: "#0f172a" }}>₹{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <>
                    <span style={{ fontSize: 18, color: "#94a3b8", textDecoration: "line-through" }}>₹{product.originalPrice.toLocaleString()}</span>
                    <span style={{ background: "#dcfce7", color: "#16a34a", fontSize: 13, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>
                      {discountPct}% OFF
                    </span>
                  </>
                )}
              </div>

              <p style={{ color: "#64748b", lineHeight: 1.7, margin: 0, fontSize: 14 }}>
                Official premium match-quality jersey. Sweat-wicking performance mesh, ultra-lightweight fabric, and heat-applied crest for maximum comfort on and off the pitch.
              </p>

              <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: 0 }} />

              {/* Size Selection */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <label style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Select Size</label>
                  <span style={{ fontSize: 12, color: "#2563eb", fontWeight: 600, cursor: "pointer" }}>📏 Size Guide</span>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(product.sizes || ["S", "M", "L", "XL"]).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        width: 52, height: 52, borderRadius: 10, fontWeight: 700,
                        fontSize: 13, cursor: "pointer", transition: "all 0.2s",
                        border: selectedSize === size ? "2.5px solid #2563eb" : "2px solid #e2e8f0",
                        background: selectedSize === size ? "#eff6ff" : "#fff",
                        color: selectedSize === size ? "#2563eb" : "#475569",
                        boxShadow: selectedSize === size ? "0 4px 12px rgba(37,99,235,0.2)" : "none",
                        transform: selectedSize === size ? "scale(1.05)" : "scale(1)",
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", display: "block", marginBottom: 10 }}>Quantity</label>
                <div style={{ display: "flex", alignItems: "center", gap: 0, border: "2px solid #e2e8f0", borderRadius: 12, overflow: "hidden", width: "fit-content" }}>
                  <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 44, height: 44, border: "none", background: "#f8fafc", cursor: "pointer", fontSize: 18, fontWeight: 700, color: "#475569" }}>−</button>
                  <span style={{ width: 52, textAlign: "center", fontWeight: 800, fontSize: 16, color: "#0f172a" }}>{qty}</span>
                  <button onClick={() => setQty(qty + 1)} style={{ width: 44, height: 44, border: "none", background: "#f8fafc", cursor: "pointer", fontSize: 18, fontWeight: 700, color: "#475569" }}>+</button>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button
                  onClick={handleAddToCart}
                  style={{
                    padding: "16px 24px", borderRadius: 14, border: "2.5px solid #0f172a",
                    background: "#0f172a", color: "#fff", fontWeight: 800, fontSize: 15,
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#1e293b"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#0f172a"; }}
                >
                  🛒 Add {qty} to Cart — ₹{(product.price * qty).toLocaleString()}
                </button>
                <button
                  onClick={() => { handleAddToCart(); setIsCartOpen(true); }}
                  style={{
                    padding: "16px 24px", borderRadius: 14, border: "none",
                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "#fff",
                    fontWeight: 800, fontSize: 15, cursor: "pointer", transition: "all 0.2s",
                    boxShadow: "0 4px 14px rgba(37,99,235,0.4)",
                  }}
                >
                  ⚡ Buy Now
                </button>
              </div>

              {/* Toast */}
              {addedToast && (
                <div style={{
                  background: "#dcfce7", color: "#15803d", borderRadius: 12,
                  padding: "12px 18px", fontWeight: 700, fontSize: 14,
                  border: "1px solid #bbf7d0", display: "flex", alignItems: "center", gap: 8,
                }}>
                  ✓ {product.name} ({selectedSize}) added to cart!
                </div>
              )}

              {/* Specs */}
              <div style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1px solid #f1f5f9", marginTop: 4 }}>
                <h3 style={{ fontWeight: 800, fontSize: 14, color: "#0f172a", margin: "0 0 12px" }}>Product Specifications</h3>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    ["Fit", "Athletic Slim Fit"],
                    ["Material", "100% Recycled Breathability Polyester"],
                    ["Technology", "Dri-FIT Moisture Wicking"],
                    ["Crest", "Heat-sealed Official Team Crest"],
                    ["Care", "Machine Wash Cold, Line Dry"],
                  ].map(([key, val]) => (
                    <li key={key} style={{ display: "flex", gap: 8, fontSize: 13, color: "#475569" }}>
                      <strong style={{ color: "#0f172a", minWidth: 80 }}>{key}:</strong>
                      <span>{val}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* All Photos Strip at Bottom */}
          {photos.length > 1 && (
            <div style={{ marginTop: 48 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>All Photos</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
                {photos.map((photo, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActivePhotoIdx(idx);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    style={{
                      position: "relative", borderRadius: 14, overflow: "hidden",
                      aspectRatio: "3/4", border: idx === activePhotoIdx ? "3px solid #2563eb" : "2px solid #e2e8f0",
                      background: "#fff", cursor: "pointer", padding: 0,
                      boxShadow: idx === activePhotoIdx ? "0 4px 16px rgba(37,99,235,0.25)" : "0 2px 8px rgba(0,0,0,0.06)",
                      transition: "all 0.2s",
                    }}
                  >
                    <img
                      src={photo.src}
                      alt={photo.label}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                      padding: "20px 10px 10px",
                    }}>
                      <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em" }}>
                        {photo.label}
                      </span>
                    </div>
                    {idx === activePhotoIdx && (
                      <div style={{
                        position: "absolute", top: 8, right: 8,
                        background: "#2563eb", borderRadius: "50%", width: 22, height: 22,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Cart Sidebar */}
      {isCartOpen && <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />}
      <aside className={`cart-sidebar ${isCartOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2 className="cart-title">Your Cart</h2>
          <button className="cart-close" onClick={() => setIsCartOpen(false)}>✕</button>
        </div>
        <div className="cart-items">
          {cart.length === 0 ? (
            <p style={{ textAlign: "center", marginTop: "2rem", color: "#64748b" }}>Your cart is empty.</p>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-details">
                  <div className="cart-item-title">{item.name}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>Size: {item.selectedSize}</div>
                  <div className="cart-item-price">₹{item.price}</div>
                  <div className="cart-qty-controls">
                    <button className="qty-btn" onClick={() => setCart(prev => prev.map((it, i) => i === idx ? { ...it, quantity: Math.max(1, it.quantity - 1) } : it))}>-</button>
                    <span>{item.quantity}</span>
                    <button className="qty-btn" onClick={() => setCart(prev => prev.map((it, i) => i === idx ? { ...it, quantity: it.quantity + 1 } : it))}>+</button>
                  </div>
                </div>
                <button className="remove-item" onClick={() => setCart(prev => prev.filter((_, i) => i !== idx))}>🗑️</button>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <button className="btn-primary btn-checkout" onClick={() => alert("Checkout not implemented yet!")}>Checkout</button>
          </div>
        )}
      </aside>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .product-detail-grid-responsive { grid-template-columns: 1fr !important; }
          .product-photos-strip { grid-template-columns: repeat(2, 1fr) !important; }
          .product-thumb-strip { flex-direction: row !important; overflow-x: auto; }
        }
      `}</style>
    </div>
  );
}
