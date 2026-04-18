# 식자재 커머스 MVP 개발 스펙

## 1. 문서 목적

이 문서는 `재주문이 빠른 식자재 커머스 플랫폼`을 개발하기 위한 기준 스펙이다.
현재 저장소에는 서비스 기획과 비즈니스 로직 초안만 존재하므로, 실제 개발 착수에 필요한 기술 선택, 기능 범위, 데이터 구조, API 규칙, 운영 기준을 정의한다.

## 2. 제품 목표

### 핵심 목표

- 일반 고객과 사업자가 모두 사용할 수 있는 식자재 커머스 MVP 구축
- 재주문 중심 UX로 반복 구매 시간을 줄이기
- 리스트 화면에서 빠르게 상품 탐색, 장바구니 추가, 주문, 결제를 끝낼 수 있게 만들기

### MVP 성공 기준

- 사용자가 3분 이내에 첫 주문을 완료할 수 있어야 한다
- 기존 주문 내역 기반 재주문 기능을 제공해야 한다
- 사용자 유형에 따라 가격, 배송비, 최소 주문 금액이 다르게 적용되어야 한다

## 3. 권장 기술 스택

초기 생산성과 유지보수성을 고려해 아래 스택을 기본안으로 채택한다.

### 프론트엔드

- `Next.js 15`
- `TypeScript`
- `React 19`
- `Tailwind CSS`
- `TanStack Query`
- `Zustand`
- `React Hook Form` + `Zod`

### 백엔드

- `Next.js Route Handlers` 또는 `NestJS`
- MVP 단계에서는 빠른 통합 개발을 위해 `Next.js Route Handlers` 우선 권장
- `Prisma ORM`
- `PostgreSQL`
- `NextAuth` 또는 JWT 기반 인증

### 인프라

- `Vercel` 프론트/서버 호스팅
- `Supabase PostgreSQL` 또는 `Neon`
- 이미지 저장이 필요하면 `Cloudinary` 또는 `S3`

### 개발 품질 도구

- `ESLint`
- `Prettier`
- `Husky`
- `lint-staged`
- `Vitest`
- `Playwright`

## 4. 시스템 범위

### 사용자 유형

- 일반 고객
- 사업자
- 관리자

### MVP 기능 범위

- 회원가입 / 로그인
- 사용자 유형별 권한 및 가격 정책 적용
- 상품 목록 조회
- 상품 상세 조회
- 장바구니 담기 / 수정 / 삭제
- 주문 생성
- 결제 상태 처리
- 배송 조회
- 주문 내역 조회
- 최근 주문 기반 재주문

### MVP 제외 범위

- 실시간 재고 연동
- 쿠폰 / 포인트 / 적립금
- 다국어 지원
- 복수 창고 및 복수 배송지 최적화
- 세금계산서 자동 발행
- 복잡한 프로모션 엔진

## 5. 핵심 비즈니스 규칙

### 가격 정책

- 일반 고객은 기본 판매가 적용
- 사업자는 대량 구매 할인 가격 적용
- 할인 기준은 수량 또는 사업자 등급 기준으로 확장 가능하게 설계

### 배송 정책

- 일반 고객은 조건부 배송비 부과
- 사업자는 무료 배송

### 최소 주문 금액

- 일반 고객: 낮은 최소 주문 금액
- 사업자: 높은 최소 주문 금액
- 정확한 수치는 운영 정책 테이블 또는 환경 변수로 관리

### 재주문 정책

- 사용자의 최근 주문 내역을 조회할 수 있어야 한다
- 최근 주문 상품을 한 번에 장바구니에 다시 담을 수 있어야 한다
- 재주문 시 판매 중단 상품은 제외하거나 별도 안내해야 한다

## 6. 화면 구조

### 공통 화면

- 홈
- 로그인 / 회원가입
- 상품 목록
- 상품 상세
- 장바구니
- 주문서
- 결제 완료
- 주문 내역
- 배송 조회

### 사업자 전용 또는 강조 화면

- 대량 구매 추천 영역
- 재주문 바로가기
- 사업자 가격 표시

### 관리자 화면

- 상품 관리
- 주문 관리
- 사용자 관리
- 가격 정책 관리

## 7. 기능 요구사항

### 7.1 인증

- 이메일 + 비밀번호 로그인 지원
- 사용자 유형은 가입 시 선택하거나 관리자가 승인
- 인증 후 사용자 프로필에 `role`과 `customerType` 저장

### 7.2 상품

- 상품은 이름, 가격, 사업자 가격, 재고 상태, 카테고리, 대표 이미지, 판매 상태를 가져야 한다
- 상품 목록은 카테고리, 검색어, 정렬 기준으로 조회 가능해야 한다
- 리스트에서 바로 장바구니 담기가 가능해야 한다

### 7.3 장바구니

- 상품별 수량 변경 가능
- 사용자 유형에 따라 가격 재계산
- 예상 배송비 표시
- 최소 주문 금액 미달 시 안내 메시지 표시

### 7.4 주문

- 주문 시점에 가격, 배송비, 사용자 유형 스냅샷 저장
- 주문 상태는 `pending`, `paid`, `preparing`, `shipping`, `delivered`, `cancelled`
- 주문 완료 후 내역에서 재주문 가능

### 7.5 결제

- MVP에서는 `mock payment` 또는 간단한 PG 연동 구조로 시작
- 결제 성공/실패/취소 상태를 저장

### 7.6 배송 조회

- 주문 상태 기반 배송 추적 정보 노출
- MVP에서는 송장 API 대신 내부 상태값 중심으로 제공 가능

## 8. 데이터 모델 초안

### users

