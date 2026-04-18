import type { CartInputItem } from "@/features/cart/types";
import type { CustomerType } from "@/features/pricing/types";

export type CartSeedResponse = {
  customerType: CustomerType;
  items: CartInputItem[];
};

export async function fetchCartSeed(): Promise<CartSeedResponse> {
  const response = await fetch("/api/cart", {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("장바구니 시드 데이터를 불러오지 못했습니다.");
  }

  return (await response.json()) as CartSeedResponse;
}
