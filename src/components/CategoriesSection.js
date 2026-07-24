"use client";
import Link from "next/link";

export default function CategoriesSection() {
  const categories = [
    {
      key: "Full Sleeve",
      slug: "full-sleeve",
      image: "/images/cat_full_sleeve.png",
      alt: "Full Sleeve Category"
    },
    {
      key: "Half Sleeve",
      slug: "half-sleeve",
      image: "/images/cat_half_sleeve.png",
      alt: "Half Sleeve Category"
    },
    {
      key: "5 Sleeve",
      slug: "5-sleeve",
      image: "/images/cat_5_sleeve.png",
      alt: "5 Sleeve Category"
    },
    {
      key: "Retro",
      slug: "retro",
      image: "/images/cat_retro.png",
      alt: "Retro Category"
    },
  ];

  return (
    <section className="categories-section" id="categories" style={{ padding: "36px 0", background: "#ffffff" }}>
      <div className="container" style={{ maxWidth: "1200px" }}>
        <div
          className="section-header-wrap"
          style={{ textAlign: "center", marginBottom: "24px" }}
        >
          <h2 className="section-title" style={{ fontSize: "26px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.04em", color: "#0f172a", margin: 0 }}>
            Shop By Category
          </h2>
        </div>

        {/* Responsive Category Grid (4 columns on PC, 2 columns on Mobile) */}
        <div className="categories-grid-responsive">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={`/category/${cat.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: "1px solid #e8e8e2",
                  transition: "all 0.25s ease",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%"
                }}
                className="category-card-hover"
              >
                {/* Edge-to-Edge Image */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "240px",
                    overflow: "hidden"
                  }}
                >
                  <img
                    src={cat.image}
                    alt={cat.alt}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.35s ease"
                    }}
                    className="cat-img"
                  />
                </div>

                {/* Category Name Below Image */}
                <div
                  style={{
                    padding: "14px 16px",
                    textAlign: "center",
                    background: "#ffffff"
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "900", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {cat.key}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        .categories-grid-responsive {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px 16px;
        }

        @media (max-width: 768px) {
          .categories-grid-responsive {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px 12px;
          }
        }

        .category-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .category-card-hover:hover .cat-img {
          transform: scale(1.06);
        }
      `}</style>
    </section>
  );
}
