import { headers } from "next/headers";
import { getServerOrigin } from "./server-origin";

/**
 * 서버 컴포넌트에서 자기 자신(`/api/*`)을 호출할 때 세션 쿠키를 함께 전달한다.
 * Next.js App Router 의 `fetch` 는 기본적으로 쿠키를 자동 전파하지 않으므로
 * `/api/mypage`, `/api/orders` 등 로그인 필요한 라우트 호출 시 401 이 된다.
 * 이 헬퍼는 쿠키 포워드 + cache:"no-store" 기본값을 묶어서 반복을 줄인다.
 */
export async function serverFetch(
  path: string,
  init?: RequestInit
): Promise<Response> {
  const origin = await getServerOrigin();
  const hdrs = await headers();
  const cookie = hdrs.get("cookie") ?? "";
  return fetch(`${origin}${path}`, {
    cache: "no-store",
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      cookie
    }
  });
}
