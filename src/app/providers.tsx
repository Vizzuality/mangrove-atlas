'use client';

import { useEffect, useState } from 'react';

import { MapProvider } from 'react-map-gl';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { tx, PseudoTranslationPolicy } from '@transifex/native';
import { TXProvider } from '@transifex/react';
import { SessionProvider } from 'next-auth/react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

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

  useEffect(() => {
    tx.init({
      token: process.env.NEXT_PUBLIC_TRANSIFEX_API_KEY,
      ...(process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
        ? { missingPolicy: new PseudoTranslationPolicy() }
        : {}),
    });
  }, []);

  return (
    <TXProvider token={process.env.NEXT_PUBLIC_TRANSIFEX_API_KEY}>
      <NuqsAdapter>
        <QueryClientProvider client={queryClient}>
          <MediaContextProvider disableDynamicMediaQueries>
            <MapProvider>
              <TooltipProvider delayDuration={200}>
                <SessionProvider>{children}</SessionProvider>
              </TooltipProvider>
            </MapProvider>
            <Toaster position="top-right" />
          </MediaContextProvider>
        </QueryClientProvider>
      </NuqsAdapter>
    </TXProvider>
  );
}
