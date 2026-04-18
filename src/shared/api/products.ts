import type { Product } from "@/features/product/types";

export type ProductsResponse = {
  items: Product[];
  total: number;
};

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch("/api/products", {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("상품 데이터를 불러오지 못했습니다.");
  }

  const data = (await response.json()) as ProductsResponse;
  return data.items;
}
