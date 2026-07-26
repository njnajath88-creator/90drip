"use client";
import { useState } from "react";
import Link from "next/link";

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);

  const photos = [
    product.image,
    product.backImage,
    product.closeupImage,
    product.fitImage,
  ].filter(Boolean);

  const displaySrc = hovered && photos[1] ? photos[1] : photos[0] || "/images/jersey_product1.png";

  return (
    <Link
      href={`/product/${product.id}`}
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
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
          <img
            src={displaySrc}
            alt={product.name}
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
