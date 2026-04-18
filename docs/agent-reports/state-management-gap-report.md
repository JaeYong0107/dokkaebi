# 내부 상태 관리 연계 누락 정리

작성일: 2026-04-18

## 목적

현재 프로젝트는 UI 스캐폴드가 빠르게 완성된 반면, 화면 상태와 도메인 상태가
실제로 연결되지 않은 구간이 여전히 많다. 이 문서는 어떤 화면이 어떤 내부
상태와 연결되어야 하는지, 그리고 현재 어디가 끊겨 있는지를 정리한 보고서다.

## 요약

현재 상태 관리의 가장 큰 문제는 다음 세 가지다.

- 화면이 자체 상수 배열을 직접 렌더링하고 있어 도메인 mock/API 결과와 분리되어 있다
- 사용자 액션 버튼이 많지만 실제 상태 변경이 거의 발생하지 않는다
- 이미 만들어 둔 도메인 서비스와 API 라우트가 페이지에서 거의 소비되지 않는다

즉, `상태를 계산하는 로직`은 일부 존재하지만 `화면이 그 상태를 구독하고
변경하는 흐름`이 빠져 있다.

## 현재 상태 관리 자산

이미 만들어진 자산:

- 장바구니 계산 로직: [src/features/cart/cart-service.ts](/Users/jylee0107/service_project/src/features/cart/cart-service.ts:1)
- 가격/배송비/최소 주문 금액 로직: [src/features/pricing/pricing-service.ts](/Users/jylee0107/service_project/src/features/pricing/pricing-service.ts:1)
- 재주문 구성 로직: [src/features/reorder/reorder-service.ts](/Users/jylee0107/service_project/src/features/reorder/reorder-service.ts:1)
- 정책값 접근: [src/lib/config.ts](/Users/jylee0107/service_project/src/lib/config.ts:1)
- mock API:
  [cart](/Users/jylee0107/service_project/src/app/api/cart/route.ts:1),
  [products](/Users/jylee0107/service_project/src/app/api/products/route.ts:1),
  [reorder](/Users/jylee0107/service_project/src/app/api/orders/reorder/route.ts:1)

아직 연결되지 않은 자산:

- `zustand` 설치만 되어 있고 실제 스토어가 없다
- `@tanstack/react-query` 설치만 되어 있고 실제 쿼리 훅이 없다
- 대부분의 페이지가 API가 아니라 페이지 내부 상수 배열을 바로 사용한다

## 화면별 누락 사항

### 1. 상품 목록

대상 파일:
[src/app/(shop)/products/page.tsx](/Users/jylee0107/service_project/src/app/(shop)/products/page.tsx:1)

현재 상태:

- `PRODUCTS`, `CATEGORIES`를 파일 내부 상수로 직접 렌더링한다
- 카테고리 링크는 URL query만 바꾸고 실제 필터링은 하지 않는다
- 정렬 버튼 UI는 있지만 선택 상태나 정렬 로직이 없다
- 수량 `+/-`, 찜, 담기 버튼이 모두 로컬 상태나 전역 상태를 바꾸지 않는다

끊긴 지점:

- `/api/products` 또는 `sampleProducts`와 목록 UI가 연결되지 않음
- 필터 상태가 URL, 컴포넌트 상태, 데이터 소스 중 어디에도 저장되지 않음
- 장바구니 추가 액션이 cart 도메인으로 이어지지 않음

필요한 상태:

- `selectedCategory`
- `sortKey`
- `searchKeyword`
- 상품별 임시 수량
- 장바구니 추가 결과 상태

권장 연결:

- 서버 데이터: `useQuery(["products", filters])`
- UI 필터: URL search params 또는 Zustand
- 담기 액션: cart store 또는 cart mutation

### 2. 장바구니

대상 파일:
[src/app/(shop)/cart/page.tsx](/Users/jylee0107/service_project/src/app/(shop)/cart/page.tsx:1)

현재 상태:

- `CART_ITEMS`를 파일 내부 상수로 렌더링한다
- 수량 버튼, 삭제 버튼, 더 담기 버튼이 아무 상태도 바꾸지 않는다
- 요약 금액은 고정 문자열이며 실제 품목 수량과 연결되지 않는다
- 이미 있는 `buildCartSummary`와 `/api/cart` 결과를 쓰지 않는다

끊긴 지점:

- [src/app/api/cart/route.ts](/Users/jylee0107/service_project/src/app/api/cart/route.ts:1)의
  계산 결과가 장바구니 페이지에 연결되지 않음
