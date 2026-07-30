"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CheckoutModal from "@/components/CheckoutModal";
import {
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "@/lib/cartStore";

const PROMO_CODES = {
  DRIP10: { type: "percent", value: 10, label: "10% Off Everything" },
  FIRST200: { type: "flat", value: 200, label: "₹200 Off Orders" },
  WELCOME20: { type: "percent", value: 20, label: "20% New Customer Discount" },
};

const FREE_SHIPPING_THRESHOLD = 1999;

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Sync cart from cartStore
  useEffect(() => {
    const syncCart = () => {
      setCart(getCart());
    };
    syncCart();

    window.addEventListener("90drip_cart_updated", syncCart);
    return () => window.removeEventListener("90drip_cart_updated", syncCart);
  }, []);

  const handleUpdateQty = (cartItemId, newQty) => {
    const updated = updateCartQuantity(cartItemId, newQty);
    setCart(updated);
  };

  const handleRemoveItem = (cartItemId) => {
    const updated = removeFromCart(cartItemId);
    setCart(updated);
  };

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      const updated = clearCart();
      setCart(updated);
      setAppliedPromo(null);
    }
  };

  const handleApplyPromo = () => {
    setPromoError("");
    const cleanCode = promoInput.trim().toUpperCase();
    if (!cleanCode) return;

    if (PROMO_CODES[cleanCode]) {
      setAppliedPromo({ code: cleanCode, ...PROMO_CODES[cleanCode] });
      setPromoInput("");
    } else {
      setPromoError("Invalid coupon code. Try DRIP10 or FIRST200!");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };

  // Calculations
  const subtotal = cart.reduce(
    (acc, item) => acc + (parseFloat(item.price) || 0) * item.quantity,
    0
  );

  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === "percent") {
      discountAmount = Math.round((subtotal * appliedPromo.value) / 100);
    } else if (appliedPromo.type === "flat") {
      discountAmount = Math.min(appliedPromo.value, subtotal);
    }
  }

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shippingFee = isFreeShipping ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* Solid Navbar */}
      <Navbar
        solid={true}
        cartCount={cartCount}
        user={user}
        setUser={setUser}
      />

      <main style={{ paddingTop: "100px", paddingBottom: "100px" }}>
        <div className="container" style={{ maxWidth: "1200px" }}>
          
          {/* Breadcrumb Header */}
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                fontSize: "12px",
                color: "#64748b",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "8px",
              }}
            >
              <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>
                Home
              </Link>
              <span>›</span>
              <span style={{ color: "#0f172a", fontWeight: "800" }}>Shopping Cart</span>
            </div>

            <h1
              style={{
                fontSize: "32px",
                fontWeight: "900",
                color: "#0f172a",
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}
            >
              Your Shopping Cart ({cartCount})
            </h1>
          </div>

          {cart.length === 0 ? (
            /* Empty Cart View */
            <div
              style={{
                background: "#ffffff",
                borderRadius: "24px",
                padding: "80px 20px",
                textAlign: "center",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              </div>
              <h2 style={{ fontSize: "22px", fontWeight: "900", color: "#0f172a", margin: "0 0 8px" }}>
                Your Cart is Empty
              </h2>
              <p style={{ fontSize: "14px", color: "#64748b", maxWidth: "400px", margin: "0 auto 24px" }}>
                Looks like you haven't added any jerseys yet. Explore our latest collection of match kits and retro editions!
              </p>
              <Link
                href="/#shop"
                style={{
                  display: "inline-block",
                  background: "linear-gradient(135deg, #0f172a, #1e293b)",
                  color: "#ffffff",
                  padding: "14px 28px",
                  borderRadius: "14px",
                  fontWeight: "800",
                  fontSize: "14px",
                  textDecoration: "none",
                  boxShadow: "0 10px 20px rgba(15, 23, 42, 0.15)",
                }}
              >
                Explore All Jerseys →
              </Link>
            </div>
          ) : (
            /* Active Cart Layout */
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "32px" }} className="cart-grid-layout">
              
              {/* Left Column: Cart Items List & Progress Bar */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                
                {/* Free Shipping Progress Tracker Bar */}
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "18px",
                    padding: "20px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "800", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                      {isFreeShipping ? "You've Unlocked FREE Express Shipping!" : `Add ₹${amountNeededForFreeShipping.toLocaleString()} more for FREE Shipping!`}
                    </span>
                    <span style={{ fontSize: "12px", fontWeight: "900", color: isFreeShipping ? "#16a34a" : "#2563eb" }}>
                      {freeShippingProgress}%
                    </span>
                  </div>

                  <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "10px", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${freeShippingProgress}%`,
                        height: "100%",
                        background: isFreeShipping
                          ? "linear-gradient(90deg, #22c55e, #16a34a)"
                          : "linear-gradient(90deg, #3b82f6, #2563eb)",
                        borderRadius: "10px",
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                </div>

                {/* Cart Items Card */}
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "24px",
                    padding: "24px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid #f1f5f9", marginBottom: "16px" }}>
                    <span style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a" }}>
                      Items in Cart ({cart.length})
                    </span>
                    <button
                      onClick={handleClearCart}
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#ef4444",
                        cursor: "pointer",
                      }}
                    >
                      Clear All
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {cart.map((item, idx) => {
                      const itemKey = item.cartItemId || `${item.id}-${idx}`;
                      return (
                        <div
                          key={itemKey}
                          style={{
                            display: "flex",
                            gap: "14px",
                            paddingBottom: "16px",
                            borderBottom: idx === cart.length - 1 ? "none" : "1px solid #f1f5f9",
                            alignItems: "flex-start",
                          }}
                        >
                          {/* Image */}
                          <Image
                            src={item.image || "/images/jersey_product1.png"}
                            alt={item.name}
                            width={76}
                            height={90}
                            loading="lazy"
                            style={{
                              width: "76px",
                              height: "90px",
                              objectFit: "cover",
                              borderRadius: "12px",
                              border: "1px solid #e2e8f0",
                              background: "#f8fafc",
                              flexShrink: 0,
                            }}
                          />

                          {/* Details Container */}
                          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                            {/* Header: Title + Trash Button */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                              <h3 style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a", margin: 0, textTransform: "uppercase", lineHeight: 1.3 }}>
                                {item.name}
                              </h3>
                              <button
                                onClick={() => handleRemoveItem(itemKey)}
                                style={{
                                  background: "#fef2f2",
                                  border: "1px solid #fee2e2",
                                  color: "#ef4444",
                                  cursor: "pointer",
                                  borderRadius: "8px",
                                  width: "28px",
                                  height: "28px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                  padding: 0,
                                }}
                                title="Remove item"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                              </button>
                            </div>

                            {/* Meta Options (Size & Custom Printing) */}
                            <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                              <span style={{ fontSize: "11px", fontWeight: "800", background: "#f1f5f9", color: "#475569", padding: "2px 8px", borderRadius: "6px" }}>
                                Size: {item.size || "M"}
                              </span>
                              {item.customName && (
                                <span style={{ fontSize: "11px", fontWeight: "800", background: "#eff6ff", color: "#2563eb", padding: "2px 8px", borderRadius: "6px" }}>
                                  Printed: {item.customName} #{item.customNumber || "10"}
                                </span>
                              )}
                            </div>

                            {/* Bottom Row: Quantity Controls & Subtotal */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", marginTop: "4px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#f8fafc", padding: "3px 6px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                                <button
                                  onClick={() => handleUpdateQty(itemKey, item.quantity - 1)}
                                  style={{
                                    width: "24px",
                                    height: "24px",
                                    borderRadius: "6px",
                                    border: "none",
                                    background: "#ffffff",
                                    fontWeight: "bold",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  -
                                </button>
                                <span style={{ fontSize: "13px", fontWeight: "800", minWidth: "18px", textAlign: "center" }}>
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateQty(itemKey, item.quantity + 1)}
                                  style={{
                                    width: "24px",
                                    height: "24px",
                                    borderRadius: "6px",
                                    border: "none",
                                    background: "#ffffff",
                                    fontWeight: "bold",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  +
                                </button>
                              </div>

                              <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: "15px", fontWeight: "900", color: "#0f172a" }}>
                                  ₹{(parseFloat(item.price) * item.quantity).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Jersey Printing & Order Notes Box */}
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "20px",
                    padding: "20px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#0f172a", marginBottom: "6px" }}>
                    ✍️ Jersey Back Printing / Special Instructions
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Please print 'RONALDO 7' on the back, or leave instructions for delivery..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "13px",
                      outline: "none",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
              </div>

              {/* Right Column: Order Summary & Checkout */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                
                {/* Order Summary Card */}
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "24px",
                    padding: "24px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                    position: "sticky",
                    top: "100px",
                  }}
                >
                  <h2 style={{ fontSize: "18px", fontWeight: "900", color: "#0f172a", margin: "0 0 16px", textTransform: "uppercase" }}>
                    Order Summary
                  </h2>

                  {/* Promo Code Input */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#64748b", marginBottom: "6px" }}>
                      Have a Coupon / Promo Code?
                    </label>
                    
                    {appliedPromo ? (
                      <div
                        style={{
                          background: "#f0fdf4",
                          border: "1px solid #bbf7d0",
                          borderRadius: "10px",
                          padding: "10px 12px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: "800", color: "#16a34a" }}>
                            🎟️ {appliedPromo.code} ({appliedPromo.label})
                          </div>
                          <div style={{ fontSize: "11px", color: "#15803d" }}>Discount applied!</div>
                        </div>
                        <button
                          onClick={handleRemovePromo}
                          style={{ background: "none", border: "none", color: "#ef4444", fontWeight: "bold", cursor: "pointer" }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <input
                            type="text"
                            placeholder="Enter DRIP10 or FIRST200"
                            value={promoInput}
                            onChange={(e) => setPromoInput(e.target.value)}
                            style={{
                              flex: 1,
                              padding: "10px 12px",
                              borderRadius: "10px",
                              border: "1px solid #cbd5e1",
                              fontSize: "13px",
                              textTransform: "uppercase",
                              outline: "none",
                            }}
                          />
                          <button
                            onClick={handleApplyPromo}
                            style={{
                              background: "#0f172a",
                              color: "#ffffff",
                              border: "none",
                              padding: "0 16px",
                              borderRadius: "10px",
                              fontWeight: "800",
                              fontSize: "13px",
                              cursor: "pointer",
                            }}
                          >
                            Apply
                          </button>
                        </div>
                        {promoError && (
                          <div style={{ fontSize: "11px", color: "#ef4444", fontWeight: "600", marginTop: "4px" }}>
                            {promoError}
                          </div>
                        )}
                        <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                          {["DRIP10", "FIRST200"].map((c) => (
                            <button
                              key={c}
                              onClick={() => {
                                setPromoInput(c);
                                setAppliedPromo({ code: c, ...PROMO_CODES[c] });
                              }}
                              style={{
                                fontSize: "10px",
                                fontWeight: "800",
                                background: "#eff6ff",
                                color: "#2563eb",
                                border: "1px dashed #93c5fd",
                                padding: "2px 8px",
                                borderRadius: "6px",
                                cursor: "pointer",
                              }}
                            >
                              + {c}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Calculations breakdown */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid #f1f5f9", paddingTop: "16px", marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#475569", fontWeight: "600" }}>
                      <span>Subtotal</span>
                      <span style={{ color: "#0f172a", fontWeight: "800" }}>₹{subtotal.toLocaleString()}</span>
                    </div>

                    {appliedPromo && (
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#16a34a", fontWeight: "700" }}>
                        <span>Coupon Discount ({appliedPromo.code})</span>
                        <span>- ₹{discountAmount.toLocaleString()}</span>
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#475569", fontWeight: "600" }}>
                      <span>Shipping Fee</span>
                      <span style={{ color: isFreeShipping ? "#16a34a" : "#0f172a", fontWeight: "800" }}>
                        {isFreeShipping ? "FREE" : "₹99"}
                      </span>
                    </div>

                    <div style={{ height: "1px", background: "#e2e8f0", margin: "4px 0" }} />

                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "900", color: "#0f172a" }}>
                      <span>Total Amount</span>
                      <span style={{ color: "#2563eb" }}>₹{finalTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Checkout Action Button */}
                  <button
                    onClick={() => setIsCheckoutOpen(true)}
                    style={{
                      width: "100%",
                      padding: "16px",
                      borderRadius: "14px",
                      background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                      color: "#ffffff",
                      fontSize: "15px",
                      fontWeight: "900",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 10px 25px rgba(37, 99, 235, 0.3)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Proceed to Checkout →
                  </button>

                  {/* Guarantee chips */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #f1f5f9" }}>
                    <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                      <span>100% Authentic Match Kits Guaranteed</span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                      <span>Fast 3-5 Days Express Delivery across India</span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                      <span>Easy 7-Day Replacement Policy</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        subtotal={subtotal}
        discount={discountAmount}
        shipping={shippingFee}
        finalTotal={finalTotal}
      />

      <style>{`
        @media (min-width: 900px) {
          .cart-grid-layout {
            grid-template-columns: 1fr 380px !important;
          }
        }

        @media (max-width: 768px) {
          main {
            padding-top: 80px !important;
            padding-bottom: 60px !important;
          }
          h1 {
            font-size: 22px !important;
          }
          .cart-grid-layout {
            gap: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}
