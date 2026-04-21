import type { DefaultSession } from "next-auth";

type Role = "CUSTOMER" | "ADMIN";
type CustomerType = "NORMAL" | "BUSINESS";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      customerType: CustomerType;
      businessApproved: boolean;
      businessName: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
    customerType: CustomerType;
    businessApproved: boolean;
    businessName?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    customerType: CustomerType;
    businessApproved: boolean;
    businessName: string | null;
  }
}
