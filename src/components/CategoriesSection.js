"use client";
import Link from "next/link";

export default function CategoriesSection() {
  const categories = [
    {
      key: "Full Sleeve",
      slug: "full-sleeve",
      image: "/images/cat_full_sleeve.png",
      alt: "Full Sleeve Category",
      description: "Long sleeve match kits & training wear",
      badgeColor: "#2563eb"
    },
    {
      key: "Half Sleeve",
      slug: "half-sleeve",
      image: "/images/cat_half_sleeve.png",
      alt: "Half Sleeve Category",
      description: "Classic short sleeve fan & player jerseys",
      badgeColor: "#2563eb"
    },
    {
      key: "5 Sleeve",
      slug: "5-sleeve",
      image: "/images/cat_5_sleeve.png",
      alt: "5 Sleeve Category",
      description: "Oversized streetwear & 3/4 sleeve fit",
      badgeColor: "#2563eb"
    },
    {
      key: "Retro",
      slug: "retro",
      image: "/images/cat_retro.png",
      alt: "Retro Category",
      description: "Iconic vintage & classic heritage kits",
      badgeColor: "#f59e0b"
    },
  ];

  return (
    <section className="categories-section" id="categories" style={{ padding: "40px 0" }}>
      <div className="container">
        <div
          className="section-header-wrap"
          style={{ textAlign: "center", marginBottom: "32px" }}
        >
          <h2 className="section-title" style={{ fontSize: "28px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Shop By Category
          </h2>
          <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>
            Explore our 4 signature sleeve styles &amp; classic retro editions
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px"
          }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={`/category/${cat.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  background: "#f4f4f0",
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: "1px solid #e8e8e2",
                  transition: "all 0.25s ease",
                  cursor: "pointer",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column"
                }}
                className="category-card-hover"
              >
                {/* Image Wrap */}
                <div
                  style={{
                    position: "relative",
                    padding: "24px 16px",
                    background: "#f4f4f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "220px",
                    overflow: "hidden"
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 14,
                      left: 14,
                      background: cat.badgeColor,
                      color: "#ffffff",
                      fontSize: "11px",
                      fontWeight: "800",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      zIndex: 2
                    }}
                  >
                    {cat.key}
                  </span>
                  <img
                    src={cat.image}
                    alt={cat.alt}
                    style={{
                      maxHeight: "190px",
                      maxWidth: "100%",
                      objectFit: "contain",
                      transition: "transform 0.35s ease"
                    }}
                    className="cat-img"
                  />
                </div>

                {/* Card Text Content */}
                <div
                  style={{
                    background: "#ffffff",
                    padding: "18px 20px 20px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >
                  <div>
                    <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: "900", color: "#0f172a" }}>
                      {cat.key}
                    </h3>
                    <p style={{ margin: 0, fontSize: "12px", color: "#64748b", lineHeight: 1.4 }}>
                      {cat.description}
                    </p>
                  </div>
                  <div style={{ marginTop: "16px", fontSize: "13px", fontWeight: "800", color: "#2563eb", display: "flex", alignItems: "center", gap: "4px" }}>
                    <span>Shop Collection</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        .category-card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
        }
        .category-card-hover:hover .cat-img {
          transform: scale(1.06);
        }
      `}</style>
    </section>
  );
}
