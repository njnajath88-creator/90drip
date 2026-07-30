"use client";
import { useState } from "react";
import Image from "next/image";

export default function FanGallerySection({ addToCart }) {
  const [activeStory, setActiveStory] = useState(null);

  const stories = [
    {
      id: 1,
      name: "mathewww",
      handle: "@mathewww",
      verified: true,
      img: "/images/jersey_product1.png",
      product: {
        id: "rm-home-2425",
        name: "Real Madrid 24/25 Home Kit",
        price: 2499,
        image: "/images/jersey_product1.png",
      },
      caption: "Classic gold details ⚡ 90DRIP kit is top tier.",
    },
    {
      id: 2,
      name: "ananya_s",
      handle: "@ananya_s",
      verified: true,
      img: "/images/jersey_product2.png",
      product: {
        id: "fcb-home-2425",
        name: "FC Barcelona 24/25 Home Kit",
        price: 2499,
        image: "/images/jersey_product2.png",
      },
      caption: "Retro Barca vibes for matchday 🔴🔵",
    },
    {
      id: 3,
      name: "kerala_drip",
      handle: "@kerala_drip",
      verified: true,
      img: "/images/jersey_product3.png",
      product: {
        id: "mun-home-2425",
        name: "Manchester United Kit",
        price: 2499,
        image: "/images/jersey_product3.png",
      },
      caption: "Kochi United supporters kit 🔥",
    },
    {
      id: 4,
      name: "priya_m",
      handle: "@priya_m",
      verified: false,
      img: "/images/jersey_product4.png",
      product: {
        id: "psg-home-2425",
        name: "PSG 24/25 Fourth Edition Kit",
        price: 2699,
        image: "/images/jersey_product4.png",
      },
      caption: "Streetwear aesthetic with Jordan x PSG ⚡",
    },
    {
      id: 5,
      name: "rahul_fit",
      handle: "@rahul_fit",
      verified: true,
      img: "/images/jersey_product5.png",
      product: {
        id: "arg-home-2425",
        name: "Argentina 3-Star Kit",
        price: 2599,
        image: "/images/jersey_product5.png",
      },
      caption: "3-Star Champions edition ⭐⭐⭐",
    },
    {
      id: 6,
      name: "sneha_r",
      handle: "@sneha_r",
      verified: false,
      img: "/images/jersey_product6.png",
      product: {
        id: "ars-home-2425",
        name: "Arsenal 24/25 Home Kit",
        price: 2499,
        image: "/images/jersey_product6.png",
      },
      caption: "Retro Gunners collar detail is perfection 🔴⚪",
    },
    {
      id: 7,
      name: "farhan_v",
      handle: "@farhan_v",
      verified: true,
      img: "/images/jersey_product1.png",
      product: {
        id: "rm-home-2425",
        name: "Real Madrid Kit",
        price: 2499,
        image: "/images/jersey_product1.png",
      },
      caption: "Bernabéu fit styled by 90DRIP",
    },
    {
      id: 8,
      name: "riya_drip",
      handle: "@riya_drip",
      verified: true,
      img: "/images/jersey_product2.png",
      product: {
        id: "fcb-home-2425",
        name: "FC Barcelona Kit",
        price: 2499,
        image: "/images/jersey_product2.png",
      },
      caption: "Matchday street style ⚽",
    },
  ];

  return (
    <section style={{ padding: "64px 0 72px", background: "#ffffff", color: "#0f172a", borderTop: "1px solid #f1f5f9" }}>
      <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "0 20px", textAlign: "center" }}>
        
        {/* Section Header */}
        <h2
          style={{
            fontSize: "36px",
            fontWeight: "900",
            fontStyle: "italic",
            color: "#0f172a",
            margin: "0 0 36px",
            letterSpacing: "-0.02em",
          }}
        >
          #90DripLife
        </h2>

        {/* Story Circle Avatars Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "22px",
            flexWrap: "wrap",
            marginBottom: "40px",
          }}
        >
          {stories.map((story) => (
            <button
              key={story.id}
              onClick={() => setActiveStory(story)}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                outline: "none",
                transition: "transform 0.25s ease",
              }}
              className="story-circle-btn"
              title={`View ${story.name}'s fit`}
            >
              <div
                style={{
                  width: "104px",
                  height: "104px",
                  borderRadius: "50%",
                  padding: "3px",
                  background: "linear-gradient(135deg, #f97316, #e11d48, #2563eb)",
                  boxShadow: "0 6px 18px rgba(0, 0, 0, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.25s ease, boxShadow 0.25s ease",
                }}
                className="story-ring"
              >
                <Image
                  src={story.img}
                  alt={story.name}
                  width={104}
                  height={104}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                    background: "#f8fafc",
                    border: "3px solid #ffffff",
                  }}
                />
              </div>
            </button>
          ))}
        </div>

        {/* Follow Us Button */}
        <a
          href="https://www.instagram.com/90drip.in?igsh=MWU0cDd1NTBtNHduaw=="
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "13px 30px",
            borderRadius: "10px",
            border: "1.5px solid #0f172a",
            background: "#ffffff",
            color: "#0f172a",
            fontSize: "12px",
            fontWeight: "800",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "all 0.25s ease",
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
          }}
          className="follow-insta-btn"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
          <span>FOLLOW US @90DRIP.IN</span>
        </a>

      </div>

      {/* Story Preview Lightbox Modal */}
      {activeStory && (
        <div
          onClick={() => setActiveStory(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(12px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              maxWidth: "400px",
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.35)",
              position: "relative",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                borderBottom: "1px solid #f1f5f9",
                background: "#ffffff",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "14px", fontWeight: "900", color: "#0f172a" }}>{activeStory.name}</span>
                {activeStory.verified && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" fill="#2563eb"/>
                    <polyline points="16 9 10 15 7 12" stroke="#ffffff" strokeWidth="2.5"/>
                  </svg>
                )}
              </div>
              <button
                onClick={() => setActiveStory(null)}
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  cursor: "pointer",
                  color: "#0f172a",
                }}
              >
                ✕
              </button>
            </div>

            {/* Story Image */}
            <div style={{ height: "360px", background: "#f8fafc", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Image
                src={activeStory.img}
                alt={activeStory.name}
                width={400}
                height={360}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Caption & Shop CTA */}
            <div style={{ padding: "18px 20px" }}>
              <p style={{ fontSize: "13px", color: "#475569", margin: "0 0 14px", fontWeight: "600" }}>
                "{activeStory.caption}"
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "10px 14px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "14px" }}>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "900", color: "#0f172a" }}>{activeStory.product.name}</div>
                </div>
                <div style={{ fontSize: "15px", fontWeight: "900", color: "#2563eb" }}>₹{activeStory.product.price}</div>
              </div>

              <button
                onClick={() => {
                  addToCart(activeStory.product);
                  setActiveStory(null);
                }}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "12px",
                  background: "#0f172a",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: "900",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 4px 14px rgba(15, 23, 42, 0.2)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                <span>Shop This Fit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .story-circle-btn:hover .story-ring {
          transform: scale(1.08);
          box-shadow: 0 10px 24px rgba(37, 99, 235, 0.25) !important;
        }
        .follow-insta-btn:hover {
          background: #0f172a !important;
          color: #ffffff !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(15, 23, 42, 0.15);
        }
      `}</style>
    </section>
  );
}


