"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartInputItem } from "@/features/cart/types";
import type { CustomerType } from "@/features/pricing/types";

export type PaymentMethod =
  | "easy"
  | "card"
  | "transfer"
  | "phone"
  | "naver"
  | "deposit";

export type CheckoutSource = "cart" | "buy-now" | "reorder";

export type ShippingAddress = {
  recipient: string;
  recipientPhone: string;
  address: string;
  addressDetail: string;
};

type CheckoutState = {
  source: CheckoutSource | null;
  draftItems: CartInputItem[];
  customerType: CustomerType;
  paymentMethod: PaymentMethod;
  shippingMemo: string;
  shippingAddress: ShippingAddress;
  taxInvoiceRequested: boolean;
  agreedToOrder: boolean;
  agreedToPrivacy: boolean;
};

type CheckoutActions = {
  setDraftFromCart: (items: CartInputItem[], customerType: CustomerType) => void;
  setDraftFromBuyNow: (
    item: CartInputItem,
    customerType: CustomerType
  ) => void;
  setDraftFromReorder: (
    items: CartInputItem[],
    customerType: CustomerType
  ) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setShippingMemo: (memo: string) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  setTaxInvoiceRequested: (requested: boolean) => void;
  setAgreedToOrder: (agreed: boolean) => void;
  setAgreedToPrivacy: (agreed: boolean) => void;
  clear: () => void;
};

const INITIAL_STATE: CheckoutState = {
  source: null,
  draftItems: [],
  customerType: "BUSINESS",
  paymentMethod: "easy",
  shippingMemo: "",
  shippingAddress: {
    recipient: "",
    recipientPhone: "",
    address: "",
    addressDetail: ""
  },
  taxInvoiceRequested: false,
  agreedToOrder: false,
  agreedToPrivacy: false
};

export const useCheckoutStore = create<CheckoutState & CheckoutActions>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      setDraftFromCart: (items, customerType) =>
        set({
          source: "cart",
          draftItems: items,
          customerType
        }),

      setDraftFromBuyNow: (item, customerType) =>
        set({
          source: "buy-now",
          draftItems: [item],
          customerType
        }),

      setDraftFromReorder: (items, customerType) =>
        set({
          source: "reorder",
          draftItems: items,
          customerType
        }),

      setPaymentMethod: (method) => set({ paymentMethod: method }),
      setShippingMemo: (memo) => set({ shippingMemo: memo }),
      setShippingAddress: (address) => set({ shippingAddress: address }),
      setTaxInvoiceRequested: (requested) =>
        set({ taxInvoiceRequested: requested }),
      setAgreedToOrder: (agreed) => set({ agreedToOrder: agreed }),
      setAgreedToPrivacy: (agreed) => set({ agreedToPrivacy: agreed }),

      clear: () => set(INITIAL_STATE)
    }),
    {
      name: "dokkaebi-checkout",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        source: state.source,
        draftItems: state.draftItems,
        customerType: state.customerType,
        paymentMethod: state.paymentMethod,
        shippingMemo: state.shippingMemo,
        shippingAddress: state.shippingAddress,
        taxInvoiceRequested: state.taxInvoiceRequested
      })
    }
  )
);

export const useCheckoutDraftItems = () =>
  useCheckoutStore((state) => state.draftItems);
export const useCheckoutSource = () =>
  useCheckoutStore((state) => state.source);
