export const metadata = {
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "90Drip Admin Portal",
    statusBarStyle: "black-translucent",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "90Drip Admin Portal",
  },
};

export default function AdminLayout({ children }) {
  return <>{children}</>;
}
