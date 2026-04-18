"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/features/product/types";
import { fetchProducts } from "@/shared/api/products";

type UseProductsQueryResult = {
  products: Product[];
  isLoading: boolean;
  error: string | null;
};

export function useProductsQuery(): UseProductsQueryResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        setIsLoading(true);
        setError(null);
        const items = await fetchProducts();

        if (!cancelled) {
          setProducts(items);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "상품 데이터를 불러오지 못했습니다."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  return { products, isLoading, error };
}
