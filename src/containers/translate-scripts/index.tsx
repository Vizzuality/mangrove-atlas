import React from 'react';

import Script from 'next/script';
const TranslateScripts = () => {
  return (
    <>
      <Script id="transifex">
        {`
    window.liveSettings = {
      api_key: "%NEXT_PUBLIC_TRANSIFEX_API_KEY%",
      detectlang: true,
      autocollect: true,
      dynamic: true,
      manual_init: false,
      translate_urls: false
    }`}
      </Script>
      <Script id="transifex-live" src="//cdn.transifex.com/live.js" />
      <Script id="transifex-load" strategy="lazyOnload">
        {`
      Transifex.live.onFetchLanguages(function (languages) {
        Transifex.live.onTranslatePage(function (language_code) {
          console.log(language_code);
        });
      })
    `}
      </Script>
    </>
  );
};

export default TranslateScripts;
