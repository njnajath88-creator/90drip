import { getProductsServer } from "@/lib/getProducts";
import HomePageClient from "@/components/HomePageClient";

export const revalidate = 60;

export default async function Home() {
  const initialProducts = await getProductsServer();
  return <HomePageClient initialProducts={initialProducts} />;
}
