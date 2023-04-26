/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useCallback, useMemo } from 'react';

import { languageAtom } from 'store/language';

import cn from 'classnames';
// import { setCookie } from 'helpers/cookies';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { LANGUAGES } from 'containers/language-selector/constants';

import Icon from 'components/icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/select';

import ARROW_DOWN_SVG from 'svgs/ui/arrow-down.svg?sprite';

export const LanguageSelector = () => {
  const language = useRecoilValue(languageAtom);
  const setLanguage = useSetRecoilState(languageAtom);

  const uiLanguages = useMemo(() => LANGUAGES.sort((a, b) => a.name.localeCompare(b.name)), []);

  const currentLan = useMemo(
    () => uiLanguages.find((lan) => lan.locale === language).name,
    [uiLanguages, language]
  );

  const onChangeLanguage = useCallback(
    (lan: string) => {
      setLanguage(lan);

      // Navigate to the same route but with a different locale
      // NOTE: Transifex listens to `router.locale` in `pages/_app.tsx`
      // router.push({ pathname, query }, asPath, { locale: newLanguageCode });

      // Set a cookie for 1 year so that the user preference is kept
      // setCookie('NEXT_LOCALE', `${newLanguageCode}; path=/; max-age=31536000; secure`);
    },
    [setLanguage]
  );

  if (uiLanguages.length === 0) {
    return null;
  }

  return (
    <Select onValueChange={(value) => onChangeLanguage(value)}>
      <SelectTrigger className="absolute -top-px right-10 flex w-40 rounded-b-[20px] bg-brand-800 px-5 font-sans text-xs font-semibold uppercase text-white">
        <SelectValue placeholder={currentLan} />
      </SelectTrigger>
      <SelectContent className="items-left flex flex-col rounded-b-[20px] bg-white font-semibold uppercase text-black">
        {uiLanguages.map((lan) => (
          <SelectItem
            key={lan.locale}
            className="flex h-11 justify-between px-5 text-xs"
            value={lan.locale}
          >
            {lan.name}
          </SelectItem>
        ))}

        <Icon
          icon={ARROW_DOWN_SVG}
          className={cn({
            'absolute top-5 right-5 h-2 w-3 rotate-180 stroke-black stroke-2': true,
          })}
        />
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
