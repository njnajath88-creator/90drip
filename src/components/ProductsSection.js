"use client";
import { useState } from "react";
import ProductCard from "./ProductCard";

const FILTER_TABS = ["all", "Full Sleeve", "Half Sleeve", "5 Sleeve", "Retro"];
const SORT_OPTIONS = ["Newly Added", "Price: Low to High", "Price: High to Low"];

export default function ProductsSection({ products, filter, setFilter, addToCart }) {
  const [sort, setSort] = useState("Newly Added");
  const [sortOpen, setSortOpen] = useState(false);

  const filtered =
    filter === "all"
      ? products
      : products.filter(
          (p) =>
            p.category === filter ||
            p.sport === filter ||
            (p.badges && p.badges.includes(filter))
        );

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "Price: Low to High") return a.price - b.price;
    if (sort === "Price: High to Low") return b.price - a.price;
    return 0;
  });

  return (
    <section id="shop" style={{ padding: "48px 0 80px", background: "#fafafa" }}>
      <div className="container" style={{ maxWidth: "1000px" }}>

        {/* Section Header */}
        <div style={{ marginBottom: "24px" }}>
          <h2
            style={{
              fontSize: "26px",
              fontWeight: "900",
              color: "#0f172a",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              margin: "0 0 4px",
            }}
          >
            {filter === "all" ? "All Jerseys" : filter}
          </h2>
          <p style={{ fontSize: "13px", color: "#64748b", margin: 0, fontWeight: "600" }}>
            {sorted.length} Product{sorted.length !== 1 ? "s" : ""} Found
          </p>
        </div>

        {/* Controls Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "28px"
          }}
        >
          {/* Category Filter Pills */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "50px",
                  fontSize: "12px",
                  fontWeight: "800",
                  letterSpacing: "0.03em",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  border: filter === tab ? "none" : "1.5px solid #e2e8f0",
                  background: filter === tab ? "#0f172a" : "#ffffff",
                  color: filter === tab ? "#ffffff" : "#475569",
                  boxShadow: filter === tab ? "0 4px 12px rgba(15,23,42,0.18)" : "none",
                }}
              >
                {tab === "all" ? "All" : tab}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setSortOpen(!sortOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 18px",
                borderRadius: "50px",
                fontSize: "12px",
                fontWeight: "800",
                border: "1.5px solid #e2e8f0",
                background: "#ffffff",
                cursor: "pointer",
                color: "#475569",
                transition: "border-color 0.2s ease",
              }}
            >
              <span>{sort}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {sortOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  zIndex: 100,
                  background: "#ffffff",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "14px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  overflow: "hidden",
                  minWidth: "180px",
                }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSort(opt);
                      setSortOpen(false);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "12px 16px",
                      fontSize: "12px",
                      fontWeight: "700",
                      background: sort === opt ? "#f8fafc" : "transparent",
                      color: sort === opt ? "#0f172a" : "#475569",
                      border: "none",
                      cursor: "pointer",
                      borderLeft: sort === opt ? "3px solid #0f172a" : "3px solid transparent",
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Grid — Strict Neat 2-Column Grid as Requested */}
        {sorted.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <p style={{ fontWeight: "700", fontSize: "16px" }}>No jerseys found in this category.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "20px",
            }}
            className="neat-2-grid"
          >
            {sorted.map((product) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 540px) {
          .neat-2-grid {
            gap: 12px !important;
          }
        }
      `}</style>
    </section>
  );
}
