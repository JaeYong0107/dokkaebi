"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartInputItem } from "@/features/cart/types";
import type { CustomerType } from "@/features/pricing/types";

type CartState = {
  customerType: CustomerType;
  items: CartInputItem[];
};

type CartActions = {
  setCustomerType: (type: CustomerType) => void;
  replaceCart: (items: CartInputItem[], customerType?: CustomerType) => void;
  addItem: (productId: string, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

const INITIAL_STATE: CartState = {
  customerType: "BUSINESS",
  items: []
};

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      setCustomerType: (type) => set({ customerType: type }),

      replaceCart: (items, customerType) =>
        set((state) => ({
          items,
          customerType: customerType ?? state.customerType
        })),

      addItem: (productId, quantity = 1) =>
        set((state) => {
          const existing = state.items.find(
            (item) => item.productId === productId
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === productId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            };
          }
          return {
            items: [...state.items, { productId, quantity }]
          };
        }),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (item) => item.productId !== productId
              )
            };
          }
          return {
            items: state.items.map((item) =>
              item.productId === productId ? { ...item, quantity } : item
            )
          };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId)
        })),

      clear: () => set({ items: [] })
    }),
    {
      name: "dokkaebi-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        customerType: state.customerType,
        items: state.items
      })
    }
  )
);

export const useCartItems = () => useCartStore((state) => state.items);
export const useCartCustomerType = () =>
  useCartStore((state) => state.customerType);
export const useCartCount = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );
