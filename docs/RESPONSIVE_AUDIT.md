# dokkaebi 반응형 검사 리포트

**검사일**: 2026-04-22
**도구**: gstack browse (Playwright 기반 headless Chromium)
**뷰포트**: mobile 375×812 · tablet 768×1024 · desktop 1280×720
**대상 페이지**: 12개 (공개·고객·관리자 전체)

---

## 총평

데스크톱(1280+) 은 모든 페이지가 양호. **모바일(375) 과 태블릿(768) 에서 레이아웃이
깨지는 패턴이 반복적**으로 관찰됨. 특히 두 가지 큰 카테고리 문제:

1. **한글 텍스트가 한 글자씩 세로로 쪼개지는 현상** (flex row 에서 폭 부족 + 한국어
   word-break 기본 동작)
2. **관리자 콘솔의 모바일 미대응** (사이드바 숨김 + 테이블 가로 오버플로)

이 두 가지만 해결해도 사용성이 크게 개선됨.

---

## 🔴🔴 CRITICAL 이슈 (UI 가 실질적으로 깨짐)

### A. "글자별 세로 쪼개짐" 증상

`flex flex-row` 컨테이너에 들어간 한국어 텍스트가 **한 글자씩 개행** 되어 읽을 수
없는 상태로 표시. CJK 문자는 공백이 없어 기본 `word-break` 로는 글자 단위
break 가 발생.

발견 위치 6곳:

| 페이지 | 뷰포트 | 위치 |
|---|---|---|
| 홈 `/` | 태블릿 (768) | "상담 신청하기" / "단가표 다운로드" CTA 버튼 (BusinessCtaButtons) |
| 상품 상세 `/products/[id]` | 모바일 | "최근 구매 상품 빠르게 담기" Quick Reorder 문구 |
| 상품 상세 | 모바일 | 오른쪽 "장바구니 전체 담기" 주황 CTA |
| 관리자 `/admin/orders` | 모바일 | 테이블 셀 전체 (주문번호/고객명/상품명/고객유형) |
| 관리자 `/admin/products` | 모바일 | 테이블 셀 (카테고리/상품명) |
| 관리자 `/admin/users` | 모바일 | 테이블 유형 컬럼 ("일반 고객" → 세로) |

**원인**:
- Tailwind 의 `break-words` / `break-all` 이 명시적으로 걸린 곳이 많음
- `flex flex-row` + 좁은 컨테이너 폭 → 한국어는 CJK rule 로 글자 단위 break

**해결 패턴**:
```css
/* globals.css 전역 */
body { word-break: keep-all; }
```
또는 해당 컴포넌트에 `whitespace-nowrap` / `[&_*]:break-keep`.
한국어에서는 `word-break: keep-all` + `overflow-wrap: break-word` 조합이 표준.

---

### B. 관리자 콘솔 모바일 미대응

#### B-1. 사이드바 숨김으로 네비게이션 불가
- `src/app/admin/layout.tsx` 의 `<aside className="hidden md:block">` → 모바일에선
  사이드바가 안 보임
