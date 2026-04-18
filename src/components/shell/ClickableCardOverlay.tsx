"use client";

import { useRouter } from "next/navigation";

type ClickableCardOverlayProps = {
  href: string;
  label: string;
};

export function ClickableCardOverlay({
  href,
  label
}: ClickableCardOverlayProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label={label}
      data-debug-href={href}
      className="absolute inset-0 z-10 rounded-[inherit]"
      onClick={() => {
        console.info("[ClickableCardOverlay] navigate", href);
        router.push(href);
      }}
    />
  );
}
