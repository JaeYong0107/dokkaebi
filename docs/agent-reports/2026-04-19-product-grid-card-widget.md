# 상품 카드 위젯 추출 (product-list)

작성일: 2026-04-19
작업자: Claude (Opus 4.7)
관련 문서: `docs/agent-reports/state-management-gap-report.md` P2 항목, `docs/FRONTEND_ARCHITECTURE.md`

## 작업 목적

`src/widgets/` 아래에 `product-list / product-detail-hero / cart-summary` 폴더가 만들어졌지만 모두 비어 있었고, 페이지에 60여 줄의 카드 마크업이 그대로 인라인으로 박혀 있었다. 동일한 카드 모양이 검색·필터 결과에 따라 반복적으로 그려지는 영역이라 변경 비용이 높았다. 첫 위젯으로 `ProductGridCard` 를 추출해 페이지 책임을 데이터 로드·필터·정렬에 한정하고, 이후 `cart-summary` · `product-detail-hero` 같은 빈 위젯도 같은 패턴으로 채울 수 있게 한다.

## 결정 사항

| 항목 | 선택 | 이유 |
| --- | --- | --- |
| 위젯 위치 | `src/widgets/product-list/ProductGridCard.tsx` | FRONTEND_ARCHITECTURE.md 의 widgets 정의(페이지 조합형 UI 블록)에 정확히 부합 |
| 컴포넌트 종류 | 서버 컴포넌트 | 카드 자체는 정적 마크업 + 자식인 `ProductCardActions` 만 client. 불필요한 client boundary 확장 회피 |
| props | `product`, `index`, `highlightFirst` | popular 정렬일 때만 BEST/하트가 첫 카드에 보여야 하므로 페이지 결정을 prop 으로 전달 |
| `ProductCardActions` 의존 | 위젯에서 직접 import | `components/cart/` 가 아직 FSD 마이그레이션이 안 된 상태. 추후 features/cart/ui 로 이동 시 위젯도 함께 갱신 (보고서 후속 항목으로 기록) |

## 변경 파일

- `src/widgets/product-list/ProductGridCard.tsx` (신설)
  - 이미지 영역: `<img>` + 뱃지 stack + 조건부 BEST 칩
  - 1순위 카드일 때만 우상단 BEST 칩 + 하단 하트 아이콘 노출
  - 정보 영역: 원산지 / 이름 / 원가-사업자가 / `ProductCardActions`
- `src/app/(shop)/products/page.tsx`
  - 인라인 카드 60여 줄을 `<ProductGridCard product index highlightFirst />` 한 줄 호출로 대체
  - 사용처 사라진 `formatCurrency` / `getOriginalPrice` / `ProductCardActions` import 제거

## 동작 검증

- `npx tsc --noEmit` 통과
- `npx next build` 24개 라우트 모두 통과 (정적 5 + 동적 19)
- 외관/동작 동일 — 단순 추출 리팩터, 정렬·필터·BEST 표시 모두 그대로

## 사이드 이펙트

- 위젯이 `components/cart/ProductCardActions` 에 의존 → FSD 경계상 widgets 가 아직 정리 안 된 components/ 에 의존하는 형태가 됨. 후속에서 `ProductCardActions` 를 `features/cart/ui` 로 옮기면 자연스럽게 해결
- 페이지 라인 수가 약 410 → 290 으로 줄어 가독성·머지 충돌 위험 감소

## 커밋

- `refactor(products): 상품 카드를 product-list 위젯으로 추출`

## 다음 작업 제안

1. `widgets/cart-summary` 채우기: `/cart` 사이드바의 최소 주문 진행률 + 가격 라인 + 결제 버튼 한 묶음
2. `widgets/product-detail-hero` 채우기: 상세 페이지 좌측 갤러리 + 우측 가격 박스 + ProductDetailActions
3. `components/cart/*` 3종을 `features/cart/ui/` 로 이동 후 import 경로 갱신 (FSD 일관성 회복)
4. `lib/` 와 `shared/lib/` 일원화 (현재 둘 다 존재)
