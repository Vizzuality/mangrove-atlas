import { useCallback, useState, MouseEvent, useEffect } from 'react';

import cn from '@/lib/classnames';

import Helper from '@/containers/help/helper';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';

import { LuChevronDown, LuLanguages } from 'react-icons/lu';

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
        button: '-right-4 top-0',
        tooltip: 'w-fit-content max-w-[400px]',
      }}
      tooltipPosition={{ top: -50, left: 0 }}
      message="Select your preferred language here. There is a choice between English, French, and Spanish. More languages coming soon."
    >
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            'flex items-center space-x-2 whitespace-nowrap font-semibold',
            THEME[theme],
            className
          )}
        >
          <LuLanguages className="h-5 w-5 shrink-0" />
          <span className="text-sm">{currentLanguage}</span>
          {hasArrow && <LuChevronDown className="h-4 w-4" />}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white">
          {languages?.map((lang: { code: string; name: string }) => (
            <DropdownMenuItem key={lang.code} asChild className="rounded-lg">
              <button
                data-testid={`${lang.code}-button`}
                id={lang.name}
                value={lang.code}
                type="button"
                className="w-full cursor-pointer px-2 py-1 text-left hover:bg-brand-800/20"
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
