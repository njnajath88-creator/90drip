"use client";
import Link from "next/link";
import Image from "next/image";

export default function CategoriesSection() {
  const categories = [
    {
      key: "Full Sleeve",
      slug: "full-sleeve",
      subtitle: "Match & Training Wear",
      image: "/images/cat_full_sleeve.png",
      alt: "Full Sleeve Category",
      tag: "POPULAR"
    },
    {
      key: "Half Sleeve",
      slug: "half-sleeve",
      subtitle: "Classic Game-Day Kits",
      image: "/images/cat_half_sleeve.png",
      alt: "Half Sleeve Category",
      tag: "BESTSELLER"
    },
    {
      key: "5 Sleeve",
      slug: "5-sleeve",
      subtitle: "Oversized Streetwear Fit",
      image: "/images/cat_5_sleeve.png",
      alt: "5 Sleeve Category",
      tag: "TRENDING"
    },
    {
      key: "Retro",
      slug: "retro",
      subtitle: "Iconic Vintage Heritage",
      image: "/images/cat_retro.png",
      alt: "Retro Category",
      tag: "HERITAGE"
    },
    {
      key: "Embroidery",
      slug: "embroidery",
      subtitle: "Premium Stitched Details",
      image: "/images/cat_embroidery.png",
      alt: "Embroidery Category",
      tag: "PREMIUM"
    },
  ];

  return (
    <section className="categories-section" id="categories">
      <div className="container" style={{ maxWidth: "1200px" }}>
        {/* Header */}
        <div className="categories-header">
          <div className="categories-badge">
            <span>EXPLORE BY FIT</span>
          </div>
          <h2 className="categories-title">
            SHOP BY CATEGORY
          </h2>
          <p className="categories-subtitle">
            Curated football kits and streetwear apparel crafted for performance and drip.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="categories-grid">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={`/category/${cat.slug}`}
              className="category-card-link"
            >
              <div className="category-card">
                {/* Image Container */}
                <div className="category-img-wrapper">
                  <Image
                    src={cat.image}
                    alt={cat.alt}
                    width={600}
                    height={750}
                    loading="lazy"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="category-img"
                  />
                  <div className="category-tag-badge">{cat.tag}</div>
                  <div className="category-img-overlay" />
                </div>

                {/* Card Content & Action */}
                <div className="category-content">
                  <div className="category-text-info">
                    <h3 className="category-name">{cat.key}</h3>
                    <span className="category-subtext">{cat.subtitle}</span>
                  </div>
                  <div className="category-arrow-btn" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .categories-section {
          padding: 64px 0 72px;
          background: #ffffff;
          position: relative;
        }

        .categories-header {
          text-align: center;
          max-width: 600px;
          margin: 0 auto 40px;
        }

        .categories-badge {
          display: inline-block;
          margin-bottom: 12px;
        }

        .categories-badge span {
          background: #eff6ff;
          color: #2563eb;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          padding: 5px 14px;
          border-radius: 9999px;
          border: 1px solid #dbeafe;
          text-transform: uppercase;
        }

        .categories-title {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          font-size: clamp(24px, 3.5vw, 32px);
          font-weight: 900;
          font-style: normal;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #0f172a;
          margin: 0 0 10px;
        }

        .categories-subtitle {
          font-size: 14px;
          color: #64748b;
          margin: 0;
          font-weight: 500;
          line-height: 1.5;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .category-card-link {
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .category-card {
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          height: 100%;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
          position: relative;
        }

        .category-img-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;
          overflow: hidden;
          background: #f8fafc;
        }

        .category-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .category-tag-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(8px);
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          padding: 4px 10px;
          border-radius: 6px;
          z-index: 2;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .category-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(15,23,42,0.15) 100%);
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
        }

        .category-content {
          padding: 18px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          border-top: 1px solid #f1f5f9;
        }

        .category-text-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .category-name {
          margin: 0;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          font-size: 15px;
          font-weight: 800;
          font-style: normal;
          color: #0f172a;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .category-subtext {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
        }

        .category-arrow-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0f172a;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        @media (hover: hover) and (pointer: fine) {
          .category-card-link:hover .category-card {
            transform: translateY(-8px);
            border-color: #cbd5e1;
            box-shadow: 0 20px 40px -12px rgba(15, 23, 42, 0.12);
          }

          .category-card-link:hover .category-img {
            transform: scale(1.08);
          }

          .category-card-link:hover .category-img-overlay {
            opacity: 1;
          }

          .category-card-link:hover .category-arrow-btn {
            background: #2563eb;
            color: #ffffff;
            border-color: #2563eb;
            transform: translateX(3px);
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
          }
        }

        @media (max-width: 1024px) {
          .categories-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
          .categories-title {
            font-size: 26px;
          }
        }

        @media (max-width: 640px) {
          .categories-section {
            padding: 40px 0 48px;
          }
          .categories-header {
            margin-bottom: 24px;
          }
          .categories-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .category-content {
            padding: 14px 12px;
          }
          .category-name {
            font-size: 13px;
          }
          .category-subtext {
            font-size: 10px;
          }
          .category-arrow-btn {
            width: 28px;
            height: 28px;
          }
          .category-arrow-btn svg {
            width: 13px;
            height: 13px;
          }
        }
      `}</style>
    </section>
  );
}

