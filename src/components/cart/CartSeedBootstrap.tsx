"use client";

import { useEffect, useState } from "react";
import { fetchCartSeed } from "@/shared/api/cart";
import { useCartStore } from "@/store/cart-store";

export function CartSeedBootstrap() {
  const items = useCartStore((state) => state.items);
  const replaceCart = useCartStore((state) => state.replaceCart);
  // SSG/SSR 단계에서는 persist API가 아직 연결되지 않을 수 있으므로 초기값은 항상 false 로 둔다
  const [persistReady, setPersistReady] = useState(false);

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
