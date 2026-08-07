import { getProductsServer } from "@/lib/getProducts";
import CategoryPageClient from "@/components/CategoryPageClient";

// Use static rendering with Incremental Static Regeneration (ISR)
export const revalidate = 300; // Revalidate every 5 minutes

const getCategoryName = (slug) => {
  const mapping = {
    "full-sleeve": "Full Sleeve Football Jerseys",
    "half-sleeve": "Half Sleeve Classic Jerseys",
    "5-sleeve": "5/Sleeve Streetwear Jerseys",
    "retro": "Retro Vintage Football Jerseys",
    "embroidery": "Stitched Embroidery Jerseys",
  };
  const normalized = String(slug || "").toLowerCase();
  return mapping[normalized] || `${normalized.charAt(0).toUpperCase() + normalized.slice(1)} Jerseys`;
};

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams?.slug || "";
  const categoryName = getCategoryName(rawSlug);

  const title = `${categoryName} | Premium Collections | 90Drip`;
  const description = `Shop our curated collection of premium ${categoryName} at 90Drip. Authentic high-quality sports kits, vintage football designs, and oversized streetwear fits.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://www.90drip.store/category/${rawSlug}`,
      siteName: "90Drip",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CategoryPage({ params }) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams?.slug || "";
  const slug = String(rawSlug).toLowerCase();

  const allProducts = await getProductsServer();

  return (
    <CategoryPageClient
      slug={slug}
      initialProducts={allProducts}
    />
  );
}
