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
          className="follow-insta-btn"
        >
          <svg className="insta-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
              position: "relative",
              maxWidth: "400px",
              width: "100%",
              borderRadius: "20px",
              overflow: "hidden",
              background: "#0f172a",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingTop: "140%",
              }}
            >
              <img
                src={activeStory.img}
                alt={activeStory.name}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <button
                onClick={() => setActiveStory(null)}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "rgba(15, 23, 42, 0.7)",
                  backdropFilter: "blur(8px)",
                  color: "#ffffff",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>
            <div
              style={{
                padding: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#0f172a",
              }}
            >
              <div>
                <h4 style={{ margin: 0, color: "#ffffff", fontSize: "16px", fontWeight: "700" }}>
                  {activeStory.name}
                </h4>
                <p style={{ margin: "2px 0 0", color: "#94a3b8", fontSize: "12px" }}>
                  Wearing {activeStory.product.name}
                </p>
              </div>
              <button
                onClick={() => {
                  addToCart(activeStory.product);
                  setActiveStory(null);
                }}
                style={{
                  padding: "10px 18px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: "900",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Shop Now
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

        .follow-insta-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 14px 32px;
          border-radius: 12px;
          background: #0f172a;
          color: #ffffff;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          overflow: hidden;
          z-index: 1;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.15);
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease, border-color 0.35s ease;
        }

        .follow-insta-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
          opacity: 0;
          z-index: -1;
          transition: opacity 0.35s ease;
          border-radius: 12px;
        }

        .follow-insta-btn::after {
          content: "";
          position: absolute;
          top: -50%;
          left: -60%;
          width: 50%;
          height: 200%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(25deg);
          transition: all 0.6s ease;
          z-index: 2;
          pointer-events: none;
        }

        .follow-insta-btn:hover {
          color: #ffffff;
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 12px 28px -4px rgba(220, 39, 67, 0.5), 0 8px 16px -4px rgba(188, 24, 136, 0.4);
          border-color: transparent;
        }

        .follow-insta-btn:hover::before {
          opacity: 1;
        }

        .follow-insta-btn:hover::after {
          left: 130%;
        }

        .follow-insta-btn .insta-icon {
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .follow-insta-btn:hover .insta-icon {
          transform: scale(1.22) rotate(-10deg);
        }

        .follow-insta-btn span {
          transition: letter-spacing 0.3s ease;
        }

        .follow-insta-btn:hover span {
          letter-spacing: 0.11em;
        }
      `}</style>
    </section>
  );
}
