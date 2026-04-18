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
  name: string;
  description: string;
  category: ProductCategory;
  unit: string;
  priceNormal: number;
  priceBusiness: number;
  origin: string;
  imageEmoji: string;
  imageBg: string;
  badges?: string[];
  isActive: boolean;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
};
