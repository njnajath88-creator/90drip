"use client";
import { useState, useEffect } from "react";

import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import BrandsSlider from "@/components/BrandsSlider";
import CategoriesSection from "@/components/CategoriesSection";
import MarqueeBanner from "@/components/MarqueeBanner";
import ProductsSection from "@/components/ProductsSection";
import FanGallerySection from "@/components/FanGallerySection";
import PromoSection from "@/components/PromoSection";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";

import {
  getCart,
  addToCart as addToCartStore,
  updateCartQuantity as updateCartStoreQty,
  removeFromCart as removeFromCartStore,
} from "@/lib/cartStore";

export default function HomePageClient({ initialProducts = [] }) {
  const [products, setProducts] = useState(initialProducts);
  const [filter, setFilter] = useState("all");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Sync cart from cartStore
  useEffect(() => {
    const syncCart = () => setCart(getCart());
    syncCart();
    window.addEventListener("90drip_cart_updated", syncCart);
    return () => window.removeEventListener("90drip_cart_updated", syncCart);
  }, []);

  // Cache products in sessionStorage as soon as they arrive from the server.
  // The product detail page reads this first — making product navigation
  // instant (0 network calls), exactly like CleanCuts uses its static data.
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      try {
        sessionStorage.setItem("90drip_products_cache", JSON.stringify(initialProducts));
        sessionStorage.setItem("90drip_products_cache_time", Date.now().toString());
      } catch (e) {
        // sessionStorage might be full — not a blocking issue
      }
    }
  }, [initialProducts]);

  // Products are pre-loaded from server (SSR), no need for a redundant client fetch

  const handleAddToCart = (product, selectedSize = "M") => {
    addToCartStore(product, selectedSize);
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (cartItemId) => {
    removeFromCartStore(cartItemId);
  };

  const handleUpdateQuantity = (cartItemId, newQuantity) => {
    updateCartStoreQty(cartItemId, newQuantity);
  };

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <>
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        user={user}
        setUser={setUser}
      />
      <HeroBanner />
      <BrandsSlider />
      <CategoriesSection />
      <MarqueeBanner />
      <ProductsSection
        products={products}
        filter={filter}
        setFilter={setFilter}
        addToCart={handleAddToCart}
      />
      <FanGallerySection addToCart={handleAddToCart} />
      <PromoSection />
      <Footer />
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={handleUpdateQuantity}
        removeFromCart={handleRemoveFromCart}
      />
    </>
  );
}
