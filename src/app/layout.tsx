import { Open_Sans, Inter } from 'next/font/google';
import Script from 'next/script';

import type { Metadata, Viewport } from 'next';

import 'styles/globals.css';
import 'styles/mapbox.css';
import 'mapbox-gl/dist/mapbox-gl.css';

import { MediaStylesTag } from './media-styles';
import Providers from './providers';
import TransifexLiveInit from './transifex-live-init';

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
  // `template` lets each route name itself while keeping the site name in the
  // browser tab, history and screen-reader page title. Without it, every route
  // — signup, password reset, 404, each country — announced the same string.
  title: {
    default: 'Global Mangrove Watch',
    template: '%s | Global Mangrove Watch',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
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
        {/*
          Transifex Live snippet. Rendered as plain server-side <script> tags in
          <head> (not next/script) so it lands in the raw SSR HTML — Transifex's
          verification crawler doesn't run JS, and afterInteractive injection is
          invisible to it, which blocks "Publish to production". Settings must be
          defined before live.js loads.

          `manual_init: true` because Live translates by mutating the DOM: left to
          auto-init it rewrites the server HTML while React is still hydrating,
          which surfaces as a hydration text mismatch (React #418) and makes React
          throw away and re-render the tree. <TransifexLiveInit /> calls
          `Transifex.live.init()` from an effect instead, i.e. after hydration.
        */}
        <script
          id="transifex-live-settings"
          dangerouslySetInnerHTML={{
            __html: `window.liveSettings = { api_key: '${process.env.NEXT_PUBLIC_TRANSIFEX_API_KEY}', detectlang: true, autocollect: true, dynamic: true, manual_init: true, translate_urls: false };`,
          }}
        />
        <script id="transifex-live" src="//cdn.transifex.com/live.js" async />
      </head>
      <body className="bg-brand-400 print:bg-white">
        <a
          href="#main-content"
          className="focus:bg-brand-800 sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-100 focus:rounded focus:px-3 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
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
        <TransifexLiveInit />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
