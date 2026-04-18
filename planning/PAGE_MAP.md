# Stitch 디자인 → Next.js 라우트 매핑

`design/` 폴더의 Google Stitch 디자인을 Next.js App Router 라우트로 매핑한 결과입니다.

## 디자인 폴더 구조

```
design/
  design_system/        # 토큰/북극성 사양 3개
  pages/
    home/{web,mobile}
    products/{web,mobile}
    product_detail/{web,mobile}
    cart/{web,mobile}
    checkout/{web,mobile}
    order_complete         # web only
    order_tracking         # web only
    mypage/{web,mobile}
    admin_dashboard        # web only
```

## 코드 라우트 구조

```
src/app/
  layout.tsx                       # 루트 레이아웃 (폰트, 메타데이터)
  globals.css                      # M3 토큰, Material Symbols
  (shop)/                          # 고객/사업자 공용 쇼핑 영역
    layout.tsx                     # TopAppBar + Footer + BottomNav
    page.tsx                       # 홈
    products/
      page.tsx                     # 상품 목록
      [id]/page.tsx                # 상품 상세
    cart/page.tsx                  # 장바구니
    checkout/page.tsx              # 주문서/결제
    orders/
      page.tsx                     # 주문 내역 (디자인 없음, 자체 구현)
      complete/page.tsx            # 결제 완료
      [id]/tracking/page.tsx       # 배송 조회
    reorder/page.tsx               # 재주문 (디자인 없음, 자체 구현)
    mypage/page.tsx                # 마이페이지
  (auth)/                          # 비회원 영역 (디자인 없음, 자체 구현)
    layout.tsx
    login/page.tsx
    signup/page.tsx
  admin/                           # 관리자 콘솔
    layout.tsx                     # 사이드바 + 상단바
    page.tsx                       # 대시보드
    orders/page.tsx                # 주문 관리 (디자인 없음, 자체 구현)
```

## 디자인 ↔ 라우트 매핑

| 디자인 폴더 | 라우트 | 비고 |
| --- | --- | --- |
| `pages/home/web`, `pages/home/mobile` | `/` | 반응형 단일 페이지에 통합 |
| `pages/products/web`, `pages/products/mobile` | `/products` | 사이드바 필터(web) + 칩 필터(mobile) |
| `pages/product_detail/web`, `pages/product_detail/mobile` | `/products/[id]` | 갤러리 + 사업자 가격 강조 |
| `pages/cart/web`, `pages/cart/mobile` | `/cart` | |
| `pages/checkout/web`, `pages/checkout/mobile` | `/checkout` | |
| `pages/order_complete` | `/orders/complete` | web 디자인만 존재 |
| `pages/order_tracking` | `/orders/[id]/tracking` | web 디자인만 존재 |
| `pages/mypage/web`, `pages/mypage/mobile` | `/mypage` | |
| `pages/admin_dashboard` | `/admin` | |
| (디자인 없음) | `/login`, `/signup`, `/orders`, `/reorder`, `/admin/orders` | 토큰만 재사용해 자체 구현 |

## 디자인 시스템 토큰

`tailwind.config.ts`에 Material Design 3 색상 토큰을 적용했습니다.

- **Primary** `#004c16` (Deep Green) — 브랜드/신뢰
- **Secondary container** `#fe6b00` (Electric Orange) — 결제/장바구니 CTA
- **Tertiary** `#771e3d` (Burgundy) — 사업자 단독 뱃지
- **Surface** `#f9f9fc`, **surface-container-lowest** `#ffffff` — 톤 레이어링
- **Outline-variant** `#bfcaba` — Ghost 보더

폰트:

- `font-headline` → Plus Jakarta Sans (브랜드/제목)
- `font-display` → Manrope (대형 디스플레이)
- `font-sans` → Inter (본문)

## 다음 단계

- API 라우트와 페이지 연결 (`/api/products`, `/api/cart`, `/api/orders`)
- 인증 (NextAuth) 연결 후 사업자/일반 가격 자동 분기
- 상품/주문 관리자 CRUD UI 추가 (`/admin/products`, `/admin/users`, `/admin/policy`)
- 카테고리/검색 필터 상태 관리 (Zustand)
- 결제 PG 모듈 연동 (Mock → 실 결제)
