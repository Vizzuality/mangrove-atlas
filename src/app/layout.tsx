import { Open_Sans, Inter } from 'next/font/google';
import Script from 'next/script';

import type { Metadata, Viewport } from 'next';

import 'styles/globals.css';
import 'styles/mapbox.css';
import 'mapbox-gl/dist/mapbox-gl.css';

import { MediaStylesTag } from './media-styles';
import Providers from './providers';

const OpenSansFont = Open_Sans({
  weight: ['300', '400', '600', '700'],
  style: ['normal'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'block',
});

const InterFont = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  fallback: ['system-ui', 'Helvetica Neue', 'Helvetica', 'Arial'],
  weight: ['400', '500'],
  style: ['normal'],
  display: 'block',
});

export const metadata: Metadata = {
  title: 'Global Mangrove Watch',
};

export const viewport: Viewport = {
  width: 1024,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <MediaStylesTag />
        <style
          dangerouslySetInnerHTML={{
            __html: `:root { --font-sans: ${OpenSansFont.style.fontFamily}; --font-inter: ${InterFont.style.fontFamily}; }`,
          }}
        />
      </head>
      <body>
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
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.liveSettings = {
                api_key: '${process.env.NEXT_PUBLIC_TRANSIFEX_API_KEY}',
                detectlang: true,
                autocollect: true,
                dynamic: true,
                manual_init: false,
                translate_urls: false,
              };
            `,
          }}
        />
        <Script id="transifex-live" src="//cdn.transifex.com/live.js" strategy="afterInteractive" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
