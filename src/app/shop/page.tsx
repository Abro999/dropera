import { Metadata } from "next";
import { ProductService } from "@/services/ProductService";
import { ShopClient } from "@/components/shop/ShopClient";

export const metadata: Metadata = {
  title: "Shop all products",
  description: "Browse DropEra's full curated catalog across tech, home, fashion, accessories and outdoor.",
};

export default async function ShopPage({ searchParams }: { searchParams: { sort?: string; category?: string } }) {
  const [products, categories] = await Promise.all([ProductService.list(), ProductService.categories()]);

  return (
    <ShopClient
      products={products}
      categories={categories}
      initialFilters={{
        sort: (searchParams.sort as any) ?? "featured",
        category: searchParams.category,
      }}
    />
  );
}
