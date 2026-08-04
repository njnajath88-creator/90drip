import { getProductsServer } from "@/lib/getProducts";
import ProductDetailClient from "@/components/ProductDetailClient";

// Use dynamic rendering — no ISR writes, always fresh data
export const dynamic = "force-dynamic";

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
