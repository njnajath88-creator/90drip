"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch products from backend on mount
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  // Navbar scroll behaviour
  useEffect(() => {
    const navbar = document.getElementById('navbar');
    const onScroll = () => {
      if (window.scrollY > 50) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const filteredProducts = filter === "all" 
    ? products 
    : products.filter(p => p.sport === filter || p.badges.includes(filter));

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <>
      <nav className="navbar" id="navbar" role="navigation" aria-label="Main navigation">
        <div className="container">
          <div className="navbar-inner">

            {/* Left: nav-links on desktop | search+profile on mobile */}
            <div className="nav-left">
              <ul className="nav-links" role="list">
                <li><a href="#home">Home</a></li>
                <li><a href="#shop">Shop</a></li>
                <li><a href="#premium">Premium Quality</a></li>
                <li><a href="/admin" style={{ color: '#3b82f6', fontWeight: 600 }}>Admin</a></li>
              </ul>
              {/* Mobile-only left icons */}
              <button className="nav-icon-btn nav-icon-mobile" aria-label="Search">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </button>
              <button className="nav-icon-btn nav-icon-mobile" aria-label="User Account">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </button>
            </div>

            {/* Center: Logo */}
            <a href="#" className="nav-logo" aria-label="90Drip Home">
              <img src="/images/90driplogo.png" alt="90DRIP" className="nav-logo-img" />
            </a>

            {/* Right: all 4 icons on desktop | wishlist+cart only on mobile */}
            <div className="nav-actions">
              <button className="nav-icon-btn nav-icon-desktop" aria-label="Search">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </button>
              <button className="nav-icon-btn nav-icon-desktop" aria-label="User Account">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </button>
              <button className="nav-icon-btn" aria-label="Wishlist">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </button>
              <button className="nav-icon-btn" id="cart-btn" aria-label="Shopping cart" onClick={() => setIsCartOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                <span className="cart-badge">{cartCount}</span>
              </button>
            </div>

          </div>
        </div>
      </nav>

      <section 
        className="hero hero-banner" 
        id="home" 
        aria-label="Hero banner"
      >
        <h1 className="hero-title" style={{ display: 'none' }}>
          90DRIP
        </h1>
      </section>

      <div className="brands-slider">
        <div className="brands-track">
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ display: 'contents' }}>
              <img src="https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg" alt="Real Madrid" className="brand-logo" />
              <img src="https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg" alt="Barcelona" className="brand-logo" />
              <img src="https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg" alt="Manchester United" className="brand-logo" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg" alt="Bayern Munich" className="brand-logo" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/ed/Juventus_FC_-_logo_black_(Italy%2C_2020).svg" alt="Juventus" className="brand-logo" />
              <img src="https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg" alt="PSG" className="brand-logo" />
              <img src="https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg" alt="Arsenal" className="brand-logo" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg" alt="AC Milan" className="brand-logo" />
            </div>
          ))}
        </div>
      </div>

      <section className="products-section" id="shop" aria-label="Product catalog">
        <div className="container">
          <h2 className="section-title">world cup collections</h2>
          <div className="filter-tabs" role="tablist">
            {["all", "Football", "Basketball", "Custom"].map(tab => (
              <button 
                key={tab} 
                className={`filter-tab ${filter === tab ? "active" : ""}`} 
                onClick={() => setFilter(tab)}
              >
                {tab === 'Custom' ? 'Premium' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image-wrap">
                  <img src={product.image} alt={product.name} className="product-image" />
                  {product.badges.map(badge => (
                    <span key={badge} className={`product-badge badge-${badge.toLowerCase()}`}>{badge}</span>
                  ))}
                </div>
                <div className="product-info">
                  <span className="product-category">{product.sport}</span>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-price">
                    <span>₹{product.price}</span>
                    {product.originalPrice && <span className="original-price">₹{product.originalPrice}</span>}
                  </div>
                  <button className="btn-primary add-to-cart-btn" onClick={() => addToCart(product)}>Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="promo-section" id="premium" aria-label="Premium Quality">
        <div className="container">
          <h2 className="promo-title">Discover the Lines</h2>
          <p className="promo-desc">
            Explore our curated collection of authentic, premium-grade sports jerseys. Minimalist designs, maximum performance.
          </p>
          <button className="btn-primary" onClick={() => document.getElementById('shop')?.scrollIntoView({behavior:'smooth'})}>
            Shop Now
          </button>
        </div>
      </section>

      <footer className="footer" role="contentinfo">
        <div className="container">
          <div className="footer-grid">
            <div><a href="#" className="footer-logo">90drip</a></div>
            <div>
              <h4 className="footer-col-title">Shop</h4>
              <ul className="footer-links">
                <li><a href="#shop">New Arrivals</a></li>
                <li><a href="#shop">Bestsellers</a></li>
                <li><a href="#shop">Sale</a></li>
              </ul>
            </div>
            <div>
              <h4 className="footer-col-title">Customer Care</h4>
              <ul className="footer-links">
                <li><a href="#">Size Guide</a></li>
                <li><a href="#">Shipping Info</a></li>
                <li><a href="#">Returns</a></li>
                <li><a href="/admin">Admin Portal</a></li>
              </ul>
            </div>
            <div>
              <h4 className="footer-col-title">About</h4>
              <ul className="footer-links">
                <li><a href="#">Our Story</a></li>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 90Drip. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {isCartOpen && <div className="cart-overlay" aria-hidden="true" onClick={() => setIsCartOpen(false)}></div>}
      <aside className={`cart-sidebar ${isCartOpen ? "open" : ""}`} aria-label="Shopping cart" aria-hidden={!isCartOpen}>
        <div className="cart-header">
          <h2 className="cart-title">Your Cart</h2>
          <button className="cart-close" onClick={() => setIsCartOpen(false)} aria-label="Close cart">✕</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <p style={{ textAlign: "center", marginTop: "2rem" }}>Your cart is empty.</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-details">
                  <div className="cart-item-title">{item.name}</div>
                  <div className="cart-item-price">₹{item.price}</div>
                  <div className="cart-qty-controls">
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button className="remove-item" onClick={() => removeFromCart(item.id)}>🗑️</button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <button className="btn-primary btn-checkout" onClick={() => alert("Checkout not implemented yet!")}>Checkout</button>
          </div>
        )}
      </aside>
    </>
  );
}
