"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useCartItems, useCartStore } from "@/store/cart-store";

const DEBOUNCE_MS = 600;

/**
 * 로그인 상태일 때 로컬 장바구니 변경 시 서버로 자동 PUT 동기화.
 * 로그아웃 시 로컬 장바구니 정리 (다른 사람이 같은 브라우저를 쓸 때
 * 이전 사용자의 장바구니가 노출되지 않도록).
 */
export function CartServerSync() {
  const { status } = useSession();
  const items = useCartItems();
  const customerType = useCartStore((state) => state.customerType);
  const clear = useCartStore((state) => state.clear);

  // 초기 마운트 직후의 hydration 단계에선 동기화하지 않도록 플래그
  const hydratedRef = useRef(false);
  const prevStatusRef = useRef<typeof status>("loading");

  // 최신 hydration 종료 시점 감지
  useEffect(() => {
    const unsubscribe = useCartStore.persist.onFinishHydration(() => {
      hydratedRef.current = true;
    });
    if (useCartStore.persist.hasHydrated()) {
      hydratedRef.current = true;
    }
    return unsubscribe;
  }, []);

  // 로그아웃 시 로컬 정리
  useEffect(() => {
    const prev = prevStatusRef.current;
    prevStatusRef.current = status;
    if (prev === "authenticated" && status === "unauthenticated") {
      clear();
    }
  }, [status, clear]);

  // 로그인 상태에서 items 가 바뀌면 debounce PUT
  useEffect(() => {
    if (!hydratedRef.current) return;
    if (status !== "authenticated") return;

    const handle = window.setTimeout(() => {
      void fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items })
      }).catch(() => undefined);
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(handle);
  }, [items, customerType, status]);

  return null;
}
