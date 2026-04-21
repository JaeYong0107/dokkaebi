import type { User as DbUser } from "@prisma/client";

export type AdminUserRecord = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: "CUSTOMER" | "ADMIN";
  customerType: "NORMAL" | "BUSINESS";
  businessName: string | null;
  businessNumber: string | null;
  businessApproved: boolean;
  createdAt: string;
  orderCount: number;
};

export function toAdminUser(
  db: DbUser,
  orderCount: number
): AdminUserRecord {
  return {
    id: db.id,
    email: db.email,
    name: db.name,
    phone: db.phone,
    role: db.role,
    customerType: db.customerType,
    businessName: db.businessName,
    businessNumber: db.businessNumber,
    businessApproved: db.businessApproved,
    createdAt: db.createdAt.toISOString(),
    orderCount
  };
}
