import Link from "next/link";
import { ProductCardActions } from "@/components/cart/ProductCardActions";
import {
  getOriginalPrice,
  getUnitPrice
} from "@/features/pricing/pricing-service";
import type { Product } from "@/features/product/types";
import { formatCurrency } from "@/shared/lib/format";
import { Icon } from "@/shared/ui/Icon";

type ProductGridCardProps = {
  product: Product;
  /** 정렬 결과 안에서의 카드 순서. 인기순 정렬 1순위에 BEST/하트 표시 */
  index: number;
  /** 현재 정렬 키 — popular 일 때만 BEST/하트 노출 */
  highlightFirst: boolean;
};

export function ProductGridCard({
  product,
  index,
  highlightFirst
}: Readonly<ProductGridCardProps>) {
  const isFirstHighlight = highlightFirst && index === 0;

  return (
    <article className="group relative">
      <Link
        href={`/products/${product.id}`}
        aria-label={`${product.name} 상세 보기`}
        className="absolute inset-0 z-10 rounded-[2.5rem]"
      />
      <div className="pointer-events-none relative z-0 mb-6 aspect-square overflow-hidden rounded-[2.5rem] bg-surface-container-low">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 flex flex-col gap-1">
          {(product.badges ?? []).map((badge) => (
            <span
              key={badge}
              className="rounded-full bg-tertiary px-3 py-1 text-[10px] font-black tracking-tighter text-white shadow-lg"
            >
              {badge}
            </span>
          ))}
        </div>
        {isFirstHighlight && (
          <div className="absolute right-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-[10px] font-black tracking-tighter text-white">
            BEST
          </div>
        )}
      </div>
      {isFirstHighlight && (
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-[8.5rem] right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-primary shadow-xl backdrop-blur"
        >
          <Icon name="favorite" />
        </span>
      )}
      <div className="space-y-1 px-2">
        <p className="text-xs font-bold text-stone-400">{product.origin}</p>
        <h3 className="truncate font-headline text-lg font-bold text-on-surface transition-colors group-hover:text-primary">
          {product.name}
        </h3>
        <div className="mb-3 flex items-center gap-2">
          <span className="text-sm text-stone-400 line-through">
            {formatCurrency(getOriginalPrice(product))}
          </span>
          <span className="font-headline text-xl font-extrabold text-primary">
            {formatCurrency(getUnitPrice(product, "BUSINESS"))}
          </span>
        </div>
        <div className="relative z-20">
          <ProductCardActions productId={product.id} />
        </div>
      </div>
    </article>
  );
}
