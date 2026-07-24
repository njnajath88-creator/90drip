"use client";

export default function OverviewTab({ orders, products, onAddProduct, setActiveTab }) {
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);
  const pendingOrders = orders.filter(
    (o) => o.status === "Pending" || o.status === "Processing"
  ).length;

  return (
    <div className="tab-content fade-in">
      {/* Metric Cards Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Total Revenue</span>
            <div className="metric-icon green">₹</div>
          </div>
          <div className="metric-value">₹{totalRevenue.toLocaleString()}</div>
          <div className="metric-subtext positive">+14.2% from last week</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Total Orders</span>
            <div className="metric-icon blue">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              </svg>
            </div>
          </div>
          <div className="metric-value">{orders.length}</div>
          <div className="metric-subtext warning">{pendingOrders} pending fulfillment</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Active Products</span>
            <div className="metric-icon purple">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
          </div>
          <div className="metric-value">{products.length}</div>
          <div className="metric-subtext">All active in catalog</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Store Conversion</span>
            <div className="metric-icon orange">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
            </div>
          </div>
          <div className="metric-value">3.84%</div>
          <div className="metric-subtext positive">+0.6% this month</div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="overview-sections">
        {/* Recent Orders Card */}
        <div className="admin-card" style={{ padding: "16px", overflow: "hidden" }}>
          <div className="admin-card-header" style={{ marginBottom: "14px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "900", color: "#0f172a", margin: 0 }}>Recent Customer Orders</h3>
            <button className="btn-secondary-sm" onClick={() => setActiveTab("orders")}>
              View All
            </button>
          </div>

          {/* Table Container with Horizontal Scroll for Mobile */}
          <div style={{ overflowX: "auto", width: "100%", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
            <table className="admin-table" style={{ width: "100%", minWidth: "460px", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1.5px solid #e2e8f0", textAlign: "left" }}>
                  <th style={{ padding: "8px 10px", fontSize: "10px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>ORDER ID</th>
                  <th style={{ padding: "8px 10px", fontSize: "10px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>CUSTOMER</th>
                  <th style={{ padding: "8px 10px", fontSize: "10px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>ITEMS</th>
                  <th style={{ padding: "8px 10px", fontSize: "10px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 3).map((order) => (
                  <tr key={order.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "10px", fontSize: "11px", fontWeight: "800", color: "#0f172a", whiteSpace: "nowrap" }}>{order.id}</td>
                    <td style={{ padding: "10px", fontSize: "11px", fontWeight: "700", color: "#334155", whiteSpace: "nowrap" }}>{order.customer}</td>
                    <td style={{ padding: "10px", fontSize: "11px", color: "#475569", whiteSpace: "nowrap", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis" }}>{order.items}</td>
                    <td style={{ padding: "10px", fontSize: "11px", fontWeight: "800", color: "#0f172a", whiteSpace: "nowrap" }}>₹{order.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Store Actions Card */}
        <div className="admin-card" style={{ padding: "16px" }}>
          <div className="admin-card-header" style={{ marginBottom: "14px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "900", color: "#0f172a", margin: 0 }}>Quick Store Actions</h3>
          </div>
          <div className="quick-actions-list" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button className="action-btn" onClick={onAddProduct} style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1.5px solid #e2e8f0", background: "#f8fafc", cursor: "pointer", textAlign: "left" }}>
              <div className="action-icon" style={{ width: "34px", height: "34px", borderRadius: "10px", background: "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "16px", flexShrink: 0 }}>+</div>
              <div className="action-info">
                <strong style={{ display: "block", fontSize: "13px", color: "#0f172a", fontWeight: "800" }}>Add New Jersey</strong>
                <span style={{ fontSize: "11px", color: "#64748b" }}>Upload photos, set size &amp; price in ₹</span>
              </div>
            </button>

            <button className="action-btn" onClick={() => setActiveTab("products")} style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1.5px solid #e2e8f0", background: "#f8fafc", cursor: "pointer", textAlign: "left" }}>
              <div className="action-icon" style={{ width: "34px", height: "34px", borderRadius: "10px", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", flexShrink: 0 }}>📋</div>
              <div className="action-info">
                <strong style={{ display: "block", fontSize: "13px", color: "#0f172a", fontWeight: "800" }}>Manage Catalog</strong>
                <span style={{ fontSize: "11px", color: "#64748b" }}>Update badges, sale discounts &amp; stock</span>
              </div>
            </button>

            <button className="action-btn" onClick={() => setActiveTab("settings")} style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1.5px solid #e2e8f0", background: "#f8fafc", cursor: "pointer", textAlign: "left" }}>
              <div className="action-icon" style={{ width: "34px", height: "34px", borderRadius: "10px", background: "#f1f5f9", color: "#475569", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", flexShrink: 0 }}>⚙️</div>
              <div className="action-info">
                <strong style={{ display: "block", fontSize: "13px", color: "#0f172a", fontWeight: "800" }}>Store Announcement Bar</strong>
                <span style={{ fontSize: "11px", color: "#64748b" }}>Edit top banner promotional messaging</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
