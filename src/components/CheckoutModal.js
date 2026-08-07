"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { clearCart } from "@/lib/cartStore";
import { addOrder } from "@/lib/orderStore";

const SAVED_ADDRESS_KEY = "90drip_saved_address";

export default function CheckoutModal({ isOpen, onClose, cart = [], subtotal = 0, discount = 0, shipping = 0, finalTotal = 0 }) {
  const [step, setStep] = useState("form"); // "form" | "confirmed"
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "cod",
  });
  const [orderId, setOrderId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Saved address state
  const [savedAddress, setSavedAddress] = useState(null); // { phone, address, city, pincode }
  const [usingSavedAddress, setUsingSavedAddress] = useState(true);

  // On open: load user info and saved address from localStorage
  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem("90drip_user");
        if (saved) {
          const user = JSON.parse(saved);
          setFormData((prev) => ({
            ...prev,
            name: prev.name || user.name || "",
            email: prev.email || user.email || "",
          }));

          // Load saved address for this user
          const rawAddr = localStorage.getItem(`${SAVED_ADDRESS_KEY}_${user.email}`);
          if (rawAddr) {
            const addr = JSON.parse(rawAddr);
            setSavedAddress(addr);
            setUsingSavedAddress(true);
            // Pre-fill form with saved values
            setFormData((prev) => ({
              ...prev,
              phone: addr.phone || prev.phone,
              address: addr.address || prev.address,
              city: addr.city || prev.city,
              pincode: addr.pincode || prev.pincode,
            }));
          } else {
            setSavedAddress(null);
            setUsingSavedAddress(false);
          }
        }
      } catch (e) {
        console.error("Failed to load signed in user in checkout:", e);
      }
    }
  }, [isOpen]);

  // When user switches to "use saved address", fill form fields from saved data
  const handleUseSavedAddress = () => {
    if (savedAddress) {
      setFormData((prev) => ({
        ...prev,
        phone: savedAddress.phone || prev.phone,
        address: savedAddress.address || prev.address,
        city: savedAddress.city || prev.city,
        pincode: savedAddress.pincode || prev.pincode,
      }));
    }
    setUsingSavedAddress(true);
  };

  // When user switches to "enter new address", clear the address fields
  const handleUseNewAddress = () => {
    setFormData((prev) => ({
      ...prev,
      phone: "",
      address: "",
      city: "",
      pincode: "",
    }));
    setUsingSavedAddress(false);
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(async () => {
      const placed = await addOrder({
        customer: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city} - ${formData.pincode}`,
        items: cart.map((i) => `${i.name} (${i.size || "M"}) x${i.quantity}`).join(", "),
        cartItems: cart,
        total: finalTotal,
        paymentMethod: formData.paymentMethod,
      });

      // Save / update address for next checkout
      try {
        if (formData.email) {
          const addrToSave = {
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            pincode: formData.pincode,
          };
          localStorage.setItem(`${SAVED_ADDRESS_KEY}_${formData.email}`, JSON.stringify(addrToSave));
        }
      } catch (e) {
        console.error("Failed to save address:", e);
      }

      setOrderId(placed.id);
      setSubmitting(false);
      setStep("confirmed");
      clearCart();
    }, 1000);
  };


  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(8px)",
        zIndex: 100000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "520px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)",
          border: "1px solid rgba(226, 232, 240, 0.8)",
          padding: "28px",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "#f1f5f9",
            border: "none",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            cursor: "pointer",
            fontWeight: "bold",
            color: "#64748b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </button>

        {step === "form" ? (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "900",
                  color: "#2563eb",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  background: "#eff6ff",
                  padding: "4px 10px",
                  borderRadius: "20px",
                }}
              >
                Secure Checkout
              </span>
              <h2 style={{ fontSize: "22px", fontWeight: "900", color: "#0f172a", margin: "8px 0 4px" }}>
                Delivery & Payment
              </h2>
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0, fontWeight: "600" }}>
                Complete your details to place your 90DRIP jersey order.
              </p>
            </div>

            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "12px 16px",
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>
                  Items ({cart.length})
                </span>
                <div style={{ fontSize: "13px", fontWeight: "800", color: "#0f172a" }}>
                  Total: ₹{finalTotal.toLocaleString()}
                </div>
              </div>
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#16a34a", background: "#dcfce7", padding: "4px 8px", borderRadius: "6px" }}>
                Express Shipping
              </span>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={formData.name}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="10-digit phone"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="alex@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* ── Saved Address Card ─────────────────────────────────── */}
              {savedAddress && (
                <div>
                  {/* Toggle Tabs */}
                  <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                    <button
                      type="button"
                      onClick={handleUseSavedAddress}
                      style={{
                        flex: 1,
                        padding: "9px 12px",
                        borderRadius: "10px",
                        border: usingSavedAddress ? "2px solid #16a34a" : "1.5px solid #e2e8f0",
                        background: usingSavedAddress ? "#f0fdf4" : "#f8fafc",
                        color: usingSavedAddress ? "#15803d" : "#64748b",
                        fontSize: "12px",
                        fontWeight: "800",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        justifyContent: "center",
                      }}
                    >
                      <span>✓</span> Use Saved Address
                    </button>
                    <button
                      type="button"
                      onClick={handleUseNewAddress}
                      style={{
                        flex: 1,
                        padding: "9px 12px",
                        borderRadius: "10px",
                        border: !usingSavedAddress ? "2px solid #2563eb" : "1.5px solid #e2e8f0",
                        background: !usingSavedAddress ? "#eff6ff" : "#f8fafc",
                        color: !usingSavedAddress ? "#1d4ed8" : "#64748b",
                        fontSize: "12px",
                        fontWeight: "800",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        justifyContent: "center",
                      }}
                    >
                      <span>+</span> New Address
                    </button>
                  </div>

                  {/* Saved Address Preview */}
                  {usingSavedAddress && (
                    <div style={{
                      background: "#f0fdf4",
                      border: "1.5px solid #86efac",
                      borderRadius: "12px",
                      padding: "12px 14px",
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start",
                    }}>
                      <div style={{ marginTop: "2px", fontSize: "16px", flexShrink: 0 }}>📍</div>
                      <div>
                        <div style={{ fontSize: "11px", fontWeight: "800", color: "#15803d", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "3px" }}>
                          Saved Address
                        </div>
                        <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", lineHeight: "1.5" }}>
                          {savedAddress.address}
                        </div>
                        <div style={{ fontSize: "12px", color: "#334155", fontWeight: "600" }}>
                          {savedAddress.city} – {savedAddress.pincode}
                        </div>
                        {savedAddress.phone && (
                          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginTop: "2px" }}>
                            📞 {savedAddress.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Address fields — hidden when using saved address */}
              {!usingSavedAddress && (
                <>
                <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                  Street Address & Flat / House No. *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="Building name, street, locality"
                  value={formData.address}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="e.g. Mumbai"
                    value={formData.city}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    placeholder="6-digit pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>
              </div>
              </>
              )}


              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "800", color: "#0f172a", marginBottom: "8px", textTransform: "uppercase" }}>
                  Select Payment Method
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[
                    { id: "cod", label: "Cash on Delivery (COD)", sub: "Pay cash upon package delivery" },
                    { id: "upi", label: "Instant UPI / GPay / PhonePe", sub: "Scan QR or pay via UPI App" },
                    { id: "card", label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay" },
                  ].map((method) => (
                    <label
                      key={method.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 14px",
                        borderRadius: "12px",
                        border: formData.paymentMethod === method.id ? "2px solid #2563eb" : "1px solid #e2e8f0",
                        background: formData.paymentMethod === method.id ? "#eff6ff" : "#ffffff",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={formData.paymentMethod === method.id}
                        onChange={handleChange}
                      />
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a" }}>{method.label}</div>
                        <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "500" }}>{method.sub}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  marginTop: "10px",
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #0f172a, #1e293b)",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: "900",
                  border: "none",
                  cursor: submitting ? "not-allowed" : "pointer",
                  letterSpacing: "0.04em",
                  boxShadow: "0 10px 20px rgba(15, 23, 42, 0.2)",
                }}
              >
                {submitting ? "Processing Order..." : `Place Order • ₹${finalTotal.toLocaleString()}`}
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation Screen */
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "900",
                color: "#16a34a",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                background: "#dcfce7",
                padding: "4px 12px",
                borderRadius: "20px",
              }}
            >
              Order Confirmed!
            </span>

            <h2 style={{ fontSize: "24px", fontWeight: "900", color: "#0f172a", margin: "12px 0 6px" }}>
              Thank You for Your Order!
            </h2>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px" }}>
              Your 90DRIP order has been received and is being prepared for dispatch.
            </p>

            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                padding: "16px",
                marginBottom: "24px",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "700" }}>Order Number</span>
                <span style={{ fontSize: "14px", fontWeight: "900", color: "#2563eb" }}>{orderId}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "700" }}>Customer</span>
                <span style={{ fontSize: "13px", fontWeight: "800", color: "#0f172a" }}>{formData.name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "700" }}>Delivery Location</span>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>{formData.city}, {formData.pincode}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "700" }}>Est. Delivery</span>
                <span style={{ fontSize: "13px", fontWeight: "800", color: "#16a34a" }}>3 - 5 Business Days</span>
              </div>
            </div>

            <Link
              href="/"
              onClick={onClose}
              style={{
                display: "inline-block",
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                background: "#2563eb",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: "900",
                textDecoration: "none",
              }}
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
