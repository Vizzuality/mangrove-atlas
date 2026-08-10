'use client';

import { useState } from 'react';

import { MapProvider } from 'react-map-gl';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'motion/react';
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
    /*
     * `reducedMotion="user"` makes every motion/react component honour the
     * OS-level prefers-reduced-motion setting: transform and layout animations
     * are disabled while opacity animations are kept, which is the behaviour
     * WCAG 2.3.3 asks for. Applying it here covers the widget collapse, the
     * widgets column, the legend and the deck in one place, instead of a
     * motion-safe: variant on each of them.
     */
    <MotionConfig reducedMotion="user">
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
    </MotionConfig>
  );
}
