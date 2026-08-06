import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata = {
  title: "90Drip | Premium Sports Jerseys",
  description: "90Drip — Premium sports jerseys from top clubs worldwide.",
  manifest: "/manifest.json",
  icons: {
    icon: "/images/favicon.png",
    shortcut: "/images/favicon.png",
    // apple-touch-icon: used by iOS when adding to homescreen
    apple: [
      { url: "/images/favicon.png", sizes: "192x192", type: "image/png" },
      { url: "/images/favicon.png", sizes: "512x512", type: "image/png" },
    ],
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
      <body>{children}</body>
    </html>
  );
}
