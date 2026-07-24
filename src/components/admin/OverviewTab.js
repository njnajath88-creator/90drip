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
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Recent Customer Orders</h3>
            <button className="btn-secondary-sm" onClick={() => setActiveTab("orders")}>
              View All
            </button>
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
                {orders.slice(0, 3).map((order) => (
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
            <button className="action-btn" onClick={onAddProduct}>
              <div className="action-icon">+</div>
              <div className="action-info">
                <strong>Add New Jersey</strong>
                <span>Upload photos, set size &amp; price in ₹</span>
              </div>
            </button>
            <button className="action-btn" onClick={() => setActiveTab("products")}>
              <div className="action-icon">📋</div>
              <div className="action-info">
                <strong>Manage Catalog</strong>
                <span>Update badges, sale discounts &amp; stock</span>
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
  );
}
