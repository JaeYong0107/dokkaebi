"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Icon } from "@/shared/ui/Icon";
import type { AdminUserRecord } from "@/server/mappers/user";

type Props = {
  users: AdminUserRecord[];
};

type ActionError = { id: string; message: string } | null;

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  } catch {
    return iso.slice(0, 10);
  }
}

function roleLabel(role: AdminUserRecord["role"]) {
  return role === "ADMIN" ? "관리자" : "일반";
}

function typeLabel(type: AdminUserRecord["customerType"]) {
  return type === "BUSINESS" ? "사업자" : "일반 고객";
}

async function patchUser(id: string, body: Record<string, unknown>) {
  const res = await fetch(`/api/admin/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message ?? err?.error?.message ?? "요청 실패");
  }
}

export function AdminUsersTable({ users }: Readonly<Props>) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [actingId, setActingId] = useState<string | null>(null);
  const [error, setError] = useState<ActionError>(null);

  const callUpdate = (id: string, body: Record<string, unknown>) => {
    setActingId(id);
    setError(null);
    patchUser(id, body)
      .then(() => {
        startTransition(() => {
          router.refresh();
        });
      })
      .catch((e: Error) => {
        setError({ id, message: e.message });
      })
      .finally(() => {
        setActingId(null);
      });
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-surface-container bg-surface-container-lowest">
      <table className="w-full min-w-[900px] text-sm">
        <thead className="bg-surface-container-low text-xs font-bold text-on-surface-variant">
          <tr>
            <th className="px-4 py-3 text-left">이메일</th>
            <th className="px-4 py-3 text-left">이름 / 상호</th>
            <th className="px-4 py-3 text-left">유형</th>
            <th className="px-4 py-3 text-left">사업자 승인</th>
            <th className="px-4 py-3 text-left">역할</th>
            <th className="px-4 py-3 text-right">주문수</th>
            <th className="px-4 py-3 text-left">가입일</th>
            <th className="px-4 py-3 text-right">액션</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="px-4 py-12 text-center text-on-surface-variant"
              >
                조건에 맞는 사용자가 없습니다.
              </td>
            </tr>
          ) : (
            users.map((user) => {
              const rowBusy = actingId === user.id && pending === false
                ? false
                : actingId === user.id || pending;
              return (
                <tr
                  key={user.id}
                  className="border-t border-surface-container hover:bg-surface-container-low/40"
                >
                  <td className="px-4 py-3 font-medium">{user.email}</td>
                  <td className="px-4 py-3">
                    {user.businessName ? (
                      <>
                        <span className="font-semibold">{user.businessName}</span>
                        <span className="ml-2 text-xs text-on-surface-variant">
                          ({user.name})
                        </span>
                      </>
                    ) : (
                      user.name
                    )}
                    {user.businessNumber && (
                      <div className="text-xs text-on-surface-variant">
                        사업자번호 {user.businessNumber}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        user.customerType === "BUSINESS"
                          ? "rounded-full bg-tertiary-container px-2.5 py-1 text-xs font-bold text-on-tertiary-container"
                          : "rounded-full bg-surface-container-high px-2.5 py-1 text-xs font-bold text-on-surface-variant"
                      }
                    >
                      {typeLabel(user.customerType)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {user.customerType === "BUSINESS" ? (
                      user.businessApproved ? (
                        <span className="inline-flex items-center gap-1 text-primary">
                          <Icon name="verified" className="text-base" />
                          <span className="text-xs font-bold">승인됨</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-error">
                          <Icon name="pending" className="text-base" />
                          <span className="text-xs font-bold">대기</span>
                        </span>
                      )
                    ) : (
                      <span className="text-xs text-on-surface-variant/60">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        user.role === "ADMIN"
                          ? "rounded-full bg-primary-container px-2.5 py-1 text-xs font-bold text-on-primary-container"
                          : "rounded-full bg-surface-container-high px-2.5 py-1 text-xs font-bold text-on-surface-variant"
                      }
                    >
                      {roleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {user.orderCount}
                  </td>
                  <td className="px-4 py-3 text-xs text-on-surface-variant">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-2">
                      {user.customerType === "BUSINESS" && (
                        <button
                          type="button"
                          disabled={rowBusy}
                          onClick={() =>
                            callUpdate(user.id, {
                              businessApproved: !user.businessApproved
                            })
                          }
                          className="rounded-full border border-primary px-3 py-1 text-xs font-bold text-primary hover:bg-primary/10 disabled:opacity-40"
                        >
                          {user.businessApproved ? "승인 해제" : "승인"}
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={rowBusy}
                        onClick={() =>
                          callUpdate(user.id, {
                            role: user.role === "ADMIN" ? "CUSTOMER" : "ADMIN"
                          })
                        }
                        className="rounded-full border border-outline-variant px-3 py-1 text-xs font-bold text-on-surface-variant hover:bg-surface-container-high disabled:opacity-40"
                      >
                        {user.role === "ADMIN" ? "권한 내리기" : "관리자 지정"}
                      </button>
                    </div>
                    {error?.id === user.id && (
                      <p className="mt-2 text-right text-[11px] font-semibold text-error">
                        {error.message}
                      </p>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
