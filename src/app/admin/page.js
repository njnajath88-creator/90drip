"use client";
import { useState, useEffect } from "react";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminTabs from "@/components/admin/AdminTabs";
import OverviewTab from "@/components/admin/OverviewTab";
import ProductsTab from "@/components/admin/ProductsTab";
import OrdersTab from "@/components/admin/OrdersTab";
import SettingsTab from "@/components/admin/SettingsTab";
import ProductModal, { DEFAULT_FORM } from "@/components/admin/ProductModal";

const INITIAL_ORDERS = [
  {
    id: "ORD-9081",
    customer: "Alex Morgan",
    email: "alex@example.com",
    items: "FC Barcelona #10 Home (x1)",
    total: 1999,
    date: "2026-07-24",
    status: "Processing",
  },
  {
    id: "ORD-9080",
    customer: "David Beckham",
    email: "david@example.com",
    items: "Classic #7 Red (x2)",
    total: 2998,
    date: "2026-07-23",
    status: "Shipped",
  },
  {
    id: "ORD-9079",
    customer: "Kylian M.",
    email: "kylian@example.com",
    items: "City FC #9 Blue (x1)",
    total: 1799,
    date: "2026-07-22",
    status: "Delivered",
  },
  {
    id: "ORD-9078",
    customer: "Marcus R.",
    email: "marcus@example.com",
    items: "Green Eagle #11 (x1)",
    total: 1299,
    date: "2026-07-21",
    status: "Pending",
  },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
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
          body: JSON.stringify({ id: editingProduct.id, ...payload }),
        });
      } else {
        res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Server error saving product");
      }

      setIsModalOpen(false);
      await fetchProducts();
    } catch (err) {
      alert("Error saving product: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this jersey product?")) return;
    try {
      await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (err) {
      alert("Error deleting product: " + err.message);
    }
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
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
            onAddProduct={handleOpenAddModal}
            onEditProduct={handleOpenEditModal}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {activeTab === "orders" && (
          <OrdersTab orders={orders} onUpdateStatus={handleUpdateOrderStatus} />
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
