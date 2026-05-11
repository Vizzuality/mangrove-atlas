import { useCallback, useState, MouseEvent, useEffect } from 'react';

import cn from '@/lib/classnames';

import Helper from '@/containers/help/helper';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';

import LANGUAGES_ICON from '@/svgs/tools-bar/languages';
import CHEVRON_ICON from '@/svgs/ui/chevron';

interface Transifex {
  live: {
    detectLanguage: () => string;
    getAllLanguages: () => { code: string; name: string }[];
    translateTo: (string) => string;
    init: () => void;
  };
}

type LanguageSelectorProps = {
  theme?: 'light' | 'dark';
  hasArrow?: boolean;
  className?: string;
};

const THEME = {
  light: 'text-white',
  dark: 'text-brand-800',
};

const LanguageSelector = ({
  theme = 'light',
  hasArrow = false,
  className,
}: LanguageSelectorProps) => {
  const [languages, setLanguages] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState('');

  const handleChange = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    const Transifex = window.Transifex as Transifex;
    Transifex?.live.translateTo(e.currentTarget.value);
    setCurrentLanguage(e.currentTarget.id);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      if (typeof window !== 'undefined' && window.Transifex) {
        const tx = window.Transifex as Transifex;
        if (tx?.live) {
          tx.live?.init();
          const locale = tx?.live.detectLanguage();
          const langs = tx.live.getAllLanguages();
          const defaultLanguage = langs?.find((lang) => lang.code === locale)?.name;
          setCurrentLanguage(defaultLanguage);
          setLanguages(langs);
        }
      }
    }, 0);
    return () => clearTimeout(id);
  }, []);

  return (
    <Helper
      className={{
        button: 'top-0 -right-4',
        tooltip: 'w-fit-content max-w-[400px]',
      }}
      tooltipPosition={{ top: -50, left: 0 }}
      message="Select your preferred language here. There is a choice between English, French, and Spanish. More languages coming soon."
    >
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            'flex items-center space-x-2 font-semibold whitespace-nowrap',
            THEME[theme],
            className
          )}
        >
          <LANGUAGES_ICON className="h-6 w-6 shrink-0" />
          <span className="text-sm">{currentLanguage}</span>
          {hasArrow && <CHEVRON_ICON role="img" className="h-4 w-4" />}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white">
          {languages?.map((lang: { code: string; name: string }) => (
            <DropdownMenuItem key={lang.code} asChild className="rounded-lg">
              <button
                data-testid={`${lang.code}-button`}
                id={lang.name}
                value={lang.code}
                type="button"
                className="hover:bg-brand-800/20 w-full cursor-pointer px-2 py-1 text-left"
                onClick={handleChange}
              >
                <span
                  className={cn({
                    'font-sans text-sm text-black/85': true,
                    'text-brand-800 font-semibold': currentLanguage === lang.name,
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
