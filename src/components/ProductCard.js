"use client";
import { useState } from "react";
import Link from "next/link";

export default function ProductCard({ product, addToCart }) {
  const [hovered, setHovered] = useState(false);

  const photos = [
    product.image,
    product.backImage,
    product.closeupImage,
    product.fitImage,
  ].filter(Boolean);

  const displaySrc = hovered && photos[1] ? photos[1] : photos[0] || "/images/jersey_product1.png";

  const discountPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#f4f4f0",
        borderRadius: "20px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? "0 12px 30px rgba(0,0,0,0.12)" : "0 2px 10px rgba(0,0,0,0.03)",
        position: "relative",
        border: "1px solid #e8e8e2"
      }}
    >
      {/* Top Left Badge */}
      <div style={{ position: "absolute", top: 14, left: 14, zIndex: 2 }}>
        {(product.badges && product.badges.length > 0) ? (
          product.badges.map((badge) => (
            <span
              key={badge}
              style={{
                background: badge.toLowerCase() === "sale" ? "#ef4444" : "#0f172a",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: "900",
                letterSpacing: "0.08em",
                padding: "5px 10px",
                borderRadius: "6px",
                textTransform: "uppercase",
                display: "inline-block"
              }}
            >
              {badge}
            </span>
          ))
        ) : discountPct ? (
          <span
            style={{
              background: "#ef4444",
              color: "#ffffff",
              fontSize: "11px",
              fontWeight: "900",
              letterSpacing: "0.08em",
              padding: "5px 10px",
              borderRadius: "6px",
              textTransform: "uppercase",
            }}
          >
            SALE
          </span>
        ) : null}
      </div>

      {/* Product Image Area */}
      <Link href={`/product/${product.id}`} style={{ textDecoration: "none", display: "block" }}>
        <div
          style={{
            padding: "24px 20px 16px",
            background: "#f4f4f0",
            minHeight: "240px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            position: "relative"
          }}
        >
          <img
            src={displaySrc}
            alt={product.name}
            style={{
              width: "100%",
              maxHeight: "220px",
              objectFit: "contain",
              transition: "transform 0.35s ease, opacity 0.25s ease",
              transform: hovered ? "scale(1.05)" : "scale(1)"
            }}
          />
        </div>
      </Link>

      {/* Content Info Card (Neat White Container) */}
      <div
        style={{
          padding: "18px 18px 20px",
          background: "#ffffff",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}
      >
        {/* Category / Sport Subhead */}
        <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {product.sport || "FOOTBALL"} · {product.category || "JERSEY"}
        </div>

        {/* Product Name */}
        <Link href={`/product/${product.id}`} style={{ textDecoration: "none" }}>
          <h3
            style={{
              fontSize: "15px",
              fontWeight: "900",
              color: "#0f172a",
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
              lineHeight: 1.3
            }}
          >
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "2px" }}>
          <span style={{ fontSize: "18px", fontWeight: "900", color: "#0f172a" }}>
            ₹{product.price?.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span style={{ fontSize: "13px", color: "#94a3b8", textDecoration: "line-through" }}>
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Available Size Chips */}
        {product.sizes && product.sizes.length > 0 && (
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
            {product.sizes.map((s) => (
              <span
                key={s}
                style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  color: "#64748b",
                  border: "1px solid #e2e8f0",
                  borderRadius: "5px",
                  padding: "3px 7px",
                  background: "#f8fafc"
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Buttons Row (Dark Navy View Details + Cart Button) */}
        <div style={{ display: "flex", gap: "10px", marginTop: "12px", alignItems: "center" }}>
          <Link
            href={`/product/${product.id}`}
            style={{
              flex: 1,
              textAlign: "center",
              textDecoration: "none",
              padding: "12px 10px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: "800",
              background: "#0e1726",
              color: "#ffffff",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              boxShadow: "0 4px 12px rgba(14,23,38,0.15)",
              transition: "background 0.2s ease"
            }}
          >
            VIEW DETAILS
          </Link>
          <button
            onClick={() => addToCart(product)}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              background: "#ffffff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "all 0.2s ease",
              boxShadow: "0 2px 6px rgba(0,0,0,0.04)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#0e1726";
              e.currentTarget.style.background = "#f8fafc";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.background = "#ffffff";
            }}
            title="Add to Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0e1726" strokeWidth="2">
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
