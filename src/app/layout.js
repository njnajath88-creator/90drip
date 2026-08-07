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
  title: "90Drip | Premium Sports Jerseys",
  description: "Explore premium, authentic-grade sports jerseys from top clubs worldwide. Minimalist designs, maximum performance. Buy premium football kits online.",
  keywords: ["football jerseys", "sports jerseys", "retro jerseys", "90drip", "premium football kits", "india jersey store", "buy football jerseys online"],
  manifest: "/manifest.json",
  icons: {
    icon: "/images/favicon.png",
    shortcut: "/favicon.ico",
    // apple-touch-icon: used by iOS when adding to homescreen
    apple: [
      { url: "/images/favicon.png", sizes: "192x192", type: "image/png" },
    ],
  },
  openGraph: {
    title: "90Drip | Premium Sports Jerseys",
    description: "Explore premium, authentic-grade sports jerseys from top clubs worldwide. Minimalist designs, maximum performance. Buy premium football kits online.",
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
    title: "90Drip | Premium Sports Jerseys",
    description: "Explore premium, authentic-grade sports jerseys from top clubs worldwide. Minimalist designs, maximum performance. Buy premium football kits online.",
    images: ["/images/90driplogo.png"],
  },
  // iOS-specific PWA meta tags
  // apple-mobile-web-app-capable: enables standalone mode on iPhone
  // Without this, iOS won't activate the PWA shell needed for Web Push.
  appleWebApp: {
    capable: true,
    title: "90Drip",
    statusBarStyle: "black-translucent",
  },
  other: {
    // Explicit fallback for older iOS versions that don't read appleWebApp
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "90Drip",
    // Prevent iOS from auto-detecting phone numbers as links
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
  return (
    <html lang="en" className={inter.className}>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
