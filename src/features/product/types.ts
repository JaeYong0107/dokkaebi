export type ProductCategory =
  | "채소"
  | "과일"
  | "수산"
  | "축산"
  | "유제품"
  | "공산품"
  | "조미료";

export type Product = {
  id: string;
  sku?: string;
  name: string;
  description: string;
  category: ProductCategory;
  unit: string;
  basePrice: number;
  normalDiscountRate: number;
  businessDiscountRate: number;
  origin: string;
  imageUrl?: string;
  imageEmoji: string;
  imageBg: string;
  badges?: string[];
  isActive: boolean;
  stockQuantity?: number;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  productCategories?: ProductCategory[];
  featured?: boolean;
};
