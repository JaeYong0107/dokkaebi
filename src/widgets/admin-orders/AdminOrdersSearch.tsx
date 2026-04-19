"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Icon } from "@/shared/ui/Icon";

const DEBOUNCE_MS = 250;

export function AdminOrdersSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initial = searchParams.get("q") ?? "";

  const [value, setValue] = useState(initial);
  const [, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 외부에서 URL 이 바뀐 경우(예: 다른 화면에서 navigate) input 동기화
  useEffect(() => {
    setValue(searchParams.get("q") ?? "");
  }, [searchParams]);

  const pushQuery = (next: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next) {
      params.set("q", next);
    } else {
      params.delete("q");
    }
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setValue(next);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => pushQuery(next), DEBOUNCE_MS);
  };

  const handleClear = () => {
    setValue("");
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    pushQuery("");
  };

  return (
    <div className="relative flex-1 min-w-[200px]">
      <Icon
        name="search"
        className="absolute left-3 top-2.5 text-on-surface-variant"
      />
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder="주문번호, 고객명 검색"
        className="w-full rounded-xl bg-surface-container-highest px-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
      />
      {value.length > 0 && (
        <button
          type="button"
          aria-label="검색어 지우기"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-on-surface-variant hover:bg-surface-container"
        >
          <Icon name="close" className="text-base" />
        </button>
      )}
    </div>
  );
}
