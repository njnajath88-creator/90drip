"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProductCard({ product, addToCart }) {
  const [hovered, setHovered] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);

  const photos = [
    product.image,
    product.backImage,
    product.closeupImage,
    product.fitImage,
  ].filter(Boolean);

  // Switch to back image on hover
  const displaySrc = hovered && photos[1] ? photos[1] : photos[0] || "/images/jersey_product1.png";

  const discountPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#f0f0ec",
        borderRadius: 16,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "transform 0.22s, box-shadow 0.22s",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? "0 12px 32px rgba(0,0,0,0.12)" : "0 2px 8px rgba(0,0,0,0.04)",
        position: "relative",
      }}
    >
      {/* Badges */}
      <div style={{ position: "absolute", top: 12, left: 12, display: "flex", flexDirection: "column", gap: 5, zIndex: 2 }}>
        {(product.badges || []).map((badge) => (
          <span
            key={badge}
            style={{
              background: badge === "Sale" ? "#ef4444" : badge === "New" ? "#0f172a" : "#f59e0b",
              color: "#fff",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.08em",
              padding: "3px 8px",
              borderRadius: 4,
              textTransform: "uppercase",
            }}
          >
            {badge}
          </span>
        ))}
      </div>

      {/* Discount badge */}
      {discountPct && (
        <div style={{
          position: "absolute", top: 12, right: 12, zIndex: 2,
          background: "#dcfce7", color: "#15803d",
          fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 4,
        }}>
          -{discountPct}%
        </div>
      )}

      {/* Image */}
      <Link href={`/product/${product.id}`} style={{ textDecoration: "none", display: "block" }}>
        <div style={{ padding: "28px 28px 16px", background: "#f0f0ec", minHeight: 220, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <img
            src={displaySrc}
            alt={product.name}
            style={{
              width: "100%",
              maxHeight: 220,
              objectFit: "contain",
              transition: "transform 0.35s, opacity 0.25s",
              transform: hovered ? "scale(1.06)" : "scale(1)",
            }}
          />
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: "12px 16px 16px", background: "#fff", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>
          {product.sport} · {product.category}
        </p>
        <Link href={`/product/${product.id}`} style={{ textDecoration: "none" }}>
          <h3 style={{
            fontSize: 13, fontWeight: 800, color: "#0f172a", margin: 0,
            textTransform: "uppercase", letterSpacing: "0.03em", lineHeight: 1.35,
          }}>
            {product.name}
          </h3>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>₹{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span style={{ fontSize: 12, color: "#94a3b8", textDecoration: "line-through" }}>
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Size chips */}
        {product.sizes && product.sizes.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 2 }}>
            {product.sizes.slice(0, 5).map((s) => (
              <span key={s} style={{ fontSize: 9, fontWeight: 700, color: "#64748b", border: "1px solid #e2e8f0", borderRadius: 4, padding: "2px 5px", letterSpacing: "0.04em" }}>
                {s}
              </span>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <Link
            href={`/product/${product.id}`}
            style={{
              flex: 1, textAlign: "center", textDecoration: "none",
              padding: "9px 0", borderRadius: 8, fontSize: 11, fontWeight: 700,
              background: "#0f172a", color: "#fff", letterSpacing: "0.04em",
              transition: "background 0.18s",
            }}
          >
            VIEW DETAILS
          </Link>
          <button
            onClick={() => addToCart(product)}
            style={{
              width: 38, height: 38, borderRadius: 8, border: "1.5px solid #e2e8f0",
              background: "#fff", cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center", flexShrink: 0,
              transition: "border-color 0.18s, background 0.18s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#0f172a"; e.currentTarget.style.background = "#f8fafc"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#fff"; }}
            title="Add to Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
