"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        const found = data.find((p) => String(p.id) === String(productId));
        if (found) {
          setProduct(found);
          if (found.sizes && found.sizes.length > 0) {
            setSelectedSize(found.sizes[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch product details:", err);
      } finally {
        setLoading(false);
      }
    }
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="product-detail-page-wrapper" style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#64748b" }}>
          <div className="spinner" style={{ width: "40px", height: "40px", border: "4px solid #e2e8f0", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }}></div>
          <p>Loading Product Details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page-wrapper" style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h2>Product Not Found</h2>
        <p style={{ color: "#64748b", margin: "12px 0 24px" }}>The requested jersey could not be found.</p>
        <Link href="/" className="btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const photos = [
    { src: product.image, label: "Front View" },
    { src: product.backImage, label: "Rear View" },
    { src: product.closeupImage, label: "Close-up Detail" },
    { src: product.fitImage, label: "Fit / Model Shot" },
  ].filter((p) => Boolean(p.src));

  const handlePrevPhoto = () => {
    setActivePhotoIdx((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNextPhoto = () => {
    setActivePhotoIdx((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      selectedSize,
      quantity: qty,
    };
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.selectedSize === selectedSize);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, cartItem];
    });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <div className="product-page-container">
      {/* Header */}
      <nav className="navbar scrolled" id="navbar" style={{ position: "sticky", top: 0, zIndex: 1000, background: "#ffffff" }}>
        <div className="container">
          <div className="navbar-inner">
            <div className="nav-left">
              <Link href="/" className="back-link" style={{ display: "flex", alignItems: "center", gap: "6px", color: "#0f172a", textDecoration: "none", fontWeight: 700, fontSize: "14px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                <span>Back to Store</span>
              </Link>
            </div>

            <Link href="/" className="nav-logo">
              <img src="/images/90driplogo.png" alt="90DRIP" className="nav-logo-img" />
            </Link>

            <div className="nav-actions">
              <button className="nav-icon-btn" onClick={() => setIsCartOpen(true)} aria-label="Shopping Cart">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Product Layout */}
      <main className="product-page-main">
        <div className="container">
          {/* Breadcrumb */}
          <div className="breadcrumb" style={{ margin: "20px 0", fontSize: "13px", color: "#64748b" }}>
            <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <Link href="/#shop" style={{ color: "#64748b", textDecoration: "none" }}>Jerseys</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#0f172a", fontWeight: 600 }}>{product.name}</span>
          </div>

          <div className="product-detail-grid">
            {/* Left: 4 Photo Carousel Slider */}
            <div className="product-slider-column">
              <div className="main-carousel-card">
                <img
                  src={photos[activePhotoIdx]?.src || product.image}
                  alt={`${product.name} - ${photos[activePhotoIdx]?.label || "View"}`}
                  className="carousel-main-img"
                />

                {photos.length > 1 && (
                  <>
                    <button className="slider-arrow arrow-left" onClick={handlePrevPhoto} aria-label="Previous image">
                      ‹
                    </button>
                    <button className="slider-arrow arrow-right" onClick={handleNextPhoto} aria-label="Next image">
                      ›
                    </button>
                  </>
                )}

                <div className="carousel-badge-tag">
                  {photos[activePhotoIdx]?.label || "View"} ({activePhotoIdx + 1}/{photos.length})
                </div>
              </div>

              {/* 4 Thumbnails */}
              {photos.length > 1 && (
                <div className="carousel-thumbnails-grid">
                  {photos.map((photo, idx) => (
                    <button
                      key={idx}
                      className={`carousel-thumb-card ${idx === activePhotoIdx ? "active" : ""}`}
                      onClick={() => setActivePhotoIdx(idx)}
                    >
                      <img src={photo.src} alt={photo.label} />
                      <span className="thumb-caption">{photo.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details & Purchase Options */}
            <div className="product-info-column">
              <div className="category-badges-row">
                <span className="sport-pill">{product.sport}</span>
                {(product.badges || []).map((badge) => (
                  <span key={badge} className={`badge-pill badge-${badge.toLowerCase()}`}>
                    {badge}
                  </span>
                ))}
              </div>

              <h1 className="product-page-title">{product.name}</h1>

              <div className="price-box">
                <span className="current-price">₹{product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="original-price-strike">₹{product.originalPrice}</span>
                    <span className="save-discount-badge">
                      Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>

              <p className="product-summary">
                Official premium match quality {product.name}. Designed with sweat-wicking performance mesh, ultra-lightweight fabric, and heat-applied crest for maximum comfort on and off the pitch.
              </p>

              <hr className="divider-line" />

              {/* Size Selection */}
              <div className="option-group">
                <div className="option-header">
                  <label className="option-label">Select Jersey Size</label>
                  <span className="size-guide-link">📏 Size Guide</span>
                </div>
                <div className="sizes-grid">
                  {(product.sizes || ["XS", "S", "M", "L", "XL", "XXL"]).map((size) => (
                    <button
                      key={size}
                      className={`size-btn-card ${selectedSize === size ? "selected" : ""}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Picker */}
              <div className="option-group">
                <label className="option-label">Quantity</label>
                <div className="qty-control-box">
                  <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(qty + 1)}>+</button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons-stack">
                <button className="btn-add-cart-lg" onClick={handleAddToCart}>
                  Add {qty} to Cart — ₹{product.price * qty}
                </button>
                <button className="btn-buy-now-lg" onClick={() => { handleAddToCart(); setIsCartOpen(true); }}>
                  ⚡ Buy Now
                </button>
              </div>

              {addedToast && (
                <div className="added-toast">
                  ✓ Added {product.name} ({selectedSize}) to Cart!
                </div>
              )}

              {/* Product Specifications & Details */}
              <div className="product-specs-card">
                <h3>Product Specifications</h3>
                <ul>
                  <li><strong>Fit:</strong> Athletic Slim Fit</li>
                  <li><strong>Material:</strong> 100% Recycled Breathability Polyester</li>
                  <li><strong>Technology:</strong> Dri-FIT Moisture Wicking</li>
                  <li><strong>Crest:</strong> Heat-sealed Official Team Crest</li>
                  <li><strong>Care:</strong> Machine Wash Cold, Line Dry</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Cart Sidebar */}
      {isCartOpen && <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>}
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
                  <div style={{ fontSize: "11px", color: "#64748b" }}>Size: {item.selectedSize}</div>
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
    </div>
  );
}
