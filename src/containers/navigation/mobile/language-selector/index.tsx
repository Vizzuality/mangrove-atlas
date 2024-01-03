import { useCallback, useState, MouseEvent, useEffect } from 'react';

import Helper from 'containers/guide/helper';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/dropdown';
import Icon from 'components/icon';

import TRANSLATE_SVG from 'svgs/tools-bar/translate.svg?sprite';

interface Transifex {
  live: {
    detectLanguage: () => string;
    getAllLanguages: () => { code: string; name: string }[];
    translateTo: (string) => string;
  };
}

const LanguageSelector = () => {
  const t = typeof window !== 'undefined' && (window.Transifex as Transifex);

  const handleChange = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    const Transifex = window.Transifex as Transifex;
    Transifex?.live.translateTo(e.currentTarget.value);
    setCurrentLanguage(e.currentTarget.id);
  }, []);

  const [languages, setLanguages] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const t = window.Transifex as Transifex;
      const locale = t?.live.detectLanguage();
      const languages = t?.live.getAllLanguages();
      const defaultLanguage = languages?.find((lang) => lang.code === locale)?.name;
      setCurrentLanguage(defaultLanguage);
      setLanguages(languages);
    }
  }, [t, languages]);

  return (
    <div className="flex flex-col items-center pt-2">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex flex-col items-center space-y-2">
            <Icon
              icon={TRANSLATE_SVG}
              className="h-6 w-6 stroke-white"
              description="language-selection"
            />
            <span className="text-xxs text-white">{currentLanguage}</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-brand-800">
          {languages?.map((lang: { code: string; name: string }) => (
            <DropdownMenuItem key={lang.code} asChild>
              <button
                data-testid={`${lang.code}-button`}
                id={lang.name}
                value={lang.code}
                type="button"
                className="cursor-pointer hover:bg-white"
                onClick={handleChange}
              >
                <span className="font-sans text-sm text-white hover:text-brand-800">
                  {lang.name}
                </span>
              </button>
            </DropdownMenuItem>
          ))}
          <div className="absolute right-0 z-[1000] h-10 w-10">
            <Helper
              className={{
                button: 'top-1 right-[100px]',
                tooltip: 'w-fit-content',
              }}
              tooltipPosition={{ top: -40, left: 260 }}
              message="Choose your preferred language here. There is a choice between English, French and Spanish"
            ></Helper>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSelector;
