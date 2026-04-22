import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { FavoriteHydrator } from "@/features/favorite/ui/FavoriteHydrator";
import { toProduct } from "@/server/mappers/product";
import { Icon } from "@/shared/ui/Icon";
import { ProductGridCard } from "@/widgets/product-list/ProductGridCard";

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/mypage/favorites");
  }

  const rows = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: { product: { include: { category: true } } },
    orderBy: { createdAt: "desc" }
  });

  const products = rows
    .filter((row) => row.product.isActive)
    .map((row) => toProduct(row.product));
  const productIds = rows.map((row) => row.productId);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <FavoriteHydrator productIds={productIds} />
      <header className="mb-10 flex flex-col gap-2">
        <Link
          href="/mypage"
          className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-on-surface-variant hover:text-primary"
        >
          <Icon name="chevron_left" className="text-base" />
          마이페이지
        </Link>
        <h1 className="font-headline text-3xl font-black tracking-tighter text-primary md:text-4xl">
          찜한 상품
        </h1>
        <p className="text-sm text-on-surface-variant">
          관심 있게 본 상품을 모아 보고 바로 주문해 보세요.
        </p>
      </header>

      {products.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-outline-variant/40 bg-surface-container-low p-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-container-high">
            <Icon
              name="favorite"
              className="text-2xl text-on-surface-variant"
            />
          </div>
          <p className="mb-2 font-headline text-lg font-bold text-on-surface">
            아직 찜한 상품이 없어요
          </p>
          <p className="mb-6 text-sm text-on-surface-variant">
            상품 목록에서 하트 버튼을 눌러 찜한 상품을 모아 보세요.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-on-primary hover:opacity-90"
          >
            상품 보러가기
            <Icon name="arrow_forward" className="text-base" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductGridCard
              key={product.id}
              product={product}
              index={index}
              highlightFirst={false}
            />
          ))}
        </div>
      )}
    </main>
  );
}
