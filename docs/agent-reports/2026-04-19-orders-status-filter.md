# 주문 내역 상태 chip 필터 동작화

작성일: 2026-04-19
작업자: Claude (Opus 4.7)
관련 문서: `docs/agent-reports/state-management-gap-report.md` P1 항목

## 작업 목적

`/orders` 의 상태 chip 6종(전체/결제 완료/준비중/배송중/배송 완료/취소)이 디자인 1:1로 자리만 잡혀 있고 실제 필터는 동작하지 않았다. 사용자가 chip을 눌러도 결과가 그대로였고, 각 상태의 주문 개수도 보이지 않았다. 이 작업은 chip을 URL 기반 상태와 연결해 즉시 필터링이 일어나고, chip 안에 카운트도 함께 보여주도록 정리한다.

## 결정 사항

| 항목 | 선택 | 이유 |
| --- | --- | --- |
| 상태 저장소 | URL `?status=` | 상품 목록과 동일한 패턴, 공유 가능 링크, 서버 컴포넌트와 자연스러운 통합 |
| chip 타입 | `<Link>` (button → link) | 새로고침/뒤로가기 호환, JS 없이 동작 |
| 카운트 노출 | chip 우측 작은 숫자 | 디자인 흐름 깨지 않으면서 빠르게 상태별 분포 확인 |
| `PENDING` 상태 | 제외 | 디자인의 6 chip 라벨에 매칭되는 상태만 노출 |

## 변경 파일

- `src/app/(shop)/orders/page.tsx`
  - `StatusFilter = "ALL" | Exclude<OrderStatus, "PENDING">` 유니온 정의
  - `STATUS_FILTERS` 배열에 `{ key, label }` 6종 정리
  - `isStatusFilter` 가드, `buildHref` 헬퍼 (상품 목록과 동일 시그니처)
  - `searchParams` Promise 파싱 후 `status` 쿼리에서 필터 키 추출
  - 모든 주문을 한 번 순회해 `counts` 집계
  - chip을 `<Link href=...>` 로 렌더, active 상태에 따라 톤 분기
  - 결과 0개 시 "XX 상태의 주문이 없습니다." 빈 상태 박스
  - 카드 하단 "재주문" 버튼 href를 `/reorder?orderId=${id}` 로 보강 (이전엔 단순히 `/reorder`)

## 동작 검증

- `/orders` → 모든 주문 표시, ALL 카운트 활성
- `/orders?status=DELIVERED` → DELIVERED 만 표시, 해당 chip 활성, 우측 카운트 일치
- 결과가 없는 상태 chip 클릭 → 빈 상태 박스 노출
- 카드 "재주문" 클릭 → `/reorder?orderId=order-...` 로 이동, ReorderView 가 해당 주문을 초기 선택
- `npx tsc --noEmit` 통과
- `npx next build` 24개 라우트 모두 통과

## 사이드 이펙트

- chip이 `<button>` → `<Link>` 로 바뀌어 키보드 포커스 링 스타일이 약간 달라질 수 있음 (현재 디자인은 hover/active만 있고 focus 스타일은 별도 없음)
- `PENDING` 주문은 chip 어디에도 매칭되지 않음 — 현재 mock 에는 없으므로 영향 없지만, 추후 결제 대기 상태가 생기면 chip 추가 필요

## 커밋

- (직전) `feat(orders): 주문 내역 상태 chip 필터 동작 + 카운트 표시`

## 다음 작업 제안

1. 관리자 주문 관리(`/admin/orders`) 검색 input + 상태 필터 + 일괄선택 (P1)
2. 상품 목록 가격 슬라이더 클라이언트 위젯화 + `priceMin/Max` 쿼리 추가
3. 빈 widgets 폴더(`product-list`)를 카드 컴포넌트로 채워 페이지 비대화 방지
