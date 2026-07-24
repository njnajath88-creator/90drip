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
    return 0; // Newly Added = original order
  });

  return (
    <section id="shop" style={{ padding: "48px 0 80px", background: "#fafafa" }}>
      <div className="container">

        {/* Section Header */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{
            fontSize: 28, fontWeight: 900, color: "#0f172a",
            textTransform: "uppercase", letterSpacing: "0.04em", margin: "0 0 4px",
          }}>
            {filter === "all" ? "All Jerseys" : filter}
          </h2>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, fontWeight: 500 }}>
            {sorted.length} Product{sorted.length !== 1 ? "s" : ""} Found
          </p>
        </div>

        {/* Controls Bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>

          {/* Category Filter Pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                style={{
                  padding: "7px 16px", borderRadius: 50, fontSize: 12, fontWeight: 700,
                  letterSpacing: "0.03em", cursor: "pointer", transition: "all 0.18s",
                  border: filter === tab ? "none" : "1.5px solid #e2e8f0",
                  background: filter === tab ? "#0f172a" : "#fff",
                  color: filter === tab ? "#fff" : "#475569",
                  boxShadow: filter === tab ? "0 4px 12px rgba(15,23,42,0.2)" : "none",
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
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 16px", borderRadius: 50, fontSize: 12, fontWeight: 700,
                border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer",
                color: "#475569", transition: "border-color 0.18s",
              }}
            >
              {sort}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="6" y1="12" x2="18" y2="12" /><line x1="9" y1="18" x2="15" y2="18" />
              </svg>
            </button>
            {sortOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 100,
                background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)", overflow: "hidden", minWidth: 180,
              }}>
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setSort(opt); setSortOpen(false); }}
                    style={{
                      display: "block", width: "100%", textAlign: "left",
                      padding: "11px 16px", fontSize: 12, fontWeight: 600,
                      background: sort === opt ? "#f8fafc" : "transparent",
                      color: sort === opt ? "#0f172a" : "#475569",
                      border: "none", cursor: "pointer",
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

        {/* Product Grid */}
        {sorted.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ fontWeight: 600, fontSize: 16 }}>No jerseys found in this category.</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
          }}>
            {sorted.map((product) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
