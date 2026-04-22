"use client";

import { useSession } from "next-auth/react";
import { Icon } from "@/shared/ui/Icon";

type Variant = "kpi" | "primary";

type Props = {
  variant: Variant;
  label?: string;
};

export function InquiryMailLink({ variant, label }: Readonly<Props>) {
  const { data: session } = useSession();
  const email = session?.user?.email ?? "(비회원)";
  const name = session?.user?.businessName ?? session?.user?.name ?? "";

  const href = `mailto:support@dokkaebi.kr?subject=${encodeURIComponent(
    `[1:1 문의] ${name || email}`
  )}&body=${encodeURIComponent(
    `안녕하세요. 아래 계정으로 문의드립니다.\n\n` +
      `회원 이메일: ${email}\n` +
      (name ? `이름/상호: ${name}\n` : "") +
      `\n문의 내용:\n`
  )}`;

  if (variant === "kpi") {
    return (
      <a
        href={href}
        aria-label="1:1 문의 보내기"
        className="rounded-full bg-white/20 p-2 backdrop-blur-md hover:bg-white/30"
      >
        <Icon name="chat_bubble" className="text-lg" />
      </a>
    );
  }

  return (
    <a
      href={href}
      className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-on-surface p-5 font-bold text-white transition-all hover:bg-primary active:scale-95"
    >
      <Icon
        name="support_agent"
        className="transition-transform group-hover:rotate-12"
      />
      {label ?? "1:1 문의하기"}
    </a>
  );
}
