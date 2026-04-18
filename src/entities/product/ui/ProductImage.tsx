import clsx from "clsx";

type ProductImageProps = {
  emoji: string;
  bg: string;
  imageUrl?: string;
  alt?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
};

const SIZE_CLASS: Record<NonNullable<ProductImageProps["size"]>, string> = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-6xl",
  xl: "text-8xl"
};

export function ProductImage({
  emoji,
  bg,
  imageUrl,
  alt,
  className,
  size = "md"
}: ProductImageProps) {
  if (imageUrl) {
    return (
      <div
        className={clsx(
          "flex h-full w-full items-center justify-center overflow-hidden bg-surface-container-low",
          className
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={alt ?? ""}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "flex h-full w-full items-center justify-center bg-gradient-to-br",
        bg,
        SIZE_CLASS[size],
        className
      )}
      aria-hidden
    >
      <span className="drop-shadow-sm">{emoji}</span>
    </div>
  );
}
