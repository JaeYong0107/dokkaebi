"use client";

import { useState, type ReactNode } from "react";
import { Icon } from "@/shared/ui/Icon";

type Props = {
  children: ReactNode;
  label?: string;
};

/**
 * 모바일에선 기본 접힘 (토글 버튼으로 펼치기),
 * 데스크톱(md+) 에선 항상 펼쳐짐.
 */
export function CollapsibleSidebar({ children, label = "필터" }: Readonly<Props>) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-2xl border border-surface-container bg-surface-container-lowest px-4 py-3 text-sm font-bold text-on-surface md:hidden"
      >
        <span className="flex items-center gap-2">
          <Icon name="tune" className="text-base" />
          {label}
        </span>
        <Icon
          name={open ? "expand_less" : "expand_more"}
          className="text-base"
        />
      </button>
      <div className={open ? "space-y-10" : "hidden space-y-10 md:block"}>
        {children}
      </div>
    </>
  );
}
