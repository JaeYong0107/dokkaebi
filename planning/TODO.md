# dokkaebi TODO

현 시점(2026-04-21) 기준 실제로 미구현된 작업을 한 곳에 모은 파일.
UI scaffold와 상태 관리 연결은 대부분 완료됐고, 아래 항목들은 DB/인증/결제 등
**백엔드·외부 연동 레이어가 통째로 비어 있는 영역**이다.

우선순위 순서: DB → 인증 → API 실 데이터화 → 결제 → 관리자 CRUD.

---

## 1. Prisma 마이그레이션 + DB 연결 ✅

**완료 (2026-04-21)**
- [docker-compose.yml](../docker-compose.yml) — 로컬 Postgres 16 (`dokkaebi-postgres` 컨테이너, healthcheck 포함)
- [.env](../.env) — `DATABASE_URL` Postgres로 통일 (기존 SQLite 설정 교체)
- [prisma/schema.prisma](../prisma/schema.prisma) — 프론트 mock 필드와 정합하도록 확장
  (Product: sku/unit/basePrice/normalDiscountRate/businessDiscountRate/origin/imageEmoji/imageBg/badges,
  Category: icon/featured)
- `prisma/migrations/20260421125416_init/` — 최초 마이그레이션 생성·적용
- [prisma/seed.ts](../prisma/seed.ts) — `data/categories.json` / `data/products.json` 읽어 upsert
  (Category 7건, Product 15건 시드 완료)
- [package.json](../package.json) — `db:up`/`db:down`/`db:migrate`/`db:seed`/`db:studio`/`db:reset` 스크립트,
  `prisma.seed` 설정, `tsx` devDep 추가

**남은 후속 작업 (별도 항목으로 추적)**
- 프로덕션 DB 분리 (Supabase/Neon 이전) — 배포 단계에서 결정
- User 시드는 NextAuth 붙인 뒤 추가 (항목 2번에서 처리)

---

## 2. NextAuth 인증 + 사업자 인증 플로우 ✅

**완료 (2026-04-21)**
- Auth.js v5 (`next-auth@beta`) 설치 + Credentials provider 적용
- [src/auth.config.ts](../src/auth.config.ts) / [src/auth.ts](../src/auth.ts) — Edge-safe config 분리
- [src/app/api/auth/[...nextauth]/route.ts](../src/app/api/auth/%5B...nextauth%5D/route.ts) — handlers mount
- [src/middleware.ts](../src/middleware.ts) — `/mypage`, `/cart`, `/checkout`, `/orders`, `/reorder` 로그인 가드,
  `/admin/*` 는 ADMIN 전용 (E2E로 302/307 검증)
- [src/features/auth/](../src/features/auth/) — password 해시(bcryptjs), zod 스키마, register 서비스
- [src/app/api/auth/register/route.ts](../src/app/api/auth/register/route.ts) — 회원가입 엔드포인트
- [src/app/(auth)/login/page.tsx](../src/app/(auth)/login/page.tsx),
  [signup/page.tsx](../src/app/(auth)/signup/page.tsx) —
  react-hook-form + `signIn` / `fetch` 로 실제 인증 연결
- [src/providers/AuthProvider.tsx](../src/providers/AuthProvider.tsx) — SessionProvider
- [src/types/next-auth.d.ts](../src/types/next-auth.d.ts) — Session/JWT 타입 확장
  (role, customerType, businessApproved 주입)
- User 모델에 `businessApproved: Boolean @default(false)` 추가 + 마이그레이션
  `20260421130008_add_business_approved`
- 시드에 테스트 계정 3건 추가:
  - `admin@dokkaebi.kr / admin1234` (ADMIN)
  - `user@dokkaebi.kr / user1234` (NORMAL)
  - `biz@dokkaebi.kr / biz12345` (BUSINESS, businessApproved=true)

**남은 후속 작업 (항목 5번에서 처리)**
- 사업자 승인 토글 UI → `/admin/users`
- 회원가입 시 BUSINESS 신청 → 관리자 알림 연결

