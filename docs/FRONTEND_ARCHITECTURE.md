# FRONTEND_ARCHITECTURE.md

이 문서는 **Codex와 Claude가 공통으로 따라야 하는 프론트엔드 아키텍처 기준**이다.
새 파일을 만들거나 기존 구조를 정리할 때는 이 문서를 우선 기준으로 삼는다.

## 1. 목적

현재 프로젝트는 App Router 기반 페이지가 빠르게 확장되면서,

- 페이지 내부 전용 코드
- 도메인 로직
- 전역 공용 UI / 유틸

의 경계가 흐려질 가능성이 있다.

이 문서는 그 경계를 명확히 해서 다음 문제를 방지하기 위한 기준이다.

- 같은 컴포넌트/유틸이 여러 페이지에 복제되는 문제
- 상태 관리 로직이 페이지마다 흩어지는 문제
- mock, API, UI가 서로 다른 구조로 자라나는 문제
- Claude / Codex가 서로 다른 방식으로 구조를 추가하는 문제

## 2. 최상위 구조 원칙

`src/` 아래는 아래 8개 축을 기준으로 관리한다.

```text
src/
  app/          # Next.js App Router 진입점
  shared/       # 전역 공용 코드
  entities/     # 핵심 도메인 모델 단위
  features/     # 사용자 액션/기능 단위
  widgets/      # 페이지를 구성하는 중간 크기 UI 블록
  processes/    # 여러 feature를 잇는 흐름
  providers/    # 전역 provider
  mocks/        # mock 데이터, fixture, 테스트용 핸들러
  store/        # 전역/교차 페이지 상태 저장소
```

## 3. 각 폴더의 책임

### `app/`

- 라우트 엔트리만 둔다
- `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts` 등 Next 전용 파일만 우선 둔다
- 페이지 전용 구현이 필요하면 해당 페이지 하위 폴더를 사용한다

### `shared/`

- 도메인과 무관하게 여러 곳에서 재사용 가능한 코드
- 특정 페이지 또는 특정 도메인에 묶이지 않는 코드만 둔다

권장 하위 구조:

```text
shared/
  ui/           # Button, Input, Modal, Badge, Tabs 등
  lib/          # format, date, number, storage, logger
  hooks/        # useBoolean, useDebounce 등 공용 훅
  types/        # 공용 타입
  constants/    # 공용 상수
  styles/       # tokens, motion, shared css helpers
  api/          # fetch client, request helper
  config/       # runtime/env config helper
  assets/       # 공용 아이콘, 정적 자산 기준
```

### `entities/`

- 핵심 도메인 개체 단위
- 예: `product`, `order`, `cart`, `user`

권장 하위 구조:

```text
entities/
  product/
    model/
    types/
    ui/
  order/
  cart/
```

### `features/`

- 사용자 액션 중심
- “무엇을 보여주는가”보다 “무슨 행동을 수행하는가”를 기준으로 둔다

예:

- `add-to-cart`
- `reorder-items`
- `checkout-payment`
- `auth-login`
- `order-tracking`

### `widgets/`

- 여러 컴포넌트와 feature를 조합한 화면 블록
- 페이지에 바로 꽂히는 단위

예:

- `product-list`
- `product-detail-hero`
- `cart-summary`
- `top-app-bar`
- `site-footer`

### `processes/`

- 여러 feature를 연결하는 상위 흐름
- 지금 단계에서 필수는 아니지만 checkout / reorder 흐름이 커지면 도입한다

예:

- `checkout`
- `reorder`

### `providers/`

- 전역 Provider 전용

예:

- `QueryProvider`
- `AuthProvider`
- `ThemeProvider`

### `mocks/`

- 페이지 내부 상수 mock을 점진적으로 이쪽으로 이동한다
- fixture, seed, MSW handler, 임시 응답을 모은다

### `store/`

- 전역/교차 페이지 상태 저장소
- 현재 프로젝트는 `store/` 단수를 유지한다

예:

- `cart-store.ts`
- `checkout-store.ts`
- `session-store.ts`

## 4. 페이지 하위 폴더 원칙

각 페이지는 아래 구조를 기본으로 가질 수 있다.

```text
components
styles
utils
hooks
types
constants
services
```

### 페이지 폴더에 두는 기준

