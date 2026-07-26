"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      return;
    }

    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products for search:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredProducts = products.filter((p) => {
    const matchesQuery =
      !query ||
      p.name?.toLowerCase().includes(query.toLowerCase()) ||
      p.category?.toLowerCase().includes(query.toLowerCase()) ||
      p.sport?.toLowerCase().includes(query.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      p.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesQuery && matchesCategory;
  });

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(10px)",
        zIndex: 100000,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "40px 20px 20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "640px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)",
          border: "1px solid rgba(226, 232, 240, 0.8)",
          overflow: "hidden",
          position: "relative",
          animation: "searchPopIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "12px" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input
            type="text"
            autoFocus
            placeholder="Search jerseys by team, category, or keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              fontSize: "16px",
              fontWeight: "700",
              color: "#0f172a",
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "14px", fontWeight: "bold" }}
            >
              ✕
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              background: "#f1f5f9",
              border: "none",
              borderRadius: "8px",
              padding: "6px 12px",
              fontSize: "12px",
              fontWeight: "800",
              color: "#475569",
              cursor: "pointer",
            }}
          >
            ESC
          </button>
        </div>

        {/* Category Filter Chips */}
        <div style={{ padding: "12px 24px", background: "#f8fafc", borderBottom: "1px solid #f1f5f9", display: "flex", gap: "8px", overflowX: "auto" }}>
          {[
            { id: "all", label: "All Jerseys" },
            { id: "full sleeve", label: "Full Sleeve" },
            { id: "half sleeve", label: "Half Sleeve" },
            { id: "5 sleeve", label: "Five Sleeve" },
            { id: "retro", label: "Retro Vintage" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                background: selectedCategory === cat.id ? "#0f172a" : "#ffffff",
                color: selectedCategory === cat.id ? "#ffffff" : "#475569",
                border: "1px solid #cbd5e1",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div style={{ maxHeight: "400px", overflowY: "auto", padding: "12px 16px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#64748b" }}>
              Searching product catalog...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <p style={{ fontWeight: "700", margin: 0 }}>No jerseys match "{query}"</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {filteredProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  onClick={onClose}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "10px 12px",
                    borderRadius: "14px",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "background 0.15s ease",
                  }}
                  className="search-item-hover"
                >
                  <img
                    src={p.image || "/images/jersey_product1.png"}
                    alt={p.name}
                    style={{
                      width: "48px",
                      height: "58px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase" }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginTop: "2px" }}>
                      {p.category} • {p.sport || "Football"}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "14px", fontWeight: "900", color: "#2563eb" }}>
                      ₹{parseFloat(p.price).toLocaleString()}
                    </div>
                    <span style={{ fontSize: "10px", color: "#16a34a", fontWeight: "800" }}>
                      In Stock
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes searchPopIn {
          from { opacity: 0; transform: translateY(-12px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        :global(.search-item-hover:hover) {
          background: #f8fafc !important;
        }
      `}</style>
    </div>
  );
}
