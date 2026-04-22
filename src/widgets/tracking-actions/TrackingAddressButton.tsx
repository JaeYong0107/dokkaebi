"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShippingAddressModal } from "@/widgets/checkout-address/ShippingAddressModal";
import type { ShippingAddress } from "@/store/checkout-store";

type Props = {
  orderId: string;
  orderStatus: string;
  initialRecipient: string;
  initialAddress: string;
};

const EDITABLE = new Set(["PENDING", "PAID", "PREPARING"]);

export function TrackingAddressButton({
  orderId,
  orderStatus,
  initialRecipient,
  initialAddress
}: Readonly<Props>) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const editable = EDITABLE.has(orderStatus);
  const initial: ShippingAddress = {
    recipient: initialRecipient,
    recipientPhone: "",
    address: initialAddress,
    addressDetail: ""
  };

  const onSave = async (next: ShippingAddress) => {
    setError(null);
    const fullAddress = [next.address, next.addressDetail]
      .filter((part) => part.trim().length > 0)
      .join(" ");

    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: next.recipient,
        recipientPhone: next.recipientPhone || null,
        shippingAddress: fullAddress
      })
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(body?.message ?? "배송지 변경에 실패했습니다");
      return;
    }
    setOpen(false);
    startTransition(() => router.refresh());
  };

  return (
    <>
      <button
        type="button"
        disabled={!editable || pending}
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
        title={editable ? undefined : "이미 출고된 주문은 배송지를 변경할 수 없습니다"}
        className="text-sm font-bold text-primary hover:underline disabled:cursor-not-allowed disabled:text-on-surface-variant/50 disabled:no-underline"
      >
        변경하기
      </button>
      {error && (
        <p className="mt-2 rounded-xl bg-error/10 px-3 py-2 text-xs font-semibold text-error">
          {error}
        </p>
      )}
      {open && (
        <ShippingAddressModal
          initial={initial}
          onClose={() => setOpen(false)}
          onSave={onSave}
        />
      )}
    </>
  );
}
