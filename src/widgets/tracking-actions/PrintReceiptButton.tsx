"use client";

import { Icon } from "@/shared/ui/Icon";

export function PrintReceiptButton() {
  const handleClick = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center gap-2 rounded-xl bg-surface-container-highest px-6 py-3 font-bold text-on-surface transition-colors hover:bg-surface-variant"
    >
      <Icon name="print" className="text-[20px]" />
      영수증 출력
    </button>
  );
}
