import Link from "next/link";
import { getServerOrigin } from "@/shared/lib/api/server-origin";
import { headers } from "next/headers";
import type { AdminUserRecord } from "@/server/mappers/user";
import { AdminUsersTable } from "@/widgets/admin-users/AdminUsersTable";

type TypeFilter = "ALL" | "NORMAL" | "BUSINESS" | "ADMIN";
type ApprovalFilter = "ALL" | "PENDING" | "APPROVED";

const TYPE_FILTERS: Array<{ key: TypeFilter; label: string }> = [
  { key: "ALL", label: "전체" },
  { key: "NORMAL", label: "일반" },
  { key: "BUSINESS", label: "사업자" },
  { key: "ADMIN", label: "관리자" }
];

const APPROVAL_FILTERS: Array<{ key: ApprovalFilter; label: string }> = [
  { key: "ALL", label: "전체" },
  { key: "PENDING", label: "승인 대기" },
  { key: "APPROVED", label: "승인 완료" }
];

function isTypeFilter(value: string | undefined): value is TypeFilter {
  return TYPE_FILTERS.some((f) => f.key === value);
}
function isApprovalFilter(value: string | undefined): value is ApprovalFilter {
  return APPROVAL_FILTERS.some((f) => f.key === value);
}

function buildHref(
  base: string,
  current: Record<string, string | string[] | undefined>,
  updates: Record<string, string | undefined>
) {
  const next = new URLSearchParams();
  for (const [k, v] of Object.entries(current)) {
    if (typeof v === "string" && v.length > 0) next.set(k, v);
  }
  for (const [k, v] of Object.entries(updates)) {
    if (v === undefined) next.delete(k);
    else next.set(k, v);
  }
  const qs = next.toString();
  return qs ? `${base}?${qs}` : base;
}

export default async function AdminUsersPage({
  searchParams
}: Readonly<{
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const origin = await getServerOrigin();
  const query = (await searchParams) ?? {};
  const typeFilter: TypeFilter =
    typeof query.type === "string" && isTypeFilter(query.type)
      ? query.type
      : "ALL";
  const approvalFilter: ApprovalFilter =
    typeof query.approval === "string" && isApprovalFilter(query.approval)
      ? query.approval
      : "ALL";
  const keyword =
    typeof query.q === "string" ? query.q.trim().toLowerCase() : "";

  const hdrs = await headers();
  const response = await fetch(`${origin}/api/admin/users`, {
    cache: "no-store",
    headers: { cookie: hdrs.get("cookie") ?? "" }
  });

  if (!response.ok) {
    return (
      <div className="rounded-xl bg-error/10 px-6 py-8 text-sm font-semibold text-error">
        사용자 목록을 불러오지 못했습니다.
      </div>
    );
  }

  const data = (await response.json()) as { items: AdminUserRecord[] };
  const all = data.items;

  const filtered = all
    .filter((u) => {
      if (typeFilter === "ALL") return true;
      if (typeFilter === "ADMIN") return u.role === "ADMIN";
      return u.role !== "ADMIN" && u.customerType === typeFilter;
    })
    .filter((u) => {
      if (approvalFilter === "ALL") return true;
      if (u.customerType !== "BUSINESS") return false;
      return approvalFilter === "APPROVED"
        ? u.businessApproved
        : !u.businessApproved;
    })
    .filter((u) => {
      if (!keyword) return true;
      return (
        u.email.toLowerCase().includes(keyword) ||
        u.name.toLowerCase().includes(keyword) ||
        (u.businessName ?? "").toLowerCase().includes(keyword)
      );
    });

  const pendingCount = all.filter(
    (u) => u.customerType === "BUSINESS" && !u.businessApproved
  ).length;

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="font-headline text-2xl font-bold">사용자 관리</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            전체 사용자 {all.length}명 · 사업자 승인 대기 {pendingCount}명
          </p>
        </div>
      </header>

      <form
        action="/admin/users"
        method="get"
        className="flex flex-wrap items-center gap-3"
      >
        <input
          type="text"
          name="q"
          defaultValue={typeof query.q === "string" ? query.q : ""}
          placeholder="이메일, 이름, 상호 검색"
          className="flex-1 min-w-[240px] rounded-xl border border-surface-container bg-surface-container-lowest px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
        {typeFilter !== "ALL" && (
          <input type="hidden" name="type" value={typeFilter} />
        )}
        {approvalFilter !== "ALL" && (
          <input type="hidden" name="approval" value={approvalFilter} />
        )}
        <button
          type="submit"
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-on-primary"
        >
          검색
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        <span className="mr-2 self-center text-xs font-bold text-on-surface-variant">
          유형
        </span>
        {TYPE_FILTERS.map((f) => (
          <Link
            key={f.key}
            href={buildHref("/admin/users", query, {
              type: f.key === "ALL" ? undefined : f.key
            })}
            className={
              f.key === typeFilter
                ? "rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-on-primary"
                : "rounded-full bg-surface-container-high px-3 py-1.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-highest"
            }
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="mr-2 self-center text-xs font-bold text-on-surface-variant">
          승인
        </span>
        {APPROVAL_FILTERS.map((f) => (
          <Link
            key={f.key}
            href={buildHref("/admin/users", query, {
              approval: f.key === "ALL" ? undefined : f.key
            })}
            className={
              f.key === approvalFilter
                ? "rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-on-primary"
                : "rounded-full bg-surface-container-high px-3 py-1.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-highest"
            }
          >
            {f.label}
          </Link>
        ))}
      </div>

      <AdminUsersTable users={filtered} />
    </div>
  );
}
