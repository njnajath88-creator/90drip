import { getProductsServer } from "@/lib/getProducts";
import CategoryPageClient from "@/components/CategoryPageClient";

export const dynamic = "force-dynamic";

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
