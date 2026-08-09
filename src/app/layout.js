import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://www.90drip.store"),
  title: {
    default: "90Drip | Premium Sports & Football Jerseys India",
    template: "%s | 90Drip",
  },
  description: "90Drip is India's premier online store for authentic-grade sports jerseys, retro kits, and streetwear football apparel. Minimalist designs, maximum performance.",
  keywords: [
    "90drip",
    "90 drip",
    "90drip store",
    "90drip.store",
    "90drip jerseys",
    "football jerseys",
    "sports jerseys",
    "retro jerseys",
    "buy football kits india",
  ],
  alternates: {
    canonical: "https://www.90drip.store",
  },
  icons: {
    icon: "/images/90d-favicon.png",
    shortcut: "/images/90d-favicon.png",
    apple: "/images/90d-favicon.png",
  },
  openGraph: {
    title: "90Drip | Premium Sports & Football Jerseys India",
    description: "Explore premium, authentic-grade sports jerseys from top clubs worldwide. Minimalist designs, maximum performance.",
    url: "https://www.90drip.store",
    siteName: "90Drip",
    images: [
      {
        url: "/images/90driplogo.png",
        width: 1200,
        height: 630,
        alt: "90Drip Premium Sports Jerseys",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "90Drip | Premium Sports & Football Jerseys",
    description: "Explore premium, authentic-grade sports jerseys from top clubs worldwide.",
    images: ["/images/90driplogo.png"],
  },
  other: {
    "format-detection": "telephone=no",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.90drip.store/#website",
        "url": "https://www.90drip.store",
        "name": "90Drip",
        "alternateName": ["90 Drip", "90Drip Store"],
        "description": "Premium Sports & Football Jerseys Store India",
        "publisher": {
          "@id": "https://www.90drip.store/#organization",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://www.90drip.store/#organization",
        "name": "90Drip",
        "url": "https://www.90drip.store",
        "logo": "https://www.90drip.store/images/90driplogo.png",
      },
    ],
  };

  return (
    <html lang="en" className={inter.className}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
