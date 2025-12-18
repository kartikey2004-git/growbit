"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {  useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // queryClient intialisation for react query to manage server state

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

// power of react query - make applications so much optimised

