import { activeGuideAtom } from '@/store/guide';

import { useAtom } from 'jotai';

import CLOSE_SVG from '@/svgs/ui/close';

const CloseHelpGuide = () => {
  const [isActive, setIsActive] = useAtom(activeGuideAtom);

  if (!isActive) return null;

  return (
    <button
      type="button"
      aria-label="Close navigation help"
      className="fixed top-2 left-1/2 z-20 flex min-h-6 translate-x-[-50%] cursor-pointer items-center space-x-1 rounded-2xl bg-yellow-400 px-3 py-1.5 text-sm font-semibold text-black"
      onClick={() => setIsActive(false)}
    >
      <span>Close navigation help</span>
      <CLOSE_SVG className="h-4 w-4" aria-hidden={true} />
    </button>
  );
};

export default CloseHelpGuide;
