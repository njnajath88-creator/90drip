"use client";

export default function OrdersTab({ orders, onUpdateStatus }) {
  return (
    <div className="tab-content fade-in">
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Customer Orders Management</h3>
          <span className="subhead-text">Real-time status updates</span>
        </div>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", width: "100%" }}>
          <table className="admin-table" style={{ width: "100%", minWidth: "620px", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1.5px solid #e2e8f0", textAlign: "left" }}>
                <th style={{ padding: "12px 14px", fontSize: "11px", fontWeight: "800", color: "#64748b" }}>Order ID</th>
                <th style={{ padding: "12px 14px", fontSize: "11px", fontWeight: "800", color: "#64748b" }}>Customer Info</th>
                <th style={{ padding: "12px 14px", fontSize: "11px", fontWeight: "800", color: "#64748b" }}>Items Purchased</th>
                <th style={{ padding: "12px 14px", fontSize: "11px", fontWeight: "800", color: "#64748b" }}>Date</th>
                <th style={{ padding: "12px 14px", fontSize: "11px", fontWeight: "800", color: "#64748b" }}>Total</th>
                <th style={{ padding: "12px 14px", fontSize: "11px", fontWeight: "800", color: "#64748b" }}>Fulfillment Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}><strong>{order.id}</strong></td>
                  <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                    <div style={{ fontWeight: "800", color: "#0f172a" }}>{order.customer}</div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>{order.email}</div>
                  </td>
                  <td style={{ padding: "12px 14px", whiteSpace: "nowrap", color: "#475569" }}>{order.items}</td>
                  <td style={{ padding: "12px 14px", whiteSpace: "nowrap", color: "#64748b" }}>{order.date}</td>
                  <td style={{ padding: "12px 14px", whiteSpace: "nowrap", fontWeight: "800", color: "#0f172a" }}>₹{order.total.toLocaleString()}</td>
                  <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                    <select
                      value={order.status}
                      onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                      className={`status-select ${order.status.toLowerCase()}`}
                      style={{ padding: "6px 12px", borderRadius: "8px", fontWeight: "800", fontSize: "12px", outline: "none", cursor: "pointer" }}
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
  );
}
