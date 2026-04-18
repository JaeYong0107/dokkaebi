import type { Product } from "@/features/product/types";
import type { RecentOrderItem } from "./types";

export function buildReorderItems(params: {
  recentOrderItems: RecentOrderItem[];
  products: Product[];
}) {
  return params.recentOrderItems.flatMap((item) => {
    const product = params.products.find(
      (candidate) => candidate.id === item.productId && candidate.isActive
    );

    if (!product) {
      return [];
    }

    return [
      {
        productId: product.id,
        name: product.name,
        quantity: item.quantity
      }
    ];
  });
}
