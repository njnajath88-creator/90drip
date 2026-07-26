"use client";

const WISHLIST_KEY = "90drip_wishlist";

/**
 * Fetch all saved wishlist products
 */
export function getWishlist() {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(WISHLIST_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Failed to load wishlist from localStorage:", e);
    return [];
  }
}

/**
 * Save wishlist array and dispatch notification
 */
export function saveWishlist(items) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("90drip_wishlist_updated"));
  } catch (e) {
    console.error("Failed to save wishlist to localStorage:", e);
  }
}

/**
 * Check if a product is in wishlist
 */
export function isInWishlist(productId) {
  const current = getWishlist();
  return current.some((p) => String(p.id) === String(productId));
}

/**
 * Toggle product in wishlist (Add if not present, remove if present)
 */
export function toggleWishlist(product) {
  const current = getWishlist();
  const exists = current.some((p) => String(p.id) === String(product.id));

  let updated;
  if (exists) {
    updated = current.filter((p) => String(p.id) !== String(product.id));
  } else {
    updated = [product, ...current];
  }

  saveWishlist(updated);
  return { updated, isAdded: !exists };
}

/**
 * Remove item from wishlist
 */
export function removeFromWishlist(productId) {
  const current = getWishlist();
  const updated = current.filter((p) => String(p.id) !== String(productId));
  saveWishlist(updated);
  return updated;
}

/**
 * Clear wishlist
 */
export function clearWishlist() {
  saveWishlist([]);
  return [];
}
