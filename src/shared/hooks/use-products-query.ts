"use client";

import { useQuery } from "@tanstack/react-query";
import type { Product } from "@/features/product/types";
import { fetchProducts } from "@/shared/api/products";

type UseProductsQueryResult = {
  products: Product[];
  isLoading: boolean;
  error: string | null;
};

export const productsQueryKey = ["products"] as const;

export function useProductsQuery(): UseProductsQueryResult {
  const query = useQuery({
    queryKey: productsQueryKey,
    queryFn: () => fetchProducts()
  });

  return {
    products: query.data ?? [],
    isLoading: query.isPending,
    error: extractErrorMessage(query.error)
  };
}

function extractErrorMessage(error: unknown): string | null {
  if (!error) return null;
  if (error instanceof Error) return error.message;
  return "상품 데이터를 불러오지 못했습니다.";
}
