"use client";
import ProductCard from "./ProductCard";

const FILTER_TABS = ["all", "Full Sleeve", "Half Sleeve", "5 Sleeve", "Retro"];

export default function ProductsSection({
  products,
  filter,
  setFilter,
  addToCart,
}) {
  const filteredProducts =
    filter === "all"
      ? products
      : products.filter(
          (p) =>
            p.category === filter ||
            p.sport === filter ||
            (p.badges && p.badges.includes(filter))
        );

  return (
    <section
      className="products-section"
      id="shop"
      aria-label="Product catalog"
    >
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <h2 className="section-title" style={{ margin: 0 }}>
            {filter === "all" ? "All Jersey Collections" : `${filter} Jerseys`}
          </h2>
          <div className="filter-tabs" role="tablist">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                className={`filter-tab ${filter === tab ? "active" : ""}`}
                onClick={() => setFilter(tab)}
              >
                {tab === "all" ? "All Products" : tab}
              </button>
            ))}
          </div>
        </div>

        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
