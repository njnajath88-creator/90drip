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
      <div className="admin-card-header-bar">
        <div className="search-filter-group">
          <div className="search-input-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search jerseys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-input"
            />
          </div>
          <select
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
            className="admin-select"
          >
            <option value="all">All Sports</option>
            <option value="Football">Football</option>
            <option value="Basketball">Basketball</option>
          </select>
        </div>

        <button className="btn-primary-admin" onClick={onAddProduct}>
          + Add New Jersey
        </button>
      </div>

      {loading ? (
        <div className="admin-loading">Loading products catalog...</div>
      ) : (
        <div className="admin-card">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Jersey Name</th>
                  <th>Category</th>
                  <th>Price (₹)</th>
                  <th>Original (₹)</th>
                  <th>Badges</th>
                  <th>Sizes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-table">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="product-thumb"
                        />
                      </td>
                      <td><strong>{product.name}</strong></td>
                      <td>
                        <span className="category-badge">{product.sport}</span>
                      </td>
                      <td><strong>₹{product.price.toLocaleString()}</strong></td>
                      <td>
                        {product.originalPrice
                          ? `₹${product.originalPrice.toLocaleString()}`
                          : "—"}
                      </td>
                      <td>
                        {product.badges && product.badges.length > 0 ? (
                          product.badges.map((b) => (
                            <span
                              key={b}
                              className={`product-badge-pill badge-${b.toLowerCase()}`}
                            >
                              {b}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted">None</span>
                        )}
                      </td>
                      <td>
                        <div className="sizes-wrap">
                          {(Array.isArray(product.sizes) ? product.sizes : []).map(
                            (s) => (
                              <span key={s} className="size-chip">
                                {s}
                              </span>
                            )
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon edit"
                            onClick={() => onEditProduct(product)}
                            title="Edit Product"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </button>
                          <button
                            className="btn-icon delete"
                            onClick={() => onDeleteProduct(product.id)}
                            title="Delete Product"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
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
