import { useLocalStorage } from 'usehooks-ts';

import { activeGuideAtom } from 'store/guide';

import { useRecoilValue } from 'recoil';

import VideoIntro from 'containers/help/video-intro';

import { Button } from 'components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from 'components/ui/dialog';

export const GuideModalIntro = ({ isOpen, setIsOpen }) => {
  const [guideLocalStorage, setGuideLocalStorage] = useLocalStorage<boolean>(
    'guideLocalStorage',
    false,
  );
  const isActive = useRecoilValue(activeGuideAtom);

  const handleClick = () => {
    if (!guideLocalStorage) {
      setGuideLocalStorage(true);
    }
  };

  return (
    <Dialog open={isActive && isOpen}>
      <DialogContent className="z-50 space-y-6 p-8 text-black/85">
        <DialogHeader className="space-y-6">
          <DialogTitle className="text-3xl font-light">Navigation help</DialogTitle>
          <p className="m-0 font-light">
            Click in the dots to display help about the navigation elements.
          </p>
        </DialogHeader>
        <div className="relative h-full min-h-[300px] w-full rounded-3xl">
          <VideoIntro />
        </div>
        <Button onClick={handleClick} className="text-sm font-bold">
          Got it! Don't show again
        </Button>
        <DialogClose onClose={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default GuideModalIntro;
