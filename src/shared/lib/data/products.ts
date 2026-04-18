import categoryData from "../../../../data/categories.json";
import productData from "../../../../data/products.json";
import type { Category, Product } from "@/features/product/types";

export const sampleCategories: Category[] = categoryData as Category[];
export const sampleProducts: Product[] = productData as Product[];

export function getProductById(id: string) {
  return sampleProducts.find((product) => product.id === id) ?? null;
}

export function getActiveProducts() {
  return sampleProducts.filter((product) => product.isActive);
}