- 상단바에 admin 전용 메뉴 없음 (기존 메뉴 "대시보드·주문 관리·상품 관리·사용자
  관리·정책 관리" 접근 방법 0)
- 모바일 관리자는 현재 **첫 진입 페이지에서 빠져나올 수 없음**

**해결**: 햄버거 버튼 → slide-in drawer, 또는 하단 admin 전용 BottomNav, 또는
헤더에 drop-down.

#### B-2. 테이블 가로 오버플로
- `/admin/orders`, `/admin/products`, `/admin/users` 모두 `<table>` 기반
- 모바일 뷰에서 가로 스크롤 없이 폭에 맞춰 셀 폭이 붕괴 → 글자 세로 쪼개짐(위 A 와 연계)

**해결 후보**:
- A: `<div className="overflow-x-auto"><table className="min-w-[600px]">` 로 가로 스크롤
- B: 모바일에서 `<div className="md:hidden">` 카드 레이아웃, 태블릿+에서 표
- C: 주요 컬럼 2개만 보이고 상세는 토글

---

## 🔴 HIGH (사용성 저해)

### C. 홈 히어로 텍스트 모바일 강제 줄바꿈
- "새벽에 수확한 / 신선함을 식탁까지." 가 모바일(375) 에서 "새벽에 수" + "확한" +
  "신선함을" + "식탁까지." 로 어색하게 쪼개짐
- 원인: `text-5xl`(48px) 고정 → 모바일 폭 부족
- 해결: `text-3xl md:text-5xl` 또는 `text-[2rem] md:text-5xl`

### D. 상품 상세 브레드크럼 overflow
- 모바일에서 "홈 > 채소 > 무농약 버터헤드 레터스 1kg" 한 줄 꽉 참
- 해결: 상품명은 마지막이니 `truncate` + 긴 이름 회전/말줄임

### E. `/products` 모바일 사이드바 세로 공간 차지
- 카테고리 리스트(8개) + 가격 필터 + 체크박스가 상단 전체를 차지 → 첫 화면에서
  상품 카드가 안 보임
- 해결: 모바일에선 필터를 `<details>` 접이식으로, 또는 상단 고정 필터 칩만 노출

---

## 🟡 MEDIUM

### F. 푸터 사업자 정보 긴 줄
- 모바일에서 "(주)도깨비 | 대표자: 홍길동 | 서울특별시 강남구..." 한 줄이 너무 길어
  줄바꿈은 되지만 가독성 낮음

### G. 관리자 상단바 모바일에서 로고 외 내비게이션 힌트 없음
- 로고(홈으로) + storefront(쇼핑몰) + 알림벨 + UserMenu 만 보이고 "어느 admin 페이지에
  있는지" 힌트 없음
- 개선: 모바일에서 현재 페이지명을 헤더 텍스트로 표시

---

## ⚪ INFO (dev 환경 영향, production 검증 필요)

- **BottomNav "홈" 아이콘에 "N" 표기**: Next.js dev tools 오버레이. production 배포분에서
  자동 제거됨.
- **상품 이미지가 placeholder 회색 박스**: dev 환경에서 외부 CDN
  (`lh3.googleusercontent.com`, `images.pexels.com`) 로딩이 느리거나 blocked.
  production(`dokkaebi-delta.vercel.app`) 에서 재확인 필요.

---

## ✅ 정상 동작 확인된 페이지

| 페이지 | 모바일 | 태블릿 | 비고 |
|---|---|---|---|
| `/login` | ✅ | ✅ | 폼 정렬 깔끔 |
| `/signup` | ✅ | ✅ | |
| `/mypage` | ✅ | ✅ | 프로필 카드·KPI 카드 OK |
| `/orders` | ✅ | ✅ | 주문 카드 레이아웃 좋음 |
| `/admin/policy` | ✅ | ✅ | 폼 기반이라 세로 정렬 자연스러움 |
| 모든 페이지 데스크톱 | ✅ | | |

---

## 스크린샷 소재

`C:\Users\123\AppData\Local\Temp\responsive\` 에 viewport 별 캡처 보관.
재생산: `npm run dev` + `~/.claude/skills/gstack/browse/dist/browse` 로 같은 URL 방문 후
`responsive <prefix>` 또는 `viewport WxH && screenshot --viewport path`.

---

## 권장 수정 순서 (영향도 대비 작업량)

1. **globals.css 에 `word-break: keep-all`** 한 줄 추가 → 이슈 A 의 **6곳 전부** 개선 (5분)
2. **홈 히어로 텍스트 반응형 폰트** — `text-3xl md:text-5xl` (5분)
3. **admin 테이블 `overflow-x-auto` 래퍼** 추가 → B-2 해결 (15분)
4. **admin 모바일 사이드바** 햄버거 drawer — 중간 규모 (30분)
5. **`/products` 필터 모바일 collapse** — 중간 규모 (20분)
6. 나머지는 후속 polish

합쳐서 1~2시간 내 대부분 해결 가능.
