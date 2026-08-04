import { getProductsServer } from "@/lib/getProducts";
import HomePageClient from "@/components/HomePageClient";

export const revalidate = 3600; // Revalidate every 1 hour instead of every 60s to save ISR writes

export default async function Home() {
  const initialProducts = await getProductsServer();
  return <HomePageClient initialProducts={initialProducts} />;
}
