# 관리자 주문 관리 검색·필터·일괄 선택 동작화

작성일: 2026-04-19
작업자: Claude (Opus 4.7)
관련 문서: `docs/agent-reports/state-management-gap-report.md` P1 항목

## 작업 목적

`/admin/orders` 의 검색 input · 상태 chip 6종 · 행 체크박스 · 헤더 선택박스 · 하단 일괄 작업 버튼 모두가 정적 마크업이었다. 운영자가 어떤 액션을 취해도 결과가 같았고, 어떤 주문을 선택했는지도 알 수 없었다. 이번 작업은 이 영역 전부를 실제 상태로 연결해서, 디자인 그대로의 흐름이 그대로 동작하도록 정리한다.

## 결정 사항

| 항목 | 선택 | 이유 |
| --- | --- | --- |
| 검색 상태 | URL `?q=` (250ms 디바운스) | 다른 chip 상태와 동일 진실원본, 입력 중 라우팅 폭주 방지 |
| 상태 chip | URL `?status=` Link | `/orders` 와 동일 패턴, 새로고침/뒤로가기 호환 |
| 선택 row 상태 | 클라이언트 컴포넌트 내부 `Set<string>` | URL 에 두기엔 양이 많고 일시적, 서버 트립 불필요 |
| 일괄 작업 mutation | 현재 `window.alert` 로 ID 노출, 추후 API 연결 | 도메인 service/route 가 아직 없음. UI 만 먼저 정리 |

## 변경 파일

- `src/widgets/admin-orders/AdminOrdersSearch.tsx` (신설)
  - 디바운스 250ms 후 `router.replace(?q=...)` 로 URL 갱신
  - 외부에서 `searchParams` 가 바뀌면 input 값 동기화
  - 입력값이 있으면 X 버튼으로 즉시 초기화
- `src/widgets/admin-orders/AdminOrdersTable.tsx` (신설)
  - `orders` prop 을 받아 `Set<string> selectedIds` 로 선택 관리
  - 헤더 체크박스: `allChecked`/`someChecked` 계산해 `indeterminate` 반영
  - 행 체크박스: `toggleOne(id)`, 선택 시 행 배경 `bg-primary/5`
  - 빈 결과: `colSpan=8` 안내 행
  - 하단 일괄 작업 바: 선택 건수 뱃지 + 두 버튼은 0건일 때 비활성
- `src/app/admin/orders/page.tsx`
  - `status` / `q` 쿼리 파싱 + 가드 (`isStatusFilter`)
  - 서버에서 status 일치 + (`orderNumber` / `customerName` / `recipient` 부분 일치) 필터
  - chip <button> → <Link>, `buildHref` 로 다른 쿼리 보존하면서 status swap
  - 각 chip 우측에 카운트(작은 텍스트) 노출
  - 검색·테이블 영역은 신설 위젯에 위임 (페이지 책임은 데이터 로드 + URL 파싱으로 한정)

## 동작 검증

- `/admin/orders?status=PREPARING` → 준비중 만 표시, chip 활성, 카운트 일치
- 검색창에 "두두" 입력 → 250ms 후 URL `?q=두두`, 결과가 즉시 좁혀짐
- 검색창 X 버튼 → URL 에서 `q` 제거 + 입력 비움
- 헤더 체크박스: 일부만 선택했을 때 indeterminate, 전체 선택 시 체크
- 일괄 작업 버튼: 선택 건수 0이면 비활성 스타일, 1건 이상이면 활성 + 알림 (선택된 ID 목록 노출)
- `npx tsc --noEmit` 통과
- `npx next build` 24개 라우트 모두 통과

## 사이드 이펙트

- `STATUS_FILTERS` 가 페이지·테이블 위젯·`/orders` 페이지에 중복 정의 — 추후 `entities/order` 또는 `features/order` 안의 상수로 통합 가능
- 일괄 작업이 아직 mutation 이 아니라 알림 — TODO 주석으로 표시. `/api/orders/bulk-status` API 가 생기면 `useMutation`(또는 fetch)으로 교체

## 커밋

- `89c4197` feat(admin): 주문 관리 검색·상태 필터·일괄 선택 동작

## 다음 작업 제안

1. providers 폴더에 `QueryClientProvider` 셋업 (현재 `useProductsQuery` 가 외부 provider 없이 동작하는지 점검 필요)
2. 빈 widgets 폴더(`product-list` 등) 채우기로 페이지 비대화 방지
3. `STATUS_FILTERS` 와 `STATUS_TONE` 상수를 `entities/order` 로 끌어올려 중복 제거
4. 일괄 작업 실제 mutation 연결 (`PATCH /api/orders/bulk-status`)
