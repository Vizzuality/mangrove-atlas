import { useCallback, useEffect, useState } from 'react';

import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import { GAPage } from 'lib/analytics/ga';

import { QueryClient, QueryClientProvider, Hydrate } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';

import { MediaContextProvider } from 'components/media-query';

import 'styles/globals.css';
import 'styles/mapbox.css';

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
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <MediaContextProvider disableDynamicMediaQueries>
            <Component {...pageProps} />
          </MediaContextProvider>
        </Hydrate>
      </QueryClientProvider>
    </RecoilRoot>
  );
};

export default MyApp;
