"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sportFilter, setSportFilter] = useState("all");

  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    sport: "Football",
    price: "",
    originalPrice: "",
    badges: "",
    sizes: "XS, S, M, L, XL",
    image: "/images/jersey_product1.png",
    backImage: "/images/jersey_product2.png"
  });

  // Mock Orders State in INR (₹)
  const [orders, setOrders] = useState([
    {
      id: "ORD-9081",
      customer: "Alex Morgan",
      email: "alex@example.com",
      items: "FC Barcelona #10 Home (x1)",
      total: 1999,
      date: "2026-07-24",
      status: "Processing"
    },
    {
      id: "ORD-9080",
      customer: "David Beckham",
      email: "david@example.com",
      items: "Classic #7 Red (x2)",
      total: 2998,
      date: "2026-07-23",
      status: "Shipped"
    },
    {
      id: "ORD-9079",
      customer: "Kylian M.",
      email: "kylian@example.com",
      items: "City FC #9 Blue (x1)",
      total: 1799,
      date: "2026-07-22",
      status: "Delivered"
    },
    {
      id: "ORD-9078",
      customer: "Marcus R.",
      email: "marcus@example.com",
      items: "Green Eagle #11 (x1)",
      total: 1299,
      date: "2026-07-21",
      status: "Pending"
    }
  ]);

  // Settings State
  const [storeSettings, setStoreSettings] = useState({
    storeName: "90DRIP",
    bannerText: "WORLD CUP COLLECTIONS — FREE EXPRESS SHIPPING ON ORDERS OVER ₹1,999",
    currency: "INR (₹)",
    maintenanceMode: false,
    autoApproveOrders: true
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Form Handlers
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, backImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      sport: "Football",
      price: "",
      originalPrice: "",
      badges: "",
      sizes: "S, M, L, XL",
      image: "/images/jersey_product1.png",
      backImage: "/images/jersey_product2.png"
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sport: product.sport,
      price: product.price,
      originalPrice: product.originalPrice || "",
      badges: Array.isArray(product.badges) ? product.badges.join(", ") : product.badges || "",
      sizes: Array.isArray(product.sizes) ? product.sizes.join(", ") : product.sizes || "",
      image: product.image,
      backImage: product.backImage || ""
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        badges: formData.badges ? formData.badges.split(",").map(b => b.trim()).filter(Boolean) : [],
        sizes: formData.sizes ? formData.sizes.split(",").map(s => s.trim()).filter(Boolean) : ["S", "M", "L"]
      };

      if (editingProduct) {
        // Update product
        await fetch("/api/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingProduct.id, ...payload })
        });
      } else {
        // Add new product
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      setIsProductModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert("Error saving product: " + err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this jersey product?")) return;
    try {
      await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (err) {
      alert("Error deleting product: " + err.message);
    }
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sport.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = sportFilter === "all" || p.sport === sportFilter;
    return matchesSearch && matchesSport;
  });

  // Calculate metrics
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);
  const pendingOrders = orders.filter(o => o.status === "Pending" || o.status === "Processing").length;

  return (
    <div className="admin-wrapper">
      {/* Top Navbar */}
      <header className="admin-header">
        <div className="admin-header-container">
          <div className="admin-brand">
            <Link href="/" className="admin-logo-link">
              <img src="/images/90driplogo.png" alt="90DRIP" style={{ height: '36px', objectFit: 'contain' }} />
            </Link>
            <span className="admin-badge">ADMIN PORTAL</span>
          </div>

          <div className="admin-nav-actions">
            <Link href="/" className="admin-back-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              View Shop Front
            </Link>
            <div className="admin-user-profile">
              <div className="admin-avatar">AD</div>
              <span className="admin-user-name">Manager</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <div className="admin-container">
        {/* Navigation Tabs */}
        <div className="admin-tabs-bar">
          <button 
            className={`admin-tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
            Overview
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            Product Catalog ({products.length})
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
            Orders ({orders.length})
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            Store Settings
          </button>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="tab-content fade-in">
            {/* Metric Cards Grid */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-title">Total Revenue</span>
                  <div className="metric-icon green">
                    ₹
                  </div>
                </div>
                <div className="metric-value">₹{totalRevenue.toLocaleString()}</div>
                <div className="metric-subtext positive">+14.2% from last week</div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-title">Total Orders</span>
                  <div className="metric-icon blue">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path></svg>
                  </div>
                </div>
                <div className="metric-value">{orders.length}</div>
                <div className="metric-subtext warning">{pendingOrders} pending fulfillment</div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-title">Active Products</span>
                  <div className="metric-icon purple">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                  </div>
                </div>
                <div className="metric-value">{products.length}</div>
                <div className="metric-subtext">All active in catalog</div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-title">Store Conversion</span>
                  <div className="metric-icon orange">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                  </div>
                </div>
                <div className="metric-value">3.84%</div>
                <div className="metric-subtext positive">+0.6% this month</div>
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="overview-sections">
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>Recent Customer Orders</h3>
                  <button className="btn-secondary-sm" onClick={() => setActiveTab("orders")}>View All</button>
                </div>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 3).map(order => (
                        <tr key={order.id}>
                          <td><strong>{order.id}</strong></td>
                          <td>{order.customer}</td>
                          <td>{order.items}</td>
                          <td>₹{order.total.toLocaleString()}</td>
                          <td>
                            <span className={`status-pill ${order.status.toLowerCase()}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>Quick Store Actions</h3>
                </div>
                <div className="quick-actions-list">
                  <button className="action-btn" onClick={handleOpenAddModal}>
                    <div className="action-icon">+</div>
                    <div className="action-info">
                      <strong>Add New Jersey</strong>
                      <span>Upload photos, set size & price in ₹</span>
                    </div>
                  </button>
                  <button className="action-btn" onClick={() => setActiveTab("products")}>
                    <div className="action-icon">📋</div>
                    <div className="action-info">
                      <strong>Manage Catalog</strong>
                      <span>Update badges, sale discounts & stock</span>
                    </div>
                  </button>
                  <button className="action-btn" onClick={() => setActiveTab("settings")}>
                    <div className="action-icon">⚙️</div>
                    <div className="action-info">
                      <strong>Store Announcement Bar</strong>
                      <span>Edit top banner promotional messaging</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <div className="tab-content fade-in">
            <div className="admin-card-header-bar">
              <div className="search-filter-group">
                <div className="search-input-wrap">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
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

              <button className="btn-primary-admin" onClick={handleOpenAddModal}>
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
                          <td colSpan="8" className="empty-table">No products found.</td>
                        </tr>
                      ) : (
                        filteredProducts.map(product => (
                          <tr key={product.id}>
                            <td>
                              <img src={product.image} alt={product.name} className="product-thumb" />
                            </td>
                            <td>
                              <strong>{product.name}</strong>
                            </td>
                            <td>
                              <span className="category-badge">{product.sport}</span>
                            </td>
                            <td><strong>₹{product.price.toLocaleString()}</strong></td>
                            <td>
                              {product.originalPrice ? `₹${product.originalPrice.toLocaleString()}` : "—"}
                            </td>
                            <td>
                              {product.badges && product.badges.length > 0 ? (
                                product.badges.map(b => (
                                  <span key={b} className={`product-badge-pill badge-${b.toLowerCase()}`}>
                                    {b}
                                  </span>
                                ))
                              ) : (
                                <span className="text-muted">None</span>
                              )}
                            </td>
                            <td>
                              <div className="sizes-wrap">
                                {(Array.isArray(product.sizes) ? product.sizes : []).map(s => (
                                  <span key={s} className="size-chip">{s}</span>
                                ))}
                              </div>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button className="btn-icon edit" onClick={() => handleOpenEditModal(product)} title="Edit Product">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </button>
                                <button className="btn-icon delete" onClick={() => handleDeleteProduct(product.id)} title="Delete Product">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
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
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div className="tab-content fade-in">
            <div className="admin-card">
              <div className="admin-card-header">
                <h3>Customer Orders Management</h3>
                <span className="subhead-text">Real-time status updates</span>
              </div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Info</th>
                      <th>Items Purchased</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Fulfillment Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td><strong>{order.id}</strong></td>
                        <td>
                          <div><strong>{order.customer}</strong></div>
                          <div className="text-muted" style={{ fontSize: '12px' }}>{order.email}</div>
                        </td>
                        <td>{order.items}</td>
                        <td>{order.date}</td>
                        <td><strong>₹{order.total.toLocaleString()}</strong></td>
                        <td>
                          <select 
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className={`status-select ${order.status.toLowerCase()}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="tab-content fade-in">
            <div className="admin-card">
              <div className="admin-card-header">
                <h3>Store Front Configurations</h3>
              </div>
              <form onSubmit={handleSaveSettings} className="admin-form">
                <div className="form-group">
                  <label className="form-label">Store Branding Name</label>
                  <input 
                    type="text" 
                    value={storeSettings.storeName}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                    className="admin-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Promo Announcement Bar Text</label>
                  <input 
                    type="text" 
                    value={storeSettings.bannerText}
                    onChange={(e) => setStoreSettings({ ...storeSettings, bannerText: e.target.value })}
                    className="admin-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Store Currency</label>
                    <select 
                      value={storeSettings.currency}
                      onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                      className="admin-select"
                    >
                      <option value="INR (₹)">INR (₹)</option>
                      <option value="USD ($)">USD ($)</option>
                      <option value="EUR (€)">EUR (€)</option>
                      <option value="GBP (£)">GBP (£)</option>
                    </select>
                  </div>

                  <div className="form-group checkbox-group">
                    <label className="form-label">Auto-Approve Orders</label>
                    <input 
                      type="checkbox" 
                      checked={storeSettings.autoApproveOrders}
                      onChange={(e) => setStoreSettings({ ...storeSettings, autoApproveOrders: e.target.checked })}
                      className="admin-checkbox"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary-admin">
                    Save Configurations
                  </button>
                  {settingsSaved && <span className="save-success-msg">✓ Store settings updated!</span>}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingProduct ? "Edit Jersey Product" : "Add New Jersey"}</h3>
              <button className="modal-close" onClick={() => setIsProductModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSaveProduct} className="modal-form">
              <div className="form-group">
                <label className="form-label">Jersey Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Real Madrid #5 Bellingham" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Sport Category</label>
                  <select 
                    value={formData.sport}
                    onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                    className="admin-select"
                  >
                    <option value="Football">Football</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Custom">Custom / Premium</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input 
                    type="number" 
                    step="1"
                    required
                    placeholder="1999" 
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Original Price (₹) (Optional)</label>
                  <input 
                    type="number" 
                    step="1"
                    placeholder="2499" 
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="admin-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Badges (comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="New, Sale, Limited" 
                    value={formData.badges}
                    onChange={(e) => setFormData({ ...formData, badges: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Available Sizes (comma separated)</label>
                <input 
                  type="text" 
                  placeholder="XS, S, M, L, XL, XXL" 
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  className="admin-input"
                />
              </div>

              {/* Front View Image */}
              <div className="form-group">
                <label className="form-label">1. Front View Photo (Front Side)</label>
                <div className="image-upload-wrapper">
                  <input 
                    type="file" 
                    id="phone-gallery-input" 
                    accept="image/*" 
                    onChange={handleFileSelect} 
                    style={{ display: "none" }} 
                  />
                  <label htmlFor="phone-gallery-input" className="gallery-upload-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    <span>📷 Upload Front View Photo</span>
                  </label>
                </div>

                {formData.image && (
                  <div className="image-preview-container">
                    <img src={formData.image} alt="Front View Preview" className="image-preview-img" />
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600 }}>Front View Selected</div>
                      <button 
                        type="button" 
                        className="btn-remove-preview" 
                        onClick={() => setFormData({ ...formData, image: "" })}
                        style={{ marginTop: '4px' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Rear/Back View Image */}
              <div className="form-group">
                <label className="form-label">2. Rear View Photo (Back Side)</label>
                <div className="image-upload-wrapper">
                  <input 
                    type="file" 
                    id="phone-gallery-back-input" 
                    accept="image/*" 
                    onChange={handleBackFileSelect} 
                    style={{ display: "none" }} 
                  />
                  <label htmlFor="phone-gallery-back-input" className="gallery-upload-btn" style={{ borderColor: '#a7f3d0', color: '#059669', background: '#ecfdf5' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    <span>📷 Upload Rear (Back) View Photo</span>
                  </label>
                </div>

                {formData.backImage && (
                  <div className="image-preview-container">
                    <img src={formData.backImage} alt="Rear View Preview" className="image-preview-img" />
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600 }}>Rear View Selected</div>
                      <button 
                        type="button" 
                        className="btn-remove-preview" 
                        onClick={() => setFormData({ ...formData, backImage: "" })}
                        style={{ marginTop: '4px' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  ⚡ Product cards will automatically toggle between Front and Rear view every 3 seconds!
                </p>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary-sm" onClick={() => setIsProductModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-admin">
                  {editingProduct ? "Save Changes" : "Create Jersey"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