---

## 3. API 라우트를 mock에서 Prisma 기반으로 전환 ✅

**완료 (2026-04-21)**
두 개 커밋으로 분할 진행. 응답 스키마는 프론트가 기대하는 형태 그대로 유지.

**1차 커밋 — 카탈로그/장바구니 (커밋 9bd6bff)**
- [src/server/mappers/product.ts](../src/server/mappers/product.ts) 신설
  · DB Category.name(표시용) 과 Product.category 라벨의 불일치를
    categoryId 기반 CATEGORY_PRODUCT_LABELS 로 해결
- `/api/categories`: prisma.category + "전체보기" 가상 prepend
- `/api/products`, `/api/products/[id]`: findMany/findUnique(include:category)
- `/api/cart`: 세션 user 의 Cart/CartItem 조회 + PUT(전량 교체) 신규

**2차 커밋 — 주문/마이페이지/관리자 집계 (이 커밋)**
- [src/server/mappers/order.ts](../src/server/mappers/order.ts) 신설
  · DB Order + OrderItem(+product) + Delivery + User 를 프론트 OrderRecord 로 변환
  · `ORDER_INCLUDE` 상수로 include 로직 공유
- `/api/orders`: 세션 기반. 일반 user 는 본인 주문만, ADMIN 은 전체
- `/api/orders/[id]`: 본인 또는 ADMIN 만 접근, 404/403 처리
- `/api/orders/reorder`: 세션 user 의 최근 주문 + 전체 상품 기반으로
  기존 `buildReorderItems` 재사용
- `/api/mypage`: 세션 user 주문 집계로 recentOrders/frequentlyBought/
  quickReorder/progressingOrders 계산 (account.json 의 정적 부분은 유지)
- `/api/admin/dashboard`: ADMIN 게이트 + 전체 주문/상품 집계
- `src/server/local-orders.ts` 제거 (더 이상 참조 없음)
- `prisma/seed.ts` 에 biz 계정 샘플 주문 2건 (SHIPPING/DELIVERED) 시드 추가

**남은 후속 작업 (범위 밖이라 별도 항목으로 추적)**
- 일부 프론트 페이지(`products/[id]/page.tsx`, `orders/page.tsx`,
  `orders/complete/page.tsx`)가 여전히 `sampleProducts` 를 직접 import 중.
  API 호출로 전환은 5번(관리자 CRUD) 이후 UI 리팩터링 항목으로.
- Order 모델에 배송지/수취인/연락처 필드가 없어서 응답에서 빈 값으로 내려감.
  결제(4번) 에서 스키마 확장 시 채워넣기.

---

## 4. PG 결제 모듈 연동 ✅ (MVP mock 단계)

**완료 (2026-04-21)**
MVP 단계에서는 mock provider 로 결제 흐름 전체(승인 → 주문 생성 → 재고 차감 →
장바구니 비움)를 통합 구현. 실 PG 는 provider 교체만으로 붙도록 추상화.

- [src/features/payment/types.ts](../src/features/payment/types.ts) — PaymentMethod,
  CheckoutRequest, PaymentApproval, PaymentError
- [src/features/payment/schemas.ts](../src/features/payment/schemas.ts) — zod
  checkoutRequestSchema (items/customerType/paymentMethod/배송지/수취인 검증)
- [src/features/payment/provider.ts](../src/features/payment/provider.ts) —
  PaymentProvider 인터페이스 + MockPaymentProvider.
  `PAYMENT_PROVIDER=mock` 기본, 실 PG 추가 시 여기만 분기
- [src/features/payment/payment-service.ts](../src/features/payment/payment-service.ts)
  — checkoutAndPay(userId, request) 한 곳에서:
  1. 상품 검증(존재/활성/재고)
  2. 단가 재계산 (사업자/일반 분기)
  3. 소계·배송비·최소주문 검증 (env 정책값 기반)
  4. orderNumber 생성 + provider.approve()
  5. Prisma `$transaction` 으로 Order + OrderItem + Delivery(PENDING) 생성
  6. 재고 decrement + Cart 비우기
