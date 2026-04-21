# dokkaebi 배포 가이드 (Vercel + Neon)

MVP 배포용 체크리스트와 단계별 가이드. 다른 조합(Railway/Fly.io 등) 도
방법만 다르고 원리는 동일.

## 전체 흐름

```
1. Neon PostgreSQL 프로젝트 생성 → DATABASE_URL 확보
2. NEXTAUTH_SECRET 강력한 랜덤값 생성
3. Vercel 프로젝트 생성 → GitHub repo 연결
4. Vercel 환경변수 입력
5. Vercel Build Command 를 `npm run vercel-build` 로 변경 (또는 기본 유지하고 package.json 에서 해결)
6. 배포 트리거 → 마이그레이션 자동 적용
7. 관리자 계정 1개 수동 생성
```

---

## 1. Neon Postgres 세팅

**왜 Neon?** Serverless Postgres 무료 tier 3GB, Prisma 완벽 호환,
Vercel Marketplace 1클릭 통합.

**단계**
1. https://neon.tech → GitHub 로 가입
2. "Create Project" → Region 은 한국 사용자면 `AWS ap-northeast-1 (Tokyo)` 권장
3. Dashboard → Connection Details → **"Pooled connection"** 선택
4. `postgresql://...@...neon.tech/...` 형식 **connection string 복사**
   - 끝에 `?sslmode=require` 가 붙어 있어야 함

---

## 2. NEXTAUTH_SECRET 생성

로컬 터미널에서:
```bash
openssl rand -base64 32
```

출력값을 복사. (예: `sX9v/K4F...=`) 노출 금지.

---

## 3. Vercel 프로젝트 생성

1. https://vercel.com → GitHub 로 가입
2. "Add New Project" → 리포지토리 `JaeYong0107/dokkaebi` Import
3. **Framework Preset**: Next.js (자동 인식)
4. **Build and Output Settings** 은 건드리지 말고 그대로 통과
5. "Environment Variables" 섹션에서 아래 값 입력:

| 이름 | 값 | 비고 |
|---|---|---|
| `DATABASE_URL` | Neon pooled connection string | 마이그레이션 포함 모두 여기서 수행 |
| `NEXTAUTH_SECRET` | 2번에서 생성한 값 | |
| `NEXTAUTH_URL` | `https://<vercel-domain>.vercel.app` | 커스텀 도메인 쓰면 그걸로 |
| `PAYMENT_PROVIDER` | `mock` | 실 PG 붙이기 전까지 |
| `PAYMENT_API_KEY` | `mock-key` | |
| `DEFAULT_SHIPPING_FEE` | `3000` | |
| `FREE_SHIPPING_THRESHOLD` | `50000` | |
| `MIN_ORDER_NORMAL` | `10000` | |
| `MIN_ORDER_BUSINESS` | `50000` | |

**`SEED_DEV_DATA` 는 넣지 않는다.** 프로덕션에 테스트 계정을
주입하지 않기 위함.

6. "Deploy" 클릭

---

## 4. Build Command 확인

Vercel Project → Settings → Build & Development Settings:

- **Build Command**: `npm run vercel-build` 로 덮어쓰기 (Override 토글 켜고)
  - 이 스크립트는 `prisma migrate deploy && next build` — 배포 때마다
    스키마 변경을 자동 적용

기존 `"build": "next build"` 는 로컬 개발 편의를 위해 유지.

---

## 5. 첫 배포 확인

배포가 완료되면 Vercel 이 URL 을 줌. 방문하여:

- [ ] `/` 홈페이지 200
- [ ] `/api/health` → `{"ok":true,...}`
- [ ] `/login` 렌더 OK
- [ ] `/signup` 로 계정 하나 만들어 로그인까지 되는지

로그인 후 `/api/auth/session` 에서 `role: "CUSTOMER"` 가 찍히면
정상.

---

## 6. 관리자 계정 생성 (수동)

프로덕션엔 seed 자동 돌지 않으므로 관리자 1명은 직접 만든다.

**방법 A — 회원가입 후 승격**
1. 일반 회원가입으로 내 이메일 가입
2. Neon Dashboard → "SQL Editor" 열기
3. 실행:
   ```sql
   UPDATE "User" SET "role" = 'ADMIN' WHERE "email" = 'me@example.com';
   ```

**방법 B — bcrypt 해시 만들어 직접 INSERT**
```bash
# 로컬에서 비밀번호 해시 생성
node -e 'require("bcryptjs").hash("관리자비밀번호", 10).then(console.log)'
```
나온 해시를 복사해 Neon SQL Editor 에서:
```sql
INSERT INTO "User" ("id", "email", "passwordHash", "name", "role", "customerType")
VALUES (gen_random_uuid()::text, 'admin@yourdomain.com', '<위 해시>', 'Admin', 'ADMIN', 'NORMAL');
```

---

## 7. 이후 업데이트

```bash
git push origin main
```
→ Vercel 이 자동 빌드 + `prisma migrate deploy` + 배포.

스키마 변경이 필요한 경우 로컬에서:
```bash
npm run db:migrate -- --name 변경_설명
git add prisma/migrations
git commit -m "feat(prisma): ..."
git push
```
→ 프로덕션 DB 에도 자동 적용.

---

## 트러블슈팅

- **`useSearchParams() should be wrapped in a suspense boundary`**
  → 이미 `/login`, `/reorder` 수정됨. 새 클라이언트 컴포넌트에서 쓸 때 `<Suspense>` 감싸기
- **`Cannot find module '.prisma/client'`**
  → `postinstall: prisma generate` 가 돌았는지 Vercel Build Log 확인
- **`Migration cannot be applied...`**
  → Neon 의 Pooled 와 Direct URL 구분. Prisma `migrate deploy` 는 Direct URL 쓰는 게 안전.
  Neon Dashboard 에서 `DIRECT_URL` 도 꺼내서 schema 의 `directUrl` 옵션으로 지정하는 패턴 도입 고려.
- **한국어 환경변수 인식 안 됨**
  → 모든 env key 는 영문 대문자+언더스코어 유지.
