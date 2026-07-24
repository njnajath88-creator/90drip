export default function PromoSection() {
  return (
    <section className="promo-section" id="premium" aria-label="Premium Quality">
      <div className="container">
        <h2 className="promo-title">Discover the Lines</h2>
        <p className="promo-desc">
          Explore our curated collection of authentic, premium-grade sports
          jerseys. Minimalist designs, maximum performance.
        </p>
        <button
          className="btn-primary"
          onClick={() =>
            document
              .getElementById("shop")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Shop Now
        </button>
      </div>
    </section>
  );
}
