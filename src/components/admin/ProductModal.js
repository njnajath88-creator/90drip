"use client";
import { compressAndReadImage } from "@/lib/imageUtils";

const IMAGE_FIELDS = [
  {
    key: "image",
    inputId: "phone-gallery-input",
    title: "1. Front View",
    badge: "MAIN COVER",
    desc: "Primary store listing cover photo",
    isPrimary: true,
  },
  {
    key: "backImage",
    inputId: "phone-gallery-back-input",
    title: "2. Rear (Back) View",
    badge: "BACK & PRINT",
    desc: "Player name & back numbering",
  },
  {
    key: "closeupImage",
    inputId: "phone-gallery-closeup-input",
    title: "3. Close-up Detail",
    badge: "FABRIC & CREST",
    desc: "Embroidery & badge detail shot",
  },
  {
    key: "fitImage",
    inputId: "phone-gallery-fit-input",
    title: "4. Model / Fit Shot",
    badge: "ON-BODY FIT",
    desc: "Fit reference & drape shot",
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
      <div className="modal-content" style={{ maxWidth: "680px" }}>
        <div className="modal-header">
          <h3 style={{ fontSize: "18px", fontWeight: "900", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span>{editingProduct ? "Edit Jersey Product" : "Add New Jersey"}</span>
          </h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">
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

          {/* Professional Image Upload & Angle Gallery Section */}
          <div style={{ marginTop: "16px", marginBottom: "16px", paddingTop: "16px", borderTop: "1.5px solid #f1f5f9" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <h4 style={{ fontSize: "13px", fontWeight: "900", color: "#0f172a", margin: 0, textTransform: "uppercase", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  Product Angle Photography
                </h4>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0" }}>
                  Upload high-resolution photography for all product angles
                </p>
              </div>
              <span style={{ fontSize: "11px", fontWeight: "800", background: "#eff6ff", color: "#1d4ed8", padding: "3px 10px", borderRadius: "20px", border: "1px solid #bfdbfe" }}>
                4 Views Available
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
              {IMAGE_FIELDS.map((field) => {
                const hasImage = Boolean(formData[field.key]);
                return (
                  <div
                    key={field.key}
                    style={{
                      background: "#ffffff",
                      borderRadius: "14px",
                      border: hasImage ? "1.5px solid #e2e8f0" : "1.5px dashed #cbd5e1",
                      padding: "12px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "all 0.2s ease",
                      position: "relative",
                      boxShadow: hasImage ? "0 2px 8px rgba(0,0,0,0.03)" : "none"
                    }}
                  >
                    <input
                      type="file"
                      id={field.inputId}
                      accept="image/*"
                      onChange={(e) => handleFileSelect(field.key, e)}
                      style={{ display: "none" }}
                    />

                    {/* Card Header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                      <span style={{ fontSize: "12px", fontWeight: "800", color: "#0f172a" }}>{field.title}</span>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: "800",
                          padding: "2px 7px",
                          borderRadius: "6px",
                          background: field.isPrimary ? "#eff6ff" : "#f1f5f9",
                          color: field.isPrimary ? "#2563eb" : "#475569",
                          border: field.isPrimary ? "1px solid #bfdbfe" : "1px solid #e2e8f0",
                          letterSpacing: "0.03em"
                        }}
                      >
                        {field.badge}
                      </span>
                    </div>

                    {/* Image Preview or Dropzone */}
                    {hasImage ? (
                      <div style={{ position: "relative", borderRadius: "10px", overflow: "hidden", border: "1px solid #e2e8f0", background: "#f8fafc", aspectRatio: "4 / 3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img
                          src={formData[field.key]}
                          alt={field.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                        <div style={{ position: "absolute", top: 6, left: 6, background: "rgba(15, 23, 42, 0.8)", color: "#ffffff", fontSize: "10px", fontWeight: "800", padding: "2px 7px", borderRadius: "20px", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", gap: "4px" }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                          <span>Active</span>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor={field.inputId}
                        style={{
                          borderRadius: "10px",
                          background: "#f8fafc",
                          border: "1px dashed #cbd5e1",
                          aspectRatio: "4 / 3",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          padding: "12px",
                          textAlign: "center",
                          gap: "6px",
                          transition: "all 0.2s ease"
                        }}
                      >
                        <div style={{ width: 36, height: 36, borderRadius: "10px", background: "#ffffff", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.04)", color: "#2563eb" }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                        </div>
                        <div>
                          <div style={{ fontSize: "12px", fontWeight: "800", color: "#2563eb" }}>Upload Photo</div>
                          <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "2px" }}>{field.desc}</div>
                        </div>
                      </label>
                    )}

                    {/* Action Controls */}
                    <div style={{ marginTop: "10px", display: "flex", gap: "6px" }}>
                      {hasImage ? (
                        <>
                          <label
                            htmlFor={field.inputId}
                            style={{
                              flex: 1,
                              textAlign: "center",
                              background: "#f1f5f9",
                              color: "#334155",
                              border: "1px solid #cbd5e1",
                              borderRadius: "8px",
                              padding: "6px 8px",
                              fontSize: "11px",
                              fontWeight: "800",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "4px"
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                            <span>Replace</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, [field.key]: "" })}
                            style={{
                              background: "#fef2f2",
                              color: "#dc2626",
                              border: "1px solid #fecaca",
                              borderRadius: "8px",
                              padding: "6px 10px",
                              fontSize: "11px",
                              fontWeight: "800",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "4px"
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            <span>Remove</span>
                          </button>
                        </>
                      ) : (
                        <label
                          htmlFor={field.inputId}
                          style={{
                            width: "100%",
                            textAlign: "center",
                            background: "#0f172a",
                            color: "#ffffff",
                            borderRadius: "8px",
                            padding: "7px 10px",
                            fontSize: "11px",
                            fontWeight: "800",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "5px"
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                          <span>Select Photo</span>
                        </label>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

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
