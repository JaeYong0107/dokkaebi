import clsx from "clsx";

type ProductImageProps = {
  emoji: string;
  bg: string;
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
  className,
  size = "md"
}: ProductImageProps) {
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
