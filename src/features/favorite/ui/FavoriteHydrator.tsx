"use client";

import { useEffect } from "react";
import { useFavoriteStore } from "../store";

type Props = {
  productIds: string[];
};

export function FavoriteHydrator({ productIds }: Readonly<Props>) {
  useEffect(() => {
    useFavoriteStore.getState().hydrate(productIds);
  }, [productIds]);
  return null;
}
