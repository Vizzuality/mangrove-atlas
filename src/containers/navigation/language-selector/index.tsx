import { useCallback, useState, MouseEvent, useEffect } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown';
import Icon from 'components/ui/icon';
import Helper from 'containers/help/helper';
import cn from 'lib/classnames';
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
    if (typeof window !== 'undefined' && window.Transifex) {
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
  }, [t]);

  return (
    <Helper
      className={{
        button: 'top-0 -right-4',
        tooltip: 'w-fit-content',
      }}
      tooltipPosition={{ top: -50, left: 0 }}
      message="Choose your preferred language here. There is a choice between English, French and Spanish"
    >
      <DropdownMenu>
        <DropdownMenuTrigger className="h-11">
          <div className="flex items-center space-x-2">
            <Icon
              icon={TRANSLATE_SVG}
              className="h-6 w-6 stroke-white"
              description="language-selection"
            />
            <span className="text-sm text-white">{currentLanguage}</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white">
          {languages?.map((lang: { code: string; name: string }) => (
            <DropdownMenuItem key={lang.code} asChild className="rounded-lg">
              <button
                data-testid={`${lang.code}-button`}
                id={lang.name}
                value={lang.code}
                type="button"
                className="w-full cursor-pointer py-1 px-2 text-left hover:bg-brand-800/20"
                onClick={handleChange}
              >
                <span
                  className={cn({
                    'font-sans text-sm text-black/85': true,
                    'font-semibold text-brand-800': currentLanguage === lang.name,
                  })}
                >
                  {lang.name}
                </span>
              </button>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </Helper>
  );
};

export default LanguageSelector;
