"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ApiError, apiFetch } from "@/shared/lib/api/api-fetch";
import { Icon } from "@/shared/ui/Icon";
import {
  useFavoriteStore,
  useIsFavoritePending,
  useIsFavorited
} from "../store";

type Size = "sm" | "md" | "lg";

type Props = {
  productId: string;
  size?: Size;
  /** 카드 모서리처럼 이미지 위에 띄울 때 */
  floating?: boolean;
  className?: string;
};

const SIZE_STYLE: Record<Size, { box: string; icon: string }> = {
  sm: { box: "h-8 w-8", icon: "text-base" },
  md: { box: "h-10 w-10", icon: "text-xl" },
  lg: { box: "h-12 w-12", icon: "text-2xl" }
};

export function FavoriteButton({
  productId,
  size = "md",
  floating = false,
  className
}: Readonly<Props>) {
  const router = useRouter();
  const favorited = useIsFavorited(productId);
  const pending = useIsFavoritePending(productId);
  const [isTransitioning, startTransition] = useTransition();
  const { optimisticAdd, optimisticRemove, setPending } = useFavoriteStore();

  const disabled = pending || isTransitioning;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    const nextFavorited = !favorited;
    setPending(productId, true);
    if (nextFavorited) optimisticAdd(productId);
    else optimisticRemove(productId);

    try {
      await apiFetch(`/api/favorites/${productId}`, {
        method: nextFavorited ? "POST" : "DELETE"
      });
      startTransition(() => router.refresh());
    } catch (err) {
      // 실패 시 롤백
      if (nextFavorited) optimisticRemove(productId);
      else optimisticAdd(productId);
      if (!(err instanceof ApiError) || err.status !== 401) {
        console.error("[FavoriteButton]", err);
      }
    } finally {
      setPending(productId, false);
    }
  };

  const { box, icon } = SIZE_STYLE[size];
  const baseClass = [
    "flex shrink-0 items-center justify-center rounded-full transition-colors",
    box,
    floating ? "bg-white/90 shadow-md backdrop-blur" : "bg-surface-container-high",
    disabled ? "opacity-60" : "hover:bg-white",
    className ?? ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      aria-pressed={favorited}
      aria-label={favorited ? "찜 해제" : "찜하기"}
      disabled={disabled}
      onClick={handleClick}
      className={baseClass}
    >
      <Icon
        name="favorite"
        className={`${icon} ${
          favorited ? "text-error" : "text-on-surface-variant"
        }`}
        filled={favorited}
      />
    </button>
  );
}
