"use client";

export default function OrdersTab({ orders, onUpdateStatus }) {
  return (
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
              {orders.map((order) => (
                <tr key={order.id}>
                  <td><strong>{order.id}</strong></td>
                  <td>
                    <div><strong>{order.customer}</strong></div>
                    <div className="text-muted" style={{ fontSize: "12px" }}>
                      {order.email}
                    </div>
                  </td>
                  <td>{order.items}</td>
                  <td>{order.date}</td>
                  <td><strong>₹{order.total.toLocaleString()}</strong></td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => onUpdateStatus(order.id, e.target.value)}
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
  );
}
