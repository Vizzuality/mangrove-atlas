import cn from 'lib/classnames';

import { activeGuideAtom } from 'store/guide';

import { useRecoilState } from 'recoil';

import Icon from 'components/icon';

import HELP_SVG from 'svgs/tools-bar/help.svg?sprite';
export const GuideSwitcher = () => {
  const [isActive, setIsActive] = useRecoilState(activeGuideAtom);
  const handleClick = () => setIsActive(!isActive);
  return (
    <div className="flex items-center">
      <button id="guide" data-testid="guide-button" type="button" onClick={handleClick}>
        <Icon icon={HELP_SVG} className="h-6 w-6 stroke-white" description="Menu" />
      </button>
      <p className="font-sans text-sm text-white">Help</p>
    </div>
  );
};

export default GuideSwitcher;
