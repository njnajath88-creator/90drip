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
    <div className="marquee-wrapper">
      {/* Ribbon 2 (Backdrop Translucent Ribbon - Moving Right) */}
      <div className="marquee-ribbon-bg">
        <div className="marquee-track-bg">
          {marqueeItems.concat(marqueeItems).concat(marqueeItems).map((text, idx) => (
            <div key={idx} className="marquee-item-bg">
              <img
                src="/images/90driplogo.png"
                alt="90DRIP"
                className="marquee-logo-bg"
              />
              <span>{text}</span>
              {/* Grey Footballer Silhouette */}
              <svg className="marquee-svg-bg" viewBox="0 0 24 24" fill="#cbd5e1">
                <circle cx="16" cy="4.5" r="2.2" />
                <path d="M12.5 7.5L8.2 11.8c-.4.4-.4 1 0 1.4l3.8 3.8v4.5h2v-5.2l-3.1-3.1 2.6-2.6 3.5 3.5h3.5v-2h-2.7l-4.1-4.1-.7.5zM6.5 14.5l-3 3 1.4 1.4 3-3z"/>
                <circle cx="19.5" cy="8.5" r="1.5" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* Ribbon 1 (Foreground Bright Yellow Ribbon - Moving Left) */}
      <div className="marquee-ribbon-fg">
        <div className="marquee-track-fg">
          {marqueeItems.concat(marqueeItems).concat(marqueeItems).map((text, idx) => (
            <div key={idx} className="marquee-item-fg">
              <img
                src="/images/90driplogo.png"
                alt="90DRIP"
                className="marquee-logo-fg"
              />
              <span>{text}</span>
              {/* Black Footballer Silhouette */}
              <svg className="marquee-svg-fg" viewBox="0 0 24 24" fill="#0f172a">
                <circle cx="16" cy="4.5" r="2.2" />
                <path d="M12.5 7.5L8.2 11.8c-.4.4-.4 1 0 1.4l3.8 3.8v4.5h2v-5.2l-3.1-3.1 2.6-2.6 3.5 3.5h3.5v-2h-2.7l-4.1-4.1-.7.5zM6.5 14.5l-3 3 1.4 1.4 3-3z"/>
                <circle cx="19.5" cy="8.5" r="1.5" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .marquee-wrapper {
          position: relative;
          overflow: hidden;
          padding: 45px 0;
          background: #ffffff;
          margin: 10px 0 20px;
          width: 100%;
        }

        .marquee-ribbon-bg {
          position: absolute;
          top: 50%;
          left: -10%;
          width: 120%;
          transform: translateY(-50%) rotate(2deg);
          background: rgba(248, 250, 252, 0.9);
          border-top: 1px solid #f1f5f9;
          border-bottom: 1px solid #f1f5f9;
          padding: 12px 0;
          z-index: 1;
          display: flex;
          white-space: nowrap;
          overflow: hidden;
        }

        .marquee-track-bg {
          display: flex;
          align-items: center;
          gap: 50px;
          animation: marqueeRight 35s linear infinite;
          color: #94a3b8;
          font-weight: 800;
          font-style: italic;
          font-size: 18px;
          letter-spacing: 0.02em;
        }

        .marquee-item-bg {
          display: flex;
          align-items: center;
          gap: 40px;
        }

        .marquee-logo-bg {
          height: 20px;
          width: auto;
          object-fit: contain;
          opacity: 0.35;
          filter: grayscale(100%);
        }

        .marquee-svg-bg {
          width: 22px;
          height: 22px;
        }

        .marquee-ribbon-fg {
          position: relative;
          z-index: 2;
          width: 120%;
          margin-left: -10%;
          transform: rotate(-1.8deg);
          background: #facc15;
          padding: 13px 0;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.07);
          display: flex;
          white-space: nowrap;
          overflow: hidden;
        }

        .marquee-track-fg {
          display: flex;
          align-items: center;
          gap: 50px;
          animation: marqueeLeft 30s linear infinite;
          color: #0f172a;
          font-weight: 900;
          font-style: italic;
          font-size: 19px;
          letter-spacing: 0.02em;
        }

        .marquee-item-fg {
          display: flex;
          align-items: center;
          gap: 40px;
        }

        .marquee-logo-fg {
          height: 24px;
          width: auto;
          object-fit: contain;
        }

        .marquee-svg-fg {
          width: 24px;
          height: 24px;
        }

        @keyframes marqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }

        @keyframes marqueeRight {
          0% { transform: translateX(-33.33%); }
          100% { transform: translateX(0); }
        }

        /* Responsive Mobile Styles */
        @media (max-width: 768px) {
          .marquee-wrapper {
            padding: 24px 0;
            margin: 5px 0 15px;
          }

          .marquee-ribbon-bg {
            transform: translateY(-50%) rotate(1deg);
            padding: 8px 0;
          }

          .marquee-track-bg {
            font-size: 13px;
            gap: 24px;
          }

          .marquee-item-bg {
            gap: 20px;
          }

          .marquee-logo-bg {
            height: 14px;
          }

          .marquee-svg-bg {
            width: 15px;
            height: 15px;
          }

          .marquee-ribbon-fg {
            transform: rotate(-1deg);
            padding: 9px 0;
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
          }

          .marquee-track-fg {
            font-size: 14px;
            gap: 24px;
          }

          .marquee-item-fg {
            gap: 20px;
          }

          .marquee-logo-fg {
            height: 16px;
          }

          .marquee-svg-fg {
            width: 16px;
            height: 16px;
          }
        }
      `}</style>
    </div>
  );
}
