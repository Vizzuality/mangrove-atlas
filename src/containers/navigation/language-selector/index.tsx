import { useCallback, useState, MouseEvent } from 'react';

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
  const Transifex = window?.Transifex as Transifex;
  const locale = Transifex.live.detectLanguage();
  const languages = Transifex.live.getAllLanguages() satisfies { code: string; name: string }[];
  const defaultLanguage = languages?.find((lang) => lang.code === locale).name;

  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);

  const handleChange = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      Transifex.live.translateTo(e.currentTarget.value);
      setCurrentLanguage(e.currentTarget.id);
    },
    [Transifex]
  );

  return (
    <Helper
      className={{
        button: '-bottom-10 -right-1.5',
        tooltip: 'w-fit-content',
      }}
      tooltipPosition={{ top: -10, left: -60 }}
      message="Choose your preferred language here. There is a choice between English, French and Spanish"
    >
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex items-center space-x-2">
            <Icon
              icon={TRANSLATE_SVG}
              className="h-6 w-6 stroke-white"
              description="language-selection"
            />
            <span className="text-sm text-white">{currentLanguage}</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-brand-800">
          {languages.map((lang: { code: string; name: string }) => (
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
        </DropdownMenuContent>
      </DropdownMenu>
    </Helper>
  );
};

export default LanguageSelector;
