'use client';

import Script from 'next/script';

import { useCookieConsent } from '@/store/cookie-consent';

// Google Analytics (gtag.js). Only injected once the visitor has accepted
// non-essential cookies: GA sets `_ga*` cookies as soon as the script runs, so
// gating the <Script> tags (not just the events) is what makes "reject" real.
const GoogleAnalytics = ({ gaId }: { gaId?: string }) => {
  const { consent } = useCookieConsent();

  if (!gaId || consent !== 'accepted') return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics;
