import { QueryClient } from '@tanstack/react-query';

export function getQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // server-side defaults (client defaults live in providers)
        staleTime: 0,
      },
    },
  });
}
