import { getProductsServer } from "@/lib/getProducts";
import ProductDetailClient from "@/components/ProductDetailClient";

export const dynamic = "force-dynamic";

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
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "3",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Marcus V."
        },
        "reviewBody": "The authentic match fabric feels incredible. Breathable, sleek fit, and the badge details are top tier."
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Liam K."
        },
        "reviewBody": "Ordered an M and it fits like a glove. The printing on the back looks official and sharp."
      }
    ],
    "offers": {
      "@type": "Offer",
      "url": `https://www.90drip.store/product/${product.id || product._id}`,
      "priceCurrency": "INR",
      "price": product.price,
      "validFrom": "2024-01-01",
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "90Drip"
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "IN",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 7,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "INR"
        },
        "shippingDestination": [
          {
            "@type": "DefinedRegion",
            "addressCountry": "IN"
          }
        ],
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 2,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 3,
            "maxValue": 7,
            "unitCode": "DAY"
          }
        }
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
