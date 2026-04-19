# 상품 목록 정렬·필터 상태 연결

작성일: 2026-04-19
작업자: Claude (Opus 4.7)
관련 문서: `docs/agent-reports/state-management-gap-report.md` P1 항목

## 작업 목적

상품 목록 페이지의 사이드바와 정렬 영역이 디자인 1:1로는 채워졌지만, 실제로는 카테고리 링크만 동작하고 정렬 버튼·체크박스는 정적 마크업이었다. 이번 작업은 UI에서 발생하는 모든 필터 상태를 URL 쿼리 한 점에서 관리하도록 정리해, 화면 결과가 사용자 액션에 직접 반영되고 공유 가능한 링크가 되도록 만든다.

## 결정 사항

| 항목 | 선택 | 이유 |
| --- | --- | --- |
| 상태 저장소 | URL 검색 파라미터 | 공유 가능한 링크, 새로고침/뒤로가기 보존, 서버 컴포넌트와 자연스러운 통합 |
| 정렬 키 | `popular` (기본), `price`, `freshness` | 사이트 콘텐츠의 3개 라벨에 1:1 매핑 |
| 부가 필터 | `dealsOnly`, `freeShipping` | 디자인의 두 체크박스에 대응 |
| 체크박스 동작 | 클라이언트 컴포넌트 + `router.replace(scroll: false)` | 서버 컴포넌트로는 onChange 불가, useTransition 으로 부드러운 전환 |

## 변경 파일

- `src/widgets/product-list/FilterToggleCheckbox.tsx` (신설)
  - `paramKey`, `label` props
  - `useSearchParams` 로 현재 값 읽기, 체크 변경 시 `URLSearchParams` 업데이트 후 `router.replace`
  - 전환 중에는 `useTransition` 으로 입력을 살짝 흐리게 표시
- `src/app/(shop)/products/page.tsx`
  - 쿼리 파싱: `category`, `sort`, `dealsOnly`, `freeShipping`
  - 필터 체인: 카테고리 → dealsOnly → freeShipping
  - 정렬: 정렬 키별 비교 함수
    - `popular`: 주문 합계 desc
    - `price`: 사업자가 asc
    - `freshness`: id 역순
  - 카테고리 카운트가 부가 필터 반영하도록 재계산
  - 정렬 버튼을 `<Link>` 로 변경, `buildHref` 로 다른 쿼리 보존하며 `sort` 만 swap
  - BEST 뱃지/하트 아이콘은 `popular` 정렬일 때만 노출 (다른 정렬에서 첫 카드가 베스트가 아니므로 거짓 신호 방지)
  - 결과 0개일 때 "조건에 맞는 상품이 없습니다" 빈 상태 박스
- `src/components/cart/CartSeedBootstrap.tsx` (사전 버그 fix)
  - `useState(useCartStore.persist.hasHydrated())` → `useState(false)`
  - SSG 단계에서 persist 객체가 미설치되어 `next build` 시 `/mypage`, `/orders` prerender 실패하던 문제

## 동작 검증

- 정렬 버튼 클릭 → `?sort=price` 등 URL 갱신 + 카드 순서 즉시 반영
- 카테고리 클릭 → 다른 필터를 유지한 채 `category` 만 swap
- 체크박스 토글 → URL `dealsOnly=1` 추가/제거 + 사이드바 카테고리 카운트 즉시 갱신
- 모든 필터가 0개를 만들면 빈 상태 박스 노출, 더보기 버튼은 숨김
- `npx tsc --noEmit` 통과
- `npx next build` 24개 라우트(정적 5 / 동적 19) 모두 통과

## 사이드 이펙트

- BEST 뱃지·하트 아이콘이 popular 정렬에만 보이게 바뀌었다 — 디자인은 1:1이지만 의미적으로는 더 정확
- `freshness` 정렬은 `stockQuantity` 등 신선도 지표가 mock 에 없어 id 역순으로 근사. 이후 데이터 보강 시 비교 함수만 교체

## 커밋

- `f71a3b1` fix(cart): CartSeedBootstrap SSG 단계 hasHydrated 호출 회피
- `273ee71` feat(products): 상품 목록 정렬·필터를 URL 쿼리 상태로 연결

## 다음 작업 제안

1. 주문 내역(`/orders`) 상태 chip 동일 패턴으로 동작화 (P1)
2. 관리자 주문 관리 검색·상태 필터·일괄선택 (P1)
3. 가격 슬라이더(현재 정적)도 클라이언트 위젯으로 끌어올리고 `priceMin/Max` 쿼리 추가
