# service_project

식자재 커머스 MVP를 위한 기획 및 개발 기준 저장소입니다.

## 현재 상태

현재 저장소는 구현 전 단계이며, 아래 문서를 기준으로 개발을 시작합니다.

- `planning/service_plan.md`: 서비스 기획 초안
- `planning/business_logic.md`: 핵심 비즈니스 로직 초안
- `planning/DEVELOPMENT_SPEC.md`: 실제 개발 착수를 위한 기술/기능 스펙

## 권장 개발 기준

- Frontend: `Next.js` + `TypeScript` + `Tailwind CSS`
- Backend: `Next.js Route Handlers` + `Prisma`
- Database: `PostgreSQL`
- Test: `Vitest` + `Playwright`

## 실행 방법

```bash
npm install
cp .env.example .env.local
npm run dev
```

## 현재 포함된 초기 구현

- `src/app`: App Router 기반 웹 진입점
- `src/app/api`: health, products, cart, reorder 샘플 API
- `src/features/pricing`: 가격/배송비/최소 주문 금액 도메인 로직
- `src/features/reorder`: 최근 주문 기반 재주문 로직
- `prisma/schema.prisma`: 사용자, 상품, 장바구니, 주문, 배송 스키마 초안

## 다음 단계

1. Prisma 마이그레이션 및 실제 DB 연결
2. 인증 구현
3. 상품/장바구니/주문 API를 mock 데이터에서 DB 기반으로 전환
4. 재주문 UX와 관리자 화면 확장
