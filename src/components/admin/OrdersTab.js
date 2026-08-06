"use client";
import { useState } from "react";

export default function OrdersTab({ orders = [], onUpdateStatus, onDeleteOrder, onClearOrders }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getItemsList = (order) => {
    if (order.cartItems && order.cartItems.length > 0) {
      return order.cartItems;
    }
    const itemsText = order.items || "Jersey Item";
    const quantityMatch = itemsText.match(/x\s*(\d+)/i);
    const quantity = quantityMatch ? parseInt(quantityMatch[1], 10) : 1;
    const sizeMatch = itemsText.match(/\(([^)]+)\)/);
    const size = sizeMatch ? sizeMatch[1] : "M";
    const name = itemsText.replace(/\([^)]+\)/g, "").replace(/x\s*\d+/gi, "").trim();

    return [{
      name: name || "Jersey Item",
      size: size || "M",
      quantity: quantity,
      image: "/images/jersey_product1.png",
      price: (order.total || 498) / quantity
    }];
  };

  const printShippingLabel = (order) => {
    const itemsList = getItemsList(order);
    const printWindow = window.open("", "_blank", "width=700,height=850");
    if (!printWindow) {
      alert("Please allow popups to print shipping labels.");
      return;
    }

    const logoUrl = window.location.origin + "/images/90driplogo.png";
    const itemsHtml = itemsList.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center; font-weight: bold;">${item.size || 'M'}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center; font-weight: bold;">${item.quantity}</td>
      </tr>
    `).join("");

    const barcodeNumber = order.id.replace(/\D/g, "") || "90264071";

    printWindow.document.write(`
      <html>
        <head>
          <title>Shipping Label - ${order.id}</title>
          <style>
            @page {
              size: auto;
              margin: 0mm;
            }
            body {
              font-family: 'Courier New', Courier, monospace;
              padding: 20px;
              color: #000;
              background-color: #fff;
              margin: 0;
            }
            .label-card {
              border: 3px dashed #000;
              padding: 20px;
              max-width: 600px;
              margin: 0 auto;
              box-sizing: border-box;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 3px solid #000;
              padding-bottom: 15px;
              margin-bottom: 15px;
            }
            .logo-img {
              height: 45px;
              object-fit: contain;
            }
            .header-title {
              text-align: right;
            }
            .header-title h2 {
              margin: 0;
              font-size: 20px;
              font-weight: 900;
              letter-spacing: 1px;
            }
            .header-title p {
              margin: 4px 0 0;
              font-size: 11px;
              font-weight: bold;
            }
            .addresses {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              border-bottom: 3px solid #000;
              padding-bottom: 15px;
              margin-bottom: 15px;
            }
            .address-box {
              font-size: 12px;
              line-height: 1.4;
            }
            .address-box h3 {
              margin: 0 0 6px;
              font-size: 13px;
              text-transform: uppercase;
              border-bottom: 1px solid #000;
              padding-bottom: 2px;
              display: inline-block;
            }
            .order-meta {
              display: grid;
              grid-template-columns: 1.2fr 0.8fr;
              gap: 15px;
              border-bottom: 3px solid #000;
              padding-bottom: 15px;
              margin-bottom: 15px;
            }
            .meta-item {
              font-size: 13px;
              line-height: 1.4;
            }
            .barcode-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            .barcode-lines {
              display: flex;
              justify-content: center;
              height: 40px;
              margin-bottom: 4px;
              width: 100%;
              max-width: 220px;
              overflow: hidden;
            }
            .barcode-line {
              width: 2px;
              height: 100%;
              background-color: #000;
              margin-right: 1.5px;
            }
            .barcode-line.wide {
              width: 5px;
            }
            .barcode-line.spacer {
              width: 1px;
              background-color: transparent;
            }
            .contents-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 15px;
              font-size: 12px;
            }
            .contents-table th {
              background-color: #f2f2f2;
              padding: 8px;
              text-align: left;
              border: 1px solid #000;
              text-transform: uppercase;
            }
            .contents-table td {
              border: 1px solid #000;
            }
            .footer-msg {
              text-align: center;
              font-size: 11px;
              font-weight: bold;
              border-top: 1px solid #000;
              padding-top: 10px;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="label-card">
            <div class="header">
              <img src="${logoUrl}" alt="90Drip Logo" class="logo-img" onerror="this.style.display='none'" />
              <div class="header-title">
                <h2>90DRIP PARCEL</h2>
                <p>FASTEST STANDARD DELIVERY</p>
              </div>
            </div>
            
            <div class="addresses">
              <div class="address-box">
                <h3>SENDER (FROM):</h3>
                <div><strong>90DRIP WAREHOUSE</strong></div>
                <div>Plot 402, Sector 18, Vashi</div>
                <div>Navi Mumbai, MH - 400703</div>
                <div>support@90drip.com</div>
              </div>
              <div class="address-box">
                <h3>SHIP TO (TO):</h3>
                <div><strong>${order.customer || order.name || 'Guest Customer'}</strong></div>
                <div>${order.address || 'No address details provided'}</div>
                <div>Phone: ${order.phone || 'N/A'}</div>
                <div>Email: ${order.email || 'N/A'}</div>
              </div>
            </div>
            
            <div class="order-meta">
              <div class="meta-item">
                <div><strong>ORDER ID:</strong> ${order.id}</div>
                <div><strong>DATE:</strong> ${order.date || order.createdAt?.split("T")[0] || 'Today'}</div>
                <div><strong>PAYMENT:</strong> ${order.paymentMethod?.toUpperCase() || 'COD'}</div>
                <div><strong>TOTAL DUE:</strong> ₹${(order.total || 0).toLocaleString()}</div>
              </div>
              <div class="barcode-container">
                <div class="barcode-lines">
                  ${Array.from({ length: 24 }).map((_, idx) => {
                    const isWide = (idx * 7) % 3 === 0;
                    const isSpacer = (idx * 5) % 4 === 0;
                    if (isSpacer) return '<div class="barcode-line spacer"></div>';
                    return `<div class="barcode-line ${isWide ? 'wide' : ''}"></div>`;
                  }).join("")}
                </div>
                <div style="font-size: 10px; font-weight: bold; letter-spacing: 2px;">*${barcodeNumber}*</div>
              </div>
            </div>
            
            <table class="contents-table">
              <thead>
                <tr>
                  <th style="padding: 8px; border: 1px solid #000;">Item Name</th>
                  <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 60px;">Size</th>
                  <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 50px;">Qty</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            
            <div class="footer-msg">
              Thank you for ordering with 90DRIP! Scan for support.
            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };
  return (
    <div className="tab-content fade-in">
      <style>{`
        .admin-orders-desktop {
          display: block;
        }
        .admin-orders-mobile {
          display: none;
        }
        @media (max-width: 768px) {
          .admin-orders-desktop {
            display: none !important;
          }
          .admin-orders-mobile {
            display: flex !important;
            flex-direction: column;
            gap: 14px;
          }
        }
      `}</style>

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
          <>
            {/* Desktop Table View */}
            <div className="admin-orders-desktop" style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", width: "100%" }}>
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
                      <td 
                        onClick={() => setSelectedOrder(order)}
                        style={{ padding: "12px 14px", color: "#2563eb", fontWeight: "700", cursor: "pointer", maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis" }}
                        title="Click to view details & print shipping label"
                      >
                        <span style={{ textDecoration: "underline" }}>
                          {order.items || (Array.isArray(order.cartItems) ? order.cartItems.map(i => `${i.name} (x${i.quantity})`).join(", ") : "1x Jersey Item")}
                        </span>
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
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px"
                            }}
                            title="Delete Order"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            <span>Delete</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Touch-Friendly Card View */}
            <div className="admin-orders-mobile">
              {orders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    border: "1.5px solid #e2e8f0",
                    padding: "16px",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {/* Row 1: Order ID & Status Dropdown */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontSize: "15px", fontWeight: "900", color: "#0f172a" }}>
                      #{order.id}
                    </div>
                    <select
                      value={order.status || "Processing"}
                      onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                      className={`status-select ${(order.status || "processing").toLowerCase()}`}
                      style={{ padding: "6px 10px", borderRadius: "8px", fontWeight: "800", fontSize: "11px", outline: "none", cursor: "pointer" }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Row 2: Customer Box */}
                  <div style={{ background: "#f8fafc", padding: "10px 12px", borderRadius: "10px", border: "1px solid #f1f5f9" }}>
                    <div style={{ fontSize: "13px", fontWeight: "800", color: "#0f172a" }}>
                      {order.customer || order.name || "Guest Customer"}
                    </div>
                    {(order.email || order.phone) && (
                      <div style={{ fontSize: "11px", color: "#64748b", marginTop: "3px" }}>
                        {order.email || order.phone}
                      </div>
                    )}
                  </div>

                  {/* Row 3: Items */}
                  <div 
                    onClick={() => setSelectedOrder(order)}
                    style={{ padding: "0 2px", cursor: "pointer" }}
                    title="Click to view details & print shipping label"
                  >
                    <span style={{ fontSize: "10px", fontWeight: "900", color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.06em", textDecoration: "underline" }}>
                      Items Purchased:
                    </span>
                    <div style={{ fontSize: "12px", fontWeight: "700", color: "#334155", marginTop: "3px", lineHeight: "1.4" }}>
                      {order.items || (Array.isArray(order.cartItems) ? order.cartItems.map(i => `${i.name} (${i.size || "M"}) x${i.quantity}`).join(", ") : "1x Jersey Item")}
                    </div>
                  </div>

                  {/* Row 4: Total, Date & Actions */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "10px", borderTop: "1px solid #f1f5f9" }}>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: "900", color: "#0f172a" }}>
                        ₹{(order.total || 0).toLocaleString()}
                      </div>
                      <div style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "700" }}>
                        Date: {order.date || order.createdAt?.split("T")[0] || "Today"}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        style={{
                          background: "#f0fdf4",
                          color: "#16a34a",
                          border: "1px solid #bbf7d0",
                          borderRadius: "8px",
                          padding: "6px 12px",
                          fontSize: "11px",
                          fontWeight: "800",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                          <line x1="7" y1="7" x2="7.01" y2="7"></line>
                        </svg>
                        <span>Label</span>
                      </button>
                      {onDeleteOrder && (
                        <button
                          onClick={() => onDeleteOrder(order.id)}
                          style={{
                            background: "#fef2f2",
                            color: "#ef4444",
                            border: "1px solid #fecaca",
                            borderRadius: "8px",
                            padding: "6px 12px",
                            fontSize: "11px",
                            fontWeight: "800",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Order Details & Shipping Label Modal */}
      {selectedOrder && (() => {
        const itemsList = getItemsList(selectedOrder);
        return (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.4)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px"
          }}>
            <div style={{
              background: "#ffffff",
              borderRadius: "24px",
              border: "1px solid #e2e8f0",
              maxWidth: "550px",
              width: "100%",
              boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
              display: "flex",
              flexDirection: "column",
              maxHeight: "90vh",
              overflow: "hidden"
            }}>
              {/* Modal Header */}
              <div style={{
                padding: "20px 24px",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: "900", color: "#0f172a", margin: 0 }}>
                    Order Details & Shipping Labels
                  </h4>
                  <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "700" }}>
                    ID: {selectedOrder.id} • {selectedOrder.date || selectedOrder.createdAt?.split("T")[0] || "Today"}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  style={{
                    background: "#f1f5f9",
                    border: "none",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#64748b"
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
                
                {/* Section 1: Customer Details */}
                <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
                  <div style={{ fontSize: "11px", fontWeight: "900", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
                    Customer Details
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a" }}>
                      {selectedOrder.customer || selectedOrder.name || "Guest Customer"}
                    </div>
                    {(selectedOrder.email || selectedOrder.phone) && (
                      <div style={{ fontSize: "12px", color: "#475569", fontWeight: "600" }}>
                        <strong>Email:</strong> {selectedOrder.email || "N/A"} • <strong>Phone:</strong> {selectedOrder.phone || "N/A"}
                      </div>
                    )}
                    <div style={{ fontSize: "12px", color: "#475569", fontWeight: "600", marginTop: "4px" }}>
                      <strong>Address:</strong> {selectedOrder.address || "No address details provided"}
                    </div>
                  </div>
                </div>

                {/* Section 2: Items Purchased (WITH IMAGES) */}
                <div>
                  <div style={{ fontSize: "11px", fontWeight: "900", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
                    Items in Order ({itemsList.length})
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {itemsList.map((item, idx) => (
                      <div key={idx} style={{ display: "flex", gap: "16px", alignItems: "center", background: "#ffffff", padding: "16px", borderRadius: "20px", border: "1.5px solid #f1f5f9" }}>
                        <img
                          src={item.image || "/images/jersey_product1.png"}
                          alt={item.name}
                          style={{ width: "96px", height: "116px", objectFit: "cover", borderRadius: "12px", border: "1px solid #e2e8f0" }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a" }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px", fontWeight: "600" }}>
                            Size: <span style={{ color: "#0f172a", fontWeight: "800" }}>{item.size || "M"}</span> • Qty: <span style={{ color: "#0f172a", fontWeight: "800" }}>{item.quantity}</span>
                          </div>
                        </div>
                        <div style={{ fontSize: "14px", fontWeight: "900", color: "#0f172a" }}>
                          ₹{(parseFloat(item.price || 498) * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: Payment & Pricing */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "14px" }}>
                  <div>
                    <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "800", textTransform: "uppercase" }}>
                      Payment Method
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: "800", color: "#0f172a", marginTop: "2px" }}>
                      {selectedOrder.paymentMethod?.toUpperCase() || "COD"}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "800", textTransform: "uppercase" }}>
                      Grand Total
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: "900", color: "#0f172a", marginTop: "2px" }}>
                      ₹{(selectedOrder.total || 0).toLocaleString()}
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div style={{
                padding: "16px 24px",
                borderTop: "1px solid #f1f5f9",
                background: "#f8fafc",
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end"
              }}>
                <button
                  onClick={() => setSelectedOrder(null)}
                  style={{
                    background: "#ffffff",
                    color: "#475569",
                    border: "1.5px solid #cbd5e1",
                    borderRadius: "12px",
                    padding: "10px 16px",
                    fontSize: "13px",
                    fontWeight: "800",
                    cursor: "pointer"
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => printShippingLabel(selectedOrder)}
                  style={{
                    background: "#0f172a",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "12px",
                    padding: "10px 20px",
                    fontSize: "13px",
                    fontWeight: "900",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(15,23,42,0.15)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                  </svg>
                  <span>Print Shipping Label</span>
                </button>
              </div>

            </div>
          </div>
        );
      })()}
    </div>
  );
}
