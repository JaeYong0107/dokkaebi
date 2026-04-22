"use client";

import { create } from "zustand";

type FavoriteState = {
  hydrated: boolean;
  productIds: Set<string>;
  pending: Set<string>;
};

type FavoriteActions = {
  hydrate: (productIds: string[]) => void;
  optimisticAdd: (productId: string) => void;
  optimisticRemove: (productId: string) => void;
  setPending: (productId: string, pending: boolean) => void;
  reset: () => void;
};

const EMPTY: FavoriteState = {
  hydrated: false,
  productIds: new Set(),
  pending: new Set()
};

export const useFavoriteStore = create<FavoriteState & FavoriteActions>(
  (set) => ({
    ...EMPTY,
    hydrate: (productIds) =>
      set({
        hydrated: true,
        productIds: new Set(productIds),
        pending: new Set()
      }),
    optimisticAdd: (productId) =>
      set((state) => {
        const next = new Set(state.productIds);
        next.add(productId);
        return { productIds: next };
      }),
    optimisticRemove: (productId) =>
      set((state) => {
        const next = new Set(state.productIds);
        next.delete(productId);
        return { productIds: next };
      }),
    setPending: (productId, pending) =>
      set((state) => {
        const next = new Set(state.pending);
        if (pending) next.add(productId);
        else next.delete(productId);
        return { pending: next };
      }),
    reset: () => set({ ...EMPTY, productIds: new Set(), pending: new Set() })
  })
);

export function useIsFavorited(productId: string) {
  return useFavoriteStore((state) => state.productIds.has(productId));
}

export function useIsFavoritePending(productId: string) {
  return useFavoriteStore((state) => state.pending.has(productId));
}
