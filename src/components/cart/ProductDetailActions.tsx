"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/shared/ui/Icon";
import { useCartStore } from "@/store/cart-store";
import { useCheckoutStore } from "@/store/checkout-store";

type ProductDetailActionsProps = {
  productId: string;
};

export function ProductDetailActions({
  productId
}: Readonly<ProductDetailActionsProps>) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const customerType = useCartStore((state) => state.customerType);
  const setDraftFromBuyNow = useCheckoutStore(
    (state) => state.setDraftFromBuyNow
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const decrement = () => setQuantity((q) => Math.max(1, q - 1));
  const increment = () => setQuantity((q) => Math.min(99, q + 1));

  const handleAddToCart = () => {
    addItem(productId, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  const handleBuyNow = () => {
    setDraftFromBuyNow({ productId, quantity }, customerType);
    router.push("/checkout");
  };

  return (
    <>
      <div className="mb-8">
        <div className="mb-4 text-sm font-bold">수량 선택</div>
        <div className="flex w-fit items-center overflow-hidden rounded-xl border border-outline-variant bg-white">
          <button
            type="button"
            aria-label="수량 감소"
            onClick={decrement}
            className="px-4 py-3 text-primary hover:bg-surface-container-low"
          >
            <Icon name="remove" />
          </button>
          <input
            type="number"
            value={quantity}
            min={1}
            onChange={(event) => {
              const next = Number(event.target.value);
              if (Number.isFinite(next) && next > 0) {
                setQuantity(Math.min(99, Math.floor(next)));
              }
            }}
            className="w-12 border-none text-center text-lg font-bold focus:ring-0"
          />
          <button
            type="button"
            aria-label="수량 증가"
            onClick={increment}
            className="px-4 py-3 text-primary hover:bg-surface-container-low"
          >
            <Icon name="add" />
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-primary py-4 font-bold text-primary transition-colors hover:bg-surface-container-low"
        >
          <Icon name="shopping_cart" />
          {added ? "담겼어요" : "장바구니"}
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="flex flex-[2] items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-container py-4 font-bold text-white shadow-lg shadow-primary/10 transition-all hover:opacity-90"
        >
          바로 구매하기
        </button>
      </div>
    </>
  );
}
