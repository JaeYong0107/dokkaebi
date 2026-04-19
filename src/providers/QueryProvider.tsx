"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

type QueryProviderProps = {
  children: React.ReactNode;
};

export function QueryProvider({ children }: Readonly<QueryProviderProps>) {
  // Next.js App Router 환경에서 클라이언트 컴포넌트가 매 렌더 새 인스턴스를 만들지
  // 않도록 useState 로 초기화 한 번만 보장한다.
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000, // 1분간 fresh
            gcTime: 5 * 60_000, // 5분간 보관
            retry: 1,
            refetchOnWindowFocus: false
          },
          mutations: {
            retry: 0
          }
        }
      })
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
