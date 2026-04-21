# dokkaebi TODO

현 시점(2026-04-21) 기준 실제로 미구현된 작업을 한 곳에 모은 파일.
UI scaffold와 상태 관리 연결은 대부분 완료됐고, 아래 항목들은 DB/인증/결제 등
**백엔드·외부 연동 레이어가 통째로 비어 있는 영역**이다.

우선순위 순서: DB → 인증 → API 실 데이터화 → 결제 → 관리자 CRUD.

---

## 1. Prisma 마이그레이션 + DB 연결

**현재 상태**
- [prisma/schema.prisma](../prisma/schema.prisma) 에 모델은 정의돼 있다 (User / Category / Product / Cart / CartItem / Order / OrderItem / Delivery)
- `prisma/migrations/` 폴더가 **없음** → 마이그레이션 한 번도 생성되지 않음
- [src/lib/prisma.ts](../src/lib/prisma.ts) 싱글턴은 만들어져 있지만 **어디서도 import되지 않음**
- `.env`의 `DATABASE_URL` 실제 DB 연결 여부 미확인

**해야 할 일**
- [ ] Supabase 또는 Neon 인스턴스 생성, `DATABASE_URL` 세팅
- [ ] `npx prisma migrate dev --name init` 으로 최초 마이그레이션 생성
- [ ] 시드 스크립트 (`data/*.json` → Category/Product 주입) 작성
- [ ] 개발 DB와 프로덕션 DB 분리 전략 결정

---

## 2. NextAuth 인증 + 사업자 인증 플로우

**현재 상태**
- `package.json` 의존성에 `next-auth` 자체가 **없음**
- `src/app/api/auth/` 라우트 **없음**
- [src/app/(auth)/login/page.tsx](../src/app/(auth)/login/page.tsx), [signup/page.tsx](../src/app/(auth)/signup/page.tsx) 는 UI만 존재
- `.env.example` 에는 `NEXTAUTH_SECRET`, `NEXTAUTH_URL` 키만 준비됨

**해야 할 일**
- [ ] `next-auth` 설치 및 `src/app/api/auth/[...nextauth]/route.ts` 세팅
- [ ] 이메일/비밀번호 Credentials provider — User.passwordHash 검증
- [ ] 로그인/회원가입 페이지를 실제 mutation과 연결
- [ ] `customerType`(NORMAL/BUSINESS) 분기: 회원가입 시 사업자 입력 → 관리자 승인 플로우
- [ ] 세션 기반으로 가격/배송비 분기 (BUSINESS 도매가 자동 적용)
- [ ] 미들웨어로 `/admin/*`, `/mypage` 등 보호 라우트 게이팅

---

## 3. API 라우트를 mock에서 Prisma 기반으로 전환

**현재 상태**
- `src/app/api/**/route.ts` 전부 [data/*.json](../data/) + [src/server/local-orders.ts](../src/server/local-orders.ts) 기반
- Prisma import 0건 (`grep -r "from \"@/lib/prisma\"" src/` → 매치 없음)
- 즉 서버 라우트가 전부 **정적 mock**

**해야 할 일 (엔드포인트별)**
- [ ] `/api/products`, `/api/products/[id]` — Product + Category
- [ ] `/api/categories` — Category
- [ ] `/api/cart` — Cart + CartItem (userId 기반, 세션 필요)
- [ ] `/api/orders`, `/api/orders/[id]` — Order + OrderItem + Delivery
- [ ] `/api/orders/reorder` — 과거 주문 기반 재주문 초안
- [ ] `/api/mypage` — 세션 사용자 요약
- [ ] `/api/admin/dashboard` — 집계 쿼리
- [ ] `/api/site-content` — 정적 유지 or CMS 결정

각 전환 시: mock JSON 동작과 응답 스키마가 동일하게 유지되는지 검증 필요
(프론트 페이지들이 이미 응답 형태에 맞춰져 있음).

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
