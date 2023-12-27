import { activeGuideAtom } from 'store/guide';

import { useRecoilState } from 'recoil';

import Icon from 'components/icon';

import HELP_SVG from 'svgs/tools-bar/help.svg?sprite';

export const GuideSwitcher = () => {
  const [isActive, setIsActive] = useRecoilState(activeGuideAtom);
  const handleClick = () => setIsActive(!isActive);
  return (
    <button
      id="guide"
      data-testid="guide-button"
      type="button"
      onClick={handleClick}
      className="flex cursor-pointer items-center space-x-2"
    >
      <Icon icon={HELP_SVG} className="h-6 w-6 stroke-white" description="Menu" />
      <p className="font-sans text-sm text-white">Help</p>
    </button>
  );
};

export default GuideSwitcher;
