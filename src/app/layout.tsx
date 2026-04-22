import type { Metadata } from "next";
import { Inter, Manrope, Plus_Jakarta_Sans } from "next/font/google";
import { AuthProvider } from "@/providers/AuthProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { CartServerSync } from "@/components/cart/CartServerSync";
import { LoginPromptModal } from "@/shared/ui/LoginPromptModal";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap"
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap"
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap"
});

export const metadata: Metadata = {
  title: "dokkaebi | 재주문이 빠른 식자재 커머스",
  description:
    "일반 고객과 사업자가 함께 사용하는 재주문 중심 식자재 커머스 플랫폼"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ko"
      className={`${inter.variable} ${manrope.variable} ${jakarta.variable}`}
    >
      <body className="bg-surface text-on-surface font-sans">
        <AuthProvider>
          <QueryProvider>
            <CartServerSync />
            {children}
            <LoginPromptModal />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
