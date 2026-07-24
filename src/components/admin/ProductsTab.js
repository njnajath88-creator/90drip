"use client";
import { useState } from "react";

export default function ProductsTab({
  products,
  loading,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sportFilter, setSportFilter] = useState("all");

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sport.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = sportFilter === "all" || p.sport === sportFilter;
    return matchesSearch && matchesSport;
  });

  return (
    <div className="tab-content fade-in">
      {/* Search, Filter & Add Button Bar */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
        
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {/* Search Input */}
          <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
            <input
              type="text"
              placeholder="Search jerseys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "12px",
                border: "1.5px solid #e2e8f0",
                fontSize: "14px",
                fontWeight: "600",
                background: "#ffffff",
                outline: "none"
              }}
            />
          </div>

          {/* Sport Select */}
          <select
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
            style={{
              padding: "12px 14px",
              borderRadius: "12px",
              border: "1.5px solid #e2e8f0",
              fontSize: "13px",
              fontWeight: "700",
              background: "#ffffff",
              color: "#0f172a",
              outline: "none"
            }}
          >
            <option value="all">All Sports</option>
            <option value="Football">Football</option>
            <option value="Basketball">Basketball</option>
          </select>
        </div>

        {/* Add Product Button */}
        <button
          onClick={onAddProduct}
          style={{
            width: "100%",
            padding: "14px 20px",
            borderRadius: "12px",
            border: "none",
            background: "#2563eb",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "900",
            cursor: "pointer",
            letterSpacing: "0.03em",
            boxShadow: "0 4px 14px rgba(37,99,235,0.25)"
          }}
        >
          + Add New Jersey
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#64748b" }}>Loading products catalog...</div>
      ) : (
        <div style={{ background: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1.5px solid #e2e8f0", textAlign: "left" }}>
                  <th style={{ padding: "12px 16px", fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>Preview</th>
                  <th style={{ padding: "12px 16px", fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>Jersey Name</th>
                  <th style={{ padding: "12px 16px", fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>Category</th>
                  <th style={{ padding: "12px 16px", fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>Price</th>
                  <th style={{ padding: "12px 16px", fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: "30px", textAlign: "center", color: "#94a3b8" }}>No products found.</td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "10px 16px" }}>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: "44px", height: "52px", objectFit: "contain", borderRadius: "8px", background: "#f4f4f0", padding: "4px" }}
                        />
                      </td>
                      <td style={{ padding: "10px 16px", fontSize: "13px", fontWeight: "800", color: "#0f172a" }}>
                        {product.name}
                      </td>
                      <td style={{ padding: "10px 16px" }}>
                        <span style={{ background: "#f1f5f9", color: "#475569", fontSize: "11px", fontWeight: "800", padding: "4px 8px", borderRadius: "6px" }}>
                          {product.category || product.sport}
                        </span>
                      </td>
                      <td style={{ padding: "10px 16px", fontSize: "13px", fontWeight: "800", color: "#0f172a" }}>
                        ₹{product.price?.toLocaleString()}
                      </td>
                      <td style={{ padding: "10px 16px" }}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => onEditProduct(product)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "8px",
                              border: "1px solid #e2e8f0",
                              background: "#f8fafc",
                              fontSize: "12px",
                              fontWeight: "700",
                              color: "#2563eb",
                              cursor: "pointer"
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDeleteProduct(product.id)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "8px",
                              border: "1px solid #fee2e2",
                              background: "#fef2f2",
                              fontSize: "12px",
                              fontWeight: "700",
                              color: "#ef4444",
                              cursor: "pointer"
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
