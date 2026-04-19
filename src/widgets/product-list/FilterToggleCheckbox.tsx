"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

type FilterToggleCheckboxProps = {
  paramKey: string;
  label: string;
};

export function FilterToggleCheckbox({
  paramKey,
  label
}: Readonly<FilterToggleCheckboxProps>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const checked = searchParams.get(paramKey) === "1";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = new URLSearchParams(searchParams.toString());
    if (event.target.checked) {
      next.set(paramKey, "1");
    } else {
      next.delete(paramKey);
    }
    const qs = next.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  };

  return (
    <label
      className={
        "flex cursor-pointer items-center gap-3 transition-opacity " +
        (isPending ? "opacity-60" : "")
      }
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="h-5 w-5 rounded-md border-outline-variant text-primary focus:ring-primary"
      />
      <span className="text-sm font-medium">{label}</span>
    </label>
  );
}
