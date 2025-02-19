import { activeGuideAtom } from 'store/guide';

import { useRecoilState } from 'recoil';

import { Icon } from 'components/ui/icon';

import CLOSE_SVG from 'svgs/ui/close.svg?sprite';

export const CloseHelpGuide = () => {
  const [isActive, setIsActive] = useRecoilState(activeGuideAtom);

  if (!isActive) return null;

  return (
    <div
      className="fixed top-2 left-1/2 z-20 flex translate-x-[-50%] cursor-pointer items-center space-x-1 rounded-2xl bg-yellow-400 px-3 py-1.5 text-sm font-semibold text-black"
      onClick={() => setIsActive(false)}
    >
      <span>Close navigation help</span>
      <Icon icon={CLOSE_SVG} />
    </div>
  );
};

export default CloseHelpGuide;
