import { useState } from 'react';

import { useRecoilState } from 'recoil';

import Icon from 'components/ui/icon';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { SwitchRoot, SwitchThumb, SwitchWrapper } from 'components/ui/switch';
import Contact from 'containers/contact';
import { activeGuideAtom } from 'store/guide';
import HELP_SVG from 'svgs/tools-bar/help.svg?sprite';

// import GuideModalIntro from './modal-intro';

export const HelpContainer = () => {
  const [isActive, setIsActive] = useRecoilState(activeGuideAtom);
  const [
    ,
    // showGuideModal
    setShowGuideModal,
  ] = useState(() => {
    return !!localStorage.getItem('hasClickedGuideSwitch'); // Only true if the user never clicked before
  });

  const handleClick = () => {
    setIsActive((prev) => !prev);

    // Only show modal the first time the switch is clicked
    if (!localStorage.getItem('hasClickedGuideSwitch')) {
      setShowGuideModal(true);
      localStorage.setItem('hasClickedGuideSwitch', 'true'); // Mark as seen so it never shows again
    }
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
          {process.env.NEXT_PUBLIC_VERCEL_ENV === 'development' && <Contact />}
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

      {/* Show the modal ONLY if it's the first time clicking the switch */}
      {/* {showGuideModal && <GuideModalIntro isOpen={showGuideModal} />} */}
    </div>
  );
};

export default HelpContainer;
