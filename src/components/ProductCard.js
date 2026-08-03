"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { isInWishlist, toggleWishlist } from "@/lib/wishlistStore";
import { addToCart as addToCartStore } from "@/lib/cartStore";
import { requireAuth } from "@/lib/authUtils";

export default function ProductCard({ product, index = 0, addToCart: addToCartProp }) {
  const [hovered, setHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [lastAddedSize, setLastAddedSize] = useState("");
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  const availableSizes = product.sizes && product.sizes.length > 0
    ? product.sizes
    : ["XS", "S", "M", "L", "XL"];

  useEffect(() => {
    setIsSaved(isInWishlist(product.id));
    const sync = () => setIsSaved(isInWishlist(product.id));
    window.addEventListener("90drip_wishlist_updated", sync);
    return () => window.removeEventListener("90drip_wishlist_updated", sync);
  }, [product.id]);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -30px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireAuth()) return;
    const result = toggleWishlist(product);
    setIsSaved(result.isAdded);
  };

  const handleToggleSizePicker = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireAuth()) return;
    setShowSizePicker((prev) => !prev);
  };

  const handleSelectSize = (e, size) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireAuth()) return;
    const addFn = addToCartProp || addToCartStore;
    if (addFn) {
      addFn(product, size);
      setLastAddedSize(size);
      setAddedToCart(true);
      setShowSizePicker(false);
      setTimeout(() => setAddedToCart(false), 1800);
    }
  };

  const displaySrc = product.image || "/images/jersey_product1.png";
  const staggerDelay = (index % 4) * 60; // 0ms, 60ms, 120ms, 180ms stagger

  return (
    <Link
      ref={cardRef}
      href={`/product/${product.id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? (hovered ? "translateY(0) scale(1.01)" : "translateY(0)")
          : "translateY(28px)",
        transition: `opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${staggerDelay}ms, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${staggerDelay}ms, box-shadow 0.25s ease`,
        willChange: "opacity, transform",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setShowSizePicker(false);
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Edge-to-Edge Clean Image Container */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            aspectRatio: "4/5",
            border: "1px solid #e8e8e2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            transition: "transform 0.25s ease, box-shadow 0.25s ease",
            transform: hovered ? "scale(1.02)" : "scale(1)",
            boxShadow: hovered ? "0 10px 25px rgba(0,0,0,0.08)" : "none"
          }}
        >
          {/* Wishlist Heart Icon Button (Top Right) */}
          <div className="product-card-wishlist-wrap">
            <button
              onClick={handleWishlistToggle}
              title={isSaved ? "Remove from Wishlist" : "Save to Wishlist"}
              aria-label={isSaved ? "Remove from Wishlist" : "Save to Wishlist"}
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(6px)",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                transition: "transform 0.2s ease, background 0.2s ease",
                transform: isSaved ? "scale(1.08)" : "scale(1)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill={isSaved ? "#ef4444" : "none"}
                stroke={isSaved ? "#ef4444" : "#475569"}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>

          {/* Quick Add to Cart Button & Dropdown (Bottom Right on mobile, Top Right on desktop) */}
          <div className="product-card-cart-wrap">
            <button
              onClick={handleToggleSizePicker}
              title={addedToCart ? `Added (${lastAddedSize})` : "Select Size & Add to Cart"}
              aria-label="Add to Cart Options"
              style={{
                background: addedToCart ? "#2563eb" : showSizePicker ? "#0f172a" : "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(6px)",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                transition: "all 0.2s ease",
                color: (addedToCart || showSizePicker) ? "#ffffff" : "#475569",
                transform: (addedToCart || showSizePicker) ? "scale(1.08)" : "scale(1)",
              }}
            >
              {addedToCart ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              )}
            </button>

            {/* Anchored Size Dropdown Menu */}
            {showSizePicker && (
              <div
                className="product-card-size-picker"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <div style={{ padding: "4px 8px 6px", fontSize: "10px", fontWeight: "900", color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid #f1f5f9" }}>
                  Select Size:
                </div>
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={(e) => handleSelectSize(e, size)}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: "8px",
                      border: "none",
                      background: "transparent",
                      color: "#0f172a",
                      fontSize: "13px",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#eff6ff";
                      e.currentTarget.style.color = "#2563eb";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#0f172a";
                    }}
                  >
                    <span>Size {size}</span>
                    <span style={{ fontSize: "11px", fontWeight: "800", color: "#2563eb" }}>+ Add</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Inner Image Wrapper */}
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "20px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Image
              src={displaySrc}
              alt={product.name}
              width={400}
              height={500}
              loading={index < 4 ? "eager" : "lazy"}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top center",
                display: "block",
                transition: "transform 0.35s ease",
                transform: hovered ? "scale(1.06)" : "scale(1)"
              }}
            />
          </div>
        </div>

        {/* Minimalist Details Below Image */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "0 4px" }}>
          {/* Title */}
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "800",
              color: "#1e293b",
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: "0.01em",
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}
          >
            {product.name}
          </h3>

          {/* Price Line */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "2px" }}>
            <span style={{ fontSize: "15px", fontWeight: "900", color: "#1e293b" }}>
              ₹{product.price?.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span style={{ fontSize: "13px", color: "#94a3b8", textDecoration: "line-through", fontWeight: "600" }}>
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
