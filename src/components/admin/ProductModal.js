"use client";
import { compressAndReadImage } from "@/lib/imageUtils";

const IMAGE_FIELDS = [
  {
    key: "image",
    inputId: "phone-gallery-input",
    label: "1. Front View Photo",
    btnLabel: "📷 Upload Front View Photo",
    previewLabel: "Front View Active",
    style: {},
  },
  {
    key: "backImage",
    inputId: "phone-gallery-back-input",
    label: "2. Rear (Back) View Photo",
    btnLabel: "📷 Upload Rear View Photo",
    previewLabel: "Rear View Active",
    style: { borderColor: "#a7f3d0", color: "#059669", background: "#ecfdf5" },
  },
  {
    key: "closeupImage",
    inputId: "phone-gallery-closeup-input",
    label: "3. Close-up Detail Photo",
    btnLabel: "📷 Upload Close-up Shot Photo",
    previewLabel: "Close-up View Active",
    style: { borderColor: "#ddd6fe", color: "#7c3aed", background: "#f5f3ff" },
  },
  {
    key: "fitImage",
    inputId: "phone-gallery-fit-input",
    label: "4. Model / Fit Shot Photo",
    btnLabel: "📷 Upload Fit / Model Shot Photo",
    previewLabel: "Fit View Active",
    style: { borderColor: "#fed7aa", color: "#ea580c", background: "#fff7ed" },
  },
];

const DEFAULT_FORM = {
  name: "",
  category: "Half Sleeve",
  sport: "Football",
  price: "",
  originalPrice: "",
  badges: "",
  sizes: "S, M, L, XL",
  image: "/images/jersey_product1.png",
  backImage: "/images/jersey_product2.png",
  closeupImage: "/images/jersey_product3.png",
  fitImage: "/images/jersey_product4.png",
};

export default function ProductModal({
  isOpen,
  onClose,
  editingProduct,
  formData,
  setFormData,
  onSave,
  saving,
}) {
  if (!isOpen) return null;

  const handleFileSelect = (fieldKey, e) => {
    compressAndReadImage(e.target.files?.[0], (res) => {
      setFormData((prev) => ({ ...prev, [fieldKey]: res }));
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{editingProduct ? "Edit Jersey Product" : "Add New Jersey"}</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={onSave} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Jersey Name</label>
              <input
                type="text"
                placeholder="e.g. FC Barcelona #10"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="admin-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Sleeve Category</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="admin-select"
              >
                <option value="Full Sleeve">Full Sleeve</option>
                <option value="Half Sleeve">Half Sleeve</option>
                <option value="5 Sleeve">5 Sleeve</option>
                <option value="Retro">Retro</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Sport Category</label>
              <select
                value={formData.sport}
                onChange={(e) =>
                  setFormData({ ...formData, sport: e.target.value })
                }
                className="admin-select"
              >
                <option value="Football">Football</option>
                <option value="Basketball">Basketball</option>
                <option value="Custom">Custom / Premium</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Price (₹)</label>
              <input
                type="number"
                step="1"
                required
                placeholder="1999"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="admin-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Original Price (₹) (Optional)</label>
              <input
                type="number"
                step="1"
                placeholder="2499"
                value={formData.originalPrice}
                onChange={(e) =>
                  setFormData({ ...formData, originalPrice: e.target.value })
                }
                className="admin-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Badges (comma separated)</label>
              <input
                type="text"
                placeholder="New, Sale, Limited"
                value={formData.badges}
                onChange={(e) =>
                  setFormData({ ...formData, badges: e.target.value })
                }
                className="admin-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Available Sizes (comma separated)</label>
            <input
              type="text"
              placeholder="XS, S, M, L, XL, XXL"
              value={formData.sizes}
              onChange={(e) =>
                setFormData({ ...formData, sizes: e.target.value })
              }
              className="admin-input"
            />
          </div>

          {/* Image Upload Fields */}
          {IMAGE_FIELDS.map((field) => (
            <div className="form-group" key={field.key}>
              <label className="form-label">{field.label}</label>
              <div className="image-upload-wrapper">
                <input
                  type="file"
                  id={field.inputId}
                  accept="image/*"
                  onChange={(e) => handleFileSelect(field.key, e)}
                  style={{ display: "none" }}
                />
                <label
                  htmlFor={field.inputId}
                  className="gallery-upload-btn"
                  style={field.style}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <span>{field.btnLabel}</span>
                </label>
              </div>
              {formData[field.key] && (
                <div className="image-preview-container">
                  <img
                    src={formData[field.key]}
                    alt={field.previewLabel}
                    className="image-preview-img"
                  />
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 600 }}>
                      {field.previewLabel}
                    </div>
                    <button
                      type="button"
                      className="btn-remove-preview"
                      onClick={() =>
                        setFormData({ ...formData, [field.key]: "" })
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div
            className="modal-actions"
            style={{
              position: "sticky",
              bottom: 0,
              background: "#ffffff",
              padding: "12px 0",
              borderTop: "1px solid #e2e8f0",
              zIndex: 10,
            }}
          >
            <button
              type="button"
              className="btn-secondary-sm"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary-admin"
              disabled={saving}
              style={{ opacity: saving ? 0.7 : 1 }}
            >
              {saving
                ? "⏳ Saving Changes..."
                : editingProduct
                ? "Save Changes"
                : "Create Jersey"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { DEFAULT_FORM };
