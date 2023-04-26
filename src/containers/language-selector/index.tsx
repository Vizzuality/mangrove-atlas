import { useCallback, useMemo } from 'react';

import { useRouter } from 'next/router';

// import { setCookie } from 'helpers/cookies';

import { LANGUAGES } from 'containers/language-selector/constants';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/select';

export const LanguageSelector = () => {
  const router = useRouter();

  const uiLanguages = useMemo(() => LANGUAGES.sort((a, b) => a.name.localeCompare(b.name)), []);

  const onChangeLanguage = useCallback(
    (newLanguageCode) => {
      const { pathname, query, asPath } = router;

      //!TODO: meterlo en url

      // Navigate to the same route but with a different locale
      // NOTE: Transifex listens to `router.locale` in `pages/_app.tsx`
      router.push({ pathname, query }, asPath, { locale: newLanguageCode });

      // Set a cookie for 1 year so that the user preference is kept
      // setCookie('NEXT_LOCALE', `${newLanguageCode}; path=/; max-age=31536000; secure`);
    },
    [router]
  );

  if (uiLanguages.length === 0) {
    return null;
  }

  return (
    <Select>
      <SelectTrigger className="absolute -top-px right-10 flex w-44 rounded-b-[20px] bg-brand-800 px-5 font-sans text-xs font-semibold uppercase text-white">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent className="items-left flex flex-col rounded-b-[20px] bg-white font-semibold uppercase text-black">
        {uiLanguages.map((language) => (
          <SelectItem
            key={language.locale}
            className="flex h-11 px-5 text-xs"
            value={language.locale}
            onClick={() => onChangeLanguage(language.locale)}
          >
            {language.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
