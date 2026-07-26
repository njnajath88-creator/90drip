"use client";

const CART_KEY = "90drip_cart";

/**
 * Get current cart from localStorage
 */
export function getCart() {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Failed to load cart from localStorage:", e);
    return [];
  }
}

/**
 * Save cart to localStorage and notify all listeners
 */
export function saveCart(cart) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event("90drip_cart_updated"));
  } catch (e) {
    console.error("Failed to save cart to localStorage:", e);
  }
}

/**
 * Add product to cart
 */
export function addToCart(product, selectedSize = "M", customName = "", customNumber = "") {
  const currentCart = getCart();
  const existingIndex = currentCart.findIndex(
    (item) =>
      item.id === product.id &&
      (item.size || "M") === selectedSize &&
      (item.customName || "") === customName &&
      (item.customNumber || "") === customNumber
  );

  let newCart;
  if (existingIndex > -1) {
    newCart = [...currentCart];
    newCart[existingIndex].quantity += 1;
  } else {
    newCart = [
      ...currentCart,
      {
        ...product,
        size: selectedSize,
        customName,
        customNumber,
        quantity: 1,
        cartItemId: `${product.id}-${selectedSize}-${Date.now()}`,
      },
    ];
  }

  saveCart(newCart);
  return newCart;
}

/**
 * Update quantity of a cart item
 */
export function updateCartQuantity(cartItemId, newQuantity) {
  const currentCart = getCart();
  let newCart;
  if (newQuantity <= 0) {
    newCart = currentCart.filter(
      (item) => (item.cartItemId || item.id) !== cartItemId
    );
  } else {
    newCart = currentCart.map((item) =>
      (item.cartItemId || item.id) === cartItemId
        ? { ...item, quantity: newQuantity }
        : item
    );
  }
  saveCart(newCart);
  return newCart;
}

/**
 * Remove an item from cart
 */
export function removeFromCart(cartItemId) {
  const currentCart = getCart();
  const newCart = currentCart.filter(
    (item) => (item.cartItemId || item.id) !== cartItemId
  );
  saveCart(newCart);
  return newCart;
}

/**
 * Clear all items from cart
 */
export function clearCart() {
  saveCart([]);
  return [];
}
