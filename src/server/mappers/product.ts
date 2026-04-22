import type {
  Category as DbCategory,
  Product as DbProduct
} from "@prisma/client";
import type { Category, Product, ProductCategory } from "@/features/product/types";

type DbProductWithCategory = DbProduct & { category: DbCategory };

// Category.id → Product.category 라벨 매핑.
// DB 의 Category.name 은 표시용("야채/채소")이므로, 프론트 타입 ProductCategory
// ("채소" 등)와 다르다. 이 매핑은 Product 응답에서 쓰고, Category 응답에서는
// productCategories 배열로 동일하게 노출된다.
const CATEGORY_PRODUCT_LABELS: Record<string, ProductCategory[]> = {
  veg: ["채소"],
  fruit: ["과일"],
  seafood: ["수산"],
  meat: ["축산"],
  dairy: ["유제품"],
  sauce: ["조미료"],
  processed: ["공산품"]
};

function resolveProductLabel(categoryId: string): ProductCategory {
  const labels = CATEGORY_PRODUCT_LABELS[categoryId];
  if (!labels || labels.length === 0) {
    throw new Error(`알 수 없는 categoryId: ${categoryId}`);
  }
  return labels[0];
}

export function toProduct(db: DbProductWithCategory): Product {
  return {
    id: db.id,
    sku: db.sku ?? undefined,
    name: db.name,
    description: db.description,
    category: resolveProductLabel(db.categoryId),
    unit: db.unit,
    basePrice: db.basePrice,
    normalDiscountRate: db.normalDiscountRate,
    businessDiscountRate: db.businessDiscountRate,
    origin: db.origin,
    imageUrl: db.imageUrl ?? undefined,
    imageEmoji: db.imageEmoji ?? "📦",
    imageBg: db.imageBg ?? "from-slate-200 to-slate-400",
    badges: db.badges.length > 0 ? db.badges : undefined,
    isActive: db.isActive,
    stockQuantity: db.stockQuantity,
    lowStockThreshold: db.lowStockThreshold
  };
}

export function toCategory(db: DbCategory): Category {
  return {
    id: db.id,
    name: db.name,
    icon: db.icon,
    productCategories: CATEGORY_PRODUCT_LABELS[db.id] ?? [],
    featured: db.featured
  };
}