- [src/features/cart/cart-service.ts](/Users/jylee0107/service_project/src/features/cart/cart-service.ts:1)의
  배송비/최소 주문 검증 로직이 UI에 반영되지 않음

필요한 상태:

- 장바구니 품목 배열
- 품목별 수량 변경
- 삭제 상태
- customer type
- 요약 금액, 배송비, 최소 주문 충족 여부

권장 연결:

- `useCartStore` 생성
- `items`, `addItem`, `removeItem`, `updateQuantity` 관리
- 파생 데이터는 `buildCartSummary`로 계산

### 3. 상품 상세

대상 파일:
[src/app/(shop)/products/[id]/page.tsx](/Users/jylee0107/service_project/src/app/(shop)/products/[id]/page.tsx:1)

현재 상태:

- 라우트 `id` 기반 상품 조회는 붙었지만, 수량 선택은 여전히 비제어 상태에 가깝다
- `장바구니`, `바로 구매하기`, 하단 `장바구니 전체 담기`가 실제 구매 상태를 만들지 않는다
- 추천 상품도 단순 링크 목록 수준이다

끊긴 지점:

- 현재 선택한 수량이 cart 상태로 전달되지 않음
- 바로 구매 시 checkout에 전달할 주문 초안 상태가 없음

필요한 상태:

- 현재 선택 수량
- 상품 상세에서 담은 임시 cart action
- 즉시 구매용 draft order 상태

권장 연결:

- 상세 페이지는 `local quantity state` 사용
- 담기 시 `cart store.addItem(productId, quantity)`
- 바로 구매 시 `checkoutDraftStore.setItems(...)`

### 4. 재주문

대상 파일:
[src/app/(shop)/reorder/page.tsx](/Users/jylee0107/service_project/src/app/(shop)/reorder/page.tsx:1)

현재 상태:

- `orderId` query를 읽어 선택 주문 기준 재구성은 가능해졌다
- 하지만 수량 `+/-`, `장바구니로 보내기`, `한 번에 주문하기`는 실제 내부 상태를 바꾸지 않는다
- 화면은 `selectedOrder`를 기준으로 계산하지만, 사용자가 수량을 바꿔도 subtotal은 그대로다

끊긴 지점:

- `buildReorderItems` 결과가 초기 렌더에만 쓰이고 사용자 수정 상태가 없음
- 재주문 항목을 cart나 checkout draft로 넘기는 내부 연결이 없음
- `/api/orders/reorder` 엔드포인트도 페이지에서 쓰지 않는다

필요한 상태:

- 선택 주문 ID
- 재주문 품목 배열
- 품목별 재주문 수량
- 제외 상품 목록
- 장바구니 이동 / 즉시 주문 액션

권장 연결:

- `useReorderStore`
- 초기화: 주문 선택 시 `initializeFromOrder(order)`
- 변경: `updateQuantity(productId, quantity)`
- 제출: `moveToCart`, `createCheckoutDraft`

### 5. 결제

대상 파일:
[src/app/(shop)/checkout/page.tsx](/Users/jylee0107/service_project/src/app/(shop)/checkout/page.tsx:1)

현재 상태:

- 필수 동의 체크는 붙었지만 주문 데이터는 페이지 내부 상수다
- 결제 수단 버튼은 active 스타일만 있고 실제 선택 상태는 없다
- 배송지, 요청사항, 지출증빙도 제출 가능한 상태 객체로 모이지 않는다

끊긴 지점:

- 장바구니 또는 바로 구매에서 넘어온 주문 draft가 없음
- 결제 수단 선택값이 상태로 저장되지 않음
- 완료 페이지로 이동 전 검증/주문 생성 로직이 없음

필요한 상태:

- checkout draft items
- selected payment method
- shipping request
- receipt / tax invoice options
- required agreements

권장 연결:

- `useCheckoutStore`
- `draftItems`, `paymentMethod`, `agreements`, `shippingMemo`
- 결제 버튼은 store 기반 검증 후 route transition

### 6. 주문 내역 / 배송 조회

대상 파일:
[orders](/Users/jylee0107/service_project/src/app/(shop)/orders/page.tsx:1),
[tracking](/Users/jylee0107/service_project/src/app/(shop)/orders/[id]/tracking/page.tsx:1)

현재 상태:

- 주문 내역은 `sampleOrders`를 직접 사용한다
- 상태 필터 chip은 UI만 있고 실제 필터링은 하지 않는다
- 배송 조회는 주문별 데이터 읽기는 붙었지만 실시간 갱신 개념은 없다

끊긴 지점:

- 필터 상태가 데이터 집합에 적용되지 않음
- 주문 목록이 API나 query cache와 연결되지 않음

