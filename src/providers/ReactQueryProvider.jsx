'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';

/**
 * React Query Provider for Next.js App Router (Client Component).
 * Ensures a single QueryClient instance exists per application lifecycle in-browser.
 */
export const ReactQueryProvider = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Standard configurations for Enterprise data
            staleTime: 1000 * 60 * 5, // 5 minutes fresh time
            retry: 1, // Only retry once automatically
            refetchOnWindowFocus: false, // Avoid excessive re-reloads
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default ReactQueryProvider;
