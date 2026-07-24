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

              {/* Main Image Display Container (objectFit: contain so zero image cropping) */}
              <div className="main-image-container">
                <div
                  style={{
                    background: "#f4f4f0",
                    borderRadius: 22,
                    overflow: "hidden",
                    position: "relative",
                    cursor: isZoomed ? "zoom-out" : "zoom-in",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    aspectRatio: "3/4",
                    border: "1px solid #e8e8e2",
                    padding: "16px",
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
                      objectFit: "contain",
                      transition: isZoomed ? "none" : "opacity 0.3s",
                      transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                      transform: isZoomed ? "scale(1.8)" : "scale(1)",
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
                        height: 72,
                        borderRadius: 12,
                        overflow: "hidden",
                        border: idx === activePhotoIdx ? "2.5px solid #2563eb" : "1.5px solid #e2e8f0",
                        background: "#f4f4f0",
                        cursor: "pointer",
                        padding: 4,
                        flexShrink: 0,
                        transition: "all 0.2s",
                        boxShadow: idx === activePhotoIdx ? "0 4px 12px rgba(37,99,235,0.2)" : "none",
                      }}
                      title={photo.label}
                    >
                      <img
                        src={photo.src}
                        alt={photo.label}
                        style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ─── RIGHT: Product Info ─── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              {/* Tags */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ background: "#eff6ff", color: "#2563eb", fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  {product.sport}
                </span>
                <span style={{ background: "#f1f5f9", color: "#475569", fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 6, textTransform: "uppercase" }}>
                  {product.category}
                </span>
              </div>

              {/* Name */}
              <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", lineHeight: 1.25, margin: 0, textTransform: "uppercase" }}>
                {product.name}
              </h1>

              {/* Price */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: "#0f172a" }}>₹{product.price?.toLocaleString()}</span>
                {product.originalPrice && (
                  <>
                    <span style={{ fontSize: 16, color: "#94a3b8", textDecoration: "line-through", fontWeight: 600 }}>₹{product.originalPrice.toLocaleString()}</span>
                    <span style={{ background: "#dcfce7", color: "#16a34a", fontSize: 12, fontWeight: 800, padding: "3px 8px", borderRadius: 6 }}>
                      {discountPct}% OFF
                    </span>
                  </>
                )}
              </div>

              <p style={{ color: "#64748b", lineHeight: 1.6, margin: 0, fontSize: 13, fontWeight: 500 }}>
                Official premium match-quality jersey. Sweat-wicking performance mesh, ultra-lightweight fabric, and heat-applied crest for maximum comfort on and off the pitch.
              </p>

              <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: 0 }} />

              {/* Size Selection */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <label style={{ fontWeight: 800, fontSize: 13, color: "#0f172a", textTransform: "uppercase" }}>Select Size</label>
                  <span style={{ fontSize: 12, color: "#2563eb", fontWeight: 700, cursor: "pointer" }}>📏 Size Guide</span>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(product.sizes || ["S", "M", "L", "XL"]).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        minWidth: 48, height: 48, borderRadius: 10, fontWeight: 800,
                        fontSize: 13, cursor: "pointer", transition: "all 0.2s",
                        border: selectedSize === size ? "2.5px solid #0f172a" : "1.5px solid #e2e8f0",
                        background: selectedSize === size ? "#0f172a" : "#fff",
                        color: selectedSize === size ? "#ffffff" : "#475569",
                        boxShadow: selectedSize === size ? "0 4px 12px rgba(15,23,42,0.18)" : "none",
                        padding: "0 14px"
                      }}
                    >
                      {size}
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
                    width: "100%"
                  }}
                >
                  🛒 Add {qty} to Cart — ₹{(product.price * qty).toLocaleString()}
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
                  ⚡ Buy Now
                </button>
              </div>

              {/* Toast */}
              {addedToast && (
                <div style={{
                  background: "#dcfce7", color: "#15803d", borderRadius: 12,
                  padding: "12px 18px", fontWeight: 800, fontSize: 13,
                  border: "1px solid #bbf7d0", display: "flex", alignItems: "center", gap: 8,
                }}>
                  ✓ {product.name} ({selectedSize}) added to cart!
                </div>
              )}

            </div>
          </div>
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
            <button className="btn-primary btn-checkout" onClick={() => alert("Checkout initialized!")}>Checkout</button>
          </div>
        )}
      </aside>

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
            gap: 24px !important;
          }
          .gallery-wrapper {
            flex-direction: column !important;
          }
          .thumbnail-strip {
            flex-direction: row !important;
            overflow-x: auto;
            padding-bottom: 4px;
          }
        }
      `}</style>
    </div>
  );
}
