"use client";
import { useState } from "react";

export default function FanGallerySection({ addToCart }) {
  const [activeReel, setActiveReel] = useState(null);

  const reels = [
    {
      id: 1,
      creator: "@kerala_drip",
      location: "Bernabéu Stadium",
      views: "48.2K",
      likes: "3.4K",
      comments: "142",
      img: "/images/jersey_product1.png",
      product: {
        id: "rm-home-2425",
        name: "Real Madrid 24/25 Home Kit",
        price: 2499,
        image: "/images/jersey_product1.png",
      },
      caption: "Unboxing the 24/25 Real Madrid Home Kit! Badges and heat-press lettering are perfection 🔥 #90DRIP",
    },
    {
      id: 2,
      creator: "@barca_vibes",
      location: "Camp Nou Fan Zone",
      views: "62.1K",
      likes: "5.1K",
      comments: "219",
      img: "/images/jersey_product2.png",
      product: {
        id: "fcb-home-2425",
        name: "FC Barcelona 24/25 Home Kit",
        price: 2499,
        image: "/images/jersey_product2.png",
      },
      caption: "Retro classic colors hit different 🔴🔵 Breathable mesh fabric is 10/10 for matchday!",
    },
    {
      id: 3,
      creator: "@reddevils_kochi",
      location: "Old Trafford",
      views: "39.5K",
      likes: "2.8K",
      comments: "98",
      img: "/images/jersey_product3.png",
      product: {
        id: "mun-home-2425",
        name: "Manchester United 24/25 Home Kit",
        price: 2499,
        image: "/images/jersey_product3.png",
      },
      caption: "Got my custom number 7 kit delivered in 3 days! Kerala devils representing 👹",
    },
    {
      id: 4,
      creator: "@paris_drip",
      location: "Paris Matchday",
      views: "74.8K",
      likes: "6.3K",
      comments: "310",
      img: "/images/jersey_product4.png",
      product: {
        id: "psg-home-2425",
        name: "PSG 24/25 Fourth Edition Kit",
        price: 2699,
        image: "/images/jersey_product4.png",
      },
      caption: "Jordan x PSG collab is street culture perfection. Tap to shop the exact fit! ⚡",
    },
  ];

  return (
    <section style={{ padding: "80px 0", background: "#ffffff", color: "#0f172a", borderTop: "1px solid #f1f5f9" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 20px" }}>
        
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#eff6ff",
              color: "#2563eb",
              border: "1px solid #bfdbfe",
              padding: "6px 16px",
              borderRadius: "30px",
              fontSize: "12px",
              fontWeight: "800",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "14px",
            }}
          >
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 10px #ef4444", display: "inline-block" }}></span>
            <span>LIVE COMMUNITY REELS</span>
          </div>

          <h2 style={{ fontSize: "36px", fontWeight: "900", color: "#0f172a", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
            As Seen On Streetwear Fans
          </h2>
          <p style={{ fontSize: "15px", color: "#64748b", maxWidth: "560px", margin: "0 auto", fontWeight: "600" }}>
            Tap any mobile frame to watch matchday fit reels & shop the exact kit.
          </p>
        </div>

        {/* Smartphone Reel Frames Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "24px",
          }}
        >
          {reels.map((reel) => (
            <div
              key={reel.id}
              onClick={() => setActiveReel(reel)}
              style={{
                position: "relative",
                borderRadius: "46px",
                padding: "8px",
                background: "linear-gradient(145deg, #1e293b, #0f172a)",
                border: "2px solid #334155",
                boxShadow: "0 25px 50px rgba(15, 23, 42, 0.18), inset 0 0 4px rgba(255, 255, 255, 0.2)",
                cursor: "pointer",
                overflow: "hidden",
                transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), boxShadow 0.35s ease",
              }}
              className="phone-frame"
            >
              {/* Phone Inner Screen Container */}
              <div
                style={{
                  position: "relative",
                  borderRadius: "38px",
                  overflow: "hidden",
                  height: "510px",
                  background: "#020617",
                }}
              >
                {/* iPhone 17 Pro Dynamic Island Notch */}
                <div
                  style={{
                    position: "absolute",
                    top: "8px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "88px",
                    height: "22px",
                    background: "#000000",
                    borderRadius: "14px",
                    zIndex: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
                  }}
                >
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#090d16" }}></span>
                  <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#1d4ed8" }}></span>
                </div>

                {/* Reel Product / Fan Photo Image */}
                <div style={{ width: "100%", height: "100%", background: "linear-gradient(to bottom, #0f172a, #020617)", display: "flex", alignItems: "center", justifyContent: "center", padding: "45px 15px 95px", overflow: "hidden" }}>
                  <img
                    src={reel.img}
                    alt={reel.creator}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                      transition: "transform 0.5s ease",
                      filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.6))",
                    }}
                    className="reel-bg-img"
                  />
                </div>

                {/* Top Views Badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "36px",
                    left: "14px",
                    zIndex: 5,
                  }}
                >
                  <span
                    style={{
                      background: "rgba(15, 23, 42, 0.8)",
                      backdropFilter: "blur(8px)",
                      color: "#ffffff",
                      fontSize: "11px",
                      fontWeight: "800",
                      padding: "4px 10px",
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#ffffff"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    <span>{reel.views} views</span>
                  </span>
                </div>

                {/* Right Action Icons (Heart & Comment) */}
                <div
                  style={{
                    position: "absolute",
                    right: "12px",
                    bottom: "115px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "14px",
                    zIndex: 5,
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(15,23,42,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.15)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    </div>
                    <span style={{ fontSize: "10px", fontWeight: "800", color: "#ffffff", marginTop: "2px", display: "block" }}>{reel.likes}</span>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(15,23,42,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.15)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    </div>
                    <span style={{ fontSize: "10px", fontWeight: "800", color: "#ffffff", marginTop: "2px", display: "block" }}>{reel.comments}</span>
                  </div>
                </div>

                {/* Bottom Overlay: Creator info & Shop Button */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "20px 14px 14px",
                    background: "linear-gradient(to top, rgba(2, 6, 23, 0.95) 0%, rgba(2, 6, 23, 0.7) 65%, transparent 100%)",
                    zIndex: 5,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "900" }}>
                      {reel.creator.charAt(1).toUpperCase()}
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: "800", color: "#ffffff" }}>{reel.creator}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>

                  <p style={{ fontSize: "11px", color: "#cbd5e1", margin: "0 0 10px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: "600" }}>
                    {reel.product.name}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(reel.product);
                    }}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "14px",
                      background: "#2563eb",
                      color: "#ffffff",
                      border: "none",
                      fontWeight: "900",
                      fontSize: "12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      boxShadow: "0 4px 14px rgba(37, 99, 235, 0.4)",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    <span>Shop Fit — ₹{reel.product.price}</span>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Reel Lightbox Modal */}
      {activeReel && (
        <div
          onClick={() => setActiveReel(null)}
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
              borderRadius: "28px",
              maxWidth: "420px",
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.35)",
              position: "relative",
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveReel(null)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#f1f5f9",
                color: "#0f172a",
                border: "none",
                fontSize: "18px",
                fontWeight: "900",
                cursor: "pointer",
                zIndex: 20,
              }}
            >
              ✕
            </button>

            {/* Reel Header */}
            <div
              style={{
                position: "absolute",
                top: "16px",
                left: "16px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                zIndex: 20,
                background: "rgba(15, 23, 42, 0.75)",
                backdropFilter: "blur(8px)",
                padding: "6px 12px",
                borderRadius: "20px",
              }}
            >
              <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "11px" }}>
                {activeReel.creator.charAt(1).toUpperCase()}
              </div>
              <span style={{ fontSize: "12px", fontWeight: "900", color: "#ffffff" }}>{activeReel.creator}</span>
            </div>

            {/* Reel Media Screen */}
            <div style={{ height: "380px", background: "linear-gradient(to bottom, #0f172a, #020617)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: "30px" }}>
              <img
                src={activeReel.img}
                alt={activeReel.creator}
                style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.6))" }}
              />
            </div>

            {/* Reel Details & Shop CTA */}
            <div style={{ padding: "24px", background: "#ffffff" }}>
              <p style={{ fontSize: "13px", color: "#334155", margin: "0 0 16px", lineHeight: 1.5, fontWeight: "600" }}>
                "{activeReel.caption}"
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "12px 16px", borderRadius: "14px", border: "1px solid #e2e8f0", marginBottom: "16px" }}>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: "900", color: "#2563eb", textTransform: "uppercase" }}>TAGGED MATCH KIT</div>
                  <div style={{ fontSize: "14px", fontWeight: "900", color: "#0f172a" }}>{activeReel.product.name}</div>
                </div>
                <div style={{ fontSize: "16px", fontWeight: "900", color: "#16a34a" }}>₹{activeReel.product.price}</div>
              </div>

              <button
                onClick={() => {
                  addToCart(activeReel.product);
                  setActiveReel(null);
                }}
                style={{
                  width: "100%",
                  padding: "15px",
                  borderRadius: "14px",
                  background: "#0f172a",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: "900",
                  fontSize: "13px",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 4px 14px rgba(15, 23, 42, 0.2)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                <span>Add {activeReel.product.name} to Cart</span>
              </button>
            </div>

          </div>
        </div>
      )}

      <style jsx>{`
        .phone-frame:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px rgba(15, 23, 42, 0.22) !important;
        }
        .phone-frame:hover .reel-bg-img {
          transform: scale(1.08);
        }
      `}</style>
    </section>
  );
}
