import React, { useEffect } from 'react';

import Script from 'next/script';

import { printModeState } from 'store/print-mode';

import { useRecoilValue } from 'recoil';

const TranslateScripts = () => {
  const isPrintingMode = useRecoilValue(printModeState);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const langSelector = document.querySelector('#tx-live-lang-container');

      if (isPrintingMode) {
        langSelector?.classList.add('hidden-langselector');
      }

      if (!isPrintingMode) {
        langSelector?.classList.remove('hidden-langselector');
      }
    }
  }, [isPrintingMode]);

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
