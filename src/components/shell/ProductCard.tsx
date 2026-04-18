import Link from "next/link";
import type { Product } from "@/features/product/types";
import { formatCurrency } from "@/lib/format";
import { Icon } from "@/components/common/Icon";
import { ProductImage } from "./ProductImage";

type ProductCardProps = {
  product: Product;
  showBusinessPrice?: boolean;
};

export function ProductCard({
  product,
  showBusinessPrice = true
}: ProductCardProps) {
  const discountRate = Math.round(
    ((product.priceNormal - product.priceBusiness) / product.priceNormal) * 100
  );

  return (
    <article className="group flex flex-col rounded-[1.75rem] bg-surface-container-lowest p-4 shadow-lift transition-transform hover:-translate-y-1">
      <Link
        href={`/products/${product.id}`}
        className="aspect-square overflow-hidden rounded-[1.25rem] bg-surface-container-low"
      >
        <ProductImage
          emoji={product.imageEmoji}
          bg={product.imageBg}
          size="lg"
          className="transition-transform duration-500 group-hover:scale-110"
        />
      </Link>
      <div className="mt-4 flex flex-1 flex-col">
        {product.badges && product.badges.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {product.badges.slice(0, 2).map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-primary-container/15 px-2 py-0.5 text-[10px] font-bold text-primary"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
        <Link href={`/products/${product.id}`}>
          <h3 className="line-clamp-2 text-sm font-bold text-on-surface">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-xs text-on-surface-variant">{product.unit}</p>
        <div className="mt-3 flex flex-1 flex-col justify-end gap-1">
          {showBusinessPrice && discountRate > 0 && (
            <div className="flex items-baseline gap-1">
              <span className="rounded bg-secondary-container/20 px-1.5 py-0.5 text-[10px] font-bold text-secondary-container">
                사업자 {discountRate}%
              </span>
              <span className="text-xs text-on-surface-variant line-through">
                {formatCurrency(product.priceNormal)}
              </span>
            </div>
          )}
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-black text-primary">
              {formatCurrency(
                showBusinessPrice ? product.priceBusiness : product.priceNormal
              )}
            </span>
            <button
              type="button"
              className="rounded-full bg-secondary-container p-2 text-on-secondary transition-transform hover:scale-105 active:scale-95"
              aria-label="장바구니에 담기"
            >
              <Icon name="add_shopping_cart" className="text-base" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
