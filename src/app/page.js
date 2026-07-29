import { getProductsServer } from "@/lib/getProducts";
import HomePageClient from "@/components/HomePageClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const initialProducts = await getProductsServer();
  return <HomePageClient initialProducts={initialProducts} />;
}
