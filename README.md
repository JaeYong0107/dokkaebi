# dokkaebi

재주문이 빠른 식자재 커머스 MVP. 일반 고객 / 사업자 / 관리자가 같은 플랫폼에서 사용하되, 가격·배송 정책이 사용자 유형에 따라 자동 분기됩니다.

## 기술 스택

- **Frontend**: Next.js 15 (App Router) · TypeScript · Tailwind CSS
- **Backend**: Next.js Route Handlers · Prisma · PostgreSQL
- **State/Form**: TanStack Query · Zustand · React Hook Form + Zod
- **Test**: Vitest (단위) · Playwright (E2E, 예정)
- **디자인 시스템**: Material Design 3 토큰 — primary `#004c16` (딥그린), secondary-container `#fe6b00` (일렉트릭 오렌지)

## 빠른 시작

```bash
npm install
cp .env.example .env.local       # 정책/DB 변수 채우기
npm run dev                      # http://localhost:3000
```

## 주요 명령어

```bash
npm run dev          # 개발 서버
npm run build        # 프로덕션 빌드
npm run typecheck    # tsc --noEmit
npm run lint         # next lint
npm run test         # vitest run
```

## 디렉터리

```
design/              # Google Stitch 디자인 (UI 정답)
  pages/<page>/{web,mobile}/{code.html, screen.png}
  design_system/                                       # 토큰·북극성
planning/                                              # 기획/스펙/매핑 문서
prisma/schema.prisma                                   # DB 스키마
src/
  app/(shop)/        # 고객·사업자 영역
  app/(auth)/        # 로그인·회원가입
  app/admin/         # 관리자 콘솔
  app/api/           # mock API 라우트
  components/        # 공용 UI
  features/          # 도메인 모듈 (pricing, cart, reorder, order, product)
  lib/               # config, format, prisma 싱글턴
```

## 라우트 / 디자인 매핑

| 라우트 | 디자인 | 비고 |
| --- | --- | --- |
| `/` | `design/pages/home/{web,mobile}` | 홈 |
| `/products` | `design/pages/products/{web,mobile}` | 상품 목록 |
| `/products/[id]` | `design/pages/product_detail/{web,mobile}` | 상품 상세 |
| `/cart` | `design/pages/cart/{web,mobile}` | 장바구니 |
| `/checkout` | `design/pages/checkout/{web,mobile}` | 주문/결제 |
| `/orders/complete` | `design/pages/order_complete` | 결제 완료 |
| `/orders/[id]/tracking` | `design/pages/order_tracking` | 배송 조회 |
| `/mypage` | `design/pages/mypage/{web,mobile}` | 마이페이지 |
| `/admin` | `design/pages/admin_dashboard` | 관리자 대시보드 |
| `/login`, `/signup`, `/orders`, `/reorder`, `/admin/orders` | (디자인 없음) | 토큰만 재사용한 자체 구현 |

자세한 매핑은 [planning/PAGE_MAP.md](planning/PAGE_MAP.md).

## 핵심 비즈니스 규칙

`src/features/pricing/pricing-service.ts` 가 단일 진입점입니다.

- **가격**: 일반 고객은 `priceNormal`, 사업자는 `priceBusiness` 자동 적용
- **배송비**: 사업자 무료 / 일반 고객은 `FREE_SHIPPING_THRESHOLD` 미만 시 `DEFAULT_SHIPPING_FEE`
- **최소 주문 금액**: 일반 `MIN_ORDER_NORMAL` / 사업자 `MIN_ORDER_BUSINESS`
- **재주문**: 최근 주문에서 판매 종료 상품을 제외하고 한 번에 장바구니로 (`src/features/reorder/reorder-service.ts`)

정책 값은 모두 `.env.local` 환경 변수 → `src/lib/config.ts` 의 `getPolicyConfig` 로 주입.

## 현재 상태

- ✅ UI scaffold 100% (Stitch 디자인 1:1 매칭)
- ✅ 도메인 로직 (가격/배송비/재주문) + Vitest
- ✅ mock 데이터 기반 페이지 동작
- ⏳ DB 연결 / 인증 / PG 결제 미구현 — 다음 단계

## 다음 단계

1. Prisma 마이그레이션 + Supabase/Neon 연결
2. NextAuth 인증 + 사업자 인증 플로우
3. 상품/장바구니/주문 API 를 mock 에서 Prisma 기반으로 전환
4. PG 결제 모듈 연결
5. 관리자 CRUD 화면 확장 (`/admin/products`, `/admin/users`, `/admin/policy`)

## Claude Code 작업 가이드

이 저장소에서 Claude Code 로 작업할 경우 [CLAUDE.md](CLAUDE.md) 참고. 디자인 룰과 커밋 컨벤션이 정리돼 있습니다.
