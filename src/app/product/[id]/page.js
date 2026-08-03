import { getProductsServer } from "@/lib/getProducts";
import ProductDetailClient from "@/components/ProductDetailClient";

// Revalidate cached page every 60 seconds (ISR)
export const revalidate = 60;

// Pre-generate product pages at build time for instant loading
export async function generateStaticParams() {
  try {
    const products = await getProductsServer();
    return products.map((p) => ({ id: String(p.id || p._id) }));
  } catch {
    return [];
  }
}

export default async function ProductDetailPage({ params }) {
  const resolvedParams = await params;
  const productId = resolvedParams?.id;

  const allProducts = await getProductsServer();
  const product = allProducts.find(
    (p) => String(p.id) === String(productId) || String(p._id) === String(productId)
  );

  return (
    <ProductDetailClient
      productId={productId}
      initialProduct={product || null}
      allProducts={allProducts}
    />
  );
}
