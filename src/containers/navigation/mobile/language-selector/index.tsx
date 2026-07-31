import { MouseEvent, useCallback } from 'react';

import { useTransifexLive } from 'hooks/use-transifex-live';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import LANGUAGE_SVG from '@/svgs/sidebar/language';

const LanguageSelector = () => {
  const { languages, currentLanguage, translateTo } = useTransifexLive();

  const handleChange = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => translateTo(e.currentTarget.value),
    [translateTo]
  );

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger
            aria-label="Language"
            className="flex w-14 cursor-pointer flex-col items-center justify-center space-y-1 text-white transition-opacity hover:opacity-80 focus-visible:opacity-80 focus-visible:outline-none"
          >
            <LANGUAGE_SVG className="h-8 w-8 fill-current text-white" role="img" title="Language" />
            <span className="text-xxs font-sans leading-none text-white">
              {currentLanguage?.name}
            </span>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="top">Change language</TooltipContent>
      </Tooltip>
      <DropdownMenuContent>
        {languages.map((lang) => (
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
  );
};

export default LanguageSelector;
