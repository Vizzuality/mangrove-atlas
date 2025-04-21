import { useState } from 'react';

import { Button } from 'components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from 'components/ui/dialog';
import VideoIntro from 'containers/help/video-intro';

export const GuideModalIntro = ({ isOpen }) => {
  const [showDialog, setShowDialog] = useState(!!isOpen);

  return (
    <Dialog open={showDialog}>
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
        <Button onClick={() => setShowDialog(false)} className="text-sm font-bold">
          Got it!
        </Button>
        <DialogClose onClose={() => setShowDialog(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default GuideModalIntro;
