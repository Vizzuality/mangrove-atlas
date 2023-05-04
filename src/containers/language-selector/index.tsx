/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useCallback, useMemo } from 'react';

import { useRouter } from 'next/router';

import cn from 'classnames';

import { LANGUAGES } from 'containers/language-selector/constants';

import Icon from 'components/icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/select';
import { setCookie } from 'helpers/cookies';

import ARROW_DOWN_SVG from 'svgs/ui/arrow-down.svg?sprite';

export const LanguageSelector = () => {
  const router = useRouter();
  const { pathname, asPath, query, locale } = router;

  const uiLanguages = useMemo(
    () => LANGUAGES.sort((x) => (x.locale === locale ? -1 : 0)),
    [locale]
  );

  const currentLan = useMemo(
    () => uiLanguages.find((lan) => lan.locale === locale)?.name,
    [uiLanguages, locale]
  );

  const onChangeLanguage = useCallback(
    (lan: string) => {
      setCookie('NEXT_LOCALE', `${lan}; path=/; max-age=31536000; secure`);
      router
        .push({ pathname, query }, asPath, { locale: lan })
        .catch((e) => console.info('error', e));
    },
    [router, asPath, pathname, query]
  );

  if (uiLanguages.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-0 right-20 w-44">
      <Select onValueChange={(value) => onChangeLanguage(value)}>
        <SelectTrigger className="flex h-3 rounded-b-[20px] bg-brand-800 py-1 px-5 font-sans text-xs font-semibold uppercase text-white">
          <SelectValue placeholder={currentLan} />
        </SelectTrigger>
        <SelectContent className="items-left flex flex-col rounded-b-[20px] bg-white font-semibold uppercase text-black">
          {uiLanguages.map((lan) => (
            <SelectItem
              key={lan.locale}
              className={cn({
                'flex h-11 justify-between px-5 text-xs': true,
                'hover:text-brand-800': lan.locale !== locale,
              })}
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
    </div>
  );
};

export default LanguageSelector;
