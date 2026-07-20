/* ==========================================
   90DRIP — JavaScript Logic (Minimalist Theme)
   ========================================== */

'use strict';

/* ---- Product Data ---- */
const PRODUCTS = [
  {
    id: 1,
    name: 'Unitus FC Elite',
    sport: 'Football',
    price: 89.99,
    originalPrice: 119.99,
    image: 'images/jersey_product1.png',
    badges: ['New'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 2,
    name: 'Classic #7 Red',
    sport: 'Football',
    price: 74.99,
    originalPrice: null,
    image: 'images/jersey_product2.png',
    badges: ['Sale'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 3,
    name: 'City FC #9 Blue',
    sport: 'Football',
    price: 79.99,
    originalPrice: 99.99,
    image: 'images/jersey_product3.png',
    badges: ['New'],
    sizes: ['S', 'M', 'L'],
  },
  {
    id: 4,
    name: 'Green Eagle #11',
    sport: 'Football',
    price: 69.99,
    originalPrice: null,
    image: 'images/jersey_product4.png',
    badges: [],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 5,
    name: 'Velocity #23',
    sport: 'Custom',
    price: 109.99,
    originalPrice: 139.99,
    image: 'images/jersey_product5.png',
    badges: ['Sold Out'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 6,
    name: 'Los Angeles #24',
    sport: 'Basketball',
    price: 129.99,
    originalPrice: 159.99,
    image: 'images/jersey_product6.png',
    badges: ['Sale'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 7,
    name: 'Aurora Premium',
    sport: 'Custom',
    price: 149.99,
    originalPrice: 189.99,
    image: 'images/hero_jersey.png',
    badges: ['Limited'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 8,
    name: 'World Kit Bundle',
    sport: 'Football',
    price: 64.99,
    originalPrice: null,
    image: 'images/jersey_collection.png',
    badges: [],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
];

/* ---- State ---- */
let cart = JSON.parse(localStorage.getItem('90drip_cart') || '[]');
let currentFilter = 'all';

/* ==========================================
   CART LOGIC
   ========================================== */
function saveCart() {
  localStorage.setItem('90drip_cart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const badge = document.getElementById('cart-badge');
  const cartFooter = document.getElementById('cart-footer');
  const cartItemsEl = document.getElementById('cart-items');

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Badge
  badge.textContent = totalItems;
  badge.style.display = totalItems === 0 ? 'none' : 'flex';

  // Cart body
  if (cart.length === 0) {
    cartFooter.style.display = 'none';
    cartItemsEl.innerHTML = '<div style="text-align:center; padding: 40px 0; color: var(--text-secondary);">Your cart is currently empty.</div>';
    return;
  }

  cartFooter.style.display = 'block';

  // Build cart items HTML
  let html = '';
  cart.forEach((item, idx) => {
    html += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name} (${item.size})</div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          <div class="qty-controls">
            <button class="qty-btn" onclick="updateQty(${idx}, -1)">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="updateQty(${idx}, 1)">+</button>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart(${idx})">Remove</button>
        </div>
      </div>
    `;
  });

  cartItemsEl.innerHTML = html;
  document.getElementById('cart-total-val').textContent = `$${total.toFixed(2)}`;
}

function addToCart(productId, size) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existingIdx = cart.findIndex(item => item.id === productId && item.size === size);
  if (existingIdx > -1) {
    cart[existingIdx].qty += 1;
  } else {
    cart.push({ ...product, size, qty: 1 });
  }

  saveCart();
  showToast(`Added ${product.name} to cart.`);
  openCart();
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  saveCart();
}

function updateQty(idx, delta) {
  cart[idx].qty = Math.max(1, cart[idx].qty + delta);
  saveCart();
}

function openCart() {
  document.getElementById('cart-overlay').classList.add('open');
  document.getElementById('cart-sidebar').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cart-overlay').classList.remove('open');
  document.getElementById('cart-sidebar').classList.remove('open');
  document.body.style.overflow = '';
}

function handleCheckout() {
  if(cart.length === 0) return;
  alert('Redirecting to secure checkout...');
  cart = [];
  saveCart();
  closeCart();
}

/* ==========================================
   PRODUCTS RENDER
   ========================================== */
function getBadgeHTML(badges) {
  return badges.map(b => `<span class="badge">${b}</span>`).join('');
}

function renderProducts(filter = 'all') {
  const grid = document.getElementById('products-grid');
  const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.sport === filter);

  grid.innerHTML = filtered.map(product => `
    <div class="product-card">
      <div class="product-img-wrap">
        <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" />
        ${product.badges.length > 0 ? `<div class="product-badges">${getBadgeHTML(product.badges)}</div>` : ''}
        <div class="product-actions-overlay">
          <button class="btn-quick-add" onclick="quickAdd(${product.id})">Quick Add</button>
        </div>
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price">
          ${product.originalPrice ? `<span class="price-original">Rs. ${product.originalPrice.toFixed(2)}</span>` : ''}
          <span class="price-current">Rs. ${product.price.toFixed(2)}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function filterProducts(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.filter === filter);
  });
  renderProducts(filter);
}

function quickAdd(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  // Default to first available size
  const defaultSize = product.sizes[0] || 'M';
  addToCart(productId, defaultSize);
}

/* ==========================================
   TOAST NOTIFICATIONS
   ========================================== */
function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.style.cssText = `
    background: #000;
    color: #fff;
    padding: 12px 24px;
    margin-top: 10px;
    font-size: 14px;
    font-weight: 500;
  `;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

/* ==========================================
   NAVBAR SCROLL
   ========================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  document.getElementById('cart-btn').addEventListener('click', openCart);
}

/* ==========================================
   INIT
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
  renderProducts('all');
  updateCartUI();
  initNavbar();
});
