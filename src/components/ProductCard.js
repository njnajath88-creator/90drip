"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProductCard({ product, addToCart }) {
  const [photoIndex, setPhotoIndex] = useState(0);

  const photos = [
    product.image,
    product.backImage,
    product.closeupImage,
    product.fitImage,
  ].filter(Boolean);

  const labels = ["FRONT", "REAR", "CLOSE-UP", "FIT SHOT"];

  useEffect(() => {
    if (photos.length <= 1) return;
    const timer = setInterval(() => {
      setPhotoIndex((prev) => (prev + 1) % photos.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [photos.length]);

  const activePhoto =
    photos[photoIndex] || product.image || "/images/jersey_product1.png";

  return (
    <div className="product-card">
      <Link
        href={`/product/${product.id}`}
        className="product-image-wrap"
        style={{ textDecoration: "none", display: "block" }}
      >
        <img
          src={activePhoto}
          alt={product.name}
          className="product-image transition-image"
        />
        {photos.length > 1 && (
          <span className="view-indicator-pill">
            {labels[photoIndex] || `PHOTO ${photoIndex + 1}`} ({photoIndex + 1}/
            {photos.length})
          </span>
        )}
        {(product.badges || []).map((badge) => (
          <span
            key={badge}
            className={`product-badge badge-${badge.toLowerCase()}`}
          >
            {badge}
          </span>
        ))}
      </Link>
      <div className="product-info">
        <span className="product-category">
          {product.category || product.sport}
        </span>
        <h3 className="product-name">
          <Link
            href={`/product/${product.id}`}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {product.name}
          </Link>
        </h3>
        <div className="product-price">
          <span>₹{product.price}</span>
          {product.originalPrice && (
            <span className="original-price">₹{product.originalPrice}</span>
          )}
        </div>
        <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
          <Link
            href={`/product/${product.id}`}
            className="btn-secondary-sm"
            style={{
              flex: 1,
              textAlign: "center",
              textDecoration: "none",
              padding: "8px 4px",
              fontSize: "12px",
            }}
          >
            View Details
          </Link>
          <button
            className="btn-primary add-to-cart-btn"
            onClick={() => addToCart(product)}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
