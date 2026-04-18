# dokkaebi 디자인 자료

Google Stitch로 생성한 dokkaebi 식자재 커머스의 디자인 산출물입니다.

## 폴더 구조

```
design/
  design_system/                # 디자인 시스템 사양 (북극성 + 토큰)
    dokkaebi_harvest/
    seoul_orchard_harvest/
    verdant_velocity/
  pages/                        # 페이지별 디자인 (코드 + 스크린샷)
    home/             {web, mobile}
    products/         {web, mobile}
    product_detail/   {web, mobile}
    cart/             {web, mobile}
    checkout/         {web, mobile}
    order_complete/                   # web only
    order_tracking/                   # web only
    mypage/           {web, mobile}
    admin_dashboard/                  # web only
```

각 페이지 폴더 / 변형 폴더는 `code.html`(Stitch 원본 HTML)과 `screen.png`(렌더링 결과)을 포함합니다.

## 페이지 ↔ 라우트 매핑

| 디자인 폴더 | Next.js 라우트 |
| --- | --- |
| `pages/home/{web,mobile}` | `/` |
| `pages/products/{web,mobile}` | `/products` |
| `pages/product_detail/{web,mobile}` | `/products/[id]` |
| `pages/cart/{web,mobile}` | `/cart` |
| `pages/checkout/{web,mobile}` | `/checkout` |
| `pages/order_complete` | `/orders/complete` |
| `pages/order_tracking` | `/orders/[id]/tracking` |
| `pages/mypage/{web,mobile}` | `/mypage` |
| `pages/admin_dashboard` | `/admin` |

## 디자인 시스템

`design_system/` 안의 세 폴더는 동일 컨셉 ("Editorial Harvest" / "Ethereal Greenhouse" / "High-Velocity Garden") 의 변주이며, 모두 다음 토큰을 공유합니다.

- **Primary** `#004c16` (Deep Green)
- **Secondary container** `#fe6b00` (Electric Orange)
- **Tertiary** `#771e3d` (Burgundy)
- 기본 폰트: Plus Jakarta Sans (Headline) / Inter (Body) / Pretendard (KR)

세부 사양은 각 폴더의 `DESIGN.md`를 참고하세요. 현재 코드에서는 `tailwind.config.ts`에 토큰을 반영했습니다.

## 누락 페이지

원본 Stitch 산출물에 없는 라우트는 코드에서는 동일 디자인 시스템을 적용해 자체 구현합니다.

- `/login`, `/signup` — 디자인 시스템 적용해서 구현
- `/orders` (주문 내역) — 마이페이지/체크아웃 패턴을 응용
- `/reorder` — 마이페이지의 "자주 주문하는 상품" 패턴을 확장
- `/admin/orders` — 관리자 대시보드 패턴 재활용
