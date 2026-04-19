# TanStack Query Provider 도입 + 상품 훅 useQuery 전환

작성일: 2026-04-19
작업자: Claude (Opus 4.7)
관련 문서: `docs/agent-reports/state-management-gap-report.md` P2 항목

## 작업 목적

`@tanstack/react-query` 가 `package.json` 에 설치돼 있지만 실제로 사용되는 곳이 없었다. `useProductsQuery` 도 자체 `useEffect + useState` 구현이라 캐시·재요청·invalidation 같은 라이브러리 핵심 기능이 빠져 있었다. 비어 있던 `src/providers/` 폴더에 `QueryClientProvider` 를 정상적으로 띄우고, 첫 사용처인 상품 훅을 `useQuery` 로 전환해 이후 mutation 추가 시 한 통로에서 캐시 무효화를 다룰 수 있게 한다.

## 결정 사항

| 항목 | 선택 | 이유 |
| --- | --- | --- |
| QueryClient 생성 위치 | `useState(() => new QueryClient(...))` | App Router 환경에서 매 렌더 새 인스턴스 생성 방지 |
| 기본 staleTime | 1분 | 짧은 새로고침 사이 중복 요청 줄이고, 그 이상은 백그라운드 재요청 |
| `refetchOnWindowFocus` | `false` | 데모 단계에서 포커스 전환마다 재요청은 잡음. 추후 mutation 도입 후 활성화 검토 |
| 훅 export | `useProductsQuery`, `productsQueryKey` 함께 | invalidate 시 동일 키로 접근 가능하도록 상수화 |

## 변경 파일

- `src/providers/QueryProvider.tsx` (신설)
  - `"use client"` + `useState` 로 QueryClient 한 번만 생성
  - `defaultOptions`: queries `{ staleTime, gcTime, retry, refetchOnWindowFocus }`, mutations `{ retry: 0 }`
- `src/app/layout.tsx`
  - `QueryProvider` import 추가
  - `<body>` 안 children 을 감싸 모든 라우트에서 사용 가능하도록 배치
- `src/shared/hooks/use-products-query.ts`
  - `useEffect + useState` 자작 구현 제거 → `useQuery({ queryKey: productsQueryKey, queryFn: fetchProducts })`
  - 반환 시그니처는 그대로 (`{ products, isLoading, error }`) 유지 → 호출부 수정 없음
  - `extractErrorMessage(error: unknown): string | null` 헬퍼로 에러 메시지 추출, 중첩 삼항 정리

## 동작 검증

- `/cart`, `/checkout`, `/reorder` 모두 useProductsQuery 호출 — 외부 동작 동일하지만 새로고침 후에도 캐시가 잠깐 유지되어 깜빡임 감소
- `npx tsc --noEmit` 통과
- `npx next build` 24개 라우트 모두 통과 (정적 5 + 동적 19)

## 사이드 이펙트

- 클라이언트 번들에 react-query 포함 → 공유 청크가 약간 증가 (체감 미미)
- mutation 도입 시 `useQueryClient().invalidateQueries({ queryKey: productsQueryKey })` 한 줄로 무효화 가능

## 커밋

- `feat(providers): TanStack Query Provider 도입 + 상품 훅을 useQuery로 전환`

## 다음 작업 제안

1. `useOrdersQuery`, `useOrderQuery(id)` 동일 패턴으로 추가 — 현재 server fetch 일부를 클라이언트 캐시로 끌어올릴 수 있음
2. 일괄 작업·주문 생성 mutation 추가 시 `useMutation` + `invalidateQueries(productsQueryKey)` 패턴 정착
3. ReactQueryDevtools 옵션 (개발 모드에서만) 추가 검토
