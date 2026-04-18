import reorderData from "../../../../data/reorder.json";
import type { RecentOrderItem } from "@/features/reorder/types";

export const mockRecentOrderItems: RecentOrderItem[] =
  reorderData as RecentOrderItem[];
