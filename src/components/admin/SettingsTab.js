"use client";
import { useState } from "react";

export default function SettingsTab() {
  const [storeSettings, setStoreSettings] = useState({
    storeName: "90DRIP",
    bannerText:
      "WORLD CUP COLLECTIONS — FREE EXPRESS SHIPPING ON ORDERS OVER ₹1,999",
    currency: "INR (₹)",
    maintenanceMode: false,
    autoApproveOrders: true,
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div className="tab-content fade-in">
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Store Front Configurations</h3>
        </div>
        <form onSubmit={handleSave} className="admin-form">
          <div className="form-group">
            <label className="form-label">Store Branding Name</label>
            <input
              type="text"
              value={storeSettings.storeName}
              onChange={(e) =>
                setStoreSettings({ ...storeSettings, storeName: e.target.value })
              }
              className="admin-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Promo Announcement Bar Text</label>
            <input
              type="text"
              value={storeSettings.bannerText}
              onChange={(e) =>
                setStoreSettings({
                  ...storeSettings,
                  bannerText: e.target.value,
                })
              }
              className="admin-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Store Currency</label>
              <select
                value={storeSettings.currency}
                onChange={(e) =>
                  setStoreSettings({
                    ...storeSettings,
                    currency: e.target.value,
                  })
                }
                className="admin-select"
              >
                <option value="INR (₹)">INR (₹)</option>
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="GBP (£)">GBP (£)</option>
              </select>
            </div>

            <div className="form-group checkbox-group">
              <label className="form-label">Auto-Approve Orders</label>
              <input
                type="checkbox"
                checked={storeSettings.autoApproveOrders}
                onChange={(e) =>
                  setStoreSettings({
                    ...storeSettings,
                    autoApproveOrders: e.target.checked,
                  })
                }
                className="admin-checkbox"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary-admin">
              Save Configurations
            </button>
            {settingsSaved && (
              <span className="save-success-msg">✓ Store settings updated!</span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
