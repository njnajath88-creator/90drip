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

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const FREE_SHIPPING_THRESHOLD = 1499;
  const shippingProgress = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);
  const amountNeeded = FREE_SHIPPING_THRESHOLD - cartTotal;

  return (
    <>
      {isOpen && (
        <div
          className="cart-overlay open"
          aria-hidden="true"
          onClick={onClose}
        />
      )}
      <aside
        className={`cart-sidebar ${isOpen ? "open" : ""}`}
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="cart-header">
          <div className="cart-title-container">
            <h2 className="cart-title">Your Cart</h2>
            {cart.length > 0 && (
              <span className="cart-badge">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
            )}
          </div>
          <button
            className="cart-close-btn"
            onClick={onClose}
            aria-label="Close cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Free Shipping Bar */}
        {cart.length > 0 && (
          <div className="shipping-progress-wrapper">
            <div className="shipping-progress-text">
              {amountNeeded > 0 ? (
                <>Add <span className="shipping-highlight">₹{amountNeeded.toLocaleString()}</span> more for <span className="shipping-free">FREE Express Delivery</span> 🚀</>
              ) : (
                <span className="shipping-unlocked">🎉 You&apos;ve unlocked FREE Express Delivery!</span>
              )}
            </div>
            <div className="shipping-progress-bar">
              <div
                className="shipping-progress-fill"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <div className="empty-icon-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </div>
              <h3 className="empty-title">Your cart is empty</h3>
              <p className="empty-desc">Discover the freshest jerseys and drip added to our catalog.</p>
              <button onClick={onClose} className="btn-empty-shop">
                Explore Collections
              </button>
            </div>
          ) : (
            cart.map((item, idx) => {
              const itemKey = item.cartItemId || item.id || idx;
              return (
                <div key={itemKey} className="cart-item">
                  <div className="cart-item-img-wrap">
                    <Image
                      src={item.image || "/images/jersey_product1.png"}
                      alt={item.name}
                      width={80}
                      height={96}
                      loading="lazy"
                      className="cart-item-img"
                    />
                  </div>
                  <div className="cart-item-details">
                    <div className="cart-item-header">
                      <span className="cart-item-title">{item.name}</span>
                      <button
                        className="remove-item-btn"
                        onClick={() => removeFromCart && removeFromCart(itemKey)}
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>

                    {item.size && (
                      <div className="cart-item-size-tag">
                        Size: <span>{item.size}</span>
                      </div>
                    )}

                    <div className="cart-item-footer">
                      <div className="cart-item-price">
                        ₹{parseFloat(item.price).toLocaleString()}
                      </div>
                      <div className="cart-qty-controls">
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity && updateQuantity(itemKey, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="qty-val">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity && updateQuantity(itemKey, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-rows">
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="cart-summary-row">
                <span>Shipping</span>
                <span>{amountNeeded <= 0 ? <strong style={{ color: "#16a34a" }}>FREE</strong> : "Calculated at checkout"}</span>
              </div>
            </div>
            <div className="cart-total-row">
              <span>Total</span>
              <span className="cart-total-amount">₹{cartTotal.toLocaleString()}</span>
            </div>
            
            <Link
              href="/cart"
              onClick={onClose}
              className="btn-checkout-primary"
            >
              <span>VIEW FULL CART PAGE</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>

            <div className="cart-trust-badges">
              <span>🔒 256-Bit SSL Secured</span>
              <span>⚡ Express Shipping</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

