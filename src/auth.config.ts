import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login"
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.customerType = user.customerType;
        token.businessApproved = user.businessApproved;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "CUSTOMER" | "ADMIN";
        session.user.customerType = token.customerType as "NORMAL" | "BUSINESS";
        session.user.businessApproved = token.businessApproved as boolean;
      }
      return session;
    }
  }
} satisfies NextAuthConfig;
