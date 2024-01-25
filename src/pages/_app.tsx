import { useCallback, useEffect, useState } from 'react';

import { MapProvider } from 'react-map-gl';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';

import { GAPage } from 'lib/analytics/ga';
import { Deserialize, RecoilURLSyncNext, Serialize } from 'lib/recoil';
import RecoilDevTools from 'lib/recoil/devtools';

import { Open_Sans } from '@next/font/google';
import { QueryClient, QueryClientProvider, Hydrate } from '@tanstack/react-query';
import { tx, PseudoTranslationPolicy } from '@transifex/native';
import { TXProvider } from '@transifex/react';
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

  const serialize: Serialize = useCallback((x) => {
    return x === undefined ? '' : JSON.stringify(x);
  }, []);

  const deserialize: Deserialize = useCallback((x: string): unknown => {
    return JSON.parse(x);
  }, []);

  const handleRouteChangeCompleted = useCallback((url: string) => {
    GAPage(url);
  }, []);

  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChangeCompleted);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeCompleted);
    };
  }, [router.events, handleRouteChangeCompleted]);

  useEffect(() => {
    tx.init({
      token: process.env.NEXT_PUBLIC_TRANSIFEX_API_KEY,
      ...(process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
        ? { missingPolicy: new PseudoTranslationPolicy() }
        : {}),
    });
  }, []);
  return (
    <>
      <Head>
        <meta name="viewport" content="width=1024" />
      </Head>
      <style jsx global>
        {`
          :root {
            --font-sans: ${OpenSansFont.style.fontFamily};
          }
        `}
      </style>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <Script
        id="transifex-live-settings"
        dangerouslySetInnerHTML={{
          __html: `
          window.liveSettings = {
            api_key: '${process.env.NEXT_PUBLIC_TRANSIFEX_API_KEY}',
            detectlang: true,
            autocollect: true,
            dynamic: true,
            manual_init: false,
            translate_urls: false,
          }`,
        }}
      />
      <Script id="transifex-live" src="//cdn.transifex.com/live.js" />
      <RecoilRoot>
        <TXProvider>
          <RecoilURLSyncNext
            location={{ part: 'queryParams' }}
            serialize={serialize}
            deserialize={deserialize}
          >
            {process.env.NEXT_PUBLIC_VERCEL_ENV === 'development' && <RecoilDevTools />}
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
        </TXProvider>
      </RecoilRoot>
    </>
  );
};

export default MyApp;
