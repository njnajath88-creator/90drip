"use client";
import Image from "next/image";

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
      {/* Ribbon 2 (Dark Slate Ribbon - Tilted +3deg - Moving Right) */}
      <div className="marquee-ribbon-bg">
        <div className="marquee-track-bg">
          {marqueeItems.concat(marqueeItems).concat(marqueeItems).map((text, idx) => (
            <div key={idx} className="marquee-item-bg">
              <Image
                src="/images/90driplogo.png"
                alt="90DRIP"
                width={70}
                height={20}
                loading="lazy"
                className="marquee-logo-bg"
              />
              <span>{text}</span>
              {/* White Footballer Silhouette */}
              <svg className="marquee-svg-bg" viewBox="0 0 24 24" fill="#ffffff">
                <circle cx="16" cy="4.5" r="2.2" />
                <path d="M12.5 7.5L8.2 11.8c-.4.4-.4 1 0 1.4l3.8 3.8v4.5h2v-5.2l-3.1-3.1 2.6-2.6 3.5 3.5h3.5v-2h-2.7l-4.1-4.1-.7.5zM6.5 14.5l-3 3 1.4 1.4 3-3z"/>
                <circle cx="19.5" cy="8.5" r="1.5" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* Ribbon 1 (Foreground Bright Yellow Ribbon - Tilted -3deg - Moving Left) */}
      <div className="marquee-ribbon-fg">
        <div className="marquee-track-fg">
          {marqueeItems.concat(marqueeItems).concat(marqueeItems).map((text, idx) => (
            <div key={idx} className="marquee-item-fg">
              <Image
                src="/images/90driplogo.png"
                alt="90DRIP"
                width={70}
                height={20}
                loading="lazy"
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
          padding: 60px 0;
          background: #ffffff;
          margin: 15px 0 25px;
          width: 100%;
        }

        /* Dark Slate Ribbon (Ribbon 2) */
        .marquee-ribbon-bg {
          position: absolute;
          top: 50%;
          left: -10%;
          width: 120%;
          transform: translateY(-50%) rotate(3.2deg);
          background: #0f172a;
          border-top: 1px solid #334155;
          border-bottom: 1px solid #334155;
          padding: 13px 0;
          z-index: 1;
          display: flex;
          white-space: nowrap;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.15);
        }

        .marquee-track-bg {
          display: flex;
          align-items: center;
          gap: 50px;
          animation: marqueeRight 32s linear infinite;
          color: #ffffff;
          font-weight: 900;
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
          height: 22px;
          width: auto;
          object-fit: contain;
          filter: brightness(0) invert(1);
        }

        .marquee-svg-bg {
          width: 22px;
          height: 22px;
        }

        /* Bright Yellow Ribbon (Ribbon 1) */
        .marquee-ribbon-fg {
          position: relative;
          z-index: 2;
          width: 120%;
          margin-left: -10%;
          transform: rotate(-3.2deg);
          background: #facc15;
          padding: 14px 0;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
          display: flex;
          white-space: nowrap;
          overflow: hidden;
        }

        .marquee-track-fg {
          display: flex;
          align-items: center;
          gap: 50px;
          animation: marqueeLeft 28s linear infinite;
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

        /* Mobile Styles - Both ribbons clearly visible */
        @media (max-width: 768px) {
          .marquee-wrapper {
            padding: 55px 0;
            margin: 10px 0 20px;
          }

          .marquee-ribbon-bg {
            transform: translateY(-50%) rotate(4deg);
            padding: 11px 0;
          }

          .marquee-track-bg {
            font-size: 15px;
            gap: 32px;
          }

          .marquee-item-bg {
            gap: 28px;
          }

          .marquee-logo-bg {
            height: 18px;
          }

          .marquee-svg-bg {
            width: 18px;
            height: 18px;
          }

          .marquee-ribbon-fg {
            transform: rotate(-4deg);
            padding: 12px 0;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          }

          .marquee-track-fg {
            font-size: 16px;
            gap: 32px;
          }

          .marquee-item-fg {
            gap: 28px;
          }

          .marquee-logo-fg {
            height: 20px;
          }

          .marquee-svg-fg {
            width: 20px;
            height: 20px;
          }
        }
      `}</style>
    </div>
  );
}
