import { useState } from 'react';

import { activeGuideAtom } from '@/store/guide';

import { useRecoilState } from 'recoil';
import { useLocalStorage } from 'usehooks-ts';

import Contact from '@/containers/contact';

import CHEVRON_ICON from '@/svgs/ui/chevron';
import HELP_ICON from '@/svgs/tools-bar/help';

import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { SwitchRoot, SwitchThumb, SwitchWrapper } from 'components/ui/switch';

import GuideModalIntro from './modal-intro';

import { trackEvent } from '@/lib/analytics/ga';
import cn from '@/lib/classnames';

type HelpContainerProps = {
  theme?: 'light' | 'dark';
  hasArrow?: boolean;
  className?: string;
};

const THEME = {
  light: 'text-white',
  dark: 'text-brand-800',
};

export const HelpContainer = ({
  theme = 'light',
  hasArrow = false,
  className,
}: HelpContainerProps) => {
  const [guideLocalStorage] = useLocalStorage<boolean>('guideLocalStorage', false);
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useRecoilState(activeGuideAtom);

  const handleClick = () => {
    // Google Analytics tracking
    trackEvent('Help guide', {
      category: 'Menu - help',
      action: 'Toggle',
      label: `Help guide - ${isActive ? 'deactivated' : 'activated'}`,
    });
    setIsActive((prev) => {
      const nextState = !prev;
      setIsOpen(nextState);
      return nextState;
    });
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger
          className={cn('flex cursor-pointer items-center space-x-2', THEME[theme], className)}
        >
          <HELP_ICON className="h-6 w-6" />
          <p className="font-sans text-sm">Help</p>
          {hasArrow && <CHEVRON_ICON role="img" className="h-4 w-4" />}
        </PopoverTrigger>

        <PopoverContent className="shadow-border rounded-2xl p-6 text-sm font-semibold">
          <Contact />
          <div className="flex space-x-2">
            <span>Navigation help</span>

            <SwitchWrapper id="guide-intro" className="h-2 w-4">
              <SwitchRoot
                onClick={handleClick}
                defaultChecked={isActive}
                checked={isActive}
                size="sm"
              >
                <SwitchThumb size="sm" />
              </SwitchRoot>
            </SwitchWrapper>
          </div>
        </PopoverContent>
      </Popover>
      {!guideLocalStorage && isOpen && <GuideModalIntro isOpen={isOpen} setIsOpen={setIsOpen} />}
    </div>
  );
};

export default HelpContainer;
