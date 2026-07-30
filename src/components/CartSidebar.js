import Link from "next/link";
import Image from "next/image";

export default function CartSidebar({
  isOpen,
  onClose,
  cart = [],
  updateQuantity,
  removeFromCart,
}) {
  const cartTotal = cart.reduce(
    (total, item) => total + (parseFloat(item.price) || 0) * item.quantity,
    0
  );

  return (
    <>
      {isOpen && (
        <div
          className="cart-overlay"
          aria-hidden="true"
          onClick={onClose}
        />
      )}
      <aside
        className={`cart-sidebar ${isOpen ? "open" : ""}`}
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
      >
        <div className="cart-header">
          <h2 className="cart-title">Your Cart</h2>
          <button
            className="cart-close"
            onClick={onClose}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: "3rem", color: "#64748b" }}>
              <div style={{ fontSize: "40px", marginBottom: "8px" }}>🛍️</div>
              <p style={{ fontWeight: "700" }}>Your cart is empty.</p>
            </div>
          ) : (
            cart.map((item, idx) => {
              const itemKey = item.cartItemId || item.id || idx;
              return (
                <div key={itemKey} className="cart-item">
                  <Image
                    src={item.image || "/images/jersey_product1.png"}
                    alt={item.name}
                    width={70}
                    height={84}
                    loading="lazy"
                    className="cart-item-img"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="cart-item-details">
                    <div className="cart-item-title">{item.name}</div>
                    {item.size && (
                      <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "700" }}>
                        Size: {item.size}
                      </div>
                    )}
                    <div className="cart-item-price">₹{parseFloat(item.price).toLocaleString()}</div>
                    <div className="cart-qty-controls">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity && updateQuantity(itemKey, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity && updateQuantity(itemKey, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="remove-item"
                    onClick={() => removeFromCart && removeFromCart(itemKey)}
                  >
                    🗑️
                  </button>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Link
                href="/cart"
                onClick={onClose}
                className="btn-primary btn-checkout"
                style={{
                  textDecoration: "none",
                  textAlign: "center",
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
                }}
              >
                View Full Cart Page →
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
