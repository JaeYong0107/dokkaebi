"use client";

import { useLoginPromptStore } from "@/shared/store/use-login-prompt-store";

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

type ApiFetchInit = RequestInit & {
  /** true 로 주면 401 이어도 로그인 모달을 띄우지 않는다 (세션 체크용 등). */
  silent401?: boolean;
};

/**
 * 클라이언트에서 자체 /api/* 호출에 공통으로 쓰는 fetch 래퍼.
 *
 * - Content-Type: application/json 자동 세팅 (body 가 문자열일 때)
 * - 401 응답이면 전역 `useLoginPromptStore` 를 통해 로그인 유도 모달을 띄운다
 * - 2xx 가 아니면 ApiError 를 throw (호출부에서 try/catch 가능)
 * - body 가 JSON 이면 파싱해서 반환, 아니면 Response 그대로 반환
 */
export async function apiFetch<T = unknown>(
  input: string,
  init?: ApiFetchInit
): Promise<T> {
  const { silent401, headers, body, ...rest } = init ?? {};

  const finalHeaders = new Headers(headers);
  if (
    body !== undefined &&
    body !== null &&
    typeof body === "string" &&
    !finalHeaders.has("Content-Type")
  ) {
    finalHeaders.set("Content-Type", "application/json");
  }

  const res = await fetch(input, {
    ...rest,
    headers: finalHeaders,
    body
  });

  if (res.status === 401 && !silent401) {
    const parsed = await safeJson(res);
    useLoginPromptStore
      .getState()
      .prompt(extractMessage(parsed) ?? undefined);
    throw new ApiError(401, extractMessage(parsed) ?? "로그인이 필요합니다.", parsed);
  }

  if (!res.ok) {
    const parsed = await safeJson(res);
    throw new ApiError(
      res.status,
      extractMessage(parsed) ?? `요청 실패 (${res.status})`,
      parsed
    );
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }
  return (await res.text()) as unknown as T;
}

async function safeJson(res: Response): Promise<unknown> {
  try {
    return await res.clone().json();
  } catch {
    return null;
  }
}

function extractMessage(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (typeof b.message === "string") return b.message;
  if (
    b.error &&
    typeof b.error === "object" &&
    typeof (b.error as Record<string, unknown>).message === "string"
  ) {
    return (b.error as Record<string, unknown>).message as string;
  }
  return null;
}
