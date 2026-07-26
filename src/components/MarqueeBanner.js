"use client";

export default function MarqueeBanner() {
  const marqueeItems = [
    "Buy 2 Get Free Delivery",
    "Only This Week",
    "100% Authentic Match Kits",
    "Express Shipping Across India",
    "Custom Name & Number Printing",
  ];

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "50px 0",
        background: "#ffffff",
        margin: "10px 0 30px",
      }}
    >
      {/* Ribbon 2 (Backdrop Translucent Ribbon - Tilted 2.5deg - Moving Right) */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "-10%",
          width: "120%",
          transform: "translateY(-50%) rotate(2.5deg)",
          background: "rgba(248, 250, 252, 0.85)",
          borderTop: "1px solid #f1f5f9",
          borderBottom: "1px solid #f1f5f9",
          padding: "14px 0",
          zIndex: 1,
          display: "flex",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "55px",
            animation: "marqueeRight 32s linear infinite",
            color: "#94a3b8",
            fontWeight: "800",
            fontStyle: "italic",
            fontSize: "19px",
            letterSpacing: "0.02em",
          }}
        >
          {marqueeItems.concat(marqueeItems).map((text, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: "45px" }}>
              <img
                src="/images/90driplogo.png"
                alt="90DRIP"
                style={{
                  height: "22px",
                  width: "auto",
                  objectFit: "contain",
                  opacity: 0.35,
                  filter: "grayscale(100%)",
                }}
              />
              <span>{text}</span>
              {/* Grey Footballer Kicking Ball Silhouette */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#cbd5e1">
                <circle cx="16" cy="4.5" r="2.2" />
                <path d="M12.5 7.5L8.2 11.8c-.4.4-.4 1 0 1.4l3.8 3.8v4.5h2v-5.2l-3.1-3.1 2.6-2.6 3.5 3.5h3.5v-2h-2.7l-4.1-4.1-.7.5zM6.5 14.5l-3 3 1.4 1.4 3-3z"/>
                <circle cx="19.5" cy="8.5" r="1.5" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* Ribbon 1 (Foreground Bright Yellow Ribbon - Tilted -2deg - Moving Left) */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          transform: "rotate(-2deg) scale(1.04)",
          background: "#facc15",
          padding: "14px 0",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
          display: "flex",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "55px",
            animation: "marqueeLeft 28s linear infinite",
            color: "#0f172a",
            fontWeight: "900",
            fontStyle: "italic",
            fontSize: "20px",
            letterSpacing: "0.02em",
          }}
        >
          {marqueeItems.concat(marqueeItems).map((text, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: "45px" }}>
              <img
                src="/images/90driplogo.png"
                alt="90DRIP"
                style={{
                  height: "26px",
                  width: "auto",
                  objectFit: "contain",
                }}
              />
              <span>{text}</span>
              {/* Black Footballer Kicking Ball Silhouette */}
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#0f172a">
                <circle cx="16" cy="4.5" r="2.2" />
                <path d="M12.5 7.5L8.2 11.8c-.4.4-.4 1 0 1.4l3.8 3.8v4.5h2v-5.2l-3.1-3.1 2.6-2.6 3.5 3.5h3.5v-2h-2.7l-4.1-4.1-.7.5zM6.5 14.5l-3 3 1.4 1.4 3-3z"/>
                <circle cx="19.5" cy="8.5" r="1.5" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