- [src/app/api/orders/route.ts](../src/app/api/orders/route.ts) — POST 재구현
  · 401(미로그인) / 400(zod) / 409(재고 부족·비활성·최소주문 미달) /
    404(존재하지 않는 상품) / 500 분기
  · 응답은 toOrderRecord 로 프론트 OrderRecord 스키마 유지
- prisma/schema.prisma Order 확장
  · paymentMethod/paymentProvider/paymentTxId
  · shippingAddress/recipient/recipientPhone/shippingMemo
  · taxInvoiceRequested
- prisma/migrations/20260421132353_add_order_shipping_payment 마이그레이션
- [src/server/mappers/order.ts](../src/server/mappers/order.ts) —
  shippingAddress / recipient 를 DB 값 기반으로 반환 (기존 빈값 반환 해소)
- [src/app/(shop)/checkout/page.tsx](../src/app/(shop)/checkout/page.tsx) —
  handleSubmit 을 새 스키마(`items: [{productId, quantity}]` + 결제 수단 /
  수취인 / 주소 / 메모 / taxInvoiceRequested)로 변경,
  submitting / submitError state 추가 + 결제 진행 버튼에 로딩·에러 표시

검증 (dev 서버 + curl, biz 계정)
- 최소주문 미달 → 409 "BELOW_MINIMUM_ORDER"
- 정상 주문 → 201, orderStatus=PAID, paymentStatus=PAID, totalAmount 일치
- 주문 후 /api/orders 목록 → 새 주문 포함 3건
- 재고 42 → 38 decrement 확인
- 장바구니 비움 확인
- 재고 부족(9999개) → 409 "OUT_OF_STOCK"
- 비로그인 결제 → 401
- npm run typecheck 통과

**남은 후속 작업**
- 실 PG(PortOne v2 또는 Toss Payments) 연동은 provider 파일에서만 분기 추가
- 결제 실패/취소 플로우(환불, OrderStatus=CANCELLED 전이)는 관리자 주문 UI 에서

---

## 5. 관리자 CRUD 화면

**진행 (2026-04-21)**

- [x] `/admin/users` 완료
  - GET `/api/admin/users` / PATCH `/api/admin/users/[id]`
  - 사용자 유형/승인 상태/검색어 필터
  - 사업자 승인 토글 + 관리자 권한 부여·회수
  - 본인 role 내리기 차단, 사업자 아닌 사용자에 businessApproved 차단
- [x] `/admin/products` 완료
  - GET `/api/admin/products`, POST / PATCH
  - 판매 상태 · 카테고리 · 키워드 검색 필터
  - 모달 폼(신규/편집) — 뱃지 CSV, 할인율, 재고, 이모지, 배경 모두 편집
  - 판매 중지 토글, 비활성 상품은 리스트에서 isActive=false 로 내려감
  - zod 검증(카테고리 존재/중복 ID/0 이하 가격 등) 서버 측 처리
- [ ] `/admin/policy` — Policy DB 이전 + 편집 UI (마지막 커밋)

**같이 수정**
- admin layout 과 `/admin`, `/admin/orders` 의 `fetch()` 가 쿠키 forward 하지
  않아 서버 사이드에서 401/403 이 나고 응답 파싱 실패로 500 이 나던 문제 동시 해결
  (`headers()` 로 cookie 전달 + fallback profile)

---

## 참고

- 완료된 상태 관리 갭 리포트: [docs/agent-reports/state-management-gap-report.md](../docs/agent-reports/state-management-gap-report.md)
- 페이지-디자인 매핑표: [planning/PAGE_MAP.md](./PAGE_MAP.md)
- 프로젝트 가이드: [CLAUDE.md](../CLAUDE.md)
