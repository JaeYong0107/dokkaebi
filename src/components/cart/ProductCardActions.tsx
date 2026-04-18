"use client";

import { useState } from "react";
import { Icon } from "@/components/common/Icon";
import { useCartStore } from "@/store/cart-store";

type ProductCardActionsProps = {
  productId: string;
};

export function ProductCardActions({
  productId
}: Readonly<ProductCardActionsProps>) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState(false);

  const decrement = () => setQuantity((q) => Math.max(1, q - 1));
  const increment = () => setQuantity((q) => Math.min(99, q + 1));

  const handleAdd = () => {
    addItem(productId, quantity);
    setFeedback(true);
    setQuantity(1);
    window.setTimeout(() => setFeedback(false), 800);
  };

  return (
    <div className="flex items-center justify-between gap-3 pt-2">
      <div className="flex items-center rounded-full bg-surface-container px-2 py-1">
        <button
          type="button"
          aria-label="수량 감소"
          onClick={decrement}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white"
        >
          <Icon name="remove" className="text-sm" />
        </button>
        <span className="w-8 text-center text-sm font-bold">{quantity}</span>
        <button
          type="button"
          aria-label="수량 증가"
          onClick={increment}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white"
        >
          <Icon name="add" className="text-sm" />
        </button>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className={
          "flex-1 rounded-full px-4 py-3 text-sm font-bold text-white shadow-md transition-all active:scale-95 " +
          (feedback
            ? "bg-primary"
            : "bg-secondary hover:bg-secondary-container")
        }
      >
        {feedback ? "담겼어요" : "담기"}
      </button>
    </div>
  );
}
