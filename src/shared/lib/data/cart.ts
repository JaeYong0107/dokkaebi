import cartData from "../../../../data/cart.json";
import type { CartInputItem } from "@/features/cart/types";

export const mockCartItems: CartInputItem[] = cartData as CartInputItem[];
