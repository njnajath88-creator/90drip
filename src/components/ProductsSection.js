"use client";
import ProductCard from "./ProductCard";

export default function ProductsSection({ products, addToCart }) {
  return (
    <section id="shop" style={{ padding: "40px 0 80px", background: "#ffffff" }}>
      <div className="container" style={{ maxWidth: "800px" }}>

        {/* Clean Section Header */}
        <div style={{ marginBottom: "24px", textAlign: "left" }}>
          <h2
            style={{
              fontSize: "26px",
              fontWeight: "900",
              color: "#0f172a",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              margin: "0 0 4px",
            }}
          >
            All Jerseys
          </h2>
          <p style={{ fontSize: "13px", color: "#64748b", margin: 0, fontWeight: "600" }}>
            {products.length} Products Found
          </p>
        </div>

        {/* Clean 2-Column Product Grid */}
        {products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <p style={{ fontWeight: "700", fontSize: "16px" }}>No jerseys found.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "24px 16px",
            }}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
