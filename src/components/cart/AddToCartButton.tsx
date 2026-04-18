"use client";

import { useState } from "react";
import clsx from "clsx";
import { Icon } from "@/components/common/Icon";
import { useCartStore } from "@/store/cart-store";

type AddToCartButtonProps = {
  productId: string;
  quantity?: number;
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
};

export function AddToCartButton({
  productId,
  quantity = 1,
  className,
  children = "담기",
  showIcon = false
}: Readonly<AddToCartButtonProps>) {
  const addItem = useCartStore((state) => state.addItem);
  const [pulsed, setPulsed] = useState(false);

  const handleClick = () => {
    addItem(productId, quantity);
    setPulsed(true);
    window.setTimeout(() => setPulsed(false), 600);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={clsx(
        "transition-transform active:scale-95",
        pulsed && "ring-2 ring-primary/30 ring-offset-2",
        className
      )}
    >
      {showIcon && (
        <Icon name="add_shopping_cart" className="mr-1 text-base align-middle" />
      )}
      {children}
    </button>
  );
}
