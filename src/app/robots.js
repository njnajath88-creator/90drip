export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/*",
        "/api/*",
      ],
    },
    sitemap: "https://www.90drip.store/sitemap.xml",
  };
}
