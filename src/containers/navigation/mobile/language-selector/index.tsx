import { MouseEvent, useCallback, useEffect, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown';
import Icon from 'components/ui/icon';

import TRANSLATE_SVG from 'svgs/tools-bar/translate.svg?sprite';

interface Transifex {
  live: {
    detectLanguage: () => string;
    getAllLanguages: () => { code: string; name: string }[];
    translateTo: (string) => string;
    init: () => void;
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
      if (t?.live) {
        t.live?.init();
        const locale = t?.live.detectLanguage();
        const languages = t.live.getAllLanguages();
        const defaultLanguage = languages?.find((lang) => lang.code === locale)?.name;
        setCurrentLanguage(defaultLanguage);
        setLanguages(languages);
      }
    }
  }, [t, languages]);

  return (
    <div className="flex h-full flex-col items-center">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex h-full flex-col items-center space-y-1 pt-1 text-white">
            <Icon
              icon={TRANSLATE_SVG}
              className="h-8 w-8 stroke-white"
              description="language-selection"
            />
            <span className="text-xxs text-white">{currentLanguage}</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {languages?.map((lang: { code: string; name: string }) => (
            <DropdownMenuItem key={lang.code} asChild>
              <button
                data-testid={`${lang.code}-button`}
                id={lang.name}
                value={lang.code}
                type="button"
                className="hover:bg-white"
                onClick={handleChange}
              >
                <span className="hover:text-brand-800">{lang.name}</span>
              </button>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSelector;
