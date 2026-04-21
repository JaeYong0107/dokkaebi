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

## 4. PG 결제 모듈 연동

**현재 상태**
- [src/app/(shop)/checkout/page.tsx](../src/app/(shop)/checkout/page.tsx) 는 `useCheckoutStore` 기반 UI state 관리까지만 구현
- 결제 수단 선택값은 store에 저장되지만 **실제 결제 생성/검증 로직 없음**
- toss / iamport / portone 등 SDK 흔적 0건
- `.env.example`의 `PAYMENT_PROVIDER` 키도 미사용

**해야 할 일**
- [ ] PG 벤더 결정 (PortOne v2 또는 Toss Payments SDK 권장)
- [ ] `src/features/payment/` 도메인 모듈 신설 — 결제 세션 생성, 승인, 검증
- [ ] `/api/payments/prepare` + `/api/payments/confirm` 라우트 추가
- [ ] 결제 완료 후 Order 생성 트랜잭션 (paymentStatus → PAID, OrderStatus → PAID)
- [ ] 결제 실패 / 취소 플로우 — OrderStatus → CANCELLED, 재시도 UI
- [ ] 세금계산서 발행 옵션 처리 (사업자 주문)

---

## 5. 관리자 CRUD 화면

**현재 상태**
- 현재 존재하는 admin 라우트: `/admin` (대시보드), `/admin/orders` (주문 관리)
- **없는 라우트**:
  - `/admin/products` — 상품 CRUD
  - `/admin/users` — 사용자 CRUD, 사업자 승인
  - `/admin/policy` — 정책값 관리 (배송비/최소주문/무료배송 기준선)

**해야 할 일**
- [ ] `/admin/products` — 목록/검색/신규등록/수정/비활성화, 카테고리 할당
- [ ] `/admin/users` — 일반/사업자 구분, 사업자 승인 토글, 역할 변경
- [ ] `/admin/policy` — `src/lib/config.ts` `getPolicyConfig`가 읽는 값을 DB로 이전하고 폼으로 편집
- [ ] 각 화면의 mutation API 라우트 추가 (`PATCH /api/admin/products/[id]` 등)
- [ ] 관리자 권한 가드 (NextAuth 세션의 `role === "ADMIN"`)

---

## 참고

- 완료된 상태 관리 갭 리포트: [docs/agent-reports/state-management-gap-report.md](../docs/agent-reports/state-management-gap-report.md)
- 페이지-디자인 매핑표: [planning/PAGE_MAP.md](./PAGE_MAP.md)
- 프로젝트 가이드: [CLAUDE.md](../CLAUDE.md)
