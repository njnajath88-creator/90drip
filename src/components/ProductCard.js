"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { isInWishlist, toggleWishlist } from "@/lib/wishlistStore";

export default function ProductCard({ product, index = 0 }) {
  const [hovered, setHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

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
    const result = toggleWishlist(product);
    setIsSaved(result.isAdded);
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
      onMouseLeave={() => setHovered(false)}
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
            overflow: "hidden",
            position: "relative",
            transition: "transform 0.25s ease, box-shadow 0.25s ease",
            transform: hovered ? "scale(1.02)" : "scale(1)",
            boxShadow: hovered ? "0 10px 25px rgba(0,0,0,0.08)" : "none"
          }}
        >
          <button
            onClick={handleWishlistToggle}
            title={isSaved ? "Remove from Wishlist" : "Save to Wishlist"}
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              zIndex: 10,
              background: "rgba(255, 255, 255, 0.9)",
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
              transform: isSaved ? "scale(1.1)" : "scale(1)",
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

          <img
            src={displaySrc}
            alt={product.name}
            loading="lazy"
            decoding="async"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.35s ease",
              transform: hovered ? "scale(1.06)" : "scale(1)"
            }}
          />
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
