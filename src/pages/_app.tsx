import { useCallback, useEffect, useState } from 'react';

import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import { GAPage } from 'lib/analytics/ga';

import { Open_Sans } from '@next/font/google';
import { QueryClient, QueryClientProvider, Hydrate } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';
import { RecoilURLSyncJSONNext } from 'recoil-sync-next';

import { MediaContextProvider } from 'components/media-query';

import 'styles/globals.css';
import 'styles/mapbox.css';

import { MapProvider } from 'react-map-gl';

const OpenSansFont = Open_Sans({
  weight: ['300', '700'],
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
  const [queryClient] = useState(() => new QueryClient());

  const handleRouteChangeCompleted = useCallback((url: string) => {
    GAPage(url);
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
        <RecoilURLSyncJSONNext location={{ part: 'queryParams' }}>
          <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
              <MediaContextProvider disableDynamicMediaQueries>
                <MapProvider>
                  <Component {...pageProps} />
                </MapProvider>
              </MediaContextProvider>
            </Hydrate>
          </QueryClientProvider>
        </RecoilURLSyncJSONNext>
      </RecoilRoot>
    </>
  );
};

export default MyApp;
