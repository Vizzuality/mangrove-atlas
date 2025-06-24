import { useState } from 'react';

import { activeGuideAtom } from 'store/guide';
import { useRecoilState } from 'recoil';

import { useLocalStorage } from 'usehooks-ts';

import Contact from 'containers/contact';

import Icon from 'components/ui/icon';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { SwitchRoot, SwitchThumb, SwitchWrapper } from 'components/ui/switch';

import HELP_SVG from 'svgs/tools-bar/help.svg?sprite';

import GuideModalIntro from './modal-intro';

export const HelpContainer = () => {
  const [guideLocalStorage] = useLocalStorage<boolean>('guideLocalStorage', false);
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useRecoilState(activeGuideAtom);

  const handleClick = () => {
    setIsActive((prev) => {
      const nextState = !prev;
      setIsOpen(nextState);
      return nextState;
    });
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger className="flex">
          <button
            id="guide"
            data-testid="guide-button"
            type="button"
            className="flex cursor-pointer items-center space-x-2"
          >
            <Icon icon={HELP_SVG} className="h-6 w-6 stroke-white" description="Menu" />
            <p className="font-sans text-sm text-white">Help</p>
          </button>
        </PopoverTrigger>

        <PopoverContent className="rounded-2xl p-6 text-sm font-semibold shadow-border">
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
