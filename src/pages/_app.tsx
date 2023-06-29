import { useCallback, useEffect, useState } from 'react';

import { MapProvider } from 'react-map-gl';

import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import { GAPage } from 'lib/analytics/ga';
import { Deserialize, RecoilURLSyncNext, Serialize } from 'lib/recoil';
import RecoilDevTools from 'lib/recoil/devtools';

import { Open_Sans } from '@next/font/google';
import { QueryClient, QueryClientProvider, Hydrate } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';

import { MediaContextProvider } from 'components/media-query';

import 'styles/globals.css';
import 'styles/mapbox.css';

import { TooltipProvider } from 'components/tooltip';

const OpenSansFont = Open_Sans({
  weight: ['300', '400', '600', '700'],
  style: ['normal'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'block',
});

type PageProps = {
  dehydratedState: unknown;
};

const MyApp = ({ Component, pageProps }: AppProps<PageProps>) => {
  const router = useRouter();

  // Never ever instantiate the client outside a component, hook or callback as it can leak data
  // between users
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const handleRouteChangeCompleted = useCallback((url: string) => {
    GAPage(url);
  }, []);

  const serialize: Serialize = useCallback((x) => {
    return x === undefined ? '' : JSON.stringify(x);
  }, []);

  const deserialize: Deserialize = useCallback((x: string): unknown => {
    return JSON.parse(x);
  }, []);

  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChangeCompleted);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeCompleted);
    };
  }, [router.events, handleRouteChangeCompleted]);

  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-sans: ${OpenSansFont.style.fontFamily};
          }
        `}
      </style>
      <RecoilRoot>
        <RecoilURLSyncNext
          location={{ part: 'queryParams' }}
          serialize={serialize}
          deserialize={deserialize}
        >
          {process.env.NODE_ENV === 'development' && <RecoilDevTools />}
          <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
              <MediaContextProvider disableDynamicMediaQueries>
                <MapProvider>
                  <TooltipProvider delayDuration={200}>
                    <Component {...pageProps} />
                  </TooltipProvider>
                </MapProvider>
              </MediaContextProvider>
            </Hydrate>
          </QueryClientProvider>
        </RecoilURLSyncNext>
      </RecoilRoot>
    </>
  );
};

export default MyApp;
