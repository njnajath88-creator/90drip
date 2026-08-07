import { getProductsServer } from "@/lib/getProducts";

export default async function sitemap() {
  const baseUrl = "https://www.90drip.store";

  // 1. Core static pages
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/wishlist`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.3,
    },
  ];

  // 2. Dynamic Category Pages
  const categories = [
    "full-sleeve",
    "half-sleeve",
    "5-sleeve",
    "retro",
    "embroidery",
  ];
  
  const categoryRoutes = categories.map((slug) => ({
    url: `${baseUrl}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  // 3. Dynamic Product Pages fetched directly from the database cache/store
  let productRoutes = [];
  try {
    const products = await getProductsServer();
    if (products && Array.isArray(products)) {
      productRoutes = products.map((p) => ({
        url: `${baseUrl}/product/${p.id || p._id}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      }));
    }
  } catch (error) {
    console.error("Sitemap generator product fetch error:", error);
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
