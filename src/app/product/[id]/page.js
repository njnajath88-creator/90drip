import { getProductsServer } from "@/lib/getProducts";
import ProductDetailClient from "@/components/ProductDetailClient";

// Use static rendering with Incremental Static Regeneration (ISR)
export const revalidate = 300; // Revalidate every 5 minutes

// Helper to construct absolute image and page URLs for Google's crawlers
const getAbsoluteUrl = (path, defaultPath = "/images/90driplogo.png") => {
  const target = path || defaultPath;
  if (target.startsWith("http://") || target.startsWith("https://")) {
    return target;
  }
  return `https://www.90drip.store${target.startsWith("/") ? "" : "/"}${target}`;
};

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const productId = resolvedParams?.id;

  const allProducts = await getProductsServer();
  const product = allProducts.find(
    (p) => String(p.id) === String(productId) || String(p._id) === String(productId)
  );

  if (!product) {
    return {
      title: "Product Not Found | 90Drip",
      description: "The requested sports jersey could not be found on 90Drip.",
    };
  }

  const title = `${product.name} | Premium ${product.sport || "Sports"} Jersey | 90Drip`;
  const description = `Buy the ${product.name} (${product.category || "Fit"}) sports jersey at 90Drip. High-quality football kits with premium stitching, logos, and athletic comfort. Available in sizes: ${product.sizes?.join(", ") || "S, M, L, XL"}.`;
  const imageUrl = getAbsoluteUrl(product.image);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl, width: 800, height: 800, alt: product.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const resolvedParams = await params;
  const productId = resolvedParams?.id;

  const allProducts = await getProductsServer();
  const product = allProducts.find(
    (p) => String(p.id) === String(productId) || String(p._id) === String(productId)
  );

  // Generate structured product schema for Google Search rich results
  const jsonLd = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": [
      getAbsoluteUrl(product.image),
      product.backImage ? getAbsoluteUrl(product.backImage) : null,
      product.closeupImage ? getAbsoluteUrl(product.closeupImage) : null,
    ].filter(Boolean),
    "description": `Buy the ${product.name} ${product.category || "Fit"} sports jersey at 90Drip. Premium quality with athletic stitching and sports details.`,
    "sku": String(product.id || product._id),
    "brand": {
      "@type": "Brand",
      "name": "90Drip"
    },
    "category": product.category,
    "offers": {
      "@type": "Offer",
      "url": `https://www.90drip.store/product/${product.id || product._id}`,
      "priceCurrency": "INR",
      "price": product.price,
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "90Drip"
      }
    }
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailClient
        productId={productId}
        initialProduct={product || null}
      />
    </>
  );
}