- 그 페이지에서만 쓰는 조각 UI
- 그 페이지에서만 쓰는 local helper
- 그 페이지에서만 쓰는 타입
- 그 페이지에서만 쓰는 스타일 상수

### 페이지 폴더에 두지 않는 기준

- 2개 이상 페이지에서 재사용되는 UI
- 공용 포맷 함수
- cart/order/product 같은 도메인 타입
- 전역 상태
- 공용 API 호출 클라이언트

위 항목은 `shared`, `entities`, `features`, `store`로 이동한다.

## 5. 파일 배치 기준

### `components`

- 페이지 전용 프레젠테이션 컴포넌트
- 예: `ProductsHeader.tsx`, `CheckoutSummary.tsx`

### `styles`

- 페이지 전용 스타일 상수
- token mapping
- variant map

### `utils`

- 페이지 전용 순수 함수
- 포맷/정렬/변환 로직 중 페이지 한정인 것

### `hooks`

- 페이지 전용 상태 훅
- 예: `useProductFilters`, `useCheckoutFormState`

### `types`

- 페이지 전용 view model
- 페이지에서만 쓰는 props / section model

### `constants`

- 목업 섹션 데이터
- 탭 정의
- 정렬 옵션
- static copy

### `services`

- 페이지 전용 조립 로직
- 화면 렌더를 위해 도메인 데이터를 재구성하는 adapter 성격

## 6. 어디에 둬야 하는지 판단 기준

### `shared`로 올리는 경우

- 두 페이지 이상에서 재사용됨
- 도메인에 묶이지 않음
- UI 또는 유틸이 범용적임

### `entities`로 가는 경우

- 특정 도메인 중심 표현
- 예: product badge, order status chip

### `features`로 가는 경우

- 사용자 액션/동작이 중심
- 예: 장바구니 담기, 재주문 실행, 결제 제출

### 페이지 내부에 남기는 경우

- 정말 그 페이지에서만 사용됨
- 다른 페이지가 가져다 쓸 가능성이 낮음

## 7. 현재 프로젝트에 바로 적용할 기준

### 유지

- `src/app/<route>/components|styles|utils|hooks|types|constants|services`
- `src/features/*`의 도메인 서비스
- `src/components/common`, `src/components/shell`의 기존 공용 UI

### 새로 도입

- `src/shared`
- `src/entities`
- `src/widgets`
- `src/processes`
- `src/providers`
- `src/mocks`

### 점진 이관 대상

- `src/lib`의 범용 유틸 -> `src/shared/lib`
- `src/types`의 공용 타입 -> `src/shared/types` 또는 `src/entities/*/types`
- 페이지 내부 상수 mock -> `src/mocks`
- `src/components/shell`, `src/components/common` 중 전역 공용 성격 유지

## 8. 상태 관리 원칙

### 서버 상태

- TanStack Query
- 위치: `shared/api`, `features/*`, `providers`

### 클라이언트 상태

- Zustand
- 위치: `src/store`

### 파생 계산

- `features/cart`
- `features/pricing`
- `features/reorder`

UI 컴포넌트에서 가격 계산, 배송비 계산, 최소 주문 금액 판단을 직접 하지 않는다.

## 9. 금지 사항

- 페이지마다 같은 Button/Input 변형을 복제하기
- mock 데이터를 페이지 파일 안에 계속 누적하기
- 비즈니스 로직을 `page.tsx` 안에 직접 작성하기
- shared 후보를 페이지 내부에 장기간 방치하기
- 전역 상태를 페이지 `useState`로 우회하기

## 10. 추천 마이그레이션 순서

1. `shared`, `providers`, `mocks` 먼저 안정화
2. `cart`, `checkout`, `reorder` 상태를 `store` 중심으로 정리
3. product/order/cart UI를 `entities` 또는 `widgets`로 승격
4. add-to-cart / reorder / checkout submit 을 `features`로 정리
5. checkout / reorder 흐름이 커지면 `processes` 도입

## 11. 협업 규칙

Codex와 Claude는 다음을 공통으로 지킨다.

- 새 구조 추가 시 이 문서를 먼저 확인한다
- 애매하면 page 내부보다 `shared/entities/features` 배치를 우선 검토한다
- 구조 변경 시 `CLAUDE.md`와 이 문서 간 충돌이 없게 유지한다
- 새 공용 규칙이 생기면 이 문서를 먼저 갱신하고 작업한다

