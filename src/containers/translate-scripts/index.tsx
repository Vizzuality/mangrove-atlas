import React from 'react';

import Script from 'next/script';

const TranslateScripts = () => {
  return (
    <>
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
    </>
  );
};

export default TranslateScripts;
