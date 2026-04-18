# CLAUDE.md

이 파일은 Claude Code가 이 저장소를 작업할 때 참조하는 프로젝트 가이드입니다.

## 프로젝트 개요

**dokkaebi** — 재주문이 빠른 식자재 커머스 MVP (Next.js 15 + TypeScript + Tailwind + Prisma).

- 사용자 유형: 일반 고객 / 사업자 / 관리자
- 핵심 차별점: 최근 주문 기반 1탭 재주문, 사업자 자동 도매가 분기
- 디자인 시스템: Material Design 3 토큰 (primary `#004c16`, secondary-container `#fe6b00`)
- 현재 상태: UI scaffold 100% 완료 (mock 데이터 동작), DB/인증/결제 미연결

## 공용 아키텍처 기준

Codex와 Claude는 프론트엔드 구조 작업 시
`docs/FRONTEND_ARCHITECTURE.md` 를 공통 기준으로 따른다.

- 페이지 내부 폴더와 상위 `shared / entities / features / widgets / processes`
  경계는 해당 문서를 우선 기준으로 판단
- 새 공용 구조를 추가하거나 위치를 옮길 때는 이 문서와 충돌 없게 유지
- 애매하면 page 내부보다 공용 승격 가능성을 먼저 검토

## 디렉터리 구조

```
service_project/
  design/                          # Stitch 디자인 산출물 (UI 정답)
    pages/<page>/{web,mobile}/     # code.html + screen.png
    design_system/                 # 토큰/북극성 3종
  planning/                        # 기획·스펙 문서
    DEVELOPMENT_SPEC.md            # 개발 스펙
    PAGE_MAP.md                    # 디자인↔라우트 매핑표
  prisma/schema.prisma             # 사용자/상품/주문/배송 스키마
  src/
    app/                           # Next.js App Router
      (shop)/                      # 고객 영역 (TopAppBar + Footer + BottomNav)
      (auth)/                      # 로그인/회원가입
      admin/                       # 관리자 콘솔
      api/                         # health/products/cart/orders mock 라우트
      globals.css                  # @import Material Symbols + M3 base
      layout.tsx                   # 폰트 (Inter/Manrope/Jakarta) + 메타데이터
    components/
      common/{Icon,Logo,SectionTitle}
      shell/{TopAppBar,BottomNav,SiteFooter,ProductCard,ProductImage,PageHeading}
    shared/                        # 전역 공용 UI/유틸/API/config
    entities/                      # 도메인 모델 단위
    features/{cart,order,pricing,product,reorder}/  # 도메인 로직 + mock + types
    widgets/                       # 페이지 조합형 UI 블록
    processes/                     # 다단계 흐름 조합
    providers/                     # 전역 provider
    mocks/                         # mock/fixture
    lib/{config,format,prisma}     # 정책 키, 통화 포맷, prisma 싱글턴
    store/                         # Zustand 상태 저장소
  tailwind.config.ts               # M3 색 토큰 + 커스텀 폰트 변수
```

## 개발 명령어

```bash
npm run dev          # Next 개발 서버
npm run build        # 프로덕션 빌드
npm run typecheck    # tsc --noEmit
npm run lint         # next lint
npm run test         # vitest run
```

검증할 때 권장 순서: `npm run typecheck` → `npm run test` → `npm run build`.

## 디자인 작업 룰 (필수)

UI 변경/추가 시 다음 순서를 따른다.

1. `design/pages/<page>/<variant>/code.html` 과 `screen.png` 를 먼저 읽는다
2. 클래스/텍스트/이미지 URL을 디자인 그대로 가져온다 (임의 추측 금지)
3. 디자인에 없는 라우트(`/login`, `/signup`, `/orders`, `/reorder`, `/admin/orders`)는 `tailwind.config.ts` 토큰만 재사용해 자체 구현
4. 새 색이 필요하면 `tailwind.config.ts`에 토큰 추가 후 사용 (인라인 hex 금지)

매핑 표는 `planning/PAGE_MAP.md`.

## 코드 컨벤션

- TypeScript strict, 절대 경로 `@/...` 사용
- 컴포넌트는 PascalCase, 훅·유틸은 camelCase
- 비즈니스 규칙은 UI 컴포넌트 안에 하드코딩 금지 — `src/features/*/` 안에 도메인 모듈로 분리
- 가격 계산 / 배송비 / 최소 주문 금액 / 재주문은 반드시 `pricing-service`, `cart-service`, `reorder-service`를 통과
- 사용자 유형(`NORMAL` / `BUSINESS`)에 따른 분기는 `customer-type` snapshot을 주문에 저장
- 외부 이미지(`<img>`)는 디자인 HTML에서 가져온 `lh3.googleusercontent.com` URL을 그대로 사용 (`next/image` 대신 plain `<img>`, eslint-disable 주석 동반)

## 폰트 / 아이콘

- 본문: Inter, 제목: Manrope/Plus Jakarta Sans (모두 `next/font/google` 변수)
- 아이콘: Material Symbols Outlined — `globals.css` 최상단 `@import url(...)` 로 로드 (이게 가장 안정적, `<link>` 본문 삽입은 hoist 보장 안 됨)
- 사용: `<Icon name="..." />` 컴포넌트 (`src/components/common/Icon.tsx`)

## 커밋 규칙

**모든 커밋 메시지는 한국어**로 작성한다 (요약·본문 모두). 영어 type prefix 외에는 한국어.

형식:

```
<type>(<scope>): <한 줄 요약, 50자 이내, 한국어>

<본문 — 작업 히스토리를 알 수 있게 한국어로 상세히>
- 무엇을 바꿨는지 (파일/컴포넌트/기능 단위)
- 왜 바꿨는지 (배경, 제약, 사용자 요청)
- 영향 범위나 후속 작업이 있다면 함께

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

**type**: `feat` / `fix` / `refactor` / `style` / `docs` / `chore` / `test`
**scope**: `home` / `products` / `cart` / `checkout` / `orders` / `mypage` / `admin` / `auth` / `shell` / `tokens` / `api` / `prisma` 등

규칙
- 요약 줄: 마침표 없음, 명령형 한국어 (예: "결제 폼 1:1 적용")
- **본문은 항상 작성**한다. 나중에 git log만 봐도 작업 흐름을 따라갈 수 있어야 한다 — 한 줄 메시지·생략 금지
- 본문 줄 길이: 한 줄 72자 권장, 의미 단위로 줄바꿈
- 한 커밋 = 한 가지 의도 (UI + 빌드 설정은 분리)
- `WIP`, `update`, `fix bug` 같은 의미 없는 메시지 금지

## 환경 변수

`.env.example` 참고. 핵심:

```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
PAYMENT_PROVIDER=
DEFAULT_SHIPPING_FEE=
FREE_SHIPPING_THRESHOLD=
MIN_ORDER_NORMAL=
MIN_ORDER_BUSINESS=
```

정책 값은 `src/lib/config.ts` 의 `getPolicyConfig` 로만 읽는다.

## 다음 단계 (참고)

1. Prisma 마이그레이션 + Supabase/Neon 연결
2. NextAuth 인증 + 사업자 인증 플로우
3. 상품/장바구니/주문 API 를 mock 에서 Prisma 기반으로 전환
4. PG 결제 모듈 연결
5. 관리자 CRUD 화면 (`/admin/products`, `/admin/users`, `/admin/policy`)
