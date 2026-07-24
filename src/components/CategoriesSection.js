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
    <section className="categories-section" id="categories" style={{ padding: "40px 0", background: "#ffffff" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        <div
          className="section-header-wrap"
          style={{ textAlign: "center", marginBottom: "28px" }}
        >
          <h2 className="section-title" style={{ fontSize: "26px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.04em", color: "#0f172a" }}>
            Shop By Category
          </h2>
          <p style={{ color: "#64748b", fontSize: "13px", marginTop: "4px", fontWeight: "600" }}>
            Explore our 4 signature sleeve styles &amp; classic retro editions
          </p>
        </div>

        {/* 2-Column Grid Layout for 4 Category Showcase Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px 16px"
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
                    padding: "20px 16px",
                    background: "#f4f4f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "200px",
                    overflow: "hidden"
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      background: cat.badgeColor,
                      color: "#ffffff",
                      fontSize: "10px",
                      fontWeight: "900",
                      padding: "4px 9px",
                      borderRadius: "6px",
                      zIndex: 2,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase"
                    }}
                  >
                    {cat.key}
                  </span>
                  <img
                    src={cat.image}
                    alt={cat.alt}
                    style={{
                      maxHeight: "170px",
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
                    padding: "16px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >
                  <div>
                    <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: "900", color: "#0f172a", textTransform: "uppercase" }}>
                      {cat.key}
                    </h3>
                    <p style={{ margin: 0, fontSize: "12px", color: "#64748b", lineHeight: 1.35, fontWeight: "500" }}>
                      {cat.description}
                    </p>
                  </div>
                  <div style={{ marginTop: "14px", fontSize: "12px", fontWeight: "800", color: "#2563eb", display: "flex", alignItems: "center", gap: "4px" }}>
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
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
        }
        .category-card-hover:hover .cat-img {
          transform: scale(1.05);
        }
      `}</style>
    </section>
  );
}
