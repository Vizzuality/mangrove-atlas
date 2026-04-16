import { MouseEvent, useCallback, useEffect, useState } from 'react';

import { LuLanguages } from 'react-icons/lu';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';

const LuLanguagesIcon = LuLanguages as unknown as (p: React.SVGProps<SVGSVGElement>) => JSX.Element;

interface Transifex {
  live: {
    detectLanguage: () => string;
    getAllLanguages: () => { code: string; name: string }[];
    translateTo: (string) => string;
    init: () => void;
  };
}

const LanguageSelector = () => {
  const [languages, setLanguages] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState('');

  const handleChange = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    const Transifex = window.Transifex as Transifex;
    Transifex?.live.translateTo(e.currentTarget.value);
    setCurrentLanguage(e.currentTarget.id);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      if (typeof window !== 'undefined') {
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
    <div className="flex h-full flex-col items-center">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-full flex-col items-center space-y-1 pt-1 text-white">
          <LuLanguagesIcon className="h-8 w-8" />
          <span className="text-xxs">{currentLanguage}</span>
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
