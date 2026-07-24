"use client";

export default function CategoriesSection({ filter, setFilter }) {
  const categories = [
    {
      key: "Full Sleeve",
      image: "/images/jersey_product1.png",
      alt: "Full Sleeve Category",
      description: "Long sleeve match kits & training wear",
    },
    {
      key: "Half Sleeve",
      image: "/images/jersey_product2.png",
      alt: "Half Sleeve Category",
      description: "Classic short sleeve fan & player jerseys",
    },
    {
      key: "5 Sleeve",
      image: "/images/jersey_product3.png",
      alt: "5 Sleeve Category",
      description: "Oversized streetwear & 3/4 sleeve fit",
    },
    {
      key: "Retro",
      image: "/images/jersey_product4.png",
      alt: "Retro Category",
      description: "Iconic vintage & classic heritage kits",
      badgeStyle: { background: "#f59e0b", color: "#ffffff" },
    },
  ];

  const handleCategoryClick = (key) => {
    setFilter(key);
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="categories-section" id="categories">
      <div className="container">
        <div
          className="section-header-wrap"
          style={{ textAlign: "center", marginBottom: "32px" }}
        >
          <h2 className="section-title">Shop By Category</h2>
          <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>
            Explore our 4 signature sleeve styles &amp; classic retro editions
          </p>
        </div>

        <div className="category-cards-grid">
          {categories.map((cat) => (
            <div
              key={cat.key}
              className={`category-card-item ${filter === cat.key ? "active" : ""}`}
              onClick={() => handleCategoryClick(cat.key)}
            >
              <div className="category-card-img-wrap">
                <img src={cat.image} alt={cat.alt} />
                <span
                  className="category-badge-pill"
                  style={cat.badgeStyle || {}}
                >
                  {cat.key}
                </span>
              </div>
              <div className="category-card-info">
                <h3>{cat.key}</h3>
                <p>{cat.description}</p>
                <span className="category-link">Shop Collection →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
