import { useState, useEffect, useMemo, useCallback } from 'react';

import { activeGuideAtom } from 'store/guide';

import { useRecoilState } from 'recoil';

import VideoIntro from 'containers/help/video-intro';

import { Button } from 'components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'components/ui/dialog';
import { SwitchRoot, SwitchThumb, SwitchWrapper } from 'components/ui/switch';

export const GuideSwitcher = () => {
  const [isActive, setIsActive] = useRecoilState(activeGuideAtom);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    localStorage.setItem('introHelpGuide', 'true');
  }, []);

  const handleClick = () => setIsActive(!isActive);

  const handleGuideVisibility = useCallback(() => {
    setShowDialog(!showDialog);
  }, [setShowDialog, showDialog]);

  const isFirstVisit = useMemo(() => !localStorage.getItem('introHelpGuide'), []);

  const handleClose = useCallback(() => {
    setShowDialog(false);
  }, [setShowDialog]);
  return (
    <div className="flex space-x-2">
      <span>Navigation help</span>

      <Dialog open={showDialog && !isFirstVisit}>
        <DialogTrigger onClick={handleGuideVisibility}>
          <SwitchWrapper id="guide-switcher" className="h-2 w-4">
            <SwitchRoot
              onClick={handleClick}
              defaultChecked={isActive}
              checked={isActive}
              size="sm"
            >
              <SwitchThumb size="sm" />
            </SwitchRoot>
          </SwitchWrapper>
        </DialogTrigger>
        <DialogContent className="z-50 space-y-6 p-8 text-black/85">
          <DialogHeader className="space-y-6">
            <DialogTitle className="text-3xl font-light">Navigation help</DialogTitle>
            <p className="m-0 font-light">
              Click in the dots to display help about the navigation elements.
            </p>
          </DialogHeader>
          <div className="relative h-full min-h-[300px] w-full rounded-3xl bg-red-800">
            <VideoIntro />
          </div>
          <Button onClick={handleClose} className="text-sm font-bold">
            Got it!
          </Button>
          <DialogClose onClose={handleClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GuideSwitcher;
