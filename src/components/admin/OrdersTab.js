"use client";

export default function OrdersTab({ orders = [], onUpdateStatus, onDeleteOrder, onClearOrders }) {
  return (
    <div className="tab-content fade-in">
      <div className="admin-card">
        <div className="admin-card-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h3>Customer Orders Management</h3>
            <span className="subhead-text">Real-time customer order updates</span>
          </div>
          {orders.length > 0 && onClearOrders && (
            <button
              onClick={() => {
                if (confirm("Clear all customer orders?")) {
                  onClearOrders();
                }
              }}
              style={{
                background: "#fef2f2",
                color: "#ef4444",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: "800",
                cursor: "pointer",
              }}
            >
              Clear All Orders
            </button>
          )}
        </div>

        {orders.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center", color: "#64748b" }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>📦</div>
            <h4 style={{ fontSize: "16px", fontWeight: "900", color: "#0f172a", margin: "0 0 6px" }}>
              No Orders Found
            </h4>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
              Dummy orders removed. Customer orders placed on the store front will automatically appear here.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", width: "100%" }}>
            <table className="admin-table" style={{ width: "100%", minWidth: "660px", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1.5px solid #e2e8f0", textAlign: "left" }}>
                  <th style={{ padding: "12px 14px", fontSize: "11px", fontWeight: "800", color: "#64748b" }}>Order ID</th>
                  <th style={{ padding: "12px 14px", fontSize: "11px", fontWeight: "800", color: "#64748b" }}>Customer Info</th>
                  <th style={{ padding: "12px 14px", fontSize: "11px", fontWeight: "800", color: "#64748b" }}>Items Purchased</th>
                  <th style={{ padding: "12px 14px", fontSize: "11px", fontWeight: "800", color: "#64748b" }}>Date</th>
                  <th style={{ padding: "12px 14px", fontSize: "11px", fontWeight: "800", color: "#64748b" }}>Total</th>
                  <th style={{ padding: "12px 14px", fontSize: "11px", fontWeight: "800", color: "#64748b" }}>Status</th>
                  <th style={{ padding: "12px 14px", fontSize: "11px", fontWeight: "800", color: "#64748b", textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                      <strong>{order.id}</strong>
                    </td>
                    <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                      <div style={{ fontWeight: "800", color: "#0f172a" }}>{order.customer || order.name || "Guest Customer"}</div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>{order.email || order.phone || ""}</div>
                    </td>
                    <td style={{ padding: "12px 14px", color: "#475569", maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {order.items || (Array.isArray(order.cartItems) ? order.cartItems.map(i => `${i.name} (x${i.quantity})`).join(", ") : "1x Jersey Item")}
                    </td>
                    <td style={{ padding: "12px 14px", whiteSpace: "nowrap", color: "#64748b" }}>
                      {order.date || order.createdAt?.split("T")[0] || "Today"}
                    </td>
                    <td style={{ padding: "12px 14px", whiteSpace: "nowrap", fontWeight: "800", color: "#0f172a" }}>
                      ₹{(order.total || 0).toLocaleString()}
                    </td>
                    <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                      <select
                        value={order.status || "Processing"}
                        onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                        className={`status-select ${(order.status || "processing").toLowerCase()}`}
                        style={{ padding: "6px 12px", borderRadius: "8px", fontWeight: "800", fontSize: "12px", outline: "none", cursor: "pointer" }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td style={{ padding: "12px 14px", whiteSpace: "nowrap", textAlign: "right" }}>
                      {onDeleteOrder && (
                        <button
                          onClick={() => onDeleteOrder(order.id)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#ef4444",
                            fontWeight: "800",
                            fontSize: "12px",
                            cursor: "pointer",
                            padding: "4px 8px",
                          }}
                          title="Delete Order"
                        >
                          🗑 Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
