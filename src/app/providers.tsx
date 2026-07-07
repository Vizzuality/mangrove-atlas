'use client';

import { useState } from 'react';

import { MapProvider } from 'react-map-gl';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { SessionSync } from '@/components/session-sync';
import { MediaContextProvider } from 'components/media-query';
import { Toaster } from 'components/ui/toast';
import { TooltipProvider } from 'components/ui/tooltip';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            retry: false,
          },
        },
      })
  );

  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <MediaContextProvider disableDynamicMediaQueries>
          <MapProvider>
            <TooltipProvider delayDuration={200}>
              <SessionProvider>
                <SessionSync />
                {children}
              </SessionProvider>
            </TooltipProvider>
          </MapProvider>
          <Toaster position="top-right" />
        </MediaContextProvider>
      </QueryClientProvider>
    </NuqsAdapter>
  );
}
