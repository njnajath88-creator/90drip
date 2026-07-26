"use client";
import ProductCard from "./ProductCard";

export default function ProductsSection({ products, addToCart }) {
  return (
    <section id="shop" style={{ padding: "40px 0 80px", background: "#ffffff" }}>
      <div className="container" style={{ maxWidth: "1200px" }}>

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

        {/* Responsive Product Grid (4 columns on PC, 2 columns on Mobile/Tablet) */}
        {products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <p style={{ fontWeight: "700", fontSize: "16px" }}>No jerseys found.</p>
          </div>
        ) : (
          <div className="products-grid-responsive">
            {products.map((product, idx) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} index={idx} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .products-grid-responsive {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px 18px;
        }

        @media (max-width: 1024px) {
          .products-grid-responsive {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .products-grid-responsive {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px 14px;
          }
        }
      `}</style>
    </section>
  );
}