필요한 상태:

- selected status filter
- order list query state
- refresh 상태

권장 연결:

- `useOrdersQuery(filters)`
- chip 선택 시 query key 변경

### 7. 마이페이지 / 관리자

대상 파일:
[mypage](/Users/jylee0107/service_project/src/app/(shop)/mypage/page.tsx:1),
[admin](/Users/jylee0107/service_project/src/app/admin/page.tsx:1),
[admin/orders](/Users/jylee0107/service_project/src/app/admin/orders/page.tsx:1)

현재 상태:

- KPI, 최근 주문, 자주 사는 상품, 관리자 테이블 모두 정적 상수 기반이다
- 관리자 필터와 검색창이 UI만 존재한다
- 일괄 작업 버튼도 실제 선택 상태를 갖지 않는다

끊긴 지점:

- 검색어 / 필터 / 선택 row state 미구현
- 사용자/주문/재고 도메인과 분리

필요한 상태:

- admin search query
- selected status filter
- selected rows
- dashboard summary query

## 공통 구조 문제

### 1. 페이지 내부 상수 데이터 중복

페이지 안에 직접 선언된 배열이 많아서 같은 도메인을 여러 곳에서 따로 관리한다.

예시:

- 상품 목록의 `PRODUCTS`: [src/app/(shop)/products/page.tsx](/Users/jylee0107/service_project/src/app/(shop)/products/page.tsx:13)
- 장바구니의 `CART_ITEMS`: [src/app/(shop)/cart/page.tsx](/Users/jylee0107/service_project/src/app/(shop)/cart/page.tsx:4)
- 결제의 `ORDER_ITEMS`: [src/app/(shop)/checkout/page.tsx](/Users/jylee0107/service_project/src/app/(shop)/checkout/page.tsx:6)

영향:

- 화면 간 데이터 불일치
- 상태 전이 불가능
- 수정 시 중복 반영 필요

### 2. 설치된 상태 라이브러리 미사용

[package.json](/Users/jylee0107/service_project/package.json:1) 기준으로
`zustand`, `@tanstack/react-query`가 이미 설치되어 있지만 실제 스토어나
query 훅이 없다.

영향:

- 페이지마다 ad-hoc 상태 처리
- 서버 데이터와 UI 상태 분리 원칙 미적용

### 3. API와 페이지의 연결 부재

mock API는 존재하지만 페이지가 직접 사용하지 않는다.

예시:

- cart API: [src/app/api/cart/route.ts](/Users/jylee0107/service_project/src/app/api/cart/route.ts:1)
- reorder API: [src/app/api/orders/reorder/route.ts](/Users/jylee0107/service_project/src/app/api/orders/reorder/route.ts:1)

영향:

- 화면 검증이 도메인 로직을 우회함
- API 전환 시 리팩터링 범위가 커짐

## 우선순위 제안

### P0

- cart store 도입
- checkout draft store 도입
- reorder state를 사용자 수정 가능한 상태로 전환

### P1

- products query/filter state 연결
- orders query/filter state 연결
- admin search/filter/row selection 상태 추가

### P2

- mypage KPI/최근 주문을 query 기반으로 통합
- 공통 액션 버튼을 실제 mutation으로 연결

## 권장 상태 관리 구조

### 서버 데이터

- `TanStack Query`
- 대상: products, cart summary, orders, admin orders, dashboard summary

### 클라이언트 UI 상태

- `Zustand`
- 대상: cart items, checkout draft, reorder draft, product filters

### 파생 계산

- 기존 도메인 서비스 재사용
- `buildCartSummary`
- `buildReorderItems`
- `pricing-service`

## 바로 실행 가능한 다음 작업

1. `src/store/cart-store.ts` 생성
2. 장바구니 페이지를 `CART_ITEMS` 대신 cart store + `buildCartSummary`로 전환
3. 상품 상세 / 상품 목록의 `담기` 버튼을 동일한 cart action으로 통합
4. `src/store/checkout-store.ts` 생성
5. 재주문 페이지에서 선택 품목을 store에 저장 후 checkout/cart로 넘기기

## 결론

현재 프로젝트는 "화면은 거의 다 보이지만 상태는 아직 흐르지 않는" 단계다.
특히 상품 목록 → 장바구니 → 결제, 주문 내역 → 재주문 → 결제의 핵심 플로우에서
상태가 이어지지 않는다.

가장 먼저 필요한 것은 새로운 UI 추가가 아니라, 기존 화면을 공통 상태 저장소와
도메인 서비스에 연결해 실제 사용자 액션이 다음 화면으로 전달되도록 만드는 일이다.
