"use client";

import { useEffect, useState } from "react";
import { fetchCartSeed } from "@/shared/api/cart";
import { useCartStore } from "@/store/cart-store";

export function CartSeedBootstrap() {
  const items = useCartStore((state) => state.items);
  const replaceCart = useCartStore((state) => state.replaceCart);
  const [persistReady, setPersistReady] = useState(useCartStore.persist.hasHydrated());

  useEffect(() => {
    if (useCartStore.persist.hasHydrated()) {
      setPersistReady(true);
      return;
    }

    const unsubscribe = useCartStore.persist.onFinishHydration(() => {
      setPersistReady(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!persistReady || items.length > 0) {
      return;
    }

    let cancelled = false;

    async function seedCart() {
      try {
        const data = await fetchCartSeed();
        if (!cancelled) {
          replaceCart(data.items, data.customerType);
        }
      } catch {
        // 장바구니 시드는 데모 편의를 위한 값이므로 실패해도 UX를 막지 않는다.
      }
    }

    seedCart();

    return () => {
      cancelled = true;
    };
  }, [persistReady, items.length, replaceCart]);

  return null;
}
