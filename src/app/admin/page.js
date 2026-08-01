"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminTabs from "@/components/admin/AdminTabs";
import OverviewTab from "@/components/admin/OverviewTab";
import ProductsTab from "@/components/admin/ProductsTab";
import OrdersTab from "@/components/admin/OrdersTab";
import SettingsTab from "@/components/admin/SettingsTab";
import ProductModal, { DEFAULT_FORM } from "@/components/admin/ProductModal";
import { getOrders, fetchOrdersServer, updateOrderStatus, deleteOrder, clearOrders } from "@/lib/orderStore";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  // Admin LoginForm State
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);

  // Read logged in user on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("90drip_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error("Failed to read user:", e);
    }
  }, []);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products?t=${Date.now()}`, { cache: "no-store" });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Sync real orders on mount and listen to changes
  useEffect(() => {
    const syncOrders = () => {
      setOrders(getOrders());
    };
    syncOrders();
    fetchOrdersServer().then((res) => {
      if (res && Array.isArray(res)) setOrders(res);
    });
    window.addEventListener("90drip_orders_updated", syncOrders);
    return () => window.removeEventListener("90drip_orders_updated", syncOrders);
  }, []);

  const handleAdminFormSubmit = (e) => {
    e.preventDefault();
    setAuthError("");

    const cleanEmail = adminEmail.toLowerCase().trim();

    if (cleanEmail === "ad123@gmail.com" && adminPassword === "ad123") {
      const adminUser = {
        email: "ad123@gmail.com",
        name: "Admin Manager",
        role: "admin"
      };
      setUser(adminUser);
      try {
        localStorage.setItem("90drip_user", JSON.stringify(adminUser));
      } catch (e) {
        console.error("Failed to save admin user:", e);
      }
    } else {
      setAuthError("Invalid Admin credentials. Email: ad123@gmail.com, Password: ad123");
    }
  };

  const isAdmin = user?.email?.toLowerCase() === "ad123@gmail.com" || user?.role === "admin";

  // Protection Guard: If not logged in as ad123@gmail.com with password ad123
  if (!isAdmin) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{ background: "#ffffff", borderRadius: "20px", border: "1px solid #e2e8f0", padding: "36px 28px", maxWidth: "380px", width: "100%", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
          <Image src="/images/90driplogo.png" alt="90DRIP" width={110} height={30} loading="lazy" style={{ height: "30px", width: "auto", marginBottom: "16px" }} />
          
          <h2 style={{ fontSize: "20px", fontWeight: "900", color: "#0f172a", margin: "0 0 6px", textTransform: "uppercase" }}>
            Admin Login
          </h2>
          <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 20px" }}>
            Enter your admin credentials to access the portal
          </p>

          {authError && (
            <div style={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fee2e2", padding: "10px", borderRadius: "10px", fontSize: "12px", fontWeight: "700", marginBottom: "16px" }}>
              {authError}
            </div>
          )}

          <form onSubmit={handleAdminFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", textAlign: "left" }}>
            <div>
              <label style={{ fontSize: "11px", fontWeight: "800", color: "#0f172a", display: "block", marginBottom: "4px", textTransform: "uppercase" }}>
                Admin Email
              </label>
              <input
                type="email"
                placeholder="ad123@gmail.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "14px",
                  fontWeight: "600",
                  outline: "none"
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "11px", fontWeight: "800", color: "#0f172a", display: "block", marginBottom: "4px", textTransform: "uppercase" }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "14px",
                  fontWeight: "600",
                  outline: "none"
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: "none",
                background: "#0f172a",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: "900",
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                marginTop: "6px",
                boxShadow: "0 4px 14px rgba(15,23,42,0.25)"
              }}
            >
              Sign In as Admin
            </button>
          </form>

          <div style={{ marginTop: "20px" }}>
            <Link
              href="/"
              style={{
                fontSize: "12px",
                fontWeight: "700",
                color: "#64748b",
                textDecoration: "none"
              }}
            >
              ← Back to Store Front
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Modal handlers
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({ ...DEFAULT_FORM, sizes: "S, M, L, XL" });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category || "Half Sleeve",
      sport: product.sport,
      price: product.price,
      originalPrice: product.originalPrice || "",
      badges: Array.isArray(product.badges)
        ? product.badges.join(", ")
        : product.badges || "",
      sizes: Array.isArray(product.sizes)
        ? product.sizes.join(", ")
        : product.sizes || "",
      image: product.image || "",
      backImage: product.backImage || "",
      closeupImage: product.closeupImage || "",
      fitImage: product.fitImage || "",
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        originalPrice: formData.originalPrice
          ? parseFloat(formData.originalPrice)
          : null,
        badges: formData.badges
          ? formData.badges.split(",").map((b) => b.trim()).filter(Boolean)
          : [],
        sizes: formData.sizes
          ? formData.sizes.split(",").map((s) => s.trim()).filter(Boolean)
          : ["S", "M", "L"],
      };

      let res;
      if (editingProduct) {
        res = await fetch("/api/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingProduct.id || editingProduct._id, ...payload }),
        });
      } else {
        res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        let errorMsg = "Server error saving product";
        try {
          const errData = await res.json();
          if (errData.error) errorMsg = errData.error;
        } catch (e) {
          if (res.status === 413) {
            errorMsg = "Total image file size exceeds server payload limits. Please choose slightly smaller image files.";
          }
        }
        throw new Error(errorMsg);
      }

      const savedItem = await res.json();

      // Optimistically update products state immediately so UI reflects changes instantly
      if (editingProduct) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === savedItem.id || p._id === savedItem.id || p.id === editingProduct.id
              ? { ...p, ...savedItem }
              : p
          )
        );
      } else {
        setProducts((prev) => [savedItem, ...prev]);
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert("Error saving product: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this jersey product?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to delete product");
      }
      // Optimistically remove product from state immediately so UI updates instantly without refresh
      setProducts((prev) => prev.filter((p) => p.id !== id && p._id !== id));
      await fetchProducts();
    } catch (err) {
      alert("Error deleting product: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updated = updateOrderStatus(orderId, newStatus);
    setOrders(updated || getOrders());
  };

  const handleDeleteOrder = (orderId) => {
    const updated = deleteOrder(orderId);
    setOrders(updated || getOrders());
  };

  const handleClearOrders = () => {
    const updated = clearOrders();
    setOrders(updated || []);
  };

  return (
    <div className="admin-wrapper">
      <AdminHeader />

      <div className="admin-container">
        <AdminTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          productsCount={products.length}
          ordersCount={orders.length}
        />

        {activeTab === "overview" && (
          <OverviewTab
            orders={orders}
            products={products}
            onAddProduct={handleOpenAddModal}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "products" && (
          <ProductsTab
            products={products}
            loading={loading}
            deletingId={deletingId}
            onAddProduct={handleOpenAddModal}
            onEditProduct={handleOpenEditModal}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {activeTab === "orders" && (
          <OrdersTab
            orders={orders}
            onUpdateStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
            onClearOrders={handleClearOrders}
          />
        )}

        {activeTab === "settings" && <SettingsTab />}
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingProduct={editingProduct}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSaveProduct}
        saving={saving}
      />
    </div>
  );
}