- id
- email
- password_hash
- name
- phone
- role
- customer_type
- business_name
- business_number
- created_at
- updated_at

### products

- id
- name
- description
- price_normal
- price_business
- min_order_qty
- stock_qty
- category_id
- image_url
- is_active
- created_at
- updated_at

### categories

- id
- name
- sort_order

### carts

- id
- user_id
- created_at
- updated_at

### cart_items

- id
- cart_id
- product_id
- quantity
- unit_price_snapshot

### orders

- id
- user_id
- order_number
- customer_type_snapshot
- subtotal_amount
- shipping_fee
- total_amount
- payment_status
- order_status
- ordered_at

### order_items

- id
- order_id
- product_id
- product_name_snapshot
- unit_price
- quantity
- line_total

### deliveries

- id
- order_id
- courier_name
- tracking_number
- delivery_status
- shipped_at
- delivered_at

### policy_configs

- id
- key
- value
- description

## 9. API 설계 초안

### 인증

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### 상품

- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/categories`

### 장바구니

- `GET /api/cart`
- `POST /api/cart/items`
- `PATCH /api/cart/items/:id`
- `DELETE /api/cart/items/:id`

### 주문

- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`
- `POST /api/orders/:id/reorder`

### 결제

- `POST /api/payments/prepare`
- `POST /api/payments/confirm`

### 배송

- `GET /api/deliveries/:orderId`

### 관리자

- `GET /api/admin/products`
- `POST /api/admin/products`
- `PATCH /api/admin/products/:id`
- `GET /api/admin/orders`
- `PATCH /api/admin/orders/:id/status`

## 10. 프론트엔드 구조 제안

```text
src/
  app/
    (public)/
    (auth)/
    (shop)/
    admin/
    api/
  components/
    common/
    product/
    cart/
    order/
  features/
    auth/
    product/
    cart/
    order/
    reorder/
  lib/
    api/
    auth/
    utils/
    constants/
  hooks/
  store/
  types/
```

### 상태 관리 원칙

- 서버 데이터는 `TanStack Query`로 관리
- UI 상태와 일시적 로컬 상태는 `Zustand`로 관리
- 폼 검증은 `React Hook Form` + `Zod`

## 11. 백엔드 구조 제안

### 계층 분리

- Route Handler: 요청/응답 처리
- Service: 비즈니스 로직 처리
- Repository: DB 접근 추상화
- Schema: 입력 검증

### 주요 서비스

- AuthService
- ProductService
- CartService
- OrderService
- DeliveryService
- PricingService
- ReorderService

## 12. 권한 정책

### 일반 고객

- 일반 가격 조회
- 상품 주문
- 배송비 조건 적용

### 사업자

- 사업자 가격 조회
- 무료 배송 적용
- 재주문 우선 UX 제공

### 관리자

- 상품 / 주문 / 정책 관리

## 13. 환경 변수 기준

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
PAYMENT_PROVIDER=
PAYMENT_API_KEY=
STORAGE_BUCKET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
DEFAULT_SHIPPING_FEE=
FREE_SHIPPING_THRESHOLD=
MIN_ORDER_NORMAL=
MIN_ORDER_BUSINESS=
```

## 14. 코딩 컨벤션

### 공통

- 전역 언어는 `TypeScript`
- 파일명은 컴포넌트 `PascalCase`, 유틸과 훅은 `camelCase`
- 절대 경로 import 사용
- 비즈니스 규칙은 UI 컴포넌트 내부에 직접 하드코딩하지 않는다

### 프론트엔드

- 화면은 최대한 서버 데이터 조회와 렌더링 책임만 가진다
- 가격 계산, 배송비 계산, 재주문 구성은 `service` 또는 `domain` 계층에 둔다

### 백엔드

- Request DTO / Response DTO 명확히 분리
- 가격 계산 시 사용자 유형 스냅샷을 주문에 저장
- 상태값은 문자열 상수 또는 enum으로 관리

## 15. 테스트 전략

### 단위 테스트

- 가격 계산
- 배송비 계산
- 최소 주문 금액 검증
- 재주문 장바구니 구성

### 통합 테스트

- 회원가입 후 로그인
- 상품 담기 후 주문 생성
- 사용자 유형별 금액 계산 차이 검증

### E2E 테스트

- 일반 고객 주문 플로우
- 사업자 재주문 플로우
- 관리자 주문 상태 변경 플로우

## 16. 개발 일정 제안

### 1주차

- 프로젝트 초기 세팅
- 인증 구조 구현
- DB 스키마 설계

### 2주차

- 상품 목록 / 상세
- 장바구니 구현

### 3주차

- 주문 / 결제 플로우
- 배송 상태 조회

### 4주차

- 재주문 기능
- 관리자 기본 기능
- 테스트 및 배포

## 17. 우선순위

### P0

- 인증
- 상품 조회
- 장바구니
- 주문
- 결제 상태 저장
- 재주문

### P1

- 배송 조회
- 관리자 상품/주문 관리

### P2

- 추천 상품
- 공공기관 맞춤 정책

## 18. 다음 실행 항목

- Next.js + TypeScript 프로젝트 초기화
- Prisma 스키마 작성
- 인증 방식 확정
- 핵심 API와 화면 라우트 뼈대 생성
- 가격/배송비/재주문 도메인 로직을 별도 모듈로 분리

## 19. 결정 사항 요약

- 서비스 유형: 식자재 커머스 MVP
- 핵심 차별점: 빠른 재주문
- 주요 사용자: 일반 고객, 사업자, 관리자
- 기본 기술 스택: Next.js, TypeScript, Prisma, PostgreSQL
- 핵심 정책: 사용자 유형별 가격/배송비/최소 주문 금액 분기
